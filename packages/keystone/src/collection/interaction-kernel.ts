import type { Accessor } from "solid-js";
import { createListCollectionManager, type ListCollectionManagerApi } from "./collection-manager";
import type { CollectionItem, CollectionRegistration } from "./collection-registry";
import type { ListInteractionNavigationIntent, ListKeyboardDelegate } from "./keyboard-delegate";
import {
  createListSelectionManager,
  type ListSelectionBehavior,
  type ListSelectionManagerApi,
  type ListSelectionMode,
} from "./selection-manager";
import type { TypeaheadApi } from "./typeahead";

export type ListInteractionKernelOptions<T extends CollectionItem, Detail> = {
  defaultValue?: string;
  defaultValues?: readonly string[];
  keyboardDelegate?: ListKeyboardDelegate<T>;
  locale?: Accessor<string | undefined>;
  loop?: boolean;
  selectionBehavior?: ListSelectionBehavior;
  selectionMode?: ListSelectionMode;
  onSelectionChange?: (value: string | undefined, detail: Detail) => void;
  onSelectedValuesChange?: (values: readonly string[], detail: Detail) => void;
  onValueSelect?: (item: T, detail: Detail) => void;
  programmaticDetail: Detail;
  typeaheadCollator?: Intl.Collator;
  typeaheadResetMs?: number;
  value?: Accessor<string | undefined>;
  values?: Accessor<readonly string[] | undefined>;
};

export type ListInteractionKeyboardOptions<Detail> = {
  selectDetail: (event: KeyboardEvent) => Detail;
};

export type ListInteractionKernelApi<T extends CollectionItem, Detail> = {
  collection: ListCollectionManagerApi<T>;
  highlightedItem: Accessor<T | undefined>;
  highlightedValue: Accessor<string | undefined>;
  handleKeyDown: (event: KeyboardEvent, options: ListInteractionKeyboardOptions<Detail>) => boolean;
  highlight: (intent: ListInteractionNavigationIntent) => T | undefined;
  isHighlighted: (value: string) => boolean;
  isSelected: (value: string) => boolean;
  items: Accessor<readonly T[]>;
  registerItem: (item: CollectionRegistration<T>) => () => void;
  selection: ListSelectionManagerApi<T, Detail>;
  selectHighlighted: (detail: Detail) => T | undefined;
  setValue: (value: string | undefined, detail: Detail) => T | undefined;
  selectValue: (value: string, detail: Detail) => T | undefined;
  selectedItem: Accessor<T | undefined>;
  selectedItems: Accessor<readonly T[]>;
  selectedValues: Accessor<readonly string[]>;
  setHighlightedValue: (value: string | undefined) => void;
  typeahead: TypeaheadApi;
  value: Accessor<string | undefined>;
};

export function createListInteractionKernel<T extends CollectionItem, Detail>(
  options: ListInteractionKernelOptions<T, Detail>,
): ListInteractionKernelApi<T, Detail> {
  const collection = createListCollectionManager<T>({
    keyboardDelegate: options.keyboardDelegate,
    locale: options.locale,
    loop: options.loop,
    typeaheadCollator: options.typeaheadCollator,
    typeaheadResetMs: options.typeaheadResetMs,
  });
  const selection = createListSelectionManager<T, Detail>({
    defaultValue: options.defaultValue,
    defaultValues: options.defaultValues,
    itemByValue: collection.itemByValue,
    onSelectionChange: options.onSelectionChange,
    onSelectedValuesChange: options.onSelectedValuesChange,
    onValueSelect: options.onValueSelect,
    programmaticDetail: options.programmaticDetail,
    selectionBehavior: options.selectionBehavior,
    selectionMode: options.selectionMode,
    value: options.value,
    values: options.values,
  });

  const highlight = (intent: ListInteractionNavigationIntent) =>
    collection.highlight(intent, selection.selectedItem());
  const selectHighlighted = (detail: Detail) =>
    selection.selectHighlighted(collection.highlightedValue(), detail);

  return {
    collection,
    highlightedItem: collection.highlightedItem,
    highlightedValue: collection.highlightedValue,
    handleKeyDown: (event, keyboardOptions) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        highlight("next");
        return true;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        highlight("previous");
        return true;
      }

      if (event.key === "Home") {
        event.preventDefault();
        highlight("first");
        return true;
      }

      if (event.key === "End") {
        event.preventDefault();
        highlight("last");
        return true;
      }

      if (event.key === "Enter" || event.key === " ") {
        if (event.key === " " && collection.typeahead.isTyping()) {
          return collection.typeahead.handleKeyDown(event);
        }

        event.preventDefault();
        selectHighlighted(keyboardOptions.selectDetail(event));
        return true;
      }

      return collection.typeahead.handleKeyDown(event);
    },
    highlight,
    isHighlighted: collection.isHighlighted,
    isSelected: selection.isSelected,
    items: collection.items,
    registerItem: collection.registerItem,
    selection,
    selectHighlighted,
    setValue: selection.setValue,
    selectValue: selection.selectValue,
    selectedItem: selection.selectedItem,
    selectedItems: selection.selectedItems,
    selectedValues: selection.selectedValues,
    setHighlightedValue: collection.setHighlightedValue,
    typeahead: collection.typeahead,
    value: selection.value,
  };
}
