import { installCommand } from "../install/dependencies";
import {
  createDoctorReport,
  createRemoveTransaction,
  createWritePlan,
  diffInstallTransaction,
  forceOverwriteTransaction,
  installedItem,
  installedItems,
  type InstalledRecord,
  type WritePlan,
} from "../install/plan";
import { applyRemoveTransaction, applyWritePlan } from "../install/write";
import { detectProject, type ProjectShape } from "../project/detect";

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
  const diffs = diffInstallTransaction(plan, record);

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
  const diffs = diffInstallTransaction(plan, record);
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
    await applyWritePlan(project, forceOverwriteTransaction(plan));
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
  const transaction = await createRemoveTransaction(project, options.item);
  const lines = [formatPlanHeader(options.dryRun ? "remove dry run" : "remove", options.item)];

  for (const file of transaction.files) {
    if (file.status === "missing") {
      lines.push(`missing ${file.target}`);
      continue;
    }
    if (file.status === "keep") {
      lines.push(`keep ${file.target} (local changes)`);
      continue;
    }
    lines.push(`delete ${file.target}`);
  }

  if (transaction.localChanges.length > 0 && !options.force) {
    lines.push("blocked: local changes detected; rerun with --force to delete");
    return lines.join("\n");
  }

  if (!options.dryRun) {
    await applyRemoveTransaction(project, transaction);
  }

  return lines.join("\n");
}

export async function doctorCommand(options: {
  cwd: string;
  registry?: string | null;
}): Promise<string> {
  const project = await detectProject(options.cwd);
  const lines = ["Mason doctor:"];
  const { issues } = await createDoctorReport(project, { registry: options.registry });

  if (issues.length === 0) {
    lines.push("ok");
  } else {
    for (const issue of issues) lines.push(`issue ${issue}`);
  }

  return lines.join("\n");
}
