import { createSignal, onCleanup, untrack, type Accessor } from "solid-js";

export type CollectionItem = {
  disabled?: boolean;
  element?: Accessor<HTMLElement | undefined>;
  group?: string;
  label?: string;
  value: string;
};

export type CollectionRegistration<T extends CollectionItem> = T & {
  index?: number;
};

export type CollectionRegistryApi<T extends CollectionItem> = {
  items: Accessor<readonly T[]>;
  registerItem: (item: CollectionRegistration<T>) => () => void;
  refreshOrder: () => void;
  scheduleRefreshOrder: () => void;
};

type CollectionEntry<T extends CollectionItem> = {
  explicitOrder: boolean;
  id: number;
  item: T;
  order: number;
};

export function createCollectionRegistry<T extends CollectionItem>(): CollectionRegistryApi<T> {
  const [items, setItems] = createSignal<Array<T>>([], { equals: false });
  const entriesByValue = new Map<string, CollectionEntry<T>>();
  let nextId = 0;
  let nextOrder = 0;
  let refreshScheduled = false;

  const registerItem = (item: CollectionRegistration<T>) => {
    const previous = entriesByValue.get(item.value);
    const entry: CollectionEntry<T> = {
      explicitOrder: item.index !== undefined,
      id: nextId++,
      item: preservePreviousElement(item, previous?.item) as T,
      order: item.index ?? previous?.order ?? nextOrder++,
    };

    entriesByValue.set(entry.item.value, entry);
    refreshItems(entriesByValue);

    const cleanup = () => {
      if (entriesByValue.get(entry.item.value)?.id !== entry.id) {
        return;
      }

      entriesByValue.delete(entry.item.value);
      refreshItems(entriesByValue);
    };

    onCleanup(cleanup);
    return cleanup;
  };

  return {
    items: () => items(),
    registerItem,
    refreshOrder: () => refreshItems(entriesByValue),
    scheduleRefreshOrder,
  };

  function scheduleRefreshOrder() {
    if (refreshScheduled) {
      return;
    }

    refreshScheduled = true;
    queueMicrotask(() => {
      refreshScheduled = false;
      refreshItems(entriesByValue);
    });
  }

  function refreshItems(entries: Map<string, CollectionEntry<T>>) {
    const entryList = Array.from(entries.values());
    const shouldSort = entryList.some(
      (entry) => entry.explicitOrder || untrack(() => entry.item.element?.()),
    );
    const nextItems = (shouldSort ? entryList.sort(sortCollectionEntries) : entryList).map(
      (entry) => entry.item,
    );

    if (areSameItems(untrack(items), nextItems)) {
      return;
    }

    setItems(nextItems);
  }
}

function areSameItems<T extends CollectionItem>(current: readonly T[], next: readonly T[]) {
  return (
    current.length === next.length &&
    current.every((item, index) => areSameCollectionItems(item, next[index]))
  );
}

function areSameCollectionItems<T extends CollectionItem>(current: T, next: T | undefined) {
  return (
    next !== undefined &&
    current.value === next.value &&
    current.label === next.label &&
    current.group === next.group &&
    current.disabled === next.disabled &&
    untrack(() => current.element?.()) === untrack(() => next.element?.())
  );
}

function preservePreviousElement<T extends CollectionItem>(
  item: CollectionRegistration<T>,
  previous: T | undefined,
): CollectionRegistration<T> {
  if (!item.element || !previous?.element) {
    return item;
  }

  const nextElement = item.element;
  const previousElement = previous.element;

  return {
    ...item,
    element: () => nextElement() ?? previousElement(),
  };
}

function sortCollectionEntries<T extends CollectionItem>(
  a: CollectionEntry<T>,
  b: CollectionEntry<T>,
): number {
  const elementOrder = compareElements(
    untrack(() => a.item.element?.()),
    untrack(() => b.item.element?.()),
  );

  if (elementOrder !== 0) {
    return elementOrder;
  }

  return a.order - b.order;
}

function compareElements(a: HTMLElement | undefined, b: HTMLElement | undefined) {
  if (!a || !b || a === b) {
    return 0;
  }

  const position = a.compareDocumentPosition(b);

  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1;
  }

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1;
  }

  return 0;
}
