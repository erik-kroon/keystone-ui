export type UIRegistryErrorCode =
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
  | "file.outsideFilesRoot"
  | "dependency.packageName"
  | "dependency.version"
  | "parity.missing"
  | "parity.invalid"
  | "registryDependency.invalidReference"
  | "registryDependency.missing"
  | "registryDependency.cycle";

export type UIRegistryError = {
  code: UIRegistryErrorCode;
  message: string;
  path?: Array<string | number>;
  field?: string;
  value?: unknown;
  details?: Record<string, unknown>;
};

export type ValidationResult<T> =
  | { ok: true; value: T; errors: [] }
  | { ok: false; errors: UIRegistryError[] };

export function ok<T>(value: T): ValidationResult<T> {
  return { ok: true, value, errors: [] };
}

export function fail<T = never>(errors: UIRegistryError[]): ValidationResult<T> {
  return { ok: false, errors };
}
