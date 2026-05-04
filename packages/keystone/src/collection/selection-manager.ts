import { createMemo, type Accessor } from "solid-js";
import { createControllableSignal } from "../utils/index";
import type { CollectionItem } from "./collection-registry";

export type ListSelectionMode = "single" | "multiple";

export type ListSelectionBehavior = "replace" | "toggle";

export type ListSelectionManagerOptions<T extends CollectionItem, Detail> = {
  defaultValue?: string;
  defaultValues?: readonly string[];
  itemByValue: (value: string | undefined) => T | undefined;
  onSelectionChange?: (value: string | undefined, detail: Detail) => void;
  onSelectedValuesChange?: (values: readonly string[], detail: Detail) => void;
  onValueSelect?: (item: T, detail: Detail) => void;
  programmaticDetail: Detail;
  selectionBehavior?: ListSelectionBehavior;
  selectionMode?: ListSelectionMode;
  value?: Accessor<string | undefined>;
  values?: Accessor<readonly string[] | undefined>;
};

export type ListSelectionManagerApi<T extends CollectionItem, Detail> = {
  isSelected: (value: string) => boolean;
  selectHighlighted: (value: string | undefined, detail: Detail) => T | undefined;
  selectedItem: Accessor<T | undefined>;
  selectedItems: Accessor<readonly T[]>;
  selectedValues: Accessor<readonly string[]>;
  selectValue: (value: string, detail: Detail) => T | undefined;
  setValues: (values: readonly string[], detail: Detail) => readonly T[];
  setValue: (value: string | undefined, detail: Detail) => T | undefined;
  toggleValue: (value: string, detail: Detail) => T | undefined;
  value: Accessor<string | undefined>;
};

export function createListSelectionManager<T extends CollectionItem, Detail>(
  options: ListSelectionManagerOptions<T, Detail>,
): ListSelectionManagerApi<T, Detail> {
  const selectionMode = options.selectionMode ?? "single";
  const selectionBehavior =
    options.selectionBehavior ?? (selectionMode === "multiple" ? "toggle" : "replace");
  const [value, setValue] = createControllableSignal<string | undefined, Detail>({
    value: options.value,
    defaultValue: options.defaultValue,
    defaultDetail: options.programmaticDetail,
    onChange: options.onSelectionChange,
  });
  const [values, setValues] = createControllableSignal<readonly string[], Detail>({
    value: options.values,
    defaultValue: options.defaultValues ?? selectionValuesFromValue(options.defaultValue),
    defaultDetail: options.programmaticDetail,
    onChange: options.onSelectedValuesChange,
  });
  const selectedValues = createMemo(() =>
    selectionMode === "multiple" ? values() : selectionValuesFromValue(value()),
  );
  const selectedValueSet = createMemo(() => new Set(selectedValues()));
  const isSelected = (candidate: string) => selectedValueSet().has(candidate);
  const selectedItem = createMemo(() =>
    options.itemByValue(selectionMode === "multiple" ? selectedValues()[0] : value()),
  );
  const selectedItems = createMemo(() =>
    selectedValues()
      .map((candidate) => options.itemByValue(candidate))
      .filter((item): item is T => item !== undefined),
  );

  const syncSingleSelection = (next: string | undefined, detail: Detail) => {
    setValue(next, detail);
    if (selectionMode === "multiple") {
      setValues(selectionValuesFromValue(next), detail);
    }
  };

  const selectValue = (next: string, detail: Detail) => {
    const item = options.itemByValue(next);

    if (!item || item.disabled) {
      return undefined;
    }

    if (selectionMode === "multiple") {
      const nextValues =
        selectionBehavior === "toggle" ? toggleSelectionValue(values(), next) : [next];
      setValues(nextValues, detail);
      setValue(nextValues[0], detail);
    } else {
      syncSingleSelection(next, detail);
    }

    options.onValueSelect?.(item, detail);
    return item;
  };

  const setSelectionValue = (next: string | undefined, detail: Detail) => {
    syncSingleSelection(next, detail);
    return options.itemByValue(next);
  };

  const setSelectionValues = (next: readonly string[], detail: Detail) => {
    const enabledValues = next.filter((candidate) => {
      const item = options.itemByValue(candidate);
      return item && !item.disabled;
    });

    setValues(enabledValues, detail);
    setValue(enabledValues[0], detail);
    return enabledValues
      .map((candidate) => options.itemByValue(candidate))
      .filter((item): item is T => item !== undefined);
  };

  const toggleValue = (next: string, detail: Detail) => {
    const item = options.itemByValue(next);

    if (!item || item.disabled) {
      return undefined;
    }

    const nextValues = toggleSelectionValue(values(), next);
    setValues(nextValues, detail);
    setValue(nextValues[0], detail);
    options.onValueSelect?.(item, detail);
    return item;
  };

  const selectHighlighted = (highlighted: string | undefined, detail: Detail) =>
    highlighted ? selectValue(highlighted, detail) : undefined;

  return {
    isSelected,
    selectHighlighted,
    selectedItem,
    selectedItems,
    selectedValues,
    selectValue,
    setValues: setSelectionValues,
    setValue: setSelectionValue,
    toggleValue,
    value,
  };
}

function selectionValuesFromValue(value: string | undefined): readonly string[] {
  return value === undefined ? [] : [value];
}

function toggleSelectionValue(values: readonly string[], value: string): readonly string[] {
  return values.includes(value)
    ? values.filter((candidate) => candidate !== value)
    : [...values, value];
}
