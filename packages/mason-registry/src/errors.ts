export type MasonRegistryErrorCode =
  | "schema.invalid"
  | "item.unsupportedForInstall"
  | "path.empty"
  | "path.absolute"
  | "path.traversal"
  | "path.home"
  | "path.emptySegment"
  | "path.windowsDrive"
  | "path.url"
  | "path.outsideRoot"
  | "path.symlinkEscape"
  | "file.duplicatePath"
  | "file.missingSource"
  | "file.duplicateTarget"
  | "dependency.packageName"
  | "dependency.version"
  | "registryDependency.invalidReference"
  | "registryDependency.missing"
  | "registryDependency.cycle";

export type MasonRegistryError = {
  code: MasonRegistryErrorCode;
  message: string;
  path?: Array<string | number>;
  field?: string;
  value?: unknown;
  details?: Record<string, unknown>;
};

export type ValidationResult<T> =
  | { ok: true; value: T; errors: [] }
  | { ok: false; errors: MasonRegistryError[] };

export function ok<T>(value: T): ValidationResult<T> {
  return { ok: true, value, errors: [] };
}

export function fail<T = never>(errors: MasonRegistryError[]): ValidationResult<T> {
  return { ok: false, errors };
}
