import type { UIRegistryError } from "./errors";
import type { RegistryItem } from "./schema";

const packageNamePattern = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const semverRangePattern =
  /^(?:\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?|(?:[~^]=?|>=?|<=?)\s*\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?|\*\s*|(?:>=?|<=?)\s*\d+\.\d+\.\d+\s+<\s*\d+\.\d+\.\d+)$/;

function parseDependency(specifier: string): { name: string; version?: string } {
  if (specifier.startsWith("@")) {
    const secondAt = specifier.indexOf("@", 1);
    if (secondAt === -1) {
      return { name: specifier };
    }
    return { name: specifier.slice(0, secondAt), version: specifier.slice(secondAt + 1) };
  }

  const at = specifier.indexOf("@");
  if (at === -1) {
    return { name: specifier };
  }
  return { name: specifier.slice(0, at), version: specifier.slice(at + 1) };
}

function validatePackageDependency(
  specifier: string,
  path: Array<string | number>,
): UIRegistryError[] {
  const { name, version } = parseDependency(specifier);
  const errors: UIRegistryError[] = [];

  if (!packageNamePattern.test(name)) {
    errors.push({
      code: "dependency.packageName",
      message: `${specifier} is not a valid package dependency name.`,
      path,
      value: specifier,
    });
  }

  if (version !== undefined && !semverRangePattern.test(version.trim())) {
    errors.push({
      code: "dependency.version",
      message: `${specifier} must use an exact version or semver-compatible range.`,
      path,
      value: specifier,
    });
  }

  return errors;
}

export function isRegistryDependencyReference(value: string): boolean {
  return (
    /^[a-z0-9][a-z0-9._-]*$/i.test(value) ||
    /^@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/i.test(value) ||
    /^https?:\/\/.+/i.test(value)
  );
}

export function validateDependencies(item: RegistryItem): UIRegistryError[] {
  const errors: UIRegistryError[] = [];

  for (const field of ["dependencies", "devDependencies"] as const) {
    for (const [index, dependency] of (item[field] ?? []).entries()) {
      errors.push(...validatePackageDependency(dependency, [field, index]));
    }
  }

  for (const [index, dependency] of (item.registryDependencies ?? []).entries()) {
    if (!isRegistryDependencyReference(dependency)) {
      errors.push({
        code: "registryDependency.invalidReference",
        message: `${dependency} is not a supported registry dependency reference.`,
        path: ["registryDependencies", index],
        value: dependency,
      });
    }
  }

  return errors;
}
