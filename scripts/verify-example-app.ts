import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { addCommand } from "../packages/mason-cli/src/commands/add";
import { initCommand } from "../packages/mason-cli/src/commands/init";

const repoRoot = path.resolve(import.meta.dir, "..");
const fixtureRoot = path.join(repoRoot, "packages/mason-cli/src/testing/fixtures");
const registry = path.join(repoRoot, "registry/default");

async function runCommand(cwd: string, args: string[]): Promise<void> {
  const proc = Bun.spawn(args, {
    cwd,
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

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(`${filePath}`, `${JSON.stringify(value, null, 2)}\n`);
}

async function linkDependency(app: string, name: string, target: string): Promise<void> {
  const segments = name.split("/");
  const parent = path.join(app, "node_modules", ...segments.slice(0, -1));
  await mkdir(parent, { recursive: true });
  await symlink(target, path.join(app, "node_modules", ...segments), "dir");
}

async function main() {
  const tempRoot = await mkdtemp(path.join(repoRoot, "apps/.example-app-verification-"));
  const app = tempRoot;

  try {
    await cp(path.join(fixtureRoot, "solid-vite-app"), app, { recursive: true });

    const packageJsonPath = path.join(app, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      dependencies: Record<string, string>;
    };
    packageJson.name = "example-app-verification";
    packageJson.dependencies["@keystone-ui/keystone"] = "workspace:*";
    await writeJson(packageJsonPath, packageJson);
    await linkDependency(app, "@keystone-ui/keystone", path.join(repoRoot, "packages/keystone"));
    for (const dependency of [
      "@tanstack/devtools-event-client",
      "@tanstack/form-core",
      "@tanstack/pacer-lite",
      "@tanstack/solid-form",
      "@tanstack/solid-store",
      "@tanstack/store",
      "@types/node",
      "solid-js",
      "typescript",
      "vite",
      "vite-plugin-solid",
    ]) {
      await linkDependency(
        app,
        dependency,
        path.join(repoRoot, "node_modules/.bun/node_modules", dependency),
      );
    }
    await mkdir(path.join(app, "node_modules/.bin"), { recursive: true });
    await symlink("../typescript/bin/tsc", path.join(app, "node_modules/.bin/tsc"));
    await symlink("../vite/bin/vite.js", path.join(app, "node_modules/.bin/vite"));

    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "dialog", registry });
    await addCommand({ cwd: app, item: "popover", registry });
    await addCommand({ cwd: app, item: "tooltip", registry });
    await addCommand({ cwd: app, item: "sheet", registry });
    await addCommand({ cwd: app, item: "text-field", registry });
    await addCommand({ cwd: app, item: "select-field", registry });
    await writeFile(
      path.join(app, "vite.config.ts"),
      `import { fileURLToPath, URL } from "node:url";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({ ssr: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
`,
    );

    await writeFile(
      path.join(app, "src/main.tsx"),
      `import { render } from "solid-js/web";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createForm } from "@tanstack/solid-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectField } from "@/components/ui/select-field";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import "./styles.css";

function App() {
  const form = createForm(() => ({
    defaultValues: {
      email: "",
      plan: "team",
    },
    onSubmit: ({ value }) => value,
  }));

  return (
    <main>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <TextField
          form={form}
          name="email"
          label="Email"
          description="Verified through TanStack Form and Keystone form-control."
          validators={{
            onChange: ({ value }) => (value.includes("@") ? undefined : "Enter an email address."),
          }}
        />
        <SelectField
          form={form}
          name="plan"
          label="Plan"
          placeholder="Choose plan"
          description="Verified through TanStack Form and Keystone Select."
          options={[
            { value: "starter", label: "Starter" },
            { value: "team", label: "Team" },
            { value: "enterprise", label: "Enterprise" },
          ]}
        />
        <button type="submit">Save</button>
      </form>
      <Dialog>
        <DialogTrigger>Open Mason dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verified example app</DialogTitle>
            <DialogDescription>
              Mason Dialog renders through Keystone behavior in one Solid app.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Generated Mason popover</PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger>More info</TooltipTrigger>
        <TooltipContent>Generated Mason tooltip</TooltipContent>
      </Tooltip>
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Generated Mason sheet</SheetTitle>
          <SheetDescription>Backed by Keystone modal overlay behavior.</SheetDescription>
        </SheetContent>
      </Sheet>
    </main>
  );
}

render(() => <App />, document.getElementById("root")!);
`,
    );

    await writeFile(
      path.join(app, "src/ssr.tsx"),
      `import { renderToString } from "solid-js/web";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createForm } from "@tanstack/solid-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectField } from "@/components/ui/select-field";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function App() {
  const form = createForm(() => ({
    defaultValues: {
      email: "team@example.com",
      plan: "team",
    },
    onSubmit: ({ value }) => value,
  }));

  return (
    <main>
      <form>
        <TextField
          form={form}
          name="email"
          label="Email"
          description="SSR verifies the TanStack Form TextField vertical."
        />
        <SelectField
          form={form}
          name="plan"
          label="Plan"
          placeholder="Choose plan"
          description="SSR verifies the TanStack Form SelectField vertical."
          options={[
            { value: "starter", label: "Starter" },
            { value: "team", label: "Team" },
          ]}
        />
      </form>
      <Dialog defaultOpen>
        <DialogTrigger>Open Mason dialog</DialogTrigger>
        <DialogContent portal={{ forceMount: true }}>
          <DialogHeader>
            <DialogTitle>Verified example app</DialogTitle>
            <DialogDescription>
              Mason Dialog and Keystone behavior server-render together.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover defaultOpen>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent portal={{ forceMount: true }}>Generated Mason popover</PopoverContent>
      </Popover>
      <Tooltip defaultOpen>
        <TooltipTrigger>More info</TooltipTrigger>
        <TooltipContent portal={{ forceMount: true }}>Generated Mason tooltip</TooltipContent>
      </Tooltip>
      <Sheet defaultOpen>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent portal={{ forceMount: true }}>
          <SheetTitle>Generated Mason sheet</SheetTitle>
          <SheetDescription>Backed by Keystone modal overlay behavior.</SheetDescription>
        </SheetContent>
      </Sheet>
    </main>
  );
}

const html = renderToString(() => <App />);

for (const expected of [
  "mason-dialog-trigger",
  "mason-popover-trigger",
  "mason-tooltip-trigger",
  "mason-sheet-trigger",
  "mason-text-field-input",
  "mason-select-field-trigger",
  'data-scope="mason-text-field"',
  'data-scope="select"',
  'data-part="input"',
  'data-scope="dialog"',
  'data-part="trigger"',
  'aria-expanded="true"',
]) {
  if (!html.includes(expected)) {
    throw new Error(\`SSR output did not include \${expected}\`);
  }
}
`,
    );

    await runCommand(app, [
      "bun",
      "node_modules/vite/bin/vite.js",
      "build",
      "--ssr",
      "src/ssr.tsx",
    ]);
    await runCommand(app, ["bun", "dist/ssr.js"]);
    await runCommand(app, ["bun", "run", "check-types"]);
    await runCommand(app, ["bun", "run", "build"]);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

await main();
