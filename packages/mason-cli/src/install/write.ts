import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ProjectShape } from "../project/detect";
import type { WritePlan } from "./plan";

function sortedObject(input: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b)));
}

export async function applyWritePlan(project: ProjectShape, plan: WritePlan): Promise<void> {
  for (const file of plan.files) {
    await mkdir(path.dirname(file.absoluteTarget), { recursive: true });
    await writeFile(file.absoluteTarget, file.content);
  }

  const packagePath = path.join(project.cwd, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8")) as Record<string, unknown>;
  const dependencies = {
    ...(packageJson.dependencies as Record<string, string> | undefined),
  };
  const devDependencies = {
    ...(packageJson.devDependencies as Record<string, string> | undefined),
  };
  for (const change of plan.dependencies) dependencies[change.name] = change.version;
  for (const change of plan.devDependencies) devDependencies[change.name] = change.version;
  packageJson.dependencies = sortedObject(dependencies);
  if (Object.keys(devDependencies).length > 0)
    packageJson.devDependencies = sortedObject(devDependencies);

  const mason = {
    installed: Object.fromEntries(
      plan.installedItems.map((item) => [
        item.name,
        {
          version: item.version,
          files: item.files,
        },
      ]),
    ),
  };
  packageJson.mason = mason;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
