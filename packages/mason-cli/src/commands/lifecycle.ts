import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { installCommand } from "../install/dependencies";
import { createWritePlan, type FileWrite, type WritePlan } from "../install/plan";
import { applyWritePlan } from "../install/write";
import { configPath, readMasonConfig } from "../project/config";
import { detectProject, type ProjectShape } from "../project/detect";

type InstalledRecord = {
  files: string[];
  fileHashes?: Record<string, string>;
  version: string;
};

type InstalledMap = Record<string, InstalledRecord>;

type FileDiff = {
  file: FileWrite;
  localChanged: boolean;
  status: "create" | "delete" | "update" | "unchanged";
};

function hashContent(content: string): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

async function readPackageJson(cwd: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(path.join(cwd, "package.json"), "utf8")) as Record<
    string,
    unknown
  >;
}

async function writePackageJson(cwd: string, packageJson: Record<string, unknown>): Promise<void> {
  await writeFile(path.join(cwd, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

function installedItems(project: ProjectShape): InstalledMap {
  const mason = project.packageJson.mason;
  if (!mason || typeof mason !== "object" || Array.isArray(mason)) return {};
  const installed = (mason as { installed?: unknown }).installed;
  if (!installed || typeof installed !== "object" || Array.isArray(installed)) return {};
  return installed as InstalledMap;
}

function installedItem(project: ProjectShape, item: string): InstalledRecord {
  const record = installedItems(project)[item];
  if (!record) {
    throw new Error(`Mason item is not installed: ${item}`);
  }
  return record;
}

function fileHash(record: InstalledRecord, target: string): string | null {
  return record.fileHashes?.[target] ?? null;
}

function diffPlan(plan: WritePlan, record?: InstalledRecord): FileDiff[] {
  const plannedTargets = new Set(plan.files.map((file) => file.target));
  const diffs = plan.files.map((file): FileDiff => {
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

function formatPlanHeader(command: string, item: string): string {
  return `Mason ${command} plan for ${item}:`;
}

function formatDiffLines(
  command: string,
  item: string,
  plan: WritePlan,
  packageManager: ProjectShape["packageManager"],
  record?: InstalledRecord,
) {
  const lines = [formatPlanHeader(command, item)];
  const diffs = diffPlan(plan, record);

  for (const diff of diffs) {
    const suffix = diff.localChanged ? " (local changes)" : "";
    lines.push(`${diff.status} ${diff.file.target}${suffix}`);
  }

  for (const dependency of [...plan.dependencies, ...plan.devDependencies]) {
    lines.push(
      `add ${dependency.name}@${dependency.version}${
        dependency.existing ? ` (was ${dependency.existing})` : ""
      }`,
    );
  }

  const commandLine = installCommand(packageManager, [
    ...plan.dependencies,
    ...plan.devDependencies,
  ]);
  if (commandLine) lines.push(`install command: ${commandLine}`);
  if (lines.length === 1) lines.push("no changes");
  return lines;
}

export async function diffCommand(options: {
  cwd: string;
  item: string;
  registry: string;
}): Promise<string> {
  const project = await detectProject(options.cwd);
  const record = installedItems(project)[options.item];
  const plan = await createWritePlan(project, {
    allowConflicts: true,
    item: options.item,
    registry: options.registry,
  });
  return formatDiffLines("diff", options.item, plan, project.packageManager, record).join("\n");
}

export async function updateCommand(options: {
  cwd: string;
  dryRun?: boolean;
  force?: boolean;
  item: string;
  registry: string;
}): Promise<string> {
  const project = await detectProject(options.cwd);
  const record = installedItem(project, options.item);
  const plan = await createWritePlan(project, {
    allowConflicts: true,
    item: options.item,
    registry: options.registry,
  });
  const diffs = diffPlan(plan, record);
  const localChanges = diffs.filter((diff) => diff.localChanged);
  const lines = formatDiffLines(
    options.dryRun ? "update dry run" : "update",
    options.item,
    plan,
    project.packageManager,
    record,
  );

  if (localChanges.length > 0 && !options.force) {
    lines.push("blocked: local changes detected; rerun with --force to overwrite");
    return lines.join("\n");
  }

  if (!options.dryRun) {
    await applyWritePlan(project, {
      ...plan,
      files: plan.files.map((file) => ({
        ...file,
        conflict: null,
        mode: file.mode === "create" && file.existing.exists ? "overwrite" : file.mode,
      })),
    });
  }

  return lines.join("\n");
}

export async function removeCommand(options: {
  cwd: string;
  dryRun?: boolean;
  force?: boolean;
  item: string;
}): Promise<string> {
  const project = await detectProject(options.cwd);
  const record = installedItem(project, options.item);
  const lines = [formatPlanHeader(options.dryRun ? "remove dry run" : "remove", options.item)];
  const localChanges: string[] = [];

  for (const target of [...record.files].sort()) {
    const absoluteTarget = path.join(project.cwd, target);
    if (!existsSync(absoluteTarget)) {
      lines.push(`missing ${target}`);
      continue;
    }
    const content = await readFile(absoluteTarget, "utf8");
    const currentHash = hashContent(content);
    const recordedHash = fileHash(record, target);
    if (recordedHash && currentHash !== recordedHash) {
      localChanges.push(target);
      lines.push(`keep ${target} (local changes)`);
      continue;
    }
    lines.push(`delete ${target}`);
  }

  if (localChanges.length > 0 && !options.force) {
    lines.push("blocked: local changes detected; rerun with --force to delete");
    return lines.join("\n");
  }

  if (!options.dryRun) {
    for (const target of record.files) {
      const absoluteTarget = path.join(project.cwd, target);
      if (existsSync(absoluteTarget)) await rm(absoluteTarget);
    }

    const packageJson = await readPackageJson(project.cwd);
    const mason = packageJson.mason as { installed?: Record<string, unknown> } | undefined;
    if (mason?.installed) {
      delete mason.installed[options.item];
      packageJson.mason = mason;
      await writePackageJson(project.cwd, packageJson);
    }
  }

  return lines.join("\n");
}

export async function doctorCommand(options: {
  cwd: string;
  registry?: string | null;
}): Promise<string> {
  const project = await detectProject(options.cwd);
  const lines = ["Mason doctor:"];
  const issues: string[] = [];

  if (!existsSync(configPath(project.cwd))) {
    issues.push("missing mason.config.json");
  } else {
    const config = await readMasonConfig(project.cwd);
    for (const [name, alias] of Object.entries(config.aliases)) {
      if (!alias) issues.push(`empty alias: ${name}`);
    }
    const styleTarget = path.isAbsolute(config.aliases.theme)
      ? config.aliases.theme
      : path.join(project.cwd, config.aliases.theme.replace(/^@\//, "src/"));
    if (!existsSync(styleTarget)) issues.push(`missing style entry: ${config.aliases.theme}`);
  }

  if (project.packageManager === "unknown") issues.push("unknown package manager");

  const installed = installedItems(project);
  for (const [name, record] of Object.entries(installed).sort(([a], [b]) => a.localeCompare(b))) {
    if (!Array.isArray(record.files)) {
      issues.push(`invalid installed metadata for ${name}: files must be an array`);
      continue;
    }
    for (const target of record.files) {
      const absoluteTarget = path.join(project.cwd, target);
      if (!existsSync(absoluteTarget)) {
        issues.push(`missing installed file for ${name}: ${target}`);
        continue;
      }
      const recordedHash = fileHash(record, target);
      if (!recordedHash) issues.push(`missing recorded hash for ${name}: ${target}`);
    }
  }

  if (options.registry) {
    const registryIndex = path.join(path.resolve(options.registry), "registry.json");
    if (!existsSync(registryIndex)) issues.push(`registry not reachable: ${options.registry}`);
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
      !dependencies["@keystone-ui/keystone"]
    ) {
      issues.push("missing @keystone-ui/keystone dependency for Keystone-backed installed items");
    }
  }

  if (issues.length === 0) {
    lines.push("ok");
  } else {
    for (const issue of issues) lines.push(`issue ${issue}`);
  }

  return lines.join("\n");
}
