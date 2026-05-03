import { createSignal, onCleanup, type Accessor } from "solid-js";

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
};

export function createCollectionRegistry<T extends CollectionItem>(): CollectionRegistryApi<T> {
  const [items, setItems] = createSignal<Array<T>>([], { equals: false });
  const currentItems: Array<T> = [];
  let order = 0;
  let needsOrderedSort = false;
  const fallbackOrder = new Map<string, number>();

  const registerItem = (item: CollectionRegistration<T>) => {
    const registrationOrder = item.index ?? order++;
    fallbackOrder.set(item.value, registrationOrder);
    const nextItem = item as T;
    const existingIndex = currentItems.findIndex((candidate) => candidate.value === nextItem.value);
    needsOrderedSort ||= item.index !== undefined || item.element !== undefined;

    if (existingIndex === -1) {
      currentItems.push(nextItem);
    } else {
      currentItems[existingIndex] = nextItem;
    }

    if (needsOrderedSort) {
      currentItems.sort((a, b) => sortCollectionItemOrder(a, b, fallbackOrder));
    }

    setItems(currentItems);

    const cleanup = () => {
      fallbackOrder.delete(nextItem.value);
      const index = currentItems.findIndex((candidate) => candidate.value === nextItem.value);

      if (index !== -1) {
        currentItems.splice(index, 1);
        setItems(currentItems);
      }
    };

    onCleanup(cleanup);
    return cleanup;
  };

  return {
    items: () => items(),
    registerItem,
  };
}

function sortCollectionItemOrder<T extends CollectionItem>(
  a: T,
  b: T,
  fallbackOrder: Map<string, number>,
): number {
  const elementOrder = compareElements(a.element?.(), b.element?.());

  if (elementOrder !== 0) {
    return elementOrder;
  }

  return (fallbackOrder.get(a.value) ?? 0) - (fallbackOrder.get(b.value) ?? 0);
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
