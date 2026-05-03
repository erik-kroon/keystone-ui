import { realpathSync } from "node:fs";
import path from "node:path";

export function rejectUnsafeRelativePath(target: string): void {
  if (!target || target.trim() !== target) throw new Error(`Unsafe target path: ${target}`);
  if (path.isAbsolute(target)) throw new Error(`Unsafe target path: ${target}`);
  if (target.startsWith("~/")) throw new Error(`Unsafe target path: ${target}`);
  if (/^[a-zA-Z]:[\\/]/.test(target)) throw new Error(`Unsafe target path: ${target}`);
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(target)) throw new Error(`Unsafe target path: ${target}`);
  const parts = target.split(/[\\/]/);
  if (parts.some((part) => part === "" || part === "." || part === "..")) {
    throw new Error(`Unsafe target path: ${target}`);
  }
}

export function resolveProjectTarget(projectRoot: string, target: string): string {
  rejectUnsafeRelativePath(target);
  const root = realpathSync(projectRoot);
  const absolute = path.resolve(root, target);
  const relative = path.relative(root, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Target escapes project root: ${target}`);
  }
  return absolute;
}

export function aliasToPath(alias: string): string {
  if (alias.startsWith("@/")) return `src/${alias.slice(2)}`;
  return alias.replace(/^\.\//, "");
}
