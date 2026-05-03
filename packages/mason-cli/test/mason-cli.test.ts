import { cp, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { addCommand } from "../src/commands/add";
import { initCommand } from "../src/commands/init";
import { createWritePlan } from "../src/install/plan";
import { rejectUnsafeRelativePath } from "../src/install/paths";
import { readMasonConfig } from "../src/project/config";
import { detectProject } from "../src/project/detect";

const fixtureRoot = path.resolve(import.meta.dir, "../src/testing/fixtures");
const registry = path.join(fixtureRoot, "local-registry");
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

  test("generated Solid app typechecks and builds after add", async () => {
    const app = await fixtureApp();
    await installFixtureAppDependencies(app);
    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "button", registry });

    await runAppScript(app, "check-types");
    await runAppScript(app, "build");
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
