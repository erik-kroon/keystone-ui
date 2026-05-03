import { Show, createContext, createSignal, splitProps, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { createFormControl, type FormControlApi } from "../form/index";
import { createListboxInteraction, type ListboxInteractionApi } from "../listbox/index";
import { assignRef } from "../overlay/dom";
import {
  createFloatingAdapter,
  type FloatingAdapter,
  type FloatingPlacement,
} from "../overlay/index";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  createStableId,
  dataBoolean,
  renderPolymorphic,
  type ListInteractionKernelApi,
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
  label: string;
  value: string;
};

export type SelectRootProps = {
  children?: JSX.Element;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  onOpenChange?: (open: boolean, detail: SelectOpenChangeDetail) => void;
  onValueChange?: (value: string | undefined, detail: SelectChangeDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
  placeholder?: string;
  required?: boolean;
  value?: string;
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
export type SelectItemProps = SelectPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
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
export type SelectItemContractProps = Omit<SelectItemProps, "children" | "label"> & {
  label: string;
};
export type SelectItemTextContractProps = Omit<SelectItemTextProps, "children">;
export type SelectItemIndicatorContractProps = Omit<SelectItemIndicatorProps, "children">;

export type CreateSelectOptions = {
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: () => boolean | undefined;
  invalid?: () => boolean | undefined;
  name?: () => string | undefined;
  onOpenChange?: (open: boolean, detail: SelectOpenChangeDetail) => void;
  onValueChange?: (value: string | undefined, detail: SelectChangeDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
  placeholder?: () => string | undefined;
  required?: () => boolean | undefined;
  value?: () => string | undefined;
};

export type SelectApi = {
  contentId: string;
  disabled: () => boolean;
  floating: FloatingAdapter;
  formControl: FormControlApi;
  getContentProps: (props: SelectContentContractProps) => Record<string, unknown>;
  getItemIndicatorProps: (props: SelectItemIndicatorContractProps) => Record<string, unknown>;
  getItemProps: (props: SelectItemContractProps) => Record<string, unknown>;
  getItemTextProps: (props: SelectItemTextContractProps) => Record<string, unknown>;
  getListboxProps: (props: SelectListboxContractProps) => Record<string, unknown>;
  getPositionerProps: (props: SelectPositionerContractProps) => Record<string, unknown>;
  getTriggerProps: (props: SelectTriggerContractProps) => Record<string, unknown>;
  getValueProps: (props: SelectValueContractProps) => Record<string, unknown>;
  invalid: () => boolean;
  itemId: (value: string) => string;
  list: ListInteractionKernelApi<SelectItemData, SelectChangeDetail>;
  listbox: ListboxInteractionApi<SelectItemData, SelectChangeDetail>;
  listboxId: string;
  open: () => boolean;
  placeholder: () => string | undefined;
  required: () => boolean;
  setOpen: (open: boolean, detail: SelectOpenChangeDetail) => void;
  triggerId: string;
  value: () => string | undefined;
};

const SelectContext = createContext<SelectApi>();

export function createSelect(options: CreateSelectOptions = {}): SelectApi {
  const triggerId = createStableId("select-trigger");
  const contentId = createStableId("select-content");
  const listboxId = createStableId("select-listbox");
  const [triggerElement, setTriggerElement] = createSignal<HTMLButtonElement>();
  const [contentElement, setContentElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  let lastOpenDetail: SelectOpenChangeDetail = { reason: "programmatic" };
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (next) => options.onOpenChange?.(next, lastOpenDetail),
  });
  const disabled = () => options.disabled?.() ?? false;
  const invalid = () => options.invalid?.() ?? false;
  const required = () => options.required?.() ?? false;
  const itemId = (value: string) => `${listboxId()}-${value}`;
  const listbox = createListboxInteraction<SelectItemData, SelectChangeDetail>({
    id: listboxId,
    labelledBy: triggerId,
    optionId: itemId,
    optionPart: "item",
    optionSelectDetail: (event) => ({ event, reason: "item" }),
    rootPart: "listbox",
    scope: "select",
    value: options.value,
    defaultValue: options.defaultValue,
    programmaticDetail: { reason: "programmatic" },
    onSelectionChange: options.onValueChange,
    onValueSelect: (_item, detail) => {
      setOpen(false, {
        event: detail.event,
        reason: detail.reason === "keyboard" ? "keyboard" : "select",
      });
    },
  });
  const formControl = createFormControl({
    id: triggerId,
    name: options.name,
    value: () => listbox.selection.value() ?? null,
    disabled,
    invalid,
    required,
    onReset: () => {
      listbox.selection.setValue(options.defaultValue, { reason: "programmatic" });
    },
  });
  const floating = createFloatingAdapter({
    anchor: triggerElement,
    floating: () => positionerElement() ?? contentElement(),
    enabled: open,
    placement: options.placement,
  });

  const setOpen = (next: boolean, detail: SelectOpenChangeDetail) => {
    lastOpenDetail = detail;
    setOpenState(next);
  };
  const state = () => (open() ? "open" : "closed");
  const partProps = (part: string) => ({
    "data-scope": "select",
    "data-part": part,
  });

  return {
    contentId: contentId(),
    disabled,
    floating,
    formControl,
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
          queueMicrotask(floating.update);
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
    getItemProps: (props) => {
      const [local, others] = splitProps(props, [
        "disabled",
        "label",
        "onClick",
        "onPointerMove",
        "value",
      ]);

      return listbox.getOptionProps({
        ...others,
        disabled: local.disabled,
        label: local.label,
        onClick: local.onClick,
        onPointerMove: local.onPointerMove,
        value: local.value,
      });
    },
    getItemTextProps: (props) => ({
      ...props,
      ...partProps("item-text"),
    }),
    getListboxProps: (props) =>
      listbox.getListboxProps(props, {
        selectDetail: (event) => ({ event, reason: "keyboard" }),
      }),
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
          queueMicrotask(floating.update);
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
      ref: (element: HTMLButtonElement) => {
        setTriggerElement(element);
        assignRef(props.ref, element);
      },
      onClick: composeEventHandlers(props.onClick, (event) => {
        setOpen(!open(), { event, reason: "trigger" });
      }),
      onKeyDown: composeEventHandlers<KeyboardEvent>(props.onKeyDown, (event) => {
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
    list: listbox.interaction,
    listbox,
    listboxId: listboxId(),
    open,
    placeholder: () => options.placeholder?.(),
    required,
    setOpen,
    triggerId: triggerId(),
    value: listbox.selection.value,
  };
}

function useSelect(part: string) {
  const select = useContext(SelectContext);

  if (!select) {
    throw new Error(`Select.${part} must be used within Select.Root`);
  }

  return select;
}

function Root(props: SelectRootProps) {
  const select = createSelect({
    open: () => props.open,
    defaultOpen: props.defaultOpen,
    value: () => props.value,
    defaultValue: props.defaultValue,
    disabled: () => props.disabled,
    invalid: () => props.invalid,
    name: () => props.name,
    placeholder: () => props.placeholder,
    placement: () => props.placement,
    required: () => props.required,
    onOpenChange: props.onOpenChange,
    onValueChange: props.onValueChange,
  });

  return (
    <SelectContext.Provider value={select}>
      <Show when={props.name}>
        <input
          {...select.formControl.getHiddenInputProps({
            value: select.value() ?? "",
            ref: (element) => {
              select.formControl.registerFormReset(() => element);
            },
          })}
        />
      </Show>
      {props.children}
    </SelectContext.Provider>
  );
}

function Trigger(props: SelectTriggerProps) {
  const select = useSelect("Trigger");
  const [local, others] = splitProps(props, ["as", "children", "onClick", "onKeyDown", "ref"]);

  const triggerProps = select.getTriggerProps({
    ...others,
    onClick: local.onClick,
    onKeyDown: local.onKeyDown,
    ref: local.ref,
  });

  if (!local.as) {
    return <button {...triggerProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
  });
}

function Value(props: SelectValueProps) {
  const select = useSelect("Value");
  const [local, others] = splitProps(props, ["children", "placeholder"]);
  const text = () =>
    local.children ??
    select.listbox.selection.selectedItem()?.label ??
    local.placeholder ??
    select.placeholder();

  return <span {...select.getValueProps(others)}>{text()}</span>;
}

function PortalPart(props: SelectPortalProps) {
  const select = useSelect("Portal");

  return (
    <Show when={props.forceMount || select.open()}>
      <Portal mount={props.mount}>{props.children}</Portal>
    </Show>
  );
}

function Content(props: SelectContentProps) {
  const select = useSelect("Content");
  const [local, others] = splitProps(props, ["children", "onKeyDown", "ref", "style"]);

  return (
    <div
      {...select.getContentProps({
        ...others,
        onKeyDown: local.onKeyDown,
        ref: local.ref,
        style: local.style,
      })}
    >
      {local.children}
    </div>
  );
}

function Positioner(props: SelectPositionerProps) {
  const select = useSelect("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);

  return (
    <div
      {...select.getPositionerProps({
        ...others,
        ref: local.ref,
        style: local.style,
      })}
    >
      {local.children}
    </div>
  );
}

function Listbox(props: SelectListboxProps) {
  const select = useSelect("Listbox");
  const [local, others] = splitProps(props, ["children", "onKeyDown"]);

  return (
    <div {...select.getListboxProps({ ...others, onKeyDown: local.onKeyDown })}>
      {local.children}
    </div>
  );
}

function Item(props: SelectItemProps) {
  const select = useSelect("Item");
  const [local, others] = splitProps(props, [
    "children",
    "disabled",
    "label",
    "onClick",
    "onPointerMove",
    "value",
  ]);
  const label = () => local.label ?? String(local.children ?? local.value);

  return (
    <div
      {...select.getItemProps({
        ...others,
        disabled: local.disabled,
        label: label(),
        onClick: local.onClick,
        onPointerMove: local.onPointerMove,
        value: local.value,
      })}
    >
      {local.children}
    </div>
  );
}

function ItemText(props: SelectItemTextProps) {
  const select = useSelect("ItemText");
  const [local, others] = splitProps(props, ["children"]);

  return <span {...select.getItemTextProps(others)}>{local.children}</span>;
}

function ItemIndicator(props: SelectItemIndicatorProps) {
  const select = useSelect("ItemIndicator");
  const [local, others] = splitProps(props, ["children"]);

  return <span {...select.getItemIndicatorProps(others)}>{local.children}</span>;
}

export const Select = {
  Root,
  Trigger,
  Value,
  Portal: PortalPart,
  Positioner,
  Content,
  Listbox,
  Item,
  ItemText,
  ItemIndicator,
};
