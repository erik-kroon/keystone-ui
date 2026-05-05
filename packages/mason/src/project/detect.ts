import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type PackageManager = "bun" | "pnpm" | "npm" | "yarn" | "unknown";

export type ProjectShape = {
  cwd: string;
  workspaceRoot: string;
  packageManager: PackageManager;
  packageJson: Record<string, unknown>;
  isSolid: boolean;
  isVite: boolean;
  isTypeScript: boolean;
  aliases: Record<string, string>;
  styleEntry: string | null;
};

async function readJson(file: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function objectValue(input: unknown): Record<string, unknown> {
  return input && typeof input === "object" && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : {};
}

function dependencyMap(pkg: Record<string, unknown>): Record<string, string> {
  return {
    ...objectValue(pkg.dependencies),
    ...objectValue(pkg.devDependencies),
  } as Record<string, string>;
}

function packageManagerFromField(value: unknown): PackageManager | null {
  if (typeof value !== "string") return null;
  if (value.startsWith("bun@")) return "bun";
  if (value.startsWith("pnpm@")) return "pnpm";
  if (value.startsWith("npm@")) return "npm";
  if (value.startsWith("yarn@")) return "yarn";
  return null;
}

function detectPackageManager(cwd: string, pkg: Record<string, unknown>): PackageManager {
  const fromField = packageManagerFromField(pkg.packageManager);
  if (fromField) return fromField;
  if (existsSync(path.join(cwd, "bun.lock")) || existsSync(path.join(cwd, "bun.lockb")))
    return "bun";
  if (existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(path.join(cwd, "package-lock.json"))) return "npm";
  if (existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "unknown";
}

async function findWorkspaceRoot(cwd: string): Promise<string> {
  let current = cwd;
  while (true) {
    const pkg = await readJson(path.join(current, "package.json"));
    const workspaces = pkg?.workspaces;
    if (Array.isArray(workspaces) || objectValue(workspaces).packages) return current;
    const parent = path.dirname(current);
    if (parent === current) return cwd;
    current = parent;
  }
}

async function detectAliases(cwd: string): Promise<Record<string, string>> {
  const configFile = existsSync(path.join(cwd, "tsconfig.json"))
    ? "tsconfig.json"
    : "jsconfig.json";
  const config = await readJson(path.join(cwd, configFile));
  const paths = objectValue(objectValue(config?.compilerOptions).paths);
  const aliases: Record<string, string> = {};
  for (const [key, value] of Object.entries(paths)) {
    if (!Array.isArray(value) || typeof value[0] !== "string") continue;
    const alias = key.replace(/\/\*$/, "");
    const target = value[0].replace(/\/\*$/, "");
    aliases[alias] = target;
  }
  return aliases;
}

async function detectStyleEntry(cwd: string): Promise<string | null> {
  const candidates = ["src/styles.css", "src/index.css", "src/app.css", "src/main.css"];
  for (const candidate of candidates) {
    if (existsSync(path.join(cwd, candidate))) return candidate;
  }
  const tailwindConfig = ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.cjs"].some(
    (file) => existsSync(path.join(cwd, file)),
  );
  return tailwindConfig ? "src/styles.css" : null;
}

export async function detectProject(cwdInput: string): Promise<ProjectShape> {
  const cwd = path.resolve(cwdInput);
  const packageJson = await readJson(path.join(cwd, "package.json"));
  if (!packageJson) {
    throw new Error(`No package.json found in ${cwd}`);
  }

  const deps = dependencyMap(packageJson);
  const viteConfig = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mts",
    "vite.config.mjs",
  ].some((file) => existsSync(path.join(cwd, file)));

  return {
    cwd,
    workspaceRoot: await findWorkspaceRoot(cwd),
    packageManager: detectPackageManager(cwd, packageJson),
    packageJson,
    isSolid: "solid-js" in deps,
    isVite: "vite" in deps || "@vitejs/plugin-solid" in deps || viteConfig,
    isTypeScript: existsSync(path.join(cwd, "tsconfig.json")),
    aliases: await detectAliases(cwd),
    styleEntry: await detectStyleEntry(cwd),
  };
}
