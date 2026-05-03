import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ProjectShape } from "../project/detect";
import type { FileWrite, WritePlan } from "./plan";

function sortedObject(input: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b)));
}

export async function applyWritePlan(project: ProjectShape, plan: WritePlan): Promise<void> {
  for (const file of plan.files) {
    await mkdir(path.dirname(file.absoluteTarget), { recursive: true });
    await writeFileByMode(file);
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
    ...((packageJson.mason && typeof packageJson.mason === "object"
      ? packageJson.mason
      : {}) as Record<string, unknown>),
    installed: {
      ...(((packageJson.mason as { installed?: Record<string, unknown> } | undefined)?.installed ??
        {}) as Record<string, unknown>),
      ...Object.fromEntries(
        plan.installedItems.map((item) => [
          item.name,
          {
            version: item.version,
            files: item.files,
            fileHashes: item.fileHashes,
          },
        ]),
      ),
    },
  };
  packageJson.mason = mason;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function writeFileByMode(file: FileWrite): Promise<void> {
  switch (file.mode) {
    case "create":
      if (existsSync(file.absoluteTarget)) {
        throw new Error(`Refusing to overwrite existing file: ${file.target}`);
      }
      await writeFile(file.absoluteTarget, file.content);
      return;
    case "overwrite":
      await writeFile(file.absoluteTarget, file.content);
      return;
    case "append-css":
      await appendCss(file);
      return;
    case "merge-json":
      await mergeJson(file);
      return;
  }
}

async function appendCss(file: FileWrite): Promise<void> {
  if (!existsSync(file.absoluteTarget)) {
    await writeFile(file.absoluteTarget, file.content);
    return;
  }

  const current = await readFile(file.absoluteTarget, "utf8");
  const separator = current.length === 0 || current.endsWith("\n") ? "" : "\n";
  await writeFile(file.absoluteTarget, `${current}${separator}${file.content}`);
}

async function mergeJson(file: FileWrite): Promise<void> {
  const current = existsSync(file.absoluteTarget)
    ? (JSON.parse(await readFile(file.absoluteTarget, "utf8")) as unknown)
    : {};
  const incoming = JSON.parse(file.content) as unknown;
  const merged = mergeJsonValue(current, incoming);
  await writeFile(file.absoluteTarget, `${JSON.stringify(merged, null, 2)}\n`);
}

function mergeJsonValue(current: unknown, incoming: unknown): unknown {
  if (!isPlainObject(current) || !isPlainObject(incoming)) {
    return incoming;
  }

  const merged: Record<string, unknown> = { ...current };
  for (const [key, value] of Object.entries(incoming)) {
    merged[key] = mergeJsonValue(merged[key], value);
  }
  return merged;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
