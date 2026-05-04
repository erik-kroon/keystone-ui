import { cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { addCommand } from "../src/commands/add";
import { initCommand } from "../src/commands/init";
import {
  diffCommand,
  doctorCommand,
  removeCommand,
  updateCommand,
} from "../src/commands/lifecycle";
import { run } from "../src/index";
import {
  createDoctorReport,
  createRemoveTransaction,
  createWritePlan,
  diffInstallTransaction,
  installedItems,
} from "../src/install/plan";
import { rejectUnsafeRelativePath } from "../src/install/paths";
import { applyWritePlan } from "../src/install/write";
import { readMasonConfig } from "../src/project/config";
import { detectProject } from "../src/project/detect";

const fixtureRoot = path.resolve(import.meta.dir, "../src/testing/fixtures");
const registry = path.join(fixtureRoot, "local-registry");
const defaultRegistry = path.resolve(import.meta.dir, "../../../registry/default");
const tempRoots: string[] = [];

async function fixtureApp(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "mason-cli-"));
  tempRoots.push(root);
  const app = path.join(root, "app");
  await cp(path.join(fixtureRoot, "solid-vite-app"), app, { recursive: true });
  return app;
}

async function runAppCommand(app: string, args: string[]): Promise<void> {
  const proc = Bun.spawn(args, {
    cwd: app,
    env: { ...process.env, CI: "1" },
    stderr: "pipe",
    stdout: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  if (exitCode !== 0) {
    throw new Error(
      [`${args.join(" ")} failed with exit code ${exitCode}`, stdout.trim(), stderr.trim()]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

async function installFixtureAppDependencies(app: string): Promise<void> {
  await runAppCommand(app, ["bun", "install"]);
}

async function runAppScript(app: string, script: "check-types" | "build"): Promise<void> {
  await runAppCommand(app, ["bun", "run", script]);
}

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("project detection and init", () => {
  test("detects a Solid Vite TypeScript project", async () => {
    const app = await fixtureApp();
    const project = await detectProject(app);
    expect(project.isSolid).toBe(true);
    expect(project.isVite).toBe(true);
    expect(project.isTypeScript).toBe(true);
    expect(project.packageManager).toBe("bun");
    expect(project.aliases).toEqual({ "@": "./src" });
    expect(project.styleEntry).toBe("src/styles.css");
  });

  test("writes deterministic config and refuses existing config", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    expect(await readMasonConfig(app)).toMatchObject({
      style: "default",
      aliases: {
        ui: "@/components/ui",
        hooks: "@/hooks",
        lib: "@/lib",
        theme: "src/styles.css",
      },
    });
    await expect(initCommand({ cwd: app, yes: true })).rejects.toThrow("already exists");
  });
});

describe("add planning and writes", () => {
  test("dry-run after init prints deterministic plan without writes", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    const beforePackage = await readFile(path.join(app, "package.json"), "utf8");
    const output = await addCommand({ cwd: app, item: "button", registry, dryRun: true });
    expect(output).toBe(
      [
        "Mason dry run plan for button:",
        "create src/components/ui/button.tsx",
        "create src/lib/cn.ts",
      ].join("\n"),
    );
    expect(await readFile(path.join(app, "package.json"), "utf8")).toBe(beforePackage);
    await expect(stat(path.join(app, "src/components/ui/button.tsx"))).rejects.toThrow();
  });

  test("init then add writes expected files and package metadata", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });
    expect(await readFile(path.join(app, "src/components/ui/button.tsx"), "utf8")).toContain(
      "export function Button",
    );
    expect(await readFile(path.join(app, "src/lib/cn.ts"), "utf8")).toContain("export function cn");
    const packageJson = JSON.parse(await readFile(path.join(app, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      mason: { installed: Record<string, { files: string[] }> };
    };
    expect(packageJson.dependencies["@keystone-ui/keystone"]).toBeUndefined();
    expect(packageJson.mason.installed.button?.files).toEqual(["src/components/ui/button.tsx"]);
  });

  test("write planning rejects existing user-owned files", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });
    const project = await detectProject(app);
    await expect(createWritePlan(project, { item: "button", registry })).rejects.toThrow(
      "Refusing to overwrite",
    );
  });

  test("write planning records target state, hashes, and conflicts before apply", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await mkdir(path.join(app, "src/components/ui"), { recursive: true });
    await writeFile(path.join(app, "src/components/ui/button.tsx"), "user-owned\n");
    const project = await detectProject(app);
    const plan = await createWritePlan(project, {
      item: "button",
      registry,
      allowConflicts: true,
    });
    const buttonFile = plan.files.find((file) => file.target === "src/components/ui/button.tsx");
    expect(buttonFile).toBeDefined();
    if (!buttonFile) throw new Error("Expected button file in write plan");
    expect(buttonFile.conflict).toBeDefined();
    if (!buttonFile.conflict) throw new Error("Expected button file conflict");

    expect(buttonFile.contentHash).toMatch(/^sha256:/);
    expect(buttonFile.existing).toMatchObject({
      exists: true,
      size: Buffer.byteLength("user-owned\n"),
    });
    expect(buttonFile.existing.hash).toMatch(/^sha256:/);
    expect(buttonFile.conflict).toMatchObject({
      kind: "target-exists",
      target: "src/components/ui/button.tsx",
    });
    expect(plan.conflicts).toEqual([buttonFile.conflict]);
    expect(plan.installedItems.find((item) => item.name === "button")?.fileHashes).toEqual({
      "src/components/ui/button.tsx": buttonFile.contentHash,
    });
  });

  test("generated Solid app typechecks and builds after add", async () => {
    const app = await fixtureApp();
    await installFixtureAppDependencies(app);
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });

    await runAppScript(app, "check-types");
    await runAppScript(app, "build");
  });

  test("real default registry field slice installs deterministic dependency plan", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    const output = await addCommand({
      cwd: app,
      item: "field",
      registry: defaultRegistry,
      dryRun: true,
    });

    expect(output).toBe(
      [
        "Mason dry run plan for field:",
        "create src/components/ui/field.tsx",
        "create src/components/ui/label.tsx",
        "create src/lib/cn.ts",
      ].join("\n"),
    );
  });

  test("real default registry base components typecheck and build after add", async () => {
    const app = await fixtureApp();
    await installFixtureAppDependencies(app);
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry: defaultRegistry });
    await addCommand({ cwd: app, item: "input", registry: defaultRegistry });
    await addCommand({ cwd: app, item: "textarea", registry: defaultRegistry });
    await addCommand({ cwd: app, item: "field", registry: defaultRegistry });
    await addCommand({ cwd: app, item: "card", registry: defaultRegistry });
    await addCommand({ cwd: app, item: "badge", registry: defaultRegistry });
    await addCommand({ cwd: app, item: "separator", registry: defaultRegistry });

    await runAppScript(app, "check-types");
    await runAppScript(app, "build");
  });

  test("real default registry dialog plans Keystone-backed generated source", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    const output = await addCommand({
      cwd: app,
      item: "dialog",
      registry: defaultRegistry,
      dryRun: true,
    });

    expect(output).toBe(
      [
        "Mason dry run plan for dialog:",
        "create src/components/ui/dialog.tsx",
        "create src/lib/cn.ts",
        "add @keystone-ui/keystone@^0.0.0",
        "install command: bun add @keystone-ui/keystone@^0.0.0",
      ].join("\n"),
    );
  });

  test("real default registry data-table plans TanStack Table generated source", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    const output = await addCommand({
      cwd: app,
      item: "data-table",
      registry: defaultRegistry,
      dryRun: true,
    });

    expect(output).toBe(
      [
        "Mason dry run plan for data-table:",
        "create src/components/data-table/data-table-column-header.tsx",
        "create src/components/data-table/data-table-empty-state.tsx",
        "create src/components/data-table/data-table-faceted-filter.tsx",
        "create src/components/data-table/data-table-pagination.tsx",
        "create src/components/data-table/data-table-row-actions.tsx",
        "create src/components/data-table/data-table-skeleton.tsx",
        "create src/components/data-table/data-table-toolbar.tsx",
        "create src/components/data-table/data-table-view-options.tsx",
        "create src/components/data-table/data-table.tsx",
        "create src/components/data-table/types.ts",
        "create src/components/data-table/use-data-table.ts",
        "create src/lib/cn.ts",
        "add @tanstack/solid-table@^8.21.3",
        "install command: bun add @tanstack/solid-table@^8.21.3",
      ].join("\n"),
    );
  });

  test("real default registry data-table router adapter plans TanStack Router source", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    const output = await addCommand({
      cwd: app,
      item: "data-table-tanstack-router",
      registry: defaultRegistry,
      dryRun: true,
    });

    expect(output).toContain("Mason dry run plan for data-table-tanstack-router:");
    expect(output).toContain("create src/components/data-table/data-table-search.ts");
    expect(output).toContain("create src/components/data-table/use-data-table-router.ts");
    expect(output).toContain("add @tanstack/solid-router@^1.168.20");
    expect(output).toContain("add @tanstack/solid-table@^8.21.3");
  });

  test("real default registry block installs composed source and dependencies", async () => {
    const app = await fixtureApp();
    await installFixtureAppDependencies(app);
    await initCommand({ cwd: app, yes: true });
    const output = await addCommand({
      cwd: app,
      item: "account-settings",
      registry: defaultRegistry,
      dryRun: true,
    });

    expect(output).toBe(
      [
        "Mason dry run plan for account-settings:",
        "create src/components/blocks/account-settings.tsx",
        "create src/components/ui/badge.tsx",
        "create src/components/ui/button.tsx",
        "create src/components/ui/card.tsx",
        "create src/components/ui/field.tsx",
        "create src/components/ui/input.tsx",
        "create src/components/ui/label.tsx",
        "create src/components/ui/separator.tsx",
        "create src/lib/cn.ts",
      ].join("\n"),
    );

    await addCommand({ cwd: app, item: "account-settings", registry: defaultRegistry });

    expect(
      await readFile(path.join(app, "src/components/blocks/account-settings.tsx"), "utf8"),
    ).toContain("export function AccountSettingsBlock");

    await runAppScript(app, "check-types");
    await runAppScript(app, "build");
  });

  test("write application honors append-css, merge-json, and overwrite modes", async () => {
    const app = await fixtureApp();
    const project = await detectProject(app);
    await writeFile(
      path.join(app, "src/settings.json"),
      '{"theme":{"color":"blue"},"keep":true}\n',
    );

    await applyWritePlan(project, {
      items: [],
      dependencies: [],
      devDependencies: [],
      installedItems: [],
      conflicts: [],
      files: [
        {
          item: "theme",
          source: "registry/default/theme.css",
          target: "src/styles.css",
          absoluteTarget: path.join(app, "src/styles.css"),
          content: ".mason-button { color: red; }\n",
          contentHash: "sha256:test-theme",
          existing: { exists: true, hash: null, size: null },
          conflict: null,
          mode: "append-css",
        },
        {
          item: "settings",
          source: "registry/default/settings.json",
          target: "src/settings.json",
          absoluteTarget: path.join(app, "src/settings.json"),
          content: '{"theme":{"radius":"8px"},"enabled":true}',
          contentHash: "sha256:test-settings",
          existing: { exists: true, hash: null, size: null },
          conflict: null,
          mode: "merge-json",
        },
        {
          item: "readme",
          source: "registry/default/readme.md",
          target: "src/readme.md",
          absoluteTarget: path.join(app, "src/readme.md"),
          content: "installed\n",
          contentHash: "sha256:test-readme",
          existing: { exists: false, hash: null, size: null },
          conflict: null,
          mode: "overwrite",
        },
      ],
    });

    expect(await readFile(path.join(app, "src/styles.css"), "utf8")).toContain(
      ".mason-button { color: red; }",
    );
    expect(JSON.parse(await readFile(path.join(app, "src/settings.json"), "utf8"))).toEqual({
      theme: { color: "blue", radius: "8px" },
      keep: true,
      enabled: true,
    });
    expect(await readFile(path.join(app, "src/readme.md"), "utf8")).toBe("installed\n");
  });
});

describe("registry lifecycle commands", () => {
  test("install transaction owns diff, remove, and doctor state", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });
    const project = await detectProject(app);
    const transaction = await createWritePlan(project, {
      allowConflicts: true,
      item: "button",
      registry,
    });
    const record = installedItems(project).button;

    expect(diffInstallTransaction(transaction, record)).toMatchObject([
      {
        localChanged: false,
        status: "unchanged",
        file: { target: "src/components/ui/button.tsx" },
      },
    ]);
    expect(await createRemoveTransaction(project, "button")).toMatchObject({
      item: "button",
      files: [{ status: "delete", target: "src/components/ui/button.tsx" }],
      localChanges: [],
    });
    expect(await createDoctorReport(project, { registry })).toEqual({ issues: [] });
  });

  test("diff reports unchanged and locally changed installed files", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });

    expect(await diffCommand({ cwd: app, item: "button", registry })).toBe(
      ["Mason diff plan for button:", "unchanged src/components/ui/button.tsx"].join("\n"),
    );

    await writeFile(path.join(app, "src/components/ui/button.tsx"), "user edit\n");

    expect(await diffCommand({ cwd: app, item: "button", registry })).toBe(
      ["Mason diff plan for button:", "update src/components/ui/button.tsx (local changes)"].join(
        "\n",
      ),
    );
  });

  test("diff reports missing registry items without writes", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });

    await expect(diffCommand({ cwd: app, item: "missing", registry })).rejects.toThrow(
      "Registry dependency 'missing' was not found.",
    );
    await expect(stat(path.join(app, "src/components/ui/missing.tsx"))).rejects.toThrow();
  });

  test("update blocks local edits unless forced and refreshes recorded hashes", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });
    await writeFile(path.join(app, "src/components/ui/button.tsx"), "user edit\n");

    const blocked = await updateCommand({ cwd: app, item: "button", registry });
    expect(blocked).toContain("blocked: local changes detected");
    expect(await readFile(path.join(app, "src/components/ui/button.tsx"), "utf8")).toBe(
      "user edit\n",
    );

    const output = await updateCommand({ cwd: app, item: "button", registry, force: true });
    expect(output).toContain("update src/components/ui/button.tsx (local changes)");
    expect(await readFile(path.join(app, "src/components/ui/button.tsx"), "utf8")).toContain(
      "export function Button",
    );

    expect(await diffCommand({ cwd: app, item: "button", registry })).toBe(
      ["Mason diff plan for button:", "unchanged src/components/ui/button.tsx"].join("\n"),
    );
  });

  test("update dry-run reports changes without writing files or metadata", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });
    await writeFile(path.join(app, "src/components/ui/button.tsx"), "user edit\n");
    const beforePackage = await readFile(path.join(app, "package.json"), "utf8");

    const output = await updateCommand({
      cwd: app,
      item: "button",
      registry,
      dryRun: true,
      force: true,
    });

    expect(output).toContain("Mason update dry run plan for button:");
    expect(output).toContain("update src/components/ui/button.tsx (local changes)");
    expect(await readFile(path.join(app, "src/components/ui/button.tsx"), "utf8")).toBe(
      "user edit\n",
    );
    expect(await readFile(path.join(app, "package.json"), "utf8")).toBe(beforePackage);
  });

  test("remove deletes clean installed files and clears installed metadata", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });

    expect(await removeCommand({ cwd: app, item: "button", dryRun: true })).toBe(
      ["Mason remove dry run plan for button:", "delete src/components/ui/button.tsx"].join("\n"),
    );

    await removeCommand({ cwd: app, item: "button" });

    await expect(stat(path.join(app, "src/components/ui/button.tsx"))).rejects.toThrow();
    const packageJson = JSON.parse(await readFile(path.join(app, "package.json"), "utf8")) as {
      mason: { installed: Record<string, unknown> };
    };
    expect(packageJson.mason.installed.button).toBeUndefined();
  });

  test("remove keeps locally modified files and metadata unless forced", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });
    await writeFile(path.join(app, "src/components/ui/button.tsx"), "user edit\n");

    const blocked = await removeCommand({ cwd: app, item: "button" });
    expect(blocked).toBe(
      [
        "Mason remove plan for button:",
        "keep src/components/ui/button.tsx (local changes)",
        "blocked: local changes detected; rerun with --force to delete",
      ].join("\n"),
    );
    expect(await readFile(path.join(app, "src/components/ui/button.tsx"), "utf8")).toBe(
      "user edit\n",
    );

    await removeCommand({ cwd: app, item: "button", force: true });

    await expect(stat(path.join(app, "src/components/ui/button.tsx"))).rejects.toThrow();
    const packageJson = JSON.parse(await readFile(path.join(app, "package.json"), "utf8")) as {
      mason: { installed: Record<string, unknown> };
    };
    expect(packageJson.mason.installed.button).toBeUndefined();
  });

  test("doctor validates config, registry reachability, and installed metadata", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });

    expect(await doctorCommand({ cwd: app, registry })).toBe("Mason doctor:\nok");

    await rm(path.join(app, "src/components/ui/button.tsx"));

    expect(await doctorCommand({ cwd: app, registry })).toContain(
      "issue missing installed file for button: src/components/ui/button.tsx",
    );
  });

  test("doctor reports bad config and invalid registry documents", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await writeFile(path.join(app, "mason.config.json"), "{bad json");
    const badRegistry = path.join(app, "bad-registry");
    await mkdir(badRegistry);
    await writeFile(path.join(badRegistry, "registry.json"), '{"items":[]}');

    const output = await doctorCommand({ cwd: app, registry: badRegistry });

    expect(output).toContain("issue invalid mason.config.json:");
    expect(output).toContain("issue invalid registry:");
  });

  test("CLI routes lifecycle commands", async () => {
    const app = await fixtureApp();
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });

    expect(await run(["diff", "button", "--cwd", app, "--registry", registry])).toContain(
      "Mason diff plan for button:",
    );
    expect(await run(["doctor", "--cwd", app, "--registry", registry])).toBe("Mason doctor:\nok");
  });
});

describe("path safety", () => {
  test("rejects unsafe paths before writes", () => {
    expect(() => rejectUnsafeRelativePath("../button.tsx")).toThrow();
    expect(() => rejectUnsafeRelativePath("/tmp/button.tsx")).toThrow();
    expect(() => rejectUnsafeRelativePath("~/button.tsx")).toThrow();
    expect(() => rejectUnsafeRelativePath("https://example.test/button.tsx")).toThrow();
    expect(() => rejectUnsafeRelativePath("C:\\tmp\\button.tsx")).toThrow();
  });
});
