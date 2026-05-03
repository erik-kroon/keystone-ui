import { fail, ok, type MasonRegistryError, type ValidationResult } from "./errors";
import type { RegistryItem } from "./schema";
import { validateItem } from "./validate-item";

export type RegistryItemMap = Map<string, RegistryItem> | Record<string, RegistryItem>;

export type ResolvedRegistryDependencyGraph = {
  items: RegistryItem[];
};

function getItem(items: RegistryItemMap, name: string): RegistryItem | undefined {
  return items instanceof Map ? items.get(name) : items[name];
}

function isRemoteReference(reference: string): boolean {
  return /^https?:\/\//i.test(reference);
}

export function resolveRegistryDependencies(
  requestedItems: string[],
  items: RegistryItemMap,
): ValidationResult<ResolvedRegistryDependencyGraph> {
  const resolved: RegistryItem[] = [];
  const errors: MasonRegistryError[] = [];
  const temporary = new Set<string>();
  const permanent = new Set<string>();

  function visit(name: string, stack: string[]): void {
    if (isRemoteReference(name)) {
      return;
    }

    if (temporary.has(name)) {
      errors.push({
        code: "registryDependency.cycle",
        message: `Registry dependency cycle detected: ${[...stack, name].join(" -> ")}.`,
        value: name,
        details: { cycle: [...stack, name] },
      });
      return;
    }

    if (permanent.has(name)) {
      return;
    }

    const item = getItem(items, name);
    if (!item) {
      errors.push({
        code: "registryDependency.missing",
        message: `Registry dependency '${name}' was not found.`,
        value: name,
        details: { requestedBy: stack.at(-1) },
      });
      return;
    }

    const itemValidation = validateItem(item);
    if (!itemValidation.ok) {
      errors.push(...itemValidation.errors);
      return;
    }

    temporary.add(name);
    for (const dependency of item.registryDependencies ?? []) {
      visit(dependency, [...stack, name]);
    }
    temporary.delete(name);
    permanent.add(name);
    resolved.push(item);
  }

  for (const name of requestedItems) {
    visit(name, []);
  }

  return errors.length > 0 ? fail(errors) : ok({ items: resolved });
}
