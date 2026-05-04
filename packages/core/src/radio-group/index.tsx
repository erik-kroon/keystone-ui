import {
  createContext,
  createMemo,
  createUniqueId,
  onCleanup,
  onMount,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { useDirection, type Direction as CoreDirection } from "../i18n/direction";
import {
  callEventHandler,
  createControllableSignal,
  dataBoolean,
  getCheckedState,
  partDataAttributes,
} from "../utils/index";

export type RadioGroupOrientation = "horizontal" | "vertical";
export type RadioGroupDirection = CoreDirection;
export type RadioGroupValueChangeDetail = {
  reason: "item" | "keyboard" | "programmatic";
};

export type RadioGroupRootProps = RadioGroupPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    defaultValue?: string;
    dir?: RadioGroupDirection;
    disabled?: boolean;
    form?: string;
    invalid?: boolean;
    loopFocus?: boolean;
    name?: string;
    onValueChange?: (value: string | undefined, detail: RadioGroupValueChangeDetail) => void;
    orientation?: RadioGroupOrientation;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
  };

export type RadioGroupPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type RadioGroupItemProps = RadioGroupPartProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref" | "value"> & {
    disabled?: boolean;
    value: string;
  };
export type RadioGroupItemIndicatorProps = RadioGroupPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref"> & {
    forceMount?: boolean;
  };
export type RadioGroupHiddenInputProps = RadioGroupPartProps<HTMLInputElement> &
  Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "children" | "checked" | "ref" | "type">;

type RadioItemRecord = {
  disabled: Accessor<boolean>;
  element: HTMLButtonElement;
  value: string;
};

type RadioGroupApi = {
  disabled: Accessor<boolean>;
  dir: Accessor<RadioGroupDirection>;
  invalid: Accessor<boolean>;
  form: Accessor<string | undefined>;
  loopFocus: Accessor<boolean>;
  name: Accessor<string | undefined>;
  orientation: Accessor<RadioGroupOrientation>;
  readOnly: Accessor<boolean>;
  registerItem: (
    element: HTMLButtonElement,
    value: string,
    disabled: Accessor<boolean>,
  ) => () => void;
  required: Accessor<boolean>;
  reset: () => string | undefined;
  selectValue: (
    value: string | undefined,
    detail: RadioGroupValueChangeDetail,
  ) => string | undefined;
  value: Accessor<string | undefined>;
  items: Accessor<RadioItemRecord[]>;
};

type RadioGroupItemApi = {
  checked: Accessor<boolean>;
  disabled: Accessor<boolean>;
  inputId: string;
  setItemElement: (element: HTMLButtonElement) => void;
  value: string;
};

const RadioGroupContext = createContext<RadioGroupApi>();
const RadioGroupItemContext = createContext<RadioGroupItemApi>();

export function createRadioGroup(
  options: {
    defaultValue?: string;
    dir?: () => RadioGroupDirection | undefined;
    disabled?: () => boolean | undefined;
    form?: () => string | undefined;
    invalid?: () => boolean | undefined;
    loopFocus?: () => boolean | undefined;
    name?: () => string | undefined;
    onValueChange?: (value: string | undefined, detail: RadioGroupValueChangeDetail) => void;
    orientation?: () => RadioGroupOrientation | undefined;
    readOnly?: () => boolean | undefined;
    required?: () => boolean | undefined;
    value?: () => string | undefined;
  } = {},
): RadioGroupApi {
  const [value, setValueState] = createControllableSignal<
    string | undefined,
    RadioGroupValueChangeDetail
  >({
    value: options.value,
    defaultValue: options.defaultValue,
    defaultDetail: { reason: "programmatic" },
    onChange: (nextValue, detail) => options.onValueChange?.(nextValue, detail),
  });
  const itemRecords: RadioItemRecord[] = [];

  return {
    disabled: createMemo(() => options.disabled?.() ?? false),
    dir: createMemo(() => (options.dir?.() === "rtl" ? "rtl" : "ltr")),
    form: createMemo(() => options.form?.()),
    invalid: createMemo(() => options.invalid?.() ?? false),
    loopFocus: createMemo(() => options.loopFocus?.() ?? true),
    name: createMemo(() => options.name?.()),
    orientation: createMemo(() => options.orientation?.() ?? "vertical"),
    readOnly: createMemo(() => options.readOnly?.() ?? false),
    registerItem: (element, itemValue, itemDisabled) => {
      const record = { disabled: itemDisabled, element, value: itemValue };
      itemRecords.push(record);

      return () => {
        const index = itemRecords.indexOf(record);
        if (index >= 0) itemRecords.splice(index, 1);
      };
    },
    required: createMemo(() => options.required?.() ?? false),
    reset: () => setValueState(options.defaultValue, { reason: "programmatic" }),
    selectValue: (nextValue, detail) => setValueState(nextValue, detail),
    value,
    items: () => itemRecords,
  };
}

function useRadioGroup(part: string) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error(`RadioGroup.${part} must be used within RadioGroup.Root`);
  return group;
}

function useRadioGroupItem(part: string) {
  const item = useContext(RadioGroupItemContext);
  if (!item) throw new Error(`RadioGroup.${part} must be used within RadioGroup.Item`);
  return item;
}

function Root(props: RadioGroupRootProps) {
  const inheritedDir = useDirection();
  const [local, others] = splitProps(props, [
    "children",
    "defaultValue",
    "dir",
    "disabled",
    "form",
    "invalid",
    "loopFocus",
    "name",
    "onValueChange",
    "orientation",
    "readOnly",
    "required",
    "value",
  ]);
  const group = createRadioGroup({
    defaultValue: local.defaultValue,
    dir: () => local.dir ?? inheritedDir(),
    disabled: () => local.disabled,
    form: () => local.form,
    invalid: () => local.invalid,
    loopFocus: () => local.loopFocus,
    name: () => local.name,
    onValueChange: local.onValueChange,
    orientation: () => local.orientation,
    readOnly: () => local.readOnly,
    required: () => local.required,
    value: () => local.value,
  });

  return (
    <RadioGroupContext.Provider value={group}>
      <div
        {...others}
        aria-disabled={group.disabled() || undefined}
        aria-invalid={group.invalid() || undefined}
        aria-orientation={group.orientation()}
        aria-readonly={group.readOnly() || undefined}
        aria-required={group.required() || undefined}
        data-disabled={dataBoolean(group.disabled())}
        data-dir={group.dir()}
        data-invalid={dataBoolean(group.invalid())}
        data-orientation={group.orientation()}
        data-readonly={dataBoolean(group.readOnly())}
        data-required={dataBoolean(group.required())}
        role="radiogroup"
        {...partDataAttributes("radio-group", "root")}
      >
        {local.children}
      </div>
    </RadioGroupContext.Provider>
  );
}

function Item(props: RadioGroupItemProps) {
  const group = useRadioGroup("Item");
  const [local, others] = splitProps(props, [
    "children",
    "disabled",
    "onClick",
    "onKeyDown",
    "ref",
    "value",
  ]);
  const disabled = createMemo(() => group.disabled() || (local.disabled ?? false));
  const checked = createMemo(() => group.value() === local.value);
  const inputId = `keystone-radio-group-input-${createUniqueId()}`;
  let unregisterItem: (() => void) | undefined;

  const item: RadioGroupItemApi = {
    checked,
    disabled,
    inputId,
    setItemElement: (element) => {
      unregisterItem?.();
      unregisterItem = group.registerItem(element, local.value, disabled);
    },
    value: local.value,
  };

  onCleanup(() => unregisterItem?.());

  return (
    <RadioGroupItemContext.Provider value={item}>
      <button
        {...others}
        aria-checked={checked()}
        aria-disabled={disabled() || undefined}
        data-checked={dataBoolean(checked())}
        data-disabled={dataBoolean(disabled())}
        data-dir={group.dir()}
        data-state={getCheckedState(checked())}
        role="radio"
        tabIndex={getTabIndex(group, local.value, disabled())}
        type="button"
        {...partDataAttributes("radio-group", "item")}
        onClick={(event) => {
          callEventHandler(local.onClick, event);
          if (event.defaultPrevented || disabled() || group.readOnly()) return;
          group.selectValue(local.value, { reason: "item" });
        }}
        onKeyDown={(event) => {
          callEventHandler(local.onKeyDown, event);
          if (!event.defaultPrevented) moveRadioFocus(event, group);
        }}
        ref={(element) => {
          if (typeof local.ref === "function") local.ref(element);
          item.setItemElement(element);
        }}
      >
        {local.children}
      </button>
    </RadioGroupItemContext.Provider>
  );
}

function ItemIndicator(props: RadioGroupItemIndicatorProps) {
  const item = useRadioGroupItem("ItemIndicator");
  const [local, others] = splitProps(props, ["children", "forceMount"]);

  if (!local.forceMount && !item.checked()) return null;

  return (
    <span
      {...others}
      data-checked={dataBoolean(item.checked())}
      data-disabled={dataBoolean(item.disabled())}
      data-state={getCheckedState(item.checked())}
      {...partDataAttributes("radio-group", "item-indicator")}
    >
      {local.children}
    </span>
  );
}

function HiddenInput(props: RadioGroupHiddenInputProps) {
  const group = useRadioGroup("HiddenInput");
  const item = useRadioGroupItem("HiddenInput");
  let input: HTMLInputElement | undefined;

  onMount(() => {
    const form = input?.form;
    if (!form) return;

    const onReset = () => group.reset();
    form.addEventListener("reset", onReset);
    onCleanup(() => form.removeEventListener("reset", onReset));
  });

  return (
    <input
      {...props}
      onChange={(event) => {
        callEventHandler(props.onChange, event);
        if (event.defaultPrevented || item.disabled() || group.readOnly()) return;
        if (event.currentTarget.checked) group.selectValue(item.value, { reason: "item" });
      }}
      ref={(element) => {
        input = element;
        if (typeof props.ref === "function") props.ref(element);
      }}
      checked={item.checked()}
      disabled={item.disabled()}
      form={props.form ?? group.form()}
      id={item.inputId}
      name={group.name()}
      required={group.required()}
      type="radio"
      value={item.value}
      data-checked={dataBoolean(item.checked())}
      data-disabled={dataBoolean(item.disabled())}
      data-dir={group.dir()}
      data-invalid={dataBoolean(group.invalid())}
      data-orientation={group.orientation()}
      data-readonly={dataBoolean(group.readOnly())}
      data-required={dataBoolean(group.required())}
      data-state={getCheckedState(item.checked())}
      {...partDataAttributes("radio-group", "hidden-input")}
    />
  );
}

function getTabIndex(group: RadioGroupApi, itemValue: string, disabled: boolean) {
  if (disabled) return undefined;
  if (group.value() === itemValue) return 0;
  if (group.value() !== undefined) return -1;
  const firstEnabled = group.items().find((item) => !item.disabled());
  return firstEnabled?.value === itemValue ? 0 : -1;
}

function moveRadioFocus(event: KeyboardEvent, group: RadioGroupApi) {
  const horizontal = group.orientation() === "horizontal";
  const nextKey = horizontal ? (group.dir() === "rtl" ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
  const previousKey = horizontal ? (group.dir() === "rtl" ? "ArrowRight" : "ArrowLeft") : "ArrowUp";

  if (![nextKey, previousKey, "Home", "End"].includes(event.key)) return;
  if (group.readOnly() || group.disabled()) return;

  const items = group.items().filter((item) => !item.disabled());
  const currentIndex = items.findIndex((item) => item.element === event.currentTarget);
  if (currentIndex < 0) return;

  event.preventDefault();

  const lastIndex = items.length - 1;
  let nextIndex = currentIndex;

  if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = lastIndex;
  else if (event.key === nextKey) nextIndex = currentIndex + 1;
  else if (event.key === previousKey) nextIndex = currentIndex - 1;

  if (nextIndex > lastIndex) nextIndex = group.loopFocus() ? 0 : lastIndex;
  if (nextIndex < 0) nextIndex = group.loopFocus() ? lastIndex : 0;

  const nextItem = items[nextIndex];
  nextItem?.element.focus();
  if (nextItem) group.selectValue(nextItem.value, { reason: "keyboard" });
}

export const RadioGroup = {
  Root,
  Item,
  ItemIndicator,
  HiddenInput,
};
