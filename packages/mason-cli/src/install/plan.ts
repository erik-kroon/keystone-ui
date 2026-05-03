import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  isInstallableItemType,
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
  mode: "create" | "overwrite" | "merge-json" | "append-css";
};

export type InstalledItemRecord = {
  name: string;
  version: string;
  files: string[];
};

export type WritePlan = {
  items: RegistryItem[];
  files: FileWrite[];
  dependencies: DependencyChange[];
  devDependencies: DependencyChange[];
  installedItems: InstalledItemRecord[];
};

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

async function resolveRegistryItem(registry: string, name: string): Promise<RegistryItem> {
  const registryRoot = path.resolve(registry);
  const itemPath = path.join(registryRoot, "items", `${name}.json`);
  return validateRegistryItem(await readJson(itemPath));
}

async function resolveItems(registry: string, requested: string): Promise<RegistryItem[]> {
  const ordered = new Map<string, RegistryItem>();
  const visiting = new Set<string>();
  async function visit(name: string): Promise<void> {
    if (ordered.has(name)) return;
    if (visiting.has(name)) throw new Error(`Registry dependency cycle detected at ${name}`);
    visiting.add(name);
    const item = await resolveRegistryItem(registry, name);
    if (!isInstallableItemType(item.type))
      throw new Error(`Unsupported registry item type: ${item.type}`);
    for (const dependency of item.registryDependencies) {
      await visit(dependency);
    }
    visiting.delete(name);
    ordered.set(name, item);
  }
  await visit(requested);
  return [...ordered.values()];
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

export async function createWritePlan(
  project: ProjectShape,
  options: { item: string; registry: string },
): Promise<WritePlan> {
  const config = await readMasonConfig(project.cwd);
  const items = await resolveItems(options.registry, options.item);
  const files: FileWrite[] = [];
  for (const item of items) {
    for (const file of item.files) {
      const target = targetForFile(config, item, file);
      const absoluteTarget = resolveProjectTarget(project.cwd, target);
      files.push({
        item: item.name,
        source: file.path,
        target,
        absoluteTarget,
        content: await contentForFile(options.registry, file),
        mode: file.mode ?? "create",
      });
    }
  }
  const seenTargets = new Set<string>();
  for (const file of files) {
    if (seenTargets.has(file.absoluteTarget))
      throw new Error(`Multiple registry files target ${file.target}`);
    seenTargets.add(file.absoluteTarget);
    if (file.mode === "create" && existsSync(file.absoluteTarget)) {
      throw new Error(`Refusing to overwrite existing file: ${file.target}`);
    }
  }
  return {
    items,
    files: files.sort((a, b) => a.target.localeCompare(b.target)),
    dependencies: collectDependencyChanges(project, items, "dependencies"),
    devDependencies: collectDependencyChanges(project, items, "devDependencies"),
    installedItems: items.map((item) => ({
      name: item.name,
      version: item.version,
      files: files
        .filter((file) => file.item === item.name)
        .map((file) => file.target)
        .sort(),
    })),
  };
}
