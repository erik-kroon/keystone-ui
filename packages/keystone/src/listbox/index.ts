import { createMemo, splitProps, type Accessor, type JSX } from "solid-js";
import {
  composeEventHandlers,
  createListInteractionKernel,
  dataBoolean,
  type CollectionItem,
  type CollectionRegistration,
  type ListInteractionKernelApi,
  type ListInteractionKernelOptions,
  type ListInteractionNavigationIntent,
  type TypeaheadApi,
} from "../utils/index";

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
    label: string;
    value: string;
  };

export type ListboxInteractionOptions<
  T extends CollectionItem,
  Detail,
> = ListInteractionKernelOptions<T, Detail> & {
  id: Accessor<string>;
  labelledBy: Accessor<string | undefined>;
  optionId: (value: string) => string;
  optionSelectDetail: (event: MouseEvent) => Detail;
  optionPart?: string;
  rootPart?: string;
  scope: string;
};

export type ListboxSelectionContract<T extends CollectionItem, Detail> = {
  isSelected: (value: string) => boolean;
  selectHighlighted: (detail: Detail) => T | undefined;
  selectedItem: Accessor<T | undefined>;
  selectValue: (value: string, detail: Detail) => T | undefined;
  setValue: (value: string | undefined, detail: Detail) => T | undefined;
  value: Accessor<string | undefined>;
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
  getListboxProps: (
    props: ListboxRootContractProps,
    options: ListboxKeyboardDetailOptions<Detail>,
  ) => Record<string, unknown>;
  getOptionProps: (props: ListboxOptionContractProps) => Record<string, unknown>;
  interaction: ListInteractionKernelApi<T, Detail>;
  items: Accessor<readonly T[]>;
  keyboard: ListboxKeyboardContract<T, Detail>;
  optionId: (value: string) => string;
  registerOption: (item: CollectionRegistration<T>) => () => void;
  selection: ListboxSelectionContract<T, Detail>;
  typeahead: TypeaheadApi;
};

export function createListboxInteraction<T extends CollectionItem, Detail>(
  options: ListboxInteractionOptions<T, Detail>,
): ListboxInteractionApi<T, Detail> {
  const list = createListInteractionKernel<T, Detail>(options);
  const rootPart = options.rootPart ?? "listbox";
  const optionPart = options.optionPart ?? "option";
  const activeDescendantId = createMemo(() => {
    const highlighted = list.highlightedValue();
    return highlighted ? options.optionId(highlighted) : undefined;
  });
  const partProps = (part: string) => ({
    "data-scope": options.scope,
    "data-part": part,
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

  return {
    activeDescendant: {
      highlightedItem: list.highlightedItem,
      highlightedValue: list.highlightedValue,
      id: activeDescendantId,
      isHighlighted: list.isHighlighted,
      setHighlightedValue: list.setHighlightedValue,
    },
    getListboxProps: (props, keyboardOptions) => ({
      ...props,
      id: options.id(),
      role: "listbox",
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
    getOptionProps: (props) => {
      const [local, others] = splitProps(props, [
        "disabled",
        "label",
        "onClick",
        "onPointerMove",
        "value",
      ]);

      list.registerItem({
        disabled: local.disabled,
        label: local.label,
        value: local.value,
      } as CollectionRegistration<T>);

      return {
        ...others,
        id: options.optionId(local.value),
        role: "option",
        "aria-disabled": local.disabled ? "true" : undefined,
        get "aria-selected"() {
          return list.isSelected(local.value);
        },
        ...partProps(optionPart),
        "data-disabled": dataBoolean(local.disabled),
        get "data-highlighted"() {
          return dataBoolean(list.isHighlighted(local.value));
        },
        get "data-selected"() {
          return dataBoolean(list.isSelected(local.value));
        },
        onPointerMove: composeEventHandlers<PointerEvent>(local.onPointerMove, () => {
          if (!local.disabled) {
            list.setHighlightedValue(local.value);
          }
        }),
        onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
          list.selectValue(local.value, options.optionSelectDetail(event));
        }),
      };
    },
    interaction: list,
    items: list.items,
    keyboard: {
      getTriggerOpenIntent,
      handleKeyDown: list.handleKeyDown,
      highlight: list.highlight,
    },
    optionId: options.optionId,
    registerOption: list.registerItem,
    selection: {
      isSelected: list.isSelected,
      selectHighlighted: list.selectHighlighted,
      selectedItem: list.selectedItem,
      selectValue: list.selectValue,
      setValue: list.setValue,
      value: list.value,
    },
    typeahead: list.typeahead,
  };
}
