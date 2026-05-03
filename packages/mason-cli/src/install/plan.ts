import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  resolveRegistryDependencyGraph,
  validateRegistryItem,
  type RegistryItem,
} from "@keystone-ui/mason-registry";
import { readMasonConfig, type MasonConfig } from "../project/config";
import type { ProjectShape } from "../project/detect";
import { parseDependencySpecifier, type DependencyChange } from "./dependencies";
import { aliasToPath, resolveProjectTarget } from "./paths";

export type FileWrite = {
  item: string;
  source: string;
  target: string;
  absoluteTarget: string;
  content: string;
  contentHash: string;
  existing: FileTargetState;
  conflict: WritePlanConflict | null;
  mode: "create" | "overwrite" | "merge-json" | "append-css";
};

export type FileTargetState = {
  exists: boolean;
  hash: string | null;
  size: number | null;
};

export type WritePlanConflict = {
  kind: "duplicate-target" | "target-exists";
  target: string;
  message: string;
};

export type InstalledItemRecord = {
  name: string;
  version: string;
  files: string[];
  fileHashes: Record<string, string>;
};

export type WritePlan = {
  items: RegistryItem[];
  files: FileWrite[];
  dependencies: DependencyChange[];
  devDependencies: DependencyChange[];
  installedItems: InstalledItemRecord[];
  conflicts: WritePlanConflict[];
};

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

async function resolveRegistryItem(registry: string, name: string): Promise<RegistryItem> {
  const registryRoot = path.resolve(registry);
  const itemPath = path.join(registryRoot, "items", `${name}.json`);
  return validateRegistryItem(await readJson(itemPath), { registryRoot });
}

async function loadRegistryItem(registry: string, name: string): Promise<RegistryItem | undefined> {
  try {
    return await resolveRegistryItem(registry, name);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}

async function resolveItems(registry: string, requested: string): Promise<RegistryItem[]> {
  const result = await resolveRegistryDependencyGraph(
    [requested],
    (name) => loadRegistryItem(registry, name),
    { installSupportedOnly: true },
  );

  if (!result.ok) {
    throw new Error(result.errors.map((error) => error.message).join("\n"));
  }

  return result.value.items;
}

function targetForFile(
  config: MasonConfig,
  item: RegistryItem,
  file: RegistryItem["files"][number],
): string {
  if (file.target) return file.target;
  const basename = path.basename(file.path);
  switch (file.type) {
    case "registry:ui":
      return path.join(aliasToPath(config.aliases.ui), basename);
    case "registry:hook":
      return path.join(aliasToPath(config.aliases.hooks), basename);
    case "registry:lib":
      return path.join(aliasToPath(config.aliases.lib), basename);
    case "registry:theme":
      return aliasToPath(config.aliases.theme);
    default:
      throw new Error(`Registry file for ${item.name} needs an explicit target`);
  }
}

async function contentForFile(
  registry: string,
  file: RegistryItem["files"][number],
): Promise<string> {
  if (file.content !== undefined) return file.content;
  return readFile(path.join(path.resolve(registry), file.path), "utf8");
}

function hashContent(content: string): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

async function readTargetState(absoluteTarget: string): Promise<FileTargetState> {
  if (!existsSync(absoluteTarget)) {
    return { exists: false, hash: null, size: null };
  }

  const content = await readFile(absoluteTarget, "utf8");
  return {
    exists: true,
    hash: hashContent(content),
    size: Buffer.byteLength(content),
  };
}

function collectDependencyChanges(
  project: ProjectShape,
  items: RegistryItem[],
  field: "dependencies" | "devDependencies",
): DependencyChange[] {
  const existing = {
    ...(project.packageJson.dependencies as Record<string, string> | undefined),
    ...(project.packageJson.devDependencies as Record<string, string> | undefined),
  };
  const changes = new Map<string, DependencyChange>();
  for (const item of items) {
    for (const specifier of item[field]) {
      const parsed = parseDependencySpecifier(specifier);
      if (existing[parsed.name] === parsed.version) continue;
      changes.set(parsed.name, {
        kind: field === "dependencies" ? "dependency" : "devDependency",
        name: parsed.name,
        version: parsed.version,
        existing: existing[parsed.name] ?? null,
      });
    }
  }
  return [...changes.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function installedItemNames(project: ProjectShape): Set<string> {
  const mason = project.packageJson.mason;
  if (!mason || typeof mason !== "object" || Array.isArray(mason)) return new Set();
  const installed = (mason as { installed?: unknown }).installed;
  if (!installed || typeof installed !== "object" || Array.isArray(installed)) return new Set();
  return new Set(Object.keys(installed));
}

export async function createWritePlan(
  project: ProjectShape,
  options: { allowConflicts?: boolean; item: string; registry: string },
): Promise<WritePlan> {
  const config = await readMasonConfig(project.cwd);
  const items = await resolveItems(options.registry, options.item);
  const alreadyInstalled = installedItemNames(project);
  const plannedItems = items.filter(
    (item) => item.name === options.item || !alreadyInstalled.has(item.name),
  );
  const files: FileWrite[] = [];
  for (const item of plannedItems) {
    for (const file of item.files) {
      const target = targetForFile(config, item, file);
      const absoluteTarget = resolveProjectTarget(project.cwd, target);
      const content = await contentForFile(options.registry, file);
      const existing = await readTargetState(absoluteTarget);
      const mode = file.mode ?? "create";
      const conflict =
        mode !== "create" || !existing.exists
          ? null
          : {
              kind: "target-exists" as const,
              target,
              message: `Refusing to overwrite existing file: ${target}`,
            };
      files.push({
        item: item.name,
        source: file.path,
        target,
        absoluteTarget,
        content,
        contentHash: hashContent(content),
        existing,
        conflict,
        mode,
      });
    }
  }
  const seenTargets = new Set<string>();
  const conflicts = files.flatMap((file) => (file.conflict ? [file.conflict] : []));
  for (const file of files) {
    if (seenTargets.has(file.absoluteTarget)) {
      conflicts.push({
        kind: "duplicate-target",
        target: file.target,
        message: `Multiple registry files target ${file.target}`,
      });
    }
    seenTargets.add(file.absoluteTarget);
  }
  if (!options.allowConflicts && conflicts.length > 0) {
    throw new Error(conflicts.map((conflict) => conflict.message).join("\n"));
  }
  return {
    items,
    files: files.sort((a, b) => a.target.localeCompare(b.target)),
    dependencies: collectDependencyChanges(project, items, "dependencies"),
    devDependencies: collectDependencyChanges(project, items, "devDependencies"),
    installedItems: plannedItems.map((item) => ({
      name: item.name,
      version: item.version,
      files: files
        .filter((file) => file.item === item.name)
        .map((file) => file.target)
        .sort(),
      fileHashes: Object.fromEntries(
        files
          .filter((file) => file.item === item.name)
          .sort((a, b) => a.target.localeCompare(b.target))
          .map((file) => [file.target, file.contentHash]),
      ),
    })),
    conflicts,
  };
}
