import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  resolveRegistryDependencyGraph,
  validateRegistry,
  validateRegistryItem,
  type RegistryItem,
  type RootRegistry,
} from "@keystone-ui/mason-registry";
import { readMasonConfig, type MasonConfig } from "../project/config";
import { configPath } from "../project/config";
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
  registry: RegistryIdentity;
  files: string[];
  fileHashes: Record<string, string>;
};

export type RegistryIdentity = {
  name: string;
  homepage: string;
  source: string;
};

export type InstalledRecord = {
  files: string[];
  fileHashes?: Record<string, string>;
  registry?: RegistryIdentity;
  version: string;
};

export type InstalledMap = Record<string, InstalledRecord>;

export type WritePlan = {
  items: RegistryItem[];
  files: FileWrite[];
  dependencies: DependencyChange[];
  devDependencies: DependencyChange[];
  installedItems: InstalledItemRecord[];
  conflicts: WritePlanConflict[];
};

export type InstallTransaction = WritePlan & {
  requestedItem: string;
  plannedItems: RegistryItem[];
};

export type FileDiff = {
  file: FileWrite;
  localChanged: boolean;
  status: "create" | "delete" | "update" | "unchanged";
};

export type RemoveFileChange = {
  absoluteTarget: string;
  currentHash: string | null;
  localChanged: boolean;
  recordedHash: string | null;
  status: "delete" | "keep" | "missing";
  target: string;
};

export type RemoveTransaction = {
  item: string;
  record: InstalledRecord;
  files: RemoveFileChange[];
  localChanges: RemoveFileChange[];
};

export type DoctorReport = {
  issues: string[];
};

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

async function loadRegistryIdentity(registry: string): Promise<RegistryIdentity> {
  const registryRoot = path.resolve(registry);
  const input = await readJson(path.join(registryRoot, "registry.json"));
  const result = validateRegistry(input);
  if (!result.ok) {
    throw new Error(result.errors.map((error) => error.message).join("\n"));
  }
  return registryIdentityFromRoot(registryRoot, result.value);
}

function registryIdentityFromRoot(registryRoot: string, registry: RootRegistry): RegistryIdentity {
  return {
    name: registry.name,
    homepage: registry.homepage,
    source: pathToFileURL(registryRoot).href,
  };
}

function repoRootForDefaultRegistry(registryRoot: string): string {
  return path.resolve(registryRoot, "../..");
}

function isRepoSourcePath(sourcePath: string): boolean {
  return sourcePath.startsWith("packages/");
}

function sourceRootForItem(registryRoot: string, item: { files: RegistryItem["files"] }): string {
  return item.files.some((file) => isRepoSourcePath(file.path))
    ? repoRootForDefaultRegistry(registryRoot)
    : registryRoot;
}

function sourceRootForFile(registryRoot: string, file: RegistryItem["files"][number]): string {
  return isRepoSourcePath(file.path) ? repoRootForDefaultRegistry(registryRoot) : registryRoot;
}

async function resolveRegistryItem(registry: string, name: string): Promise<RegistryItem> {
  const registryRoot = path.resolve(registry);
  const itemPath = path.join(registryRoot, "items", `${name}.json`);
  const item = await readJson(itemPath);
  return validateRegistryItem(item, {
    registryRoot: sourceRootForItem(registryRoot, item as RegistryItem),
  });
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
  if (item.filesRoot && item.targetRoot) {
    const relativePath = path.posix.relative(item.filesRoot, file.path);
    if (relativePath.startsWith("..") || path.posix.isAbsolute(relativePath)) {
      throw new Error(`Registry file ${file.path} is outside filesRoot ${item.filesRoot}`);
    }
    return path.posix.join(item.targetRoot, relativePath);
  }

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
  const registryRoot = path.resolve(registry);
  return readFile(path.join(sourceRootForFile(registryRoot, file), file.path), "utf8");
}

export function hashContent(content: string): string {
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

export function installedItems(project: ProjectShape): InstalledMap {
  const mason = project.packageJson.mason;
  if (!mason || typeof mason !== "object" || Array.isArray(mason)) return {};
  const installed = (mason as { installed?: unknown }).installed;
  if (!installed || typeof installed !== "object" || Array.isArray(installed)) return {};
  return installed as InstalledMap;
}

export function installedItem(project: ProjectShape, item: string): InstalledRecord {
  const record = installedItems(project)[item];
  if (!record) {
    throw new Error(`Mason item is not installed: ${item}`);
  }
  return record;
}

export function fileHash(record: InstalledRecord, target: string): string | null {
  return record.fileHashes?.[target] ?? null;
}

function installedItemNames(project: ProjectShape): Set<string> {
  return new Set(Object.keys(installedItems(project)));
}

export async function createInstallTransaction(
  project: ProjectShape,
  options: { allowConflicts?: boolean; item: string; registry: string },
): Promise<InstallTransaction> {
  const config = await readMasonConfig(project.cwd);
  const registryIdentity = await loadRegistryIdentity(options.registry);
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
    requestedItem: options.item,
    items,
    plannedItems,
    files: files.sort((a, b) => a.target.localeCompare(b.target)),
    dependencies: collectDependencyChanges(project, items, "dependencies"),
    devDependencies: collectDependencyChanges(project, items, "devDependencies"),
    installedItems: plannedItems.map((item) => ({
      name: item.name,
      version: item.version,
      registry: registryIdentity,
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

export async function createWritePlan(
  project: ProjectShape,
  options: { allowConflicts?: boolean; item: string; registry: string },
): Promise<InstallTransaction> {
  return createInstallTransaction(project, options);
}

export function diffInstallTransaction(
  transaction: WritePlan,
  record?: InstalledRecord,
): FileDiff[] {
  const plannedTargets = new Set(transaction.files.map((file) => file.target));
  const diffs = transaction.files.map((file): FileDiff => {
    const recordedHash = record ? fileHash(record, file.target) : null;
    const localChanged = Boolean(
      file.existing.exists && recordedHash && file.existing.hash !== recordedHash,
    );
    const status = !file.existing.exists
      ? "create"
      : file.existing.hash === file.contentHash
        ? "unchanged"
        : "update";
    return { file, localChanged, status };
  });

  for (const target of record?.files ?? []) {
    if (plannedTargets.has(target)) continue;
    diffs.push({
      file: {
        item: "",
        source: "",
        target,
        absoluteTarget: "",
        content: "",
        contentHash: "",
        existing: { exists: true, hash: null, size: null },
        conflict: null,
        mode: "create",
      },
      localChanged: false,
      status: "delete",
    });
  }

  return diffs.sort((a, b) => a.file.target.localeCompare(b.file.target));
}

export function forceOverwriteTransaction<T extends WritePlan>(transaction: T): T {
  return {
    ...transaction,
    files: transaction.files.map((file) => ({
      ...file,
      conflict: null,
      mode: file.mode === "create" && file.existing.exists ? "overwrite" : file.mode,
    })),
  };
}

export async function createRemoveTransaction(
  project: ProjectShape,
  item: string,
): Promise<RemoveTransaction> {
  const record = installedItem(project, item);
  const files: RemoveFileChange[] = [];

  for (const target of [...record.files].sort()) {
    const absoluteTarget = resolveProjectTarget(project.cwd, target);
    if (!existsSync(absoluteTarget)) {
      files.push({
        absoluteTarget,
        currentHash: null,
        localChanged: false,
        recordedHash: fileHash(record, target),
        status: "missing",
        target,
      });
      continue;
    }

    const content = await readFile(absoluteTarget, "utf8");
    const currentHash = hashContent(content);
    const recordedHash = fileHash(record, target);
    const localChanged = Boolean(recordedHash && currentHash !== recordedHash);
    files.push({
      absoluteTarget,
      currentHash,
      localChanged,
      recordedHash,
      status: localChanged ? "keep" : "delete",
      target,
    });
  }

  return {
    item,
    record,
    files,
    localChanges: files.filter((file) => file.localChanged),
  };
}

export async function createDoctorReport(
  project: ProjectShape,
  options: { registry?: string | null } = {},
): Promise<DoctorReport> {
  const issues: string[] = [];
  let checkedRegistry: RegistryIdentity | null = null;

  if (!existsSync(configPath(project.cwd))) {
    issues.push("missing mason.config.json");
  } else {
    try {
      const config = await readMasonConfig(project.cwd);
      for (const [name, alias] of Object.entries(config.aliases ?? {})) {
        if (!alias) issues.push(`empty alias: ${name}`);
      }
      if (!config.aliases?.theme) {
        issues.push("empty alias: theme");
      } else {
        const styleTarget = path.isAbsolute(config.aliases.theme)
          ? config.aliases.theme
          : path.join(project.cwd, config.aliases.theme.replace(/^@\//, "src/"));
        if (!existsSync(styleTarget)) issues.push(`missing style entry: ${config.aliases.theme}`);
      }
    } catch (error) {
      issues.push(
        `invalid mason.config.json: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  if (project.packageManager === "unknown") issues.push("unknown package manager");

  if (options.registry) {
    const registryIndex = path.join(path.resolve(options.registry), "registry.json");
    if (!existsSync(registryIndex)) {
      issues.push(`registry not reachable: ${options.registry}`);
    } else {
      try {
        const registry = JSON.parse(await readFile(registryIndex, "utf8")) as unknown;
        const result = validateRegistry(registry);
        if (!result.ok) {
          issues.push(
            `invalid registry: ${result.errors.map((error) => error.message).join("; ")}`,
          );
        } else {
          checkedRegistry = registryIdentityFromRoot(path.resolve(options.registry), result.value);
        }
      } catch (error) {
        issues.push(`invalid registry: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  const installed = installedItems(project);
  for (const [name, record] of Object.entries(installed).sort(([a], [b]) => a.localeCompare(b))) {
    if (!Array.isArray(record.files)) {
      issues.push(`invalid installed metadata for ${name}: files must be an array`);
      continue;
    }
    for (const target of record.files) {
      const absoluteTarget = resolveProjectTarget(project.cwd, target);
      if (!existsSync(absoluteTarget)) {
        issues.push(`missing installed file for ${name}: ${target}`);
        continue;
      }
      const recordedHash = fileHash(record, target);
      if (!recordedHash) issues.push(`missing recorded hash for ${name}: ${target}`);
    }
    if (!record.registry) issues.push(`missing registry identity for ${name}`);
    else if (checkedRegistry) {
      if (record.registry.name !== checkedRegistry.name) {
        issues.push(
          `registry name mismatch for ${name}: installed from ${record.registry.name}, checked ${checkedRegistry.name}`,
        );
      }
      if (record.registry.homepage !== checkedRegistry.homepage) {
        issues.push(
          `registry homepage mismatch for ${name}: installed from ${record.registry.homepage}, checked ${checkedRegistry.homepage}`,
        );
      }
    }
  }

  if (Object.keys(installed).length > 0) {
    const dependencies = {
      ...(project.packageJson.dependencies as Record<string, string> | undefined),
      ...(project.packageJson.devDependencies as Record<string, string> | undefined),
    };
    if (
      Object.keys(installed).some((name) =>
        ["accordion", "dialog", "popover", "select", "sheet", "tooltip"].includes(name),
      ) &&
      !dependencies["@keystone-ui/core"]
    ) {
      issues.push("missing @keystone-ui/core dependency for Core-backed installed items");
    }
  }

  return { issues };
}
