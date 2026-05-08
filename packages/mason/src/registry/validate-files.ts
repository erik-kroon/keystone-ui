import { existsSync } from "node:fs";
import path from "node:path";
import type { UIRegistryError } from "./errors";
import type { FileDescriptor } from "./schema";
import { validateRegistryPath } from "./path-safety";

export type ValidateFilesOptions = {
  filesRoot?: string;
  projectRoot?: string;
  registryRoot?: string;
  targetRoot?: string;
};

function targetFromRoot(
  file: FileDescriptor,
  options: Pick<ValidateFilesOptions, "filesRoot" | "targetRoot">,
): string | undefined {
  if (!options.filesRoot || !options.targetRoot) return file.target;
  if (file.target) return file.target;

  const relativePath = path.posix.relative(options.filesRoot, file.path);
  if (relativePath.startsWith("..") || path.posix.isAbsolute(relativePath)) return undefined;
  return path.posix.join(options.targetRoot, relativePath);
}

function pathForTargetSafety(target: string): string {
  if (target === "~") return ".";
  if (target.startsWith("~/")) return target.slice("~/".length);

  const match = /^@([^/]+)\/(.+)$/.exec(target);
  if (!match) return target;

  const placeholder = match[1];
  const rest = match[2];
  if (!placeholder || !rest) return target;

  switch (placeholder) {
    case "components":
      return path.posix.join("components", rest);
    case "ui":
      return path.posix.join("components/ui", rest);
    case "lib":
      return path.posix.join("lib", rest);
    case "hooks":
      return path.posix.join("hooks", rest);
    default:
      return path.posix.join(placeholder, rest);
  }
}

export function validateFiles(
  files: FileDescriptor[],
  options: ValidateFilesOptions = {},
): UIRegistryError[] {
  const errors: UIRegistryError[] = [];
  const sourcePaths = new Set<string>();
  const targets = new Set<string>();

  if (options.filesRoot) {
    errors.push(
      ...validateRegistryPath(options.filesRoot, {
        field: "filesRoot",
        path: ["filesRoot"],
      }),
    );
  }

  if (options.targetRoot) {
    errors.push(
      ...validateRegistryPath(options.targetRoot, {
        field: "targetRoot",
        path: ["targetRoot"],
        projectRoot: options.projectRoot,
        checkSymlinkEscape: true,
      }),
    );
  }

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

    if (options.filesRoot && options.targetRoot) {
      const relativePath = path.posix.relative(options.filesRoot, file.path);
      if (relativePath.startsWith("..") || path.posix.isAbsolute(relativePath)) {
        errors.push({
          code: "file.outsideFilesRoot",
          message: `Registry source path is outside filesRoot: ${file.path}`,
          field: "path",
          path: ["files", index, "path"],
          value: file.path,
        });
      }
    }

    const target = targetFromRoot(file, options);
    if (target) {
      const safetyTarget = pathForTargetSafety(target);
      errors.push(
        ...validateRegistryPath(safetyTarget, {
          field: "target",
          path: ["files", index, "target"],
          projectRoot: options.projectRoot,
          checkSymlinkEscape: true,
        }),
      );
      if (targets.has(safetyTarget)) {
        errors.push({
          code: "file.duplicateTarget",
          message: `Duplicate registry file target: ${target}`,
          field: "target",
          path: ["files", index, "target"],
          value: target,
        });
      }
      targets.add(safetyTarget);
    }
  }

  return errors;
}
