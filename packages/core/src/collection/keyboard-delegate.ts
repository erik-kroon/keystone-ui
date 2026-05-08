import type { CollectionItem } from "./collection-registry";

export type CollectionNavigationOptions<T extends CollectionItem> = {
  current?: string;
  items: readonly T[];
  loop?: boolean;
};

export type ListInteractionNavigationIntent =
  | "first"
  | "last"
  | "next"
  | "previous"
  | "selected-or-first";

export type ListKeyboardDelegate<T extends CollectionItem> = {
  first?: (items: readonly T[]) => T | undefined;
  last?: (items: readonly T[]) => T | undefined;
  next?: (options: CollectionNavigationOptions<T>) => T | undefined;
  previous?: (options: CollectionNavigationOptions<T>) => T | undefined;
};

export function isCollectionItemHidden(item: CollectionItem): boolean {
  return typeof item.hidden === "function" ? item.hidden() : Boolean(item.hidden);
}

export function isCollectionItemEnabled(item: CollectionItem): boolean {
  return !item.disabled && !isCollectionItemHidden(item);
}

export function firstEnabledItem<T extends CollectionItem>(items: readonly T[]): T | undefined {
  return items.find(isCollectionItemEnabled);
}

export function lastEnabledItem<T extends CollectionItem>(items: readonly T[]): T | undefined {
  return items.findLast(isCollectionItemEnabled);
}

export function nextEnabledItem<T extends CollectionItem>(
  options: CollectionNavigationOptions<T> & { direction: 1 | -1 },
): T | undefined {
  const enabled = options.items.filter(isCollectionItemEnabled);

  return nextEnabledFromEnabledItems({
    ...options,
    items: enabled,
  });
}

export function nextEnabledFromEnabledItems<T extends CollectionItem>(
  options: CollectionNavigationOptions<T> & { direction: 1 | -1 },
): T | undefined {
  if (options.items.length === 0) {
    return undefined;
  }

  const currentIndex = options.items.findIndex((item) => item.value === options.current);
  const fallbackIndex = options.direction === 1 ? 0 : options.items.length - 1;

  if (currentIndex === -1) {
    return options.items[fallbackIndex];
  }

  const nextIndex = currentIndex + options.direction;

  if (nextIndex < 0 || nextIndex >= options.items.length) {
    return options.loop === false
      ? undefined
      : options.items[(nextIndex + options.items.length) % options.items.length];
  }

  return options.items[nextIndex];
}
