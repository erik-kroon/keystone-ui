import {
  For,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { Portal } from "solid-js/web";
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
  createControllableSignal,
  createStableId,
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
export type ComboboxListboxContractProps = Omit<ComboboxListboxProps, "children">;
export type ComboboxGroupContractProps = Omit<ComboboxGroupProps, "children" | "label"> & {
  label?: string;
};
export type ComboboxGroupLabelContractProps = Omit<ComboboxGroupLabelProps, "children">;
export type ComboboxItemContractProps = Omit<ComboboxItemProps, "children" | "label"> & {
  group?: string;
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

function createScopedCombobox(options: CreateComboboxOptions = {}): ComboboxApi {
  const scope = options.scope ?? "combobox";
  const inputId = createStableId(`${scope}-input`);
  const triggerId = createStableId(`${scope}-trigger`);
  const contentId = createStableId(`${scope}-content`);
  const listboxId = createStableId(`${scope}-listbox`);
  const [inputElement, setInputElement] = createSignal<HTMLInputElement>();
  const [contentElement, setContentElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  const [open, setOpenState] = createControllableBooleanSignal<ComboboxOpenChangeDetail>({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    defaultDetail: { reason: "programmatic" },
    onChange: options.onOpenChange,
  });
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
  const itemId = (value: string) => `${listboxId()}-${value}`;
  const groupId = (value: string) => `${listboxId()}-group-${value}`;
  const groupLabelId = (value: string) => `${listboxId()}-group-${value}-label`;
  const setOpen = (next: boolean, detail: ComboboxOpenChangeDetail) => {
    setOpenState(next, detail);
  };
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
  const formValue = createComboboxValueForm({
    defaultValue: () => options.defaultValue,
    name: options.name,
    onValueChange: (value) => listbox.selection.setValue(value, { reason: "programmatic" }),
    value: listbox.selection.value,
  });
  const formControl = createFormControl({
    form: options.form,
    id: inputId,
    name: options.name,
    value: () => formValue.value() ?? null,
    disabled,
    invalid,
    readonly: readOnly,
    required,
    onReset: formValue.reset,
  });
  const floating = createFloatingAdapter({
    anchor: inputElement,
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
  const state = () => (open() ? "open" : "closed");
  const partProps = (part: string) => ({
    ...getPartDataAttributes(scope, part),
  });

  return {
    contentId: contentId(),
    disabled,
    floating,
    formControl,
    formValue,
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
        scheduleMicrotask(() => inputElement()?.focus());
      }),
    }),
    getContentProps: (props) => {
      const floatingProps = floating.getFloatingProps({ style: props.style });

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
    getGroupProps: (props) => listbox.getGroupProps(props),
    getGroupLabelProps: (props) => listbox.getGroupLabelProps(props),
    getInputProps: (props) => ({
      ...formControl.getControlProps<HTMLInputElement>({
        ...props,
        id: inputId(),
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
        setInputElement(element);
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
        scheduleMicrotask(() => inputElement()?.focus());
      }),
    }),
    groupId,
    groupLabelId,
    inputId: inputId(),
    inputValue,
    invalid,
    itemId,
    list: listbox.interaction,
    listbox,
    listboxId: listboxId(),
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
    let inputElement: HTMLInputElement | undefined;

    createEffect(() => {
      if (inputElement) {
        inputElement.value = props.input.value;
      }
    });

    return (
      <input
        {...props.combobox.formControl.getHiddenInputProps({
          name: props.input.name,
          disabled: props.input.disabled,
          ref: (element) => {
            inputElement = element;
            element.value = props.input.value;
            props.combobox.formControl.registerFormReset(() => element);
            props.combobox.formControl.registerFormValueSync(
              () => element,
              props.combobox.formValue.syncInputValue,
            );
          },
        })}
      />
    );
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
      <Show when={props.forceMount || combobox.open()}>
        <Portal mount={props.mount}>{props.children}</Portal>
      </Show>
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
