import { createMemo, createSignal, splitProps, type JSX } from "solid-js";
import type { FormControlApi } from "../form/index";
import { createListboxInteraction, type ListboxInteractionApi } from "../collection/index";
import type { ListInteractionKernelApi } from "../collection/interaction-kernel";
import { createPopupFieldKernel } from "../collection/popup-field-kernel";
import { assignRef } from "../overlay/dom";
import {
  type FloatingAdapter,
  type FloatingArrowProps,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingRootBoundary,
  type FloatingSticky,
  type FloatingStrategy,
} from "../overlay/index";
import { composeEventHandlers, dataBoolean, type PolymorphicProps } from "../utils/index";

export type SelectChangeDetail = {
  event?: Event;
  reason: "item" | "keyboard" | "programmatic";
};

export type SelectOpenChangeDetail = {
  event?: Event;
  reason: "trigger" | "keyboard" | "select" | "escape" | "outside" | "programmatic";
};

export type SelectItemData = {
  disabled?: boolean;
  group?: string;
  label: string;
  value: string;
};

export type SelectValue = string | readonly string[];

export type SelectRootProps = {
  children?: JSX.Element;
  arrowPadding?: number;
  collisionBoundary?: FloatingCollisionBoundary;
  collisionPadding?: number;
  defaultOpen?: boolean;
  defaultValue?: SelectValue;
  disabled?: boolean;
  fitViewport?: boolean;
  form?: string;
  gutter?: number;
  invalid?: boolean;
  multiple?: boolean;
  name?: string;
  onOpenChange?: (open: boolean, detail: SelectOpenChangeDetail) => void;
  onValueChange?: (value: string | undefined, detail: SelectChangeDetail) => void;
  onValuesChange?: (values: readonly string[], detail: SelectChangeDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rootBoundary?: FloatingRootBoundary;
  sameWidth?: boolean;
  sticky?: FloatingSticky;
  strategy?: FloatingStrategy;
  value?: SelectValue;
};

export type SelectPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type SelectTriggerProps = SelectPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type SelectValueProps = SelectPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref"> & {
    placeholder?: string;
  };
export type SelectPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type SelectContentProps = SelectPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type SelectPositionerProps = SelectPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type SelectArrowProps = FloatingArrowProps<HTMLSpanElement>;
export type SelectListboxProps = SelectPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type SelectGroupProps = SelectPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
    label?: string;
    value: string;
  };
export type SelectGroupLabelProps = SelectPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type SelectItemProps = SelectPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
    group?: string;
    label?: string;
    value: string;
  };
export type SelectItemTextProps = SelectPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref">;
export type SelectItemIndicatorProps = SelectPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref">;

export type SelectTriggerContractProps = Omit<SelectTriggerProps, "as" | "children">;
export type SelectValueContractProps = Omit<SelectValueProps, "children" | "placeholder">;
export type SelectContentContractProps = Omit<SelectContentProps, "children"> & {
  positioned?: boolean;
};
export type SelectPositionerContractProps = Omit<SelectPositionerProps, "children">;
export type SelectArrowContractProps = Omit<SelectArrowProps, "children">;
export type SelectListboxContractProps = Omit<SelectListboxProps, "children">;
export type SelectGroupContractProps = Omit<SelectGroupProps, "children" | "label"> & {
  label?: string;
};
export type SelectGroupLabelContractProps = Omit<SelectGroupLabelProps, "children">;
export type SelectItemContractProps = Omit<SelectItemProps, "children" | "label"> & {
  group?: string;
  label: string;
};
export type SelectItemTextContractProps = Omit<SelectItemTextProps, "children">;
export type SelectItemIndicatorContractProps = Omit<SelectItemIndicatorProps, "children">;

export type CreateSelectOptions = {
  arrowPadding?: () => number | undefined;
  collisionBoundary?: () => FloatingCollisionBoundary | undefined;
  collisionPadding?: () => number | undefined;
  defaultOpen?: boolean;
  defaultValue?: SelectValue;
  disabled?: () => boolean | undefined;
  fitViewport?: () => boolean | undefined;
  form?: () => string | undefined;
  gutter?: () => number | undefined;
  invalid?: () => boolean | undefined;
  multiple?: () => boolean | undefined;
  name?: () => string | undefined;
  onOpenChange?: (open: boolean, detail: SelectOpenChangeDetail) => void;
  onValueChange?: (value: string | undefined, detail: SelectChangeDetail) => void;
  onValuesChange?: (values: readonly string[], detail: SelectChangeDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
  placeholder?: () => string | undefined;
  readOnly?: () => boolean | undefined;
  required?: () => boolean | undefined;
  rootBoundary?: () => FloatingRootBoundary | undefined;
  sameWidth?: () => boolean | undefined;
  sticky?: () => FloatingSticky | undefined;
  strategy?: () => FloatingStrategy | undefined;
  value?: () => SelectValue | undefined;
};

export type SelectApi = {
  contentId: string;
  disabled: () => boolean;
  floating: FloatingAdapter;
  formControl: FormControlApi;
  formValue: SelectValueFormApi;
  getArrowProps: (props: SelectArrowContractProps) => Record<string, unknown>;
  getContentProps: (props: SelectContentContractProps) => Record<string, unknown>;
  getItemIndicatorProps: (props: SelectItemIndicatorContractProps) => Record<string, unknown>;
  getGroupProps: (props: SelectGroupContractProps) => Record<string, unknown>;
  getGroupLabelProps: (props: SelectGroupLabelContractProps) => Record<string, unknown>;
  getItemProps: (props: SelectItemContractProps) => Record<string, unknown>;
  getItemTextProps: (props: SelectItemTextContractProps) => Record<string, unknown>;
  getListboxProps: (props: SelectListboxContractProps) => Record<string, unknown>;
  getPositionerProps: (props: SelectPositionerContractProps) => Record<string, unknown>;
  getTriggerProps: (props: SelectTriggerContractProps) => Record<string, unknown>;
  getValueProps: (props: SelectValueContractProps) => Record<string, unknown>;
  invalid: () => boolean;
  itemId: (value: string) => string;
  groupId: (value: string) => string;
  groupLabelId: (value: string) => string;
  list: ListInteractionKernelApi<SelectItemData, SelectChangeDetail>;
  listbox: ListboxInteractionApi<SelectItemData, SelectChangeDetail>;
  listboxId: string;
  open: () => boolean;
  placeholder: () => string | undefined;
  readOnly: () => boolean;
  required: () => boolean;
  needsSelectedLabel: () => boolean;
  selectedLabel: () => string | undefined;
  setOpen: (open: boolean, detail: SelectOpenChangeDetail) => void;
  triggerId: string;
  value: () => string | undefined;
  values: () => readonly string[];
};

type SelectHiddenInputDescriptor = {
  disabled?: boolean;
  name: string;
  value: string;
};

export type SelectValueFormApi = {
  hiddenInputs: () => readonly SelectHiddenInputDescriptor[];
  reset: () => void;
  syncInputValue: (value: string) => void;
  value: () => string | undefined;
  values: () => readonly string[];
};

function createSelectValueForm(options: {
  defaultValue?: () => SelectValue | undefined;
  multiple: () => boolean;
  name?: () => string | undefined;
  onValueChange: (value: string | undefined) => void;
  onValuesChange: (values: readonly string[]) => void;
  value: () => string | undefined;
  values: () => readonly string[];
}): SelectValueFormApi {
  const value = createMemo(() => (options.multiple() ? options.values()[0] : options.value()));
  const values = createMemo(() =>
    options.multiple() ? options.values() : selectValueArray(options.value()),
  );
  const hiddenInputs = createMemo<readonly SelectHiddenInputDescriptor[]>(() => {
    const name = options.name?.();

    if (!name) {
      return [];
    }

    const serialized = values();

    if (options.multiple() && serialized.length === 0) {
      return [{ disabled: true, name, value: "" }];
    }

    return (serialized.length === 0 ? [""] : serialized).map((candidate) => ({
      name,
      value: candidate,
    }));
  });
  const reset = () => {
    if (options.multiple()) {
      options.onValuesChange(selectValueArray(options.defaultValue?.()));
      return;
    }

    options.onValueChange(selectSingleValue(options.defaultValue?.()));
  };
  const syncInputValue = (next: string) => {
    if (options.multiple()) {
      options.onValuesChange(next ? [next] : []);
      return;
    }

    options.onValueChange(next || undefined);
  };

  return {
    hiddenInputs,
    reset,
    syncInputValue,
    value,
    values,
  };
}

function selectSingleValue(value: SelectValue | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

function selectControlledSingleValue(value: SelectValue | undefined): string | undefined {
  return value === undefined ? undefined : selectSingleValue(value);
}

function selectValueArray(value: SelectValue | undefined): readonly string[] {
  if (value === undefined) {
    return [];
  }

  return typeof value === "string" ? [value] : value;
}

function selectControlledValueArray(value: SelectValue | undefined): readonly string[] | undefined {
  return value === undefined ? undefined : selectValueArray(value);
}

export function createSelect(options: CreateSelectOptions = {}): SelectApi {
  const disabled = () => options.disabled?.() ?? false;
  const invalid = () => options.invalid?.() ?? false;
  const multiple = () => options.multiple?.() ?? false;
  const readOnly = () => options.readOnly?.() ?? false;
  const required = () => options.required?.() ?? false;
  let formValue!: SelectValueFormApi;
  const popup = createPopupFieldKernel<
    SelectOpenChangeDetail,
    HTMLButtonElement,
    SelectValue | null
  >({
    anchorPart: "trigger",
    arrowPadding: options.arrowPadding,
    collisionBoundary: options.collisionBoundary,
    collisionPadding: options.collisionPadding,
    disabled,
    fitViewport: options.fitViewport,
    gutter: options.gutter,
    invalid,
    open: {
      open: options.open,
      defaultOpen: options.defaultOpen,
      programmaticDetail: { reason: "programmatic" },
      onOpenChange: options.onOpenChange,
    },
    placement: options.placement,
    readOnly,
    required,
    rootBoundary: options.rootBoundary,
    sameWidth: options.sameWidth,
    scope: "select",
    sticky: options.sticky,
    strategy: options.strategy,
  });
  const triggerId = () => popup.anchorId;
  const listboxId = () => popup.listboxId;
  const itemId = (value: string) => `${popup.listboxId}-${value}`;
  const groupId = (value: string) => `${popup.listboxId}-group-${value}`;
  const groupLabelId = (value: string) => `${popup.listboxId}-group-${value}-label`;
  const setOpen = popup.setOpen;
  const itemLabels = new Map<string, string>();
  const [itemLabelVersion, setItemLabelVersion] = createSignal(0);
  const listbox = createListboxInteraction<SelectItemData, SelectChangeDetail>({
    id: listboxId,
    labelledBy: triggerId,
    groupId,
    groupLabelId,
    optionId: itemId,
    optionPart: "item",
    optionSelectDetail: (event) => ({ event, reason: "item" }),
    rootPart: "listbox",
    scope: "select",
    selectionMode: multiple() ? "multiple" : "single",
    value: () => selectControlledSingleValue(options.value?.()),
    values: () => selectControlledValueArray(options.value?.()),
    defaultValue: selectSingleValue(options.defaultValue),
    defaultValues: selectValueArray(options.defaultValue),
    programmaticDetail: { reason: "programmatic" },
    onSelectionChange: options.onValueChange,
    onSelectedValuesChange: options.onValuesChange,
    onValueSelect: (_item, detail) => {
      if (!multiple()) {
        setOpen(false, {
          event: detail.event,
          reason: detail.reason === "keyboard" ? "keyboard" : "select",
        });
      }
    },
  });
  formValue = createSelectValueForm({
    defaultValue: () => options.defaultValue,
    multiple,
    name: options.name,
    onValueChange: (value) => listbox.selection.setValue(value, { reason: "programmatic" }),
    onValuesChange: (values) => listbox.selection.setValues(values, { reason: "programmatic" }),
    value: listbox.selection.value,
    values: listbox.selection.selectedValues,
  });
  const formControl = popup.createFormControl({
    form: options.form,
    name: options.name,
    onReset: formValue.reset,
    value: () => (multiple() ? formValue.values() : (formValue.value() ?? null)),
  });
  const open = popup.open;
  const state = popup.state;
  const partProps = popup.getPartProps;
  const rememberItemLabel = (value: string, label: string) => {
    if (itemLabels.get(value) === label) {
      return;
    }

    itemLabels.set(value, label);
    setItemLabelVersion((version) => version + 1);
  };
  const selectedLabel = createMemo(() => {
    const selectedItem = listbox.selection.selectedItem();

    if (selectedItem) {
      return selectedItem.label;
    }

    itemLabelVersion();
    const value = formValue.value();
    return value === undefined ? undefined : itemLabels.get(value);
  });
  const needsSelectedLabel = createMemo(
    () => formValue.value() !== undefined && selectedLabel() === undefined,
  );

  return {
    contentId: popup.contentId,
    disabled,
    floating: popup.floating,
    formControl,
    formValue,
    getArrowProps: popup.getArrowProps,
    getContentProps: (props) => {
      const contentProps = popup.getContentProps(props);

      return {
        ...contentProps,
        onKeyDown: composeEventHandlers<KeyboardEvent>(props.onKeyDown, (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, { event, reason: "escape" });
          }
        }),
      };
    },
    getItemIndicatorProps: (props) => ({
      ...props,
      ...partProps("item-indicator"),
    }),
    getGroupProps: (props) => listbox.getGroupProps(props),
    getGroupLabelProps: (props) => listbox.getGroupLabelProps(props),
    getItemProps: (props) => {
      const [local, others] = splitProps(props, [
        "disabled",
        "group",
        "label",
        "onClick",
        "onPointerMove",
        "value",
      ]);
      rememberItemLabel(local.value, local.label);

      return listbox.getOptionProps({
        ...others,
        disabled: local.disabled,
        group: local.group,
        label: local.label,
        onClick: composeEventHandlers<MouseEvent>(local.onClick, (event) => {
          if (readOnly()) {
            event.preventDefault();
          }
        }),
        onPointerMove: local.onPointerMove,
        value: local.value,
      });
    },
    getItemTextProps: (props) => ({
      ...props,
      ...partProps("item-text"),
    }),
    getListboxProps: (props) =>
      listbox.getListboxProps(
        {
          ...props,
          onKeyDown: composeEventHandlers<KeyboardEvent>(props.onKeyDown, (event) => {
            if (
              readOnly() &&
              (event.key === "Enter" || event.key === " " || event.key.length === 1)
            ) {
              event.preventDefault();
            }
          }),
        },
        {
          selectDetail: (event) => ({ event, reason: "keyboard" }),
        },
      ),
    getPositionerProps: (props) => {
      return popup.getPositionerProps(props);
    },
    getTriggerProps: (props) => ({
      ...formControl.getControlProps<HTMLButtonElement>({
        ...props,
        id: popup.anchorId,
      }),
      "aria-controls": popup.contentId,
      get "aria-expanded"() {
        return open();
      },
      "aria-haspopup": "listbox",
      type: "button",
      get disabled() {
        return disabled();
      },
      ...partProps("trigger"),
      get "data-state"() {
        return state();
      },
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      get "data-invalid"() {
        return dataBoolean(invalid());
      },
      get "data-placeholder"() {
        return dataBoolean(listbox.selection.value() === undefined);
      },
      get "data-required"() {
        return dataBoolean(required());
      },
      get "data-readonly"() {
        return dataBoolean(readOnly());
      },
      ref: (element: HTMLButtonElement) => {
        popup.setAnchorElement(element);
        assignRef(props.ref, element);
      },
      onClick: composeEventHandlers(props.onClick, (event) => {
        if (readOnly()) {
          event.preventDefault();
          return;
        }

        setOpen(!open(), { event, reason: "trigger" });
      }),
      onKeyDown: composeEventHandlers<KeyboardEvent>(props.onKeyDown, (event) => {
        if (readOnly()) {
          return;
        }

        const intent = listbox.keyboard.getTriggerOpenIntent(event);

        if (intent === "open-and-highlight") {
          event.preventDefault();
          setOpen(true, { event, reason: "keyboard" });
          listbox.keyboard.highlight("selected-or-first");
        }

        if (intent === "close") {
          setOpen(false, { event, reason: "escape" });
        }
      }),
    }),
    getValueProps: (props) => ({
      ...props,
      ...partProps("value"),
      get "data-placeholder"() {
        return dataBoolean(listbox.selection.value() === undefined);
      },
    }),
    invalid,
    itemId,
    groupId,
    groupLabelId,
    list: listbox.interaction,
    listbox,
    listboxId: popup.listboxId,
    open,
    placeholder: () => options.placeholder?.(),
    readOnly,
    required,
    needsSelectedLabel,
    selectedLabel,
    setOpen,
    triggerId: popup.anchorId,
    value: listbox.selection.value,
    values: listbox.selection.selectedValues,
  };
}
