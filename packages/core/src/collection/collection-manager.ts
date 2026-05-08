import { createMemo, type Accessor } from "solid-js";
import { createActiveDescendant } from "./active-descendant";
import {
  createCollectionRegistry,
  type CollectionItem,
  type CollectionRegistration,
} from "./collection-registry";
import {
  firstEnabledItem,
  isCollectionItemEnabled,
  lastEnabledItem,
  nextEnabledFromEnabledItems,
  type ListInteractionNavigationIntent,
  type ListKeyboardDelegate,
} from "./keyboard-delegate";
import { createTypeahead, type TypeaheadApi } from "./typeahead";

export type ListCollectionManagerOptions<T extends CollectionItem = CollectionItem> = {
  keyboardDelegate?: ListKeyboardDelegate<T>;
  locale?: Accessor<string | undefined>;
  loop?: boolean;
  typeaheadCollator?: Intl.Collator;
  typeaheadResetMs?: number;
};

export type ListCollectionManagerApi<T extends CollectionItem> = {
  enabledItems: Accessor<readonly T[]>;
  highlightedItem: Accessor<T | undefined>;
  highlightedValue: Accessor<string | undefined>;
  highlight: (intent: ListInteractionNavigationIntent, selected?: T | undefined) => T | undefined;
  itemByValue: (value: string | undefined) => T | undefined;
  items: Accessor<readonly T[]>;
  isHighlighted: (value: string) => boolean;
  registerItem: (item: CollectionRegistration<T>) => () => void;
  refreshOrder: () => void;
  scheduleRefreshOrder: () => void;
  setHighlightedValue: (value: string | undefined) => void;
  typeahead: TypeaheadApi;
};

export function createListCollectionManager<T extends CollectionItem>(
  options: ListCollectionManagerOptions<T> = {},
): ListCollectionManagerApi<T> {
  const collection = createCollectionRegistry<T>();
  const itemList = collection.items;
  const itemByValueMap = createMemo(() => {
    const map = new Map<string, T>();

    for (const item of itemList()) {
      map.set(item.value, item);
    }

    return map;
  });
  const enabledItems = createMemo(() => itemList().filter(isCollectionItemEnabled));
  const itemByValue = (candidateValue: string | undefined) =>
    candidateValue === undefined ? undefined : itemByValueMap().get(candidateValue);
  const activeDescendant = createActiveDescendant({ itemByValue });
  const typeahead = createTypeahead({
    collator: options.typeaheadCollator,
    current: activeDescendant.highlightedValue,
    items: itemList,
    locale: options.locale,
    onMatch: (item) => activeDescendant.setHighlightedValue(item.value),
    resetMs: options.typeaheadResetMs,
  });

  const highlightItem = (item: T | undefined) => {
    activeDescendant.setHighlightedValue(item?.value);
    scrollItemIntoView(item);
    return item;
  };

  const highlight = (intent: ListInteractionNavigationIntent, selected?: T | undefined) => {
    if (intent === "first") {
      return highlightItem(
        options.keyboardDelegate?.first?.(enabledItems()) ?? firstEnabledItem(enabledItems()),
      );
    }

    if (intent === "last") {
      return highlightItem(
        options.keyboardDelegate?.last?.(enabledItems()) ?? lastEnabledItem(enabledItems()),
      );
    }

    if (intent === "selected-or-first") {
      return highlightItem(
        selected && isCollectionItemEnabled(selected) ? selected : firstEnabledItem(enabledItems()),
      );
    }

    const nextOptions = {
      current: activeDescendant.highlightedValue(),
      items: enabledItems(),
      loop: options.loop,
    };
    const delegated =
      intent === "next"
        ? options.keyboardDelegate?.next?.(nextOptions)
        : options.keyboardDelegate?.previous?.(nextOptions);

    return highlightItem(
      delegated ??
        nextEnabledFromEnabledItems({
          ...nextOptions,
          direction: intent === "next" ? 1 : -1,
        }),
    );
  };

  return {
    enabledItems,
    highlightedItem: activeDescendant.highlightedItem,
    highlightedValue: activeDescendant.highlightedValue,
    highlight,
    itemByValue,
    items: itemList,
    isHighlighted: activeDescendant.isHighlighted,
    registerItem: collection.registerItem,
    refreshOrder: collection.refreshOrder,
    scheduleRefreshOrder: collection.scheduleRefreshOrder,
    setHighlightedValue: activeDescendant.setHighlightedValue,
    typeahead,
  };
}

function scrollItemIntoView<T extends CollectionItem>(item: T | undefined) {
  const element = item?.element?.();

  if (!element || typeof element.scrollIntoView !== "function") {
    return;
  }

  element.scrollIntoView({ block: "nearest", inline: "nearest" });
}
