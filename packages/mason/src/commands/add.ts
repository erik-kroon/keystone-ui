import { detectProject } from "../project/detect";
import { installCommand } from "../install/dependencies";
import { createWritePlan } from "../install/plan";
import { applyWritePlan } from "../install/write";

export async function addCommand(options: {
  cwd: string;
  item: string;
  registry: string;
  dryRun?: boolean;
}): Promise<string> {
  const project = await detectProject(options.cwd);
  const plan = await createWritePlan(project, { item: options.item, registry: options.registry });
  const lines = [`Mason ${options.dryRun ? "dry run" : "add"} plan for ${options.item}:`];
  for (const file of plan.files) lines.push(`create ${file.target}`);
  for (const dependency of [...plan.dependencies, ...plan.devDependencies]) {
    lines.push(
      `add ${dependency.name}@${dependency.version}${dependency.existing ? ` (was ${dependency.existing})` : ""}`,
    );
  }
  const command = installCommand(project.packageManager, [
    ...plan.dependencies,
    ...plan.devDependencies,
  ]);
  if (command) lines.push(`install command: ${command}`);
  if (!options.dryRun) await applyWritePlan(project, plan);
  return lines.join("\n");
}
