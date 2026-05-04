import { createMemo, createSignal, splitProps, type JSX } from "solid-js";
import { createFormControl, type FormControlApi } from "../form/index";
import { createListboxInteraction, type ListboxInteractionApi } from "../listbox/index";
import type { ListInteractionKernelApi } from "../listbox/interaction-kernel";
import { getPartDataAttributes } from "../metadata/index";
import { assignRef } from "../overlay/dom";
import {
  createFloatingAdapter,
  type FloatingAdapter,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingRootBoundary,
  type FloatingSticky,
  type FloatingStrategy,
} from "../overlay/index";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  createStableId,
  dataBoolean,
  getOpenClosedState,
  scheduleMicrotask,
  type PolymorphicProps,
} from "../utils/index";

export type SelectChangeDetail = {
  event?: Event;
  reason: "item" | "keyboard" | "programmatic";
};

export type SelectOpenChangeDetail = {
  event?: Event;
  reason: "trigger" | "keyboard" | "select" | "escape" | "programmatic";
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
export type SelectContentContractProps = Omit<SelectContentProps, "children">;
export type SelectPositionerContractProps = Omit<SelectPositionerProps, "children">;
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
  const triggerId = createStableId("select-trigger");
  const contentId = createStableId("select-content");
  const listboxId = createStableId("select-listbox");
  const [triggerElement, setTriggerElement] = createSignal<HTMLButtonElement>();
  const [contentElement, setContentElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  const [open, setOpenState] = createControllableBooleanSignal<SelectOpenChangeDetail>({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    defaultDetail: { reason: "programmatic" },
    onChange: options.onOpenChange,
  });
  const disabled = () => options.disabled?.() ?? false;
  const invalid = () => options.invalid?.() ?? false;
  const multiple = () => options.multiple?.() ?? false;
  const readOnly = () => options.readOnly?.() ?? false;
  const required = () => options.required?.() ?? false;
  const itemId = (value: string) => `${listboxId()}-${value}`;
  const groupId = (value: string) => `${listboxId()}-group-${value}`;
  const groupLabelId = (value: string) => `${listboxId()}-group-${value}-label`;
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
  const formValue = createSelectValueForm({
    defaultValue: () => options.defaultValue,
    multiple,
    name: options.name,
    onValueChange: (value) => listbox.selection.setValue(value, { reason: "programmatic" }),
    onValuesChange: (values) => listbox.selection.setValues(values, { reason: "programmatic" }),
    value: listbox.selection.value,
    values: listbox.selection.selectedValues,
  });
  const formControl = createFormControl({
    form: options.form,
    id: triggerId,
    name: options.name,
    value: () => (multiple() ? formValue.values() : (formValue.value() ?? null)),
    disabled,
    invalid,
    readonly: readOnly,
    required,
    onReset: formValue.reset,
  });
  const floating = createFloatingAdapter({
    anchor: triggerElement,
    floating: () => positionerElement() ?? contentElement(),
    enabled: open,
    arrowPadding: options.arrowPadding,
    collisionBoundary: options.collisionBoundary,
    collisionPadding: options.collisionPadding,
    fitViewport: () => options.fitViewport?.() ?? true,
    gutter: options.gutter,
    placement: options.placement,
    rootBoundary: options.rootBoundary,
    sameWidth: () => options.sameWidth?.() ?? true,
    sticky: options.sticky,
    strategy: options.strategy,
  });

  const setOpen = (next: boolean, detail: SelectOpenChangeDetail) => {
    setOpenState(next, detail);
  };
  const state = () => getOpenClosedState(open());
  const partProps = (part: string) => ({
    ...getPartDataAttributes("select", part),
  });

  return {
    contentId: contentId(),
    disabled,
    floating,
    formControl,
    formValue,
    getContentProps: (props) => {
      const floatingProps = floating.getFloatingProps({
        style: props.style,
      });

      return {
        ...props,
        id: contentId(),
        ...partProps("content"),
        get "data-state"() {
          return state();
        },
        get "data-side"() {
          return floating.side();
        },
        get "data-align"() {
          return floating.align();
        },
        style: floatingProps.style,
        ref: (element: HTMLDivElement) => {
          setContentElement(element);
          assignRef(props.ref, element);
          scheduleMicrotask(floating.update);
        },
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
      const floatingProps = floating.getFloatingProps({ style: props.style });

      return {
        ...props,
        ...partProps("positioner"),
        get "data-state"() {
          return state();
        },
        get "data-side"() {
          return floating.side();
        },
        get "data-align"() {
          return floating.align();
        },
        style: floatingProps.style,
        ref: (element: HTMLDivElement) => {
          setPositionerElement(element);
          assignRef(props.ref, element);
          scheduleMicrotask(floating.update);
        },
      };
    },
    getTriggerProps: (props) => ({
      ...formControl.getControlProps<HTMLButtonElement>({
        ...props,
        id: triggerId(),
      }),
      "aria-controls": contentId(),
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
        setTriggerElement(element);
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
    listboxId: listboxId(),
    open,
    placeholder: () => options.placeholder?.(),
    readOnly,
    required,
    setOpen,
    triggerId: triggerId(),
    value: listbox.selection.value,
    values: listbox.selection.selectedValues,
  };
}
