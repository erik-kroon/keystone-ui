import {
  Show,
  createContext,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
import { createFormControl, type FormControlApi } from "../form/index";
import { assignRef } from "../overlay/dom";
import {
  createFloatingAdapter,
  type FloatingAdapter,
  type FloatingPlacement,
} from "../overlay/index";
import {
  composeEventHandlers,
  createCollection,
  createControllableBooleanSignal,
  createControllableSignal,
  createStableId,
  createTypeahead,
  dataBoolean,
  firstEnabledItem,
  lastEnabledItem,
  nextEnabledItem,
  renderPolymorphic,
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
  highlightedValue: () => string | undefined;
  invalid: () => boolean;
  itemId: (value: string) => string;
  items: () => SelectItemData[];
  listboxId: string;
  open: () => boolean;
  placeholder: () => string | undefined;
  registerItem: (item: SelectItemData) => () => void;
  required: () => boolean;
  selectValue: (value: string, detail: SelectChangeDetail) => void;
  selectedItem: () => SelectItemData | undefined;
  setContentElement: (element: HTMLDivElement) => void;
  setHighlightedValue: (value: string | undefined) => void;
  setPositionerElement: (element: HTMLDivElement) => void;
  setOpen: (open: boolean, detail: SelectOpenChangeDetail) => void;
  setTriggerElement: (element: HTMLButtonElement) => void;
  triggerId: string;
  value: () => string | undefined;
};

const SelectContext = createContext<SelectApi>();

export function createSelect(options: CreateSelectOptions = {}): SelectApi {
  const triggerId = createStableId("select-trigger");
  const contentId = createStableId("select-content");
  const listboxId = createStableId("select-listbox");
  const collection = createCollection<SelectItemData>();
  const [triggerElement, setTriggerElement] = createSignal<HTMLButtonElement>();
  const [contentElement, setContentElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  let lastValueDetail: SelectChangeDetail = { reason: "programmatic" };
  let lastOpenDetail: SelectOpenChangeDetail = { reason: "programmatic" };
  const [highlightedValue, setHighlightedValue] = createControllableSignal<string | undefined>({
    defaultValue: undefined,
  });
  const [value, setValueState] = createControllableSignal<string | undefined>({
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: (next) => options.onValueChange?.(next, lastValueDetail),
  });
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (next) => options.onOpenChange?.(next, lastOpenDetail),
  });
  const itemList = () => [...collection.items()];
  const selectedItem = createMemo(() => itemList().find((item) => item.value === value()));
  const disabled = () => options.disabled?.() ?? false;
  const invalid = () => options.invalid?.() ?? false;
  const required = () => options.required?.() ?? false;
  const formControl = createFormControl({
    id: triggerId,
    name: options.name,
    value: () => value() ?? null,
    disabled,
    invalid,
    required,
    onReset: () => {
      lastValueDetail = { reason: "programmatic" };
      setValueState(options.defaultValue);
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

  const selectValue = (next: string, detail: SelectChangeDetail) => {
    const item = collection.items().find((candidate) => candidate.value === next);

    if (!item || item.disabled) {
      return;
    }

    lastValueDetail = detail;
    setValueState(next);
    setOpen(false, {
      event: detail.event,
      reason: detail.reason === "keyboard" ? "keyboard" : "select",
    });
  };

  return {
    contentId: contentId(),
    disabled,
    floating,
    formControl,
    highlightedValue,
    invalid,
    itemId: (value) => `${listboxId()}-${value}`,
    items: itemList,
    listboxId: listboxId(),
    open,
    placeholder: () => options.placeholder?.(),
    registerItem: collection.registerItem,
    required,
    selectValue,
    selectedItem,
    setContentElement,
    setHighlightedValue,
    setPositionerElement,
    setOpen,
    setTriggerElement,
    triggerId: triggerId(),
    value,
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

  const triggerProps = {
    ...others,
    id: select.triggerId,
    type: "button",
    "aria-controls": select.contentId,
    get "aria-expanded"() {
      return select.open();
    },
    "aria-haspopup": "listbox",
    get "aria-invalid"() {
      return select.invalid() ? "true" : undefined;
    },
    get "aria-required"() {
      return select.required() ? "true" : undefined;
    },
    get disabled() {
      return select.disabled();
    },
    "data-scope": "select",
    "data-part": "trigger",
    get "data-state"() {
      return select.open() ? "open" : "closed";
    },
    get "data-disabled"() {
      return dataBoolean(select.disabled());
    },
    get "data-invalid"() {
      return dataBoolean(select.invalid());
    },
    get "data-placeholder"() {
      return dataBoolean(select.value() === undefined);
    },
    get "data-required"() {
      return dataBoolean(select.required());
    },
    ref: (element: HTMLButtonElement) => {
      select.setTriggerElement(element);
      assignRef(local.ref, element);
    },
    onClick: composeEventHandlers(local.onClick, (event) => {
      select.setOpen(!select.open(), { event, reason: "trigger" });
    }),
    onKeyDown: composeEventHandlers<KeyboardEvent>(local.onKeyDown, (event) => {
      const key = (event as KeyboardEvent).key;

      if (key === "ArrowDown" || key === "Enter" || key === " ") {
        event.preventDefault();
        select.setOpen(true, { event, reason: "keyboard" });
        select.setHighlightedValue(select.value() ?? firstEnabledItem(select.items())?.value);
      }

      if (key === "Escape") {
        select.setOpen(false, { event, reason: "escape" });
      }
    }),
  } as const;

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
    local.children ?? select.selectedItem()?.label ?? local.placeholder ?? select.placeholder();

  return (
    <span
      data-scope="select"
      data-part="value"
      data-placeholder={dataBoolean(select.value() === undefined)}
      {...others}
    >
      {text()}
    </span>
  );
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
  const floatingProps = () =>
    select.floating.getFloatingProps({
      style: local.style,
    });

  return (
    <div
      id={select.contentId}
      data-scope="select"
      data-part="content"
      data-state={select.open() ? "open" : "closed"}
      data-side={select.floating.side()}
      data-align={select.floating.align()}
      style={floatingProps().style}
      {...others}
      ref={(element) => {
        select.setContentElement(element);
        assignRef(local.ref, element);
        queueMicrotask(select.floating.update);
      }}
      onKeyDown={composeEventHandlers(local.onKeyDown, (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          select.setOpen(false, { event, reason: "escape" });
        }
      })}
    >
      {local.children}
    </div>
  );
}

function Positioner(props: SelectPositionerProps) {
  const select = useSelect("Positioner");
  const [local, others] = splitProps(props, ["children", "ref", "style"]);
  const floatingProps = () => select.floating.getFloatingProps({ style: local.style });

  return (
    <div
      data-scope="select"
      data-part="positioner"
      data-state={select.open() ? "open" : "closed"}
      data-side={select.floating.side()}
      data-align={select.floating.align()}
      style={floatingProps().style}
      {...others}
      ref={(element) => {
        select.setPositionerElement(element);
        assignRef(local.ref, element);
        queueMicrotask(select.floating.update);
      }}
    >
      {local.children}
    </div>
  );
}

function Listbox(props: SelectListboxProps) {
  const select = useSelect("Listbox");
  const [local, others] = splitProps(props, ["children", "onKeyDown"]);
  const typeahead = createTypeahead({
    current: select.highlightedValue,
    items: select.items,
    onMatch: (item) => select.setHighlightedValue(item.value),
  });
  const highlightedItemId = () => {
    const highlighted = select.highlightedValue();
    return highlighted ? select.itemId(highlighted) : undefined;
  };

  return (
    <div
      id={select.listboxId}
      role="listbox"
      aria-labelledby={select.triggerId}
      aria-activedescendant={highlightedItemId()}
      tabindex={-1}
      data-scope="select"
      data-part="listbox"
      {...others}
      onKeyDown={composeEventHandlers(local.onKeyDown, (event) => {
        const items = select.items();

        if (event.key === "ArrowDown") {
          event.preventDefault();
          select.setHighlightedValue(
            nextEnabledItem({
              current: select.highlightedValue(),
              direction: 1,
              items,
            })?.value,
          );
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          select.setHighlightedValue(
            nextEnabledItem({
              current: select.highlightedValue(),
              direction: -1,
              items,
            })?.value,
          );
        }

        if (event.key === "Home") {
          event.preventDefault();
          select.setHighlightedValue(firstEnabledItem(items)?.value);
        }

        if (event.key === "End") {
          event.preventDefault();
          select.setHighlightedValue(lastEnabledItem(items)?.value);
        }

        if (event.key === "Enter" || event.key === " ") {
          if (event.key === " " && typeahead.isTyping()) {
            typeahead.handleKeyDown(event);
            return;
          }

          event.preventDefault();
          const highlighted = select.highlightedValue();

          if (highlighted) {
            select.selectValue(highlighted, { event, reason: "keyboard" });
          }
        }

        typeahead.handleKeyDown(event);
      })}
    >
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

  select.registerItem({
    disabled: local.disabled,
    label: label(),
    value: local.value,
  });

  return (
    <div
      id={select.itemId(local.value)}
      role="option"
      aria-disabled={local.disabled ? "true" : undefined}
      aria-selected={select.value() === local.value}
      data-scope="select"
      data-part="item"
      data-disabled={dataBoolean(local.disabled)}
      data-highlighted={dataBoolean(select.highlightedValue() === local.value)}
      data-selected={dataBoolean(select.value() === local.value)}
      {...others}
      onPointerMove={composeEventHandlers(local.onPointerMove, () => {
        if (!local.disabled) {
          select.setHighlightedValue(local.value);
        }
      })}
      onClick={composeEventHandlers(local.onClick, (event) => {
        select.selectValue(local.value, { event, reason: "item" });
      })}
    >
      {local.children}
    </div>
  );
}

function ItemText(props: SelectItemTextProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <span data-scope="select" data-part="item-text" {...others}>
      {local.children}
    </span>
  );
}

function ItemIndicator(props: SelectItemIndicatorProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <span data-scope="select" data-part="item-indicator" {...others}>
      {local.children}
    </span>
  );
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
