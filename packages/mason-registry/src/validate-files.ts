import { existsSync } from "node:fs";
import path from "node:path";
import type { MasonRegistryError } from "./errors";
import type { FileDescriptor } from "./schema";
import { validateRegistryPath } from "./path-safety";

export type ValidateFilesOptions = {
  projectRoot?: string;
  registryRoot?: string;
};

export function validateFiles(
  files: FileDescriptor[],
  options: ValidateFilesOptions = {},
): MasonRegistryError[] {
  const errors: MasonRegistryError[] = [];
  const sourcePaths = new Set<string>();
  const targets = new Set<string>();

  for (const [index, file] of files.entries()) {
    errors.push(
      ...validateRegistryPath(file.path, {
        field: "path",
        path: ["files", index, "path"],
      }),
    );
    if (sourcePaths.has(file.path)) {
      errors.push({
        code: "file.duplicatePath",
        message: `Duplicate registry source path: ${file.path}`,
        field: "path",
        path: ["files", index, "path"],
        value: file.path,
      });
    }
    sourcePaths.add(file.path);

    if (options.registryRoot && file.content === undefined) {
      const absoluteSource = path.join(options.registryRoot, file.path);
      if (!existsSync(absoluteSource)) {
        errors.push({
          code: "file.missingSource",
          message: `Registry source file does not exist: ${file.path}`,
          field: "path",
          path: ["files", index, "path"],
          value: file.path,
        });
      }
    }

    if (file.target) {
      errors.push(
        ...validateRegistryPath(file.target, {
          field: "target",
          path: ["files", index, "target"],
          projectRoot: options.projectRoot,
          checkSymlinkEscape: true,
        }),
      );
      if (targets.has(file.target)) {
        errors.push({
          code: "file.duplicateTarget",
          message: `Duplicate registry file target: ${file.target}`,
          field: "target",
          path: ["files", index, "target"],
          value: file.target,
        });
      }
      targets.add(file.target);
    }
  }

  return errors;
}
