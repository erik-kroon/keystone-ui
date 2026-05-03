import type { MasonRegistryError } from "./errors";
import type { FileDescriptor } from "./schema";
import { validateRegistryPath } from "./path-safety";

export type ValidateFilesOptions = {
  projectRoot?: string;
};

export function validateFiles(
  files: FileDescriptor[],
  options: ValidateFilesOptions = {},
): MasonRegistryError[] {
  const errors: MasonRegistryError[] = [];

  for (const [index, file] of files.entries()) {
    errors.push(
      ...validateRegistryPath(file.path, {
        field: "path",
        path: ["files", index, "path"],
      }),
    );

    if (file.target) {
      errors.push(
        ...validateRegistryPath(file.target, {
          field: "target",
          path: ["files", index, "target"],
          projectRoot: options.projectRoot,
          checkSymlinkEscape: true,
        }),
      );
    }
  }

  return errors;
}
