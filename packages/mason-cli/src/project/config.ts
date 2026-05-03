import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ProjectShape } from "./detect";

export type MasonConfig = {
  $schema: string;
  style: "default";
  aliases: {
    ui: string;
    hooks: string;
    lib: string;
    theme: string;
  };
  project: {
    framework: "vite-solid";
    typescript: boolean;
    packageManager: ProjectShape["packageManager"];
    styleEntry: string | null;
    workspaceRoot: string;
  };
};

export const masonConfigFile = "mason.config.json";

export function configPath(cwd: string): string {
  return path.join(cwd, masonConfigFile);
}

export function createDefaultConfig(project: ProjectShape): MasonConfig {
  const srcAlias =
    project.aliases["@"] === "./src" || project.aliases["@"] === "src" ? "@/" : "src/";
  return {
    $schema: "https://mason.build/schema/config.json",
    style: "default",
    aliases: {
      ui: `${srcAlias}components/ui`,
      hooks: `${srcAlias}hooks`,
      lib: `${srcAlias}lib`,
      theme: project.styleEntry ?? `${srcAlias}styles.css`,
    },
    project: {
      framework: "vite-solid",
      typescript: project.isTypeScript,
      packageManager: project.packageManager,
      styleEntry: project.styleEntry,
      workspaceRoot: path.relative(project.cwd, project.workspaceRoot) || ".",
    },
  };
}

export async function readMasonConfig(cwd: string): Promise<MasonConfig> {
  return JSON.parse(await readFile(configPath(cwd), "utf8")) as MasonConfig;
}

export async function writeMasonConfig(
  cwd: string,
  config: MasonConfig,
  options: { force?: boolean } = {},
): Promise<void> {
  const target = configPath(cwd);
  if (existsSync(target) && !options.force) {
    throw new Error("mason.config.json already exists. Use --force to overwrite it.");
  }
  await writeFile(target, `${JSON.stringify(config, null, 2)}\n`);
}
