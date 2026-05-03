import { createMemo, createSelector, type Accessor } from "solid-js";
import { createControllableSignal } from "../utils/index";
import type { CollectionItem } from "./collection-registry";

export type ActiveDescendantOptions<T extends CollectionItem> = {
  itemByValue: (value: string | undefined) => T | undefined;
};

export type ActiveDescendantApi<T extends CollectionItem> = {
  highlightedItem: Accessor<T | undefined>;
  highlightedValue: Accessor<string | undefined>;
  isHighlighted: (value: string) => boolean;
  setHighlightedValue: (value: string | undefined) => void;
};

export function createActiveDescendant<T extends CollectionItem>(
  options: ActiveDescendantOptions<T>,
): ActiveDescendantApi<T> {
  const [highlightedValue, setHighlightedValue] = createControllableSignal<string | undefined>({
    defaultValue: undefined,
  });
  const isHighlighted = createSelector(highlightedValue);
  const highlightedItem = createMemo(() => options.itemByValue(highlightedValue()));

  return {
    highlightedItem,
    highlightedValue,
    isHighlighted,
    setHighlightedValue,
  };
}
