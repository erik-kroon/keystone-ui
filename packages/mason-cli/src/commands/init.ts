import { createDefaultConfig, writeMasonConfig } from "../project/config";
import { detectProject } from "../project/detect";

export async function initCommand(options: {
  cwd: string;
  yes?: boolean;
  force?: boolean;
}): Promise<string> {
  const project = await detectProject(options.cwd);
  if (!project.isSolid) {
    throw new Error(
      "Mason only supports Solid projects. Install solid-js or run mason init in a Solid app.",
    );
  }
  if (!project.isVite) {
    throw new Error(
      "Mason could not detect a Vite Solid project. Add Vite config/dependencies and retry.",
    );
  }
  const config = createDefaultConfig(project);
  await writeMasonConfig(project.cwd, config, { force: options.force });
  return `Created mason.config.json for ${project.isTypeScript ? "TypeScript" : "JavaScript"} Vite Solid project.`;
}
