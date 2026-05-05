import { fail, ok, type UIRegistryError, type ValidationResult } from "./errors";
import type { RegistryItem } from "./schema";
import { validateItem } from "./validate-item";

export type RegistryItemMap = Map<string, RegistryItem> | Record<string, RegistryItem>;
export type RegistryItemLoader = (
  name: string,
) => RegistryItem | Promise<RegistryItem | undefined> | undefined;

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
  const errors: UIRegistryError[] = [];
  const temporary = new Set<string>();
  const permanent = new Set<string>();

  function visit(name: string, stack: string[]): void {
    if (isRemoteReference(name)) {
      return;
    }

    if (temporary.has(name)) {
      const cycle = [...stack, name];
      errors.push({
        code: "registryDependency.cycle",
        message: `Registry dependency cycle detected: ${cycle.join(" -> ")}.`,
        value: name,
        details: { cycle },
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
    stack.push(name);
    for (const dependency of item.registryDependencies ?? []) {
      visit(dependency, stack);
    }
    stack.pop();
    temporary.delete(name);
    permanent.add(name);
    resolved.push(item);
  }

  for (const name of requestedItems) {
    visit(name, []);
  }

  return errors.length > 0 ? fail(errors) : ok({ items: resolved });
}

export async function resolveRegistryDependencyGraph(
  requestedItems: string[],
  loadItem: RegistryItemLoader,
  options: { installSupportedOnly?: boolean } = {},
): Promise<ValidationResult<ResolvedRegistryDependencyGraph>> {
  const resolved: RegistryItem[] = [];
  const errors: UIRegistryError[] = [];
  const temporary = new Set<string>();
  const permanent = new Set<string>();

  async function visit(name: string, stack: string[]): Promise<void> {
    if (isRemoteReference(name)) {
      return;
    }

    if (temporary.has(name)) {
      const cycle = [...stack, name];
      errors.push({
        code: "registryDependency.cycle",
        message: `Registry dependency cycle detected: ${cycle.join(" -> ")}.`,
        value: name,
        details: { cycle },
      });
      return;
    }

    if (permanent.has(name)) {
      return;
    }

    const item = await loadItem(name);
    if (!item) {
      errors.push({
        code: "registryDependency.missing",
        message: `Registry dependency '${name}' was not found.`,
        value: name,
        details: { requestedBy: stack.at(-1) },
      });
      return;
    }

    const itemValidation = validateItem(item, {
      installSupportedOnly: options.installSupportedOnly,
    });
    if (!itemValidation.ok) {
      errors.push(...itemValidation.errors);
      return;
    }

    temporary.add(name);
    stack.push(name);
    for (const dependency of itemValidation.value.registryDependencies ?? []) {
      await visit(dependency, stack);
    }
    stack.pop();
    temporary.delete(name);
    permanent.add(name);
    resolved.push(itemValidation.value);
  }

  for (const name of requestedItems) {
    await visit(name, []);
  }

  return errors.length > 0 ? fail(errors) : ok({ items: resolved });
}
