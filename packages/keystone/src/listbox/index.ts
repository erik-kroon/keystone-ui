import { createMemo, createSignal, splitProps, type Accessor, type JSX } from "solid-js";
import { getPartDataAttributes } from "../metadata/index";
import { composeEventHandlers, dataBoolean } from "../utils/index";
import type { CollectionItem, CollectionRegistration } from "./collection-registry";
import {
  createListInteractionKernel,
  type ListInteractionKernelApi,
  type ListInteractionKernelOptions,
} from "./interaction-kernel";
import type { ListInteractionNavigationIntent } from "./keyboard-delegate";
import type { ListSelectionBehavior, ListSelectionMode } from "./selection-manager";
import type { TypeaheadApi } from "./typeahead";

export type ListboxOpenIntent = "open-and-highlight" | "close";

export type ListboxKeyboardDetailOptions<Detail> = {
  selectDetail: (event: KeyboardEvent) => Detail;
};

export type ListboxPartProps<T extends HTMLElement = HTMLElement> = {
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type ListboxRootContractProps = ListboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type ListboxOptionContractProps = ListboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
    group?: string;
    label: string;
    value: string;
  };

export type ListboxGroupContractProps = ListboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
    label?: string;
    value: string;
  };

export type ListboxGroupLabelContractProps = ListboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type ListboxInteractionOptions<
  T extends CollectionItem,
  Detail,
> = ListInteractionKernelOptions<T, Detail> & {
  id: Accessor<string>;
  labelledBy: Accessor<string | undefined>;
  optionId: (value: string) => string;
  optionSelectDetail: (event: MouseEvent) => Detail;
  groupId?: (value: string) => string;
  groupLabelId?: (value: string) => string;
  groupLabelPart?: string;
  groupPart?: string;
  optionPart?: string;
  rootPart?: string;
  scope: string;
};

export type ListboxSelectionContract<T extends CollectionItem, Detail> = {
  isSelected: (value: string) => boolean;
  selectHighlighted: (detail: Detail) => T | undefined;
  selectedItem: Accessor<T | undefined>;
  selectedItems: Accessor<readonly T[]>;
  selectedValues: Accessor<readonly string[]>;
  selectValue: (value: string, detail: Detail) => T | undefined;
  setValues: (values: readonly string[], detail: Detail) => readonly T[];
  setValue: (value: string | undefined, detail: Detail) => T | undefined;
  toggleValue: (value: string, detail: Detail) => T | undefined;
  value: Accessor<string | undefined>;
};

export type ListboxCollectionContract<T extends CollectionItem> = {
  highlightedItem: Accessor<T | undefined>;
  highlightedValue: Accessor<string | undefined>;
  itemByValue: (value: string | undefined) => T | undefined;
  items: Accessor<readonly T[]>;
  registerOption: (item: CollectionRegistration<T>) => () => void;
  refreshOrder: () => void;
  scheduleRefreshOrder: () => void;
};

export type ListboxActiveDescendantContract<T extends CollectionItem> = {
  highlightedItem: Accessor<T | undefined>;
  highlightedValue: Accessor<string | undefined>;
  id: Accessor<string | undefined>;
  isHighlighted: (value: string) => boolean;
  setHighlightedValue: (value: string | undefined) => void;
};

export type ListboxKeyboardContract<T extends CollectionItem, Detail> = {
  getTriggerOpenIntent: (event: KeyboardEvent) => ListboxOpenIntent | undefined;
  handleKeyDown: (event: KeyboardEvent, options: ListboxKeyboardDetailOptions<Detail>) => boolean;
  highlight: (intent: ListInteractionNavigationIntent) => T | undefined;
};

export type ListboxInteractionApi<T extends CollectionItem, Detail> = {
  activeDescendant: ListboxActiveDescendantContract<T>;
  collection: ListboxCollectionContract<T>;
  getListboxProps: (
    props: ListboxRootContractProps,
    options: ListboxKeyboardDetailOptions<Detail>,
  ) => Record<string, unknown>;
  getGroupProps: (props: ListboxGroupContractProps) => Record<string, unknown>;
  getGroupLabelProps: (props: ListboxGroupLabelContractProps) => Record<string, unknown>;
  getOptionProps: (props: ListboxOptionContractProps) => Record<string, unknown>;
  interaction: ListInteractionKernelApi<T, Detail>;
  items: Accessor<readonly T[]>;
  keyboard: ListboxKeyboardContract<T, Detail>;
  optionId: (value: string) => string;
  registerOption: (item: CollectionRegistration<T>) => () => void;
  selection: ListboxSelectionContract<T, Detail>;
  selectionBehavior: () => ListSelectionBehavior;
  selectionMode: () => ListSelectionMode;
  typeahead: TypeaheadApi;
};

export function createListboxInteraction<T extends CollectionItem, Detail>(
  options: ListboxInteractionOptions<T, Detail>,
): ListboxInteractionApi<T, Detail> {
  const list = createListInteractionKernel<T, Detail>(options);
  const rootPart = options.rootPart ?? "listbox";
  const optionPart = options.optionPart ?? "option";
  const groupPart = options.groupPart ?? "group";
  const groupLabelPart = options.groupLabelPart ?? "group-label";
  const selectionMode = () => options.selectionMode ?? "single";
  const selectionBehavior = () =>
    options.selectionBehavior ?? (selectionMode() === "multiple" ? "toggle" : "replace");
  const activeDescendantId = createMemo(() => {
    const highlighted = list.collection.highlightedValue();
    return highlighted ? options.optionId(highlighted) : undefined;
  });
  const partProps = (part: string) => ({
    ...getPartDataAttributes(options.scope, part),
  });

  const getTriggerOpenIntent = (event: KeyboardEvent): ListboxOpenIntent | undefined => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      return "open-and-highlight";
    }

    if (event.key === "Escape") {
      return "close";
    }

    return undefined;
  };
  const collection: ListboxCollectionContract<T> = {
    highlightedItem: list.collection.highlightedItem,
    highlightedValue: list.collection.highlightedValue,
    itemByValue: list.collection.itemByValue,
    items: list.collection.items,
    registerOption: list.collection.registerItem,
    refreshOrder: list.collection.refreshOrder,
    scheduleRefreshOrder: list.collection.scheduleRefreshOrder,
  };
  const selection: ListboxSelectionContract<T, Detail> = {
    isSelected: list.selection.isSelected,
    selectHighlighted,
    selectedItem: list.selection.selectedItem,
    selectedItems: list.selection.selectedItems,
    selectedValues: list.selection.selectedValues,
    selectValue: list.selection.selectValue,
    setValues: list.selection.setValues,
    setValue: list.selection.setValue,
    toggleValue: list.selection.toggleValue,
    value: list.selection.value,
  };

  function selectHighlighted(detail: Detail) {
    return list.selection.selectHighlighted(list.collection.highlightedValue(), detail);
  }

  return {
    activeDescendant: {
      highlightedItem: list.collection.highlightedItem,
      highlightedValue: list.collection.highlightedValue,
      id: activeDescendantId,
      isHighlighted: list.collection.isHighlighted,
      setHighlightedValue: list.collection.setHighlightedValue,
    },
    collection,
    getListboxProps: (props, keyboardOptions) => ({
      ...props,
      id: options.id(),
      role: "listbox",
      get "aria-multiselectable"() {
        return selectionMode() === "multiple" ? "true" : undefined;
      },
      "aria-labelledby": options.labelledBy(),
      get "aria-activedescendant"() {
        return activeDescendantId();
      },
      tabindex: -1,
      ...partProps(rootPart),
      onKeyDown: composeEventHandlers<KeyboardEvent>(props.onKeyDown, (event) => {
        list.handleKeyDown(event, keyboardOptions);
      }),
    }),
    getGroupProps: (props) => {
      const [local, others] = splitProps(props, ["disabled", "label", "value"]);
      const groupId = options.groupId?.(local.value) ?? `${options.id()}-group-${local.value}`;
      const labelId =
        options.groupLabelId?.(local.value) ?? `${options.id()}-group-${local.value}-label`;

      return {
        ...others,
        id: groupId,
        role: "group",
        "aria-disabled": local.disabled ? "true" : undefined,
        "aria-label": local.label,
        "aria-labelledby": local.label ? undefined : labelId,
        ...partProps(groupPart),
        "data-disabled": dataBoolean(local.disabled),
        "data-value": local.value,
      };
    },
    getGroupLabelProps: (props) => ({
      ...props,
      ...partProps(groupLabelPart),
    }),
    getOptionProps: (props) => {
      const [local, others] = splitProps(props, [
        "disabled",
        "group",
        "label",
        "onClick",
        "onPointerMove",
        "ref",
        "value",
      ]);
      const [element, setElement] = createSignal<HTMLDivElement>();

      list.collection.registerItem({
        disabled: local.disabled,
        element,
        group: local.group,
        label: local.label,
        value: local.value,
      } as CollectionRegistration<T>);

      return {
        ...others,
        id: options.optionId(local.value),
        role: "option",
        "aria-disabled": local.disabled ? "true" : undefined,
        ref: (element: HTMLDivElement) => {
          setElement(element);
          list.collection.scheduleRefreshOrder();
          callRef(local.ref, element);
        },
        get "aria-selected"() {
          return list.selection.isSelected(local.value);
        },
        ...partProps(optionPart),
        "data-disabled": dataBoolean(local.disabled),
        "data-group": local.group,
        get "data-highlighted"() {
          return dataBoolean(list.collection.isHighlighted(local.value));
        },
        get "data-selected"() {
          return dataBoolean(list.selection.isSelected(local.value));
        },
        onPointerMove: composeEventHandlers<PointerEvent>(local.onPointerMove, () => {
          if (!local.disabled) {
            list.collection.setHighlightedValue(local.value);
          }
        }),
        onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
          list.selection.selectValue(local.value, options.optionSelectDetail(event));
        }),
      };
    },
    interaction: list,
    items: list.collection.items,
    keyboard: {
      getTriggerOpenIntent,
      handleKeyDown: list.handleKeyDown,
      highlight: list.highlight,
    },
    optionId: options.optionId,
    registerOption: list.collection.registerItem,
    selection,
    selectionBehavior,
    selectionMode,
    typeahead: list.collection.typeahead,
  };
}

function callRef<T extends HTMLElement>(ref: T | ((element: T) => void) | undefined, element: T) {
  if (typeof ref === "function") {
    ref(element);
  }
}
