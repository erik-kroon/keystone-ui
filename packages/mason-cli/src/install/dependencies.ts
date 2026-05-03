import type { PackageManager } from "../project/detect";

export type DependencyChange = {
  kind: "dependency" | "devDependency";
  name: string;
  version: string;
  existing: string | null;
};

export function parseDependencySpecifier(specifier: string): { name: string; version: string } {
  const atIndex = specifier.startsWith("@") ? specifier.indexOf("@", 1) : specifier.indexOf("@");
  if (atIndex <= 0) {
    return { name: specifier, version: "latest" };
  }
  return {
    name: specifier.slice(0, atIndex),
    version: specifier.slice(atIndex + 1),
  };
}

export function installCommand(
  packageManager: PackageManager,
  changes: DependencyChange[],
): string | null {
  if (changes.length === 0) return null;
  const deps = changes.map((change) => `${change.name}@${change.version}`).join(" ");
  switch (packageManager) {
    case "bun":
      return `bun add ${deps}`;
    case "pnpm":
      return `pnpm add ${deps}`;
    case "yarn":
      return `yarn add ${deps}`;
    case "npm":
    case "unknown":
      return `npm install ${deps}`;
  }
}
