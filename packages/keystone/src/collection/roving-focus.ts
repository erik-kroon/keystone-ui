import { createMemo, type Accessor } from "solid-js";
import type { CollectionItem } from "./collection-registry";
import {
  nextEnabledFromEnabledItems,
  type ListInteractionNavigationIntent,
} from "./keyboard-delegate";

export type RovingFocusItem<T extends CollectionItem = CollectionItem> = T & {
  element?: Accessor<HTMLElement | undefined>;
};

export type RovingFocusOptions<T extends RovingFocusItem> = {
  current?: Accessor<string | undefined>;
  items: Accessor<readonly T[]>;
  loop?: Accessor<boolean | undefined>;
  onCurrentChange?: (value: string | undefined) => void;
};

export type RovingFocusApi<T extends RovingFocusItem> = {
  currentItem: Accessor<T | undefined>;
  currentValue: Accessor<string | undefined>;
  enabledItems: Accessor<readonly T[]>;
  focus: (intent: ListInteractionNavigationIntent) => T | undefined;
  getItemTabIndex: (value: string) => 0 | -1;
  setCurrentValue: (value: string | undefined) => void;
};

export function createRovingFocus<T extends RovingFocusItem>(
  options: RovingFocusOptions<T>,
): RovingFocusApi<T> {
  let fallbackCurrent: string | undefined;
  const enabledItems = createMemo(() =>
    options.items().filter((item) => !item.disabled && !item.hidden),
  );
  const currentValue = () => options.current?.() ?? fallbackCurrent ?? enabledItems()[0]?.value;
  const currentItem = createMemo(() =>
    enabledItems().find((item) => item.value === currentValue()),
  );

  const setCurrentValue = (value: string | undefined) => {
    fallbackCurrent = value;
    options.onCurrentChange?.(value);
  };

  const focus = (intent: ListInteractionNavigationIntent) => {
    const items = enabledItems();
    const current = currentValue();
    const next =
      intent === "first"
        ? items[0]
        : intent === "last"
          ? items.at(-1)
          : intent === "selected-or-first"
            ? (currentItem() ?? items[0])
            : nextEnabledFromEnabledItems({
                current,
                direction: intent === "next" ? 1 : -1,
                items,
                loop: options.loop?.(),
              });

    if (!next) {
      return undefined;
    }

    setCurrentValue(next.value);
    next.element?.()?.focus();
    return next;
  };

  return {
    currentItem,
    currentValue,
    enabledItems,
    focus,
    getItemTabIndex: (value) => (currentValue() === value ? 0 : -1),
    setCurrentValue,
  };
}
