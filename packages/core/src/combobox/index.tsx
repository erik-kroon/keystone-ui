import { For, Show, createContext, createMemo, splitProps, useContext, type JSX } from "solid-js";
import type { FormControlApi } from "../form/index";
import { createListboxInteraction, type ListboxInteractionApi } from "../collection/index";
import type { ListInteractionKernelApi } from "../collection/interaction-kernel";
import {
  createPopupFieldHiddenInputProps,
  createPopupFieldKernel,
} from "../collection/popup-field-kernel";
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
import { Portal } from "../portal/index";
import {
  composeEventHandlers,
  createControllableSignal,
  dataBoolean,
  renderPolymorphic,
  scheduleMicrotask,
  type PolymorphicProps,
} from "../utils/index";

export type ComboboxChangeDetail = {
  event?: Event;
  reason: "input" | "item" | "keyboard" | "clear" | "programmatic";
};

export type ComboboxOpenChangeDetail = {
  event?: Event;
  reason: "input" | "trigger" | "keyboard" | "select" | "escape" | "programmatic";
};

export type ComboboxItemData = {
  disabled?: boolean;
  group?: string;
  label: string;
  value: string;
};

export type ComboboxRootProps = {
  children?: JSX.Element;
  arrowPadding?: number;
  collisionBoundary?: FloatingCollisionBoundary;
  collisionPadding?: number;
  defaultInputValue?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  fitViewport?: boolean;
  form?: string;
  gutter?: number;
  inputValue?: string;
  invalid?: boolean;
  name?: string;
  onInputValueChange?: (value: string, detail: ComboboxChangeDetail) => void;
  onOpenChange?: (open: boolean, detail: ComboboxOpenChangeDetail) => void;
  onValueChange?: (value: string | undefined, detail: ComboboxChangeDetail) => void;
  open?: boolean;
  placement?: FloatingPlacement;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rootBoundary?: FloatingRootBoundary;
  sameWidth?: boolean;
  sticky?: FloatingSticky;
  strategy?: FloatingStrategy;
  value?: string;
};

export type ComboboxPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type ComboboxInputProps = ComboboxPartProps<HTMLInputElement> &
  PolymorphicProps<HTMLInputElement> &
  Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "children" | "ref" | "value">;
export type ComboboxTriggerProps = ComboboxPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type ComboboxClearProps = ComboboxPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type ComboboxPortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
};
export type ComboboxContentProps = ComboboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type ComboboxPositionerProps = ComboboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type ComboboxArrowProps = FloatingArrowProps<HTMLSpanElement>;
export type ComboboxListboxProps = ComboboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type ComboboxGroupProps = ComboboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
    label?: string;
    value: string;
  };
export type ComboboxGroupLabelProps = ComboboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type ComboboxItemProps = ComboboxPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
    group?: string;
    hidden?: JSX.HTMLAttributes<HTMLDivElement>["hidden"];
    label?: string;
    value: string;
  };
export type ComboboxItemTextProps = ComboboxPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref">;
export type ComboboxItemIndicatorProps = ComboboxPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref">;

export type ComboboxInputContractProps = Omit<ComboboxInputProps, "as" | "children">;
export type ComboboxTriggerContractProps = Omit<ComboboxTriggerProps, "as" | "children">;
export type ComboboxClearContractProps = Omit<ComboboxClearProps, "as" | "children">;
export type ComboboxContentContractProps = Omit<ComboboxContentProps, "children">;
export type ComboboxPositionerContractProps = Omit<ComboboxPositionerProps, "children">;
export type ComboboxArrowContractProps = Omit<ComboboxArrowProps, "children">;
export type ComboboxListboxContractProps = Omit<ComboboxListboxProps, "children">;
export type ComboboxGroupContractProps = Omit<ComboboxGroupProps, "children" | "label"> & {
  label?: string;
};
export type ComboboxGroupLabelContractProps = Omit<ComboboxGroupLabelProps, "children">;
export type ComboboxItemContractProps = Omit<ComboboxItemProps, "children" | "label"> & {
  group?: string;
  hidden?: JSX.HTMLAttributes<HTMLDivElement>["hidden"];
  label: string;
};
export type ComboboxItemTextContractProps = Omit<ComboboxItemTextProps, "children">;
export type ComboboxItemIndicatorContractProps = Omit<ComboboxItemIndicatorProps, "children">;

export type CreateComboboxOptions = {
  arrowPadding?: () => number | undefined;
  collisionBoundary?: () => FloatingCollisionBoundary | undefined;
  collisionPadding?: () => number | undefined;
  defaultInputValue?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: () => boolean | undefined;
  fitViewport?: () => boolean | undefined;
  form?: () => string | undefined;
  gutter?: () => number | undefined;
  inputValue?: () => string | undefined;
  invalid?: () => boolean | undefined;
  name?: () => string | undefined;
  onInputValueChange?: (value: string, detail: ComboboxChangeDetail) => void;
  onOpenChange?: (open: boolean, detail: ComboboxOpenChangeDetail) => void;
  onValueChange?: (value: string | undefined, detail: ComboboxChangeDetail) => void;
  open?: () => boolean | undefined;
  placement?: () => FloatingPlacement | undefined;
  placeholder?: () => string | undefined;
  readOnly?: () => boolean | undefined;
  required?: () => boolean | undefined;
  rootBoundary?: () => FloatingRootBoundary | undefined;
  sameWidth?: () => boolean | undefined;
  scope?: string;
  sticky?: () => FloatingSticky | undefined;
  strategy?: () => FloatingStrategy | undefined;
  value?: () => string | undefined;
};

export type ComboboxApi = {
  contentId: string;
  disabled: () => boolean;
  floating: FloatingAdapter;
  formControl: FormControlApi;
  formValue: ComboboxValueFormApi;
  getArrowProps: (props: ComboboxArrowContractProps) => Record<string, unknown>;
  getClearProps: (props: ComboboxClearContractProps) => Record<string, unknown>;
  getContentProps: (props: ComboboxContentContractProps) => Record<string, unknown>;
  getGroupLabelProps: (props: ComboboxGroupLabelContractProps) => Record<string, unknown>;
  getGroupProps: (props: ComboboxGroupContractProps) => Record<string, unknown>;
  getInputProps: (props: ComboboxInputContractProps) => Record<string, unknown>;
  getItemIndicatorProps: (props: ComboboxItemIndicatorContractProps) => Record<string, unknown>;
  getItemProps: (props: ComboboxItemContractProps) => Record<string, unknown>;
  getItemTextProps: (props: ComboboxItemTextContractProps) => Record<string, unknown>;
  getListboxProps: (props: ComboboxListboxContractProps) => Record<string, unknown>;
  getPositionerProps: (props: ComboboxPositionerContractProps) => Record<string, unknown>;
  getTriggerProps: (props: ComboboxTriggerContractProps) => Record<string, unknown>;
  groupId: (value: string) => string;
  groupLabelId: (value: string) => string;
  inputId: string;
  inputValue: () => string;
  invalid: () => boolean;
  itemId: (value: string) => string;
  list: ListInteractionKernelApi<ComboboxItemData, ComboboxChangeDetail>;
  listbox: ListboxInteractionApi<ComboboxItemData, ComboboxChangeDetail>;
  listboxId: string;
  open: () => boolean;
  placeholder: () => string | undefined;
  readOnly: () => boolean;
  required: () => boolean;
  scope: string;
  setInputValue: (value: string, detail: ComboboxChangeDetail) => void;
  setOpen: (open: boolean, detail: ComboboxOpenChangeDetail) => void;
  triggerId: string;
  value: () => string | undefined;
};

type ComboboxHiddenInputDescriptor = {
  disabled?: boolean;
  name: string;
  value: string;
};

export type ComboboxValueFormApi = {
  hiddenInputs: () => readonly ComboboxHiddenInputDescriptor[];
  reset: () => void;
  syncInputValue: (value: string) => void;
  value: () => string | undefined;
};

type ComboboxFactoryOptions = {
  scope: string;
};

const ComboboxContext = createContext<ComboboxApi>();
const ComboboxGroupContext = createContext<{ disabled?: boolean; value: string }>();

export function createCombobox(options: CreateComboboxOptions = {}): ComboboxApi {
  return createScopedCombobox({ ...options, scope: options.scope ?? "combobox" });
}

export function createAutocomplete(options: CreateComboboxOptions = {}): ComboboxApi {
  return createScopedCombobox({ ...options, scope: options.scope ?? "autocomplete" });
}

export function createCommand(options: CreateComboboxOptions = {}): ComboboxApi {
  return createScopedCombobox({ ...options, scope: options.scope ?? "command" });
}

function createScopedCombobox(options: CreateComboboxOptions = {}): ComboboxApi {
  const scope = options.scope ?? "combobox";
  const [inputValue, setInputValueState] = createControllableSignal<string, ComboboxChangeDetail>({
    value: options.inputValue,
    defaultValue: options.defaultInputValue ?? "",
    defaultDetail: { reason: "programmatic" },
    onChange: options.onInputValueChange,
  });
  const disabled = () => options.disabled?.() ?? false;
  const invalid = () => options.invalid?.() ?? false;
  const readOnly = () => options.readOnly?.() ?? false;
  const required = () => options.required?.() ?? false;
  let inputElement: HTMLInputElement | undefined;
  let formValue!: ComboboxValueFormApi;
  const popup = createPopupFieldKernel<ComboboxOpenChangeDetail, HTMLInputElement, string | null>({
    anchorPart: "input",
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
    scope,
    sticky: options.sticky,
    strategy: options.strategy,
  });
  const inputId = () => popup.anchorId;
  const listboxId = () => popup.listboxId;
  const triggerId = () => `${popup.anchorId}-trigger`;
  const itemId = (value: string) => `${popup.listboxId}-${value}`;
  const groupId = (value: string) => `${popup.listboxId}-group-${value}`;
  const groupLabelId = (value: string) => `${popup.listboxId}-group-${value}-label`;
  const setOpen = popup.setOpen;
  const setInputValue = (next: string, detail: ComboboxChangeDetail) => {
    setInputValueState(next, detail);
  };
  const listbox = createListboxInteraction<ComboboxItemData, ComboboxChangeDetail>({
    id: listboxId,
    labelledBy: inputId,
    groupId,
    groupLabelId,
    optionId: itemId,
    optionPart: "item",
    optionSelectDetail: (event) => ({ event, reason: "item" }),
    rootPart: "listbox",
    scope,
    selectionMode: "single",
    value: options.value,
    defaultValue: options.defaultValue,
    programmaticDetail: { reason: "programmatic" },
    onSelectionChange: options.onValueChange,
    onValueSelect: (item, detail) => {
      setInputValue(item.label, detail);
      setOpen(false, {
        event: detail.event,
        reason: detail.reason === "keyboard" ? "keyboard" : "select",
      });
    },
  });
  formValue = createComboboxValueForm({
    defaultValue: () => options.defaultValue,
    name: options.name,
    onValueChange: (value) => listbox.selection.setValue(value, { reason: "programmatic" }),
    value: listbox.selection.value,
  });
  const formControl = popup.createFormControl({
    form: options.form,
    name: options.name,
    onReset: formValue.reset,
    value: () => formValue.value() ?? null,
  });
  const open = popup.open;
  const state = popup.state;
  const partProps = popup.getPartProps;

  return {
    contentId: popup.contentId,
    disabled,
    floating: popup.floating,
    formControl,
    formValue,
    getArrowProps: popup.getArrowProps,
    getClearProps: (props) => ({
      ...props,
      type: "button",
      ...partProps("clear"),
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      onClick: composeEventHandlers<MouseEvent>(props.onClick, (event) => {
        if (disabled() || readOnly()) {
          event.preventDefault();
          return;
        }

        setInputValue("", { event, reason: "clear" });
        listbox.selection.setValue(undefined, { event, reason: "clear" });
        setOpen(false, { event, reason: "programmatic" });
        scheduleMicrotask(() => inputElement?.focus());
      }),
    }),
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
    getGroupProps: (props) => listbox.getGroupProps(props),
    getGroupLabelProps: (props) => listbox.getGroupLabelProps(props),
    getInputProps: (props) => ({
      ...formControl.getControlProps<HTMLInputElement>({
        ...props,
        id: popup.anchorId,
      }),
      role: "combobox",
      type: props.type ?? "text",
      autocomplete: props.autocomplete ?? "off",
      autocorrect: "off",
      spellcheck: "false",
      "aria-autocomplete": "list",
      "aria-controls": listboxId(),
      get "aria-expanded"() {
        return open();
      },
      "aria-haspopup": "listbox",
      get "aria-activedescendant"() {
        return listbox.activeDescendant.id();
      },
      get disabled() {
        return disabled();
      },
      get readOnly() {
        return readOnly();
      },
      get required() {
        return required();
      },
      get value() {
        return inputValue();
      },
      placeholder: props.placeholder ?? options.placeholder?.(),
      ...partProps("input"),
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
        return dataBoolean(inputValue() === "");
      },
      get "data-readonly"() {
        return dataBoolean(readOnly());
      },
      get "data-required"() {
        return dataBoolean(required());
      },
      ref: (element: HTMLInputElement) => {
        inputElement = element;
        popup.setAnchorElement(element);
        assignRef(props.ref, element);
      },
      onInput: composeEventHandlers<InputEvent>(props.onInput, (event) => {
        if (disabled() || readOnly()) {
          event.preventDefault();
          return;
        }

        const target = event.currentTarget as HTMLInputElement;
        setInputValue(target.value, { event, reason: "input" });
        setOpen(true, { event, reason: "input" });
        listbox.activeDescendant.setHighlightedValue(undefined);
      }),
      onFocus: composeEventHandlers<FocusEvent>(props.onFocus, () => {
        if (!disabled() && !readOnly() && inputValue()) {
          setOpen(true, { reason: "input" });
        }
      }),
      onKeyDown: composeEventHandlers<KeyboardEvent>(props.onKeyDown, (event) => {
        if (disabled() || readOnly()) {
          return;
        }

        if (event.key === "Escape") {
          if (open()) {
            event.preventDefault();
            setOpen(false, { event, reason: "escape" });
            return;
          }

          setInputValue("", { event, reason: "clear" });
          listbox.selection.setValue(undefined, { event, reason: "clear" });
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true, { event, reason: "keyboard" });
          listbox.keyboard.highlight("next");
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setOpen(true, { event, reason: "keyboard" });
          listbox.keyboard.highlight("previous");
          return;
        }

        if (event.key === "Enter" && open()) {
          event.preventDefault();
          listbox.selection.selectHighlighted({ event, reason: "keyboard" });
        }
      }),
    }),
    getItemIndicatorProps: (props) => ({
      ...props,
      ...partProps("item-indicator"),
    }),
    getItemProps: (props) => {
      const [local, others] = splitProps(props, [
        "disabled",
        "group",
        "hidden",
        "label",
        "onClick",
        "onPointerMove",
        "value",
      ]);

      return listbox.getOptionProps({
        ...others,
        disabled: local.disabled,
        group: local.group,
        hidden: local.hidden,
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
            if (readOnly()) {
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
      ...props,
      type: "button",
      "aria-controls": listboxId(),
      get "aria-expanded"() {
        return open();
      },
      "aria-haspopup": "listbox",
      ...partProps("trigger"),
      get "data-state"() {
        return state();
      },
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      ref: (element: HTMLButtonElement) => {
        assignRef(props.ref, element);
      },
      onClick: composeEventHandlers<MouseEvent>(props.onClick, (event) => {
        if (disabled() || readOnly()) {
          event.preventDefault();
          return;
        }

        setOpen(!open(), { event, reason: "trigger" });
        scheduleMicrotask(() => inputElement?.focus());
      }),
    }),
    groupId,
    groupLabelId,
    inputId: popup.anchorId,
    inputValue,
    invalid,
    itemId,
    list: listbox.interaction,
    listbox,
    listboxId: popup.listboxId,
    open,
    placeholder: () => options.placeholder?.(),
    readOnly,
    required,
    scope,
    setInputValue,
    setOpen,
    triggerId: triggerId(),
    value: listbox.selection.value,
  };
}

function createComboboxValueForm(options: {
  defaultValue?: () => string | undefined;
  name?: () => string | undefined;
  onValueChange: (value: string | undefined) => void;
  value: () => string | undefined;
}): ComboboxValueFormApi {
  const hiddenInputs = createMemo<readonly ComboboxHiddenInputDescriptor[]>(() => {
    const name = options.name?.();

    if (!name) {
      return [];
    }

    return [{ name, value: options.value() ?? "" }];
  });
  const reset = () => options.onValueChange(options.defaultValue?.());
  const syncInputValue = (next: string) => options.onValueChange(next || undefined);

  return {
    hiddenInputs,
    reset,
    syncInputValue,
    value: options.value,
  };
}

function useCombobox(part: string) {
  const combobox = useContext(ComboboxContext);

  if (!combobox) {
    throw new Error(`Combobox.${part} must be used within Combobox.Root`);
  }

  return combobox;
}

function createComboboxNamespace(factoryOptions: ComboboxFactoryOptions) {
  function Root(props: ComboboxRootProps) {
    const combobox = createScopedCombobox({
      arrowPadding: () => props.arrowPadding,
      collisionBoundary: () => props.collisionBoundary,
      collisionPadding: () => props.collisionPadding,
      defaultInputValue: props.defaultInputValue,
      defaultOpen: props.defaultOpen,
      defaultValue: props.defaultValue,
      disabled: () => props.disabled,
      fitViewport: () => props.fitViewport,
      form: () => props.form,
      gutter: () => props.gutter,
      inputValue: () => props.inputValue,
      invalid: () => props.invalid,
      name: () => props.name,
      onInputValueChange: props.onInputValueChange,
      onOpenChange: props.onOpenChange,
      onValueChange: props.onValueChange,
      open: () => props.open,
      placement: () => props.placement,
      placeholder: () => props.placeholder,
      readOnly: () => props.readOnly,
      required: () => props.required,
      rootBoundary: () => props.rootBoundary,
      sameWidth: () => props.sameWidth,
      scope: factoryOptions.scope,
      sticky: () => props.sticky,
      strategy: () => props.strategy,
      value: () => props.value,
    });

    return (
      <ComboboxContext.Provider value={combobox}>
        <Show when={props.name}>
          <For each={combobox.formValue.hiddenInputs()}>
            {(input) => <HiddenInput input={input} combobox={combobox} />}
          </For>
        </Show>
        {props.children}
      </ComboboxContext.Provider>
    );
  }

  function HiddenInput(props: {
    input: ReturnType<ComboboxApi["formValue"]["hiddenInputs"]>[number];
    combobox: ComboboxApi;
  }) {
    const inputProps = createPopupFieldHiddenInputProps({
      formControl: props.combobox.formControl,
      input: () => props.input,
      syncInputValue: props.combobox.formValue.syncInputValue,
    });

    return <input {...inputProps} />;
  }

  function Input(props: ComboboxInputProps) {
    const combobox = useCombobox("Input");
    const [local, others] = splitProps(props, ["as", "onFocus", "onInput", "onKeyDown", "ref"]);
    const inputProps = combobox.getInputProps({
      ...others,
      onFocus: local.onFocus,
      onInput: local.onInput,
      onKeyDown: local.onKeyDown,
      ref: local.ref,
    });

    if (!local.as) {
      return <input {...inputProps} />;
    }

    return renderPolymorphic(local.as, "input", inputProps);
  }

  function Trigger(props: ComboboxTriggerProps) {
    const combobox = useCombobox("Trigger");
    const [local, others] = splitProps(props, ["as", "children", "onClick", "ref"]);
    const triggerProps = combobox.getTriggerProps({
      ...others,
      onClick: local.onClick,
      ref: local.ref,
    });

    if (!local.as) {
      return <button {...triggerProps}>{local.children}</button>;
    }

    return renderPolymorphic(local.as, "button", { ...triggerProps, children: local.children });
  }

  function Clear(props: ComboboxClearProps) {
    const combobox = useCombobox("Clear");
    const [local, others] = splitProps(props, ["as", "children", "onClick", "ref"]);
    const clearProps = combobox.getClearProps({
      ...others,
      onClick: local.onClick,
      ref: local.ref,
    });

    if (!local.as) {
      return <button {...clearProps}>{local.children}</button>;
    }

    return renderPolymorphic(local.as, "button", { ...clearProps, children: local.children });
  }

  function PortalPart(props: ComboboxPortalProps) {
    const combobox = useCombobox("Portal");

    return (
      <Portal forceMount={props.forceMount} mount={props.mount} present={combobox.open()}>
        {props.children}
      </Portal>
    );
  }

  function Content(props: ComboboxContentProps) {
    const combobox = useCombobox("Content");
    const [local, others] = splitProps(props, ["children", "onKeyDown", "ref", "style"]);

    return (
      <div
        {...combobox.getContentProps({
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

  function Positioner(props: ComboboxPositionerProps) {
    const combobox = useCombobox("Positioner");
    const [local, others] = splitProps(props, ["children", "ref", "style"]);

    return (
      <div
        {...combobox.getPositionerProps({
          ...others,
          ref: local.ref,
          style: local.style,
        })}
      >
        {local.children}
      </div>
    );
  }

  function Arrow(props: ComboboxArrowProps) {
    const combobox = useCombobox("Arrow");
    const [local, others] = splitProps(props, ["children", "ref", "style"]);

    return (
      <span
        {...combobox.getArrowProps({
          ...others,
          ref: local.ref,
          style: local.style,
        })}
      >
        {local.children}
      </span>
    );
  }

  function Listbox(props: ComboboxListboxProps) {
    const combobox = useCombobox("Listbox");
    const [local, others] = splitProps(props, ["children", "onKeyDown"]);

    return (
      <div {...combobox.getListboxProps({ ...others, onKeyDown: local.onKeyDown })}>
        {local.children}
      </div>
    );
  }

  function Group(props: ComboboxGroupProps) {
    const combobox = useCombobox("Group");
    const [local, others] = splitProps(props, ["children", "disabled", "label", "value"]);

    return (
      <ComboboxGroupContext.Provider value={{ disabled: local.disabled, value: local.value }}>
        <div
          {...combobox.getGroupProps({
            ...others,
            disabled: local.disabled,
            label: local.label,
            value: local.value,
          })}
        >
          {local.children}
        </div>
      </ComboboxGroupContext.Provider>
    );
  }

  function GroupLabel(props: ComboboxGroupLabelProps) {
    const combobox = useCombobox("GroupLabel");
    const group = useContext(ComboboxGroupContext);
    const [local, others] = splitProps(props, ["children", "id"]);
    const id = () => local.id ?? (group ? combobox.groupLabelId(group.value) : undefined);

    return (
      <div
        {...combobox.getGroupLabelProps({
          ...others,
          id: id(),
        })}
      >
        {local.children}
      </div>
    );
  }

  function Item(props: ComboboxItemProps) {
    const combobox = useCombobox("Item");
    const group = useContext(ComboboxGroupContext);
    const [local, others] = splitProps(props, [
      "children",
      "disabled",
      "group",
      "hidden",
      "label",
      "onClick",
      "onPointerMove",
      "value",
    ]);
    const label = () => local.label ?? String(local.children ?? local.value);

    return (
      <div
        {...combobox.getItemProps({
          ...others,
          disabled: local.disabled ?? group?.disabled,
          group: local.group ?? group?.value,
          hidden: local.hidden,
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

  function ItemText(props: ComboboxItemTextProps) {
    const combobox = useCombobox("ItemText");
    const [local, others] = splitProps(props, ["children"]);

    return <span {...combobox.getItemTextProps(others)}>{local.children}</span>;
  }

  function ItemIndicator(props: ComboboxItemIndicatorProps) {
    const combobox = useCombobox("ItemIndicator");
    const [local, others] = splitProps(props, ["children"]);

    return <span {...combobox.getItemIndicatorProps(others)}>{local.children}</span>;
  }

  return {
    Root,
    Input,
    Trigger,
    Clear,
    Portal: PortalPart,
    Positioner,
    Arrow,
    Content,
    Listbox,
    Group,
    GroupLabel,
    Item,
    ItemText,
    ItemIndicator,
  };
}

export const Combobox = createComboboxNamespace({ scope: "combobox" });
export const Autocomplete = createComboboxNamespace({ scope: "autocomplete" });
export const Command = createComboboxNamespace({ scope: "command" });
