import { existsSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import type { MasonRegistryError } from "./errors";

export type PathSafetyOptions = {
  field?: string;
  path?: Array<string | number>;
  projectRoot?: string;
  checkSymlinkEscape?: boolean;
};

function error(
  code: MasonRegistryError["code"],
  message: string,
  value: string,
  options: PathSafetyOptions,
): MasonRegistryError {
  return { code, message, value, field: options.field, path: options.path };
}

function hasEmptySegment(value: string): boolean {
  return value.split(/[\\/]/).some((segment) => segment.length === 0);
}

function isUrlLike(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
}

function hasWindowsDrivePrefix(value: string): boolean {
  return /^[a-z]:[\\/]/i.test(value);
}

function isOutsideRoot(target: string, root: string): boolean {
  const relation = relative(root, target);
  return relation === ".." || relation.startsWith(`..${sep}`) || isAbsolute(relation);
}

function nearestExistingPath(path: string): string | undefined {
  let current = path;
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) {
      return undefined;
    }
    current = parent;
  }
  return current;
}

export function validateRegistryPath(
  value: string,
  options: PathSafetyOptions = {},
): MasonRegistryError[] {
  const errors: MasonRegistryError[] = [];

  if (value.length === 0) {
    errors.push(error("path.empty", "Path must not be empty.", value, options));
  }
  if (value.startsWith("~/") || value === "~") {
    errors.push(error("path.home", "Path must not use home-directory expansion.", value, options));
  }
  if (hasWindowsDrivePrefix(value)) {
    errors.push(
      error("path.windowsDrive", "Path must not use a Windows drive prefix.", value, options),
    );
  }
  if (isUrlLike(value)) {
    errors.push(error("path.url", "Path must not be URL-like.", value, options));
  }
  if (isAbsolute(value)) {
    errors.push(error("path.absolute", "Path must be relative.", value, options));
  }
  if (value.split(/[\\/]/).includes("..")) {
    errors.push(error("path.traversal", "Path must not contain '..' traversal.", value, options));
  }
  if (hasEmptySegment(value)) {
    errors.push(
      error("path.emptySegment", "Path must not contain empty path segments.", value, options),
    );
  }

  if (options.projectRoot && errors.length === 0) {
    const realRoot = realpathSync(options.projectRoot);
    const target = resolve(realRoot, value);
    if (isOutsideRoot(target, realRoot)) {
      errors.push(
        error("path.outsideRoot", "Target resolves outside the project root.", value, options),
      );
    }

    if (options.checkSymlinkEscape) {
      const existing = nearestExistingPath(target);
      if (existing) {
        const realExisting = realpathSync(existing);
        if (isOutsideRoot(realExisting, realRoot)) {
          errors.push(
            error(
              "path.symlinkEscape",
              "Target follows a symlink outside the project root.",
              value,
              options,
            ),
          );
        }
      }
    }
  }

  return errors;
}
