import { createEffect, createMemo, createSignal, type Accessor, type JSX } from "solid-js";
import {
  callEventHandler,
  createControllableSignal,
  dataBoolean,
  partDataAttributes,
} from "../utils/index";

export type SpinButtonValueChangeReason =
  | "keyboard"
  | "input"
  | "blur"
  | "increment"
  | "decrement"
  | "programmatic";

export type SpinButtonValueChangeDetail = {
  event?: Event;
  reason: SpinButtonValueChangeReason;
};

export type SpinButtonControllerOptions = {
  defaultValue?: number;
  disabled?: Accessor<boolean | undefined>;
  format?: (value: number) => string;
  form?: Accessor<string | undefined>;
  getValueText?: (value: number) => string;
  id?: Accessor<string | undefined>;
  invalid?: Accessor<boolean | undefined>;
  largeStep?: Accessor<number | undefined>;
  max?: Accessor<number | undefined>;
  min?: Accessor<number | undefined>;
  name?: Accessor<string | undefined>;
  onValueChange?: (value: number | undefined, detail: SpinButtonValueChangeDetail) => void;
  parse?: (value: string) => number | undefined;
  readOnly?: Accessor<boolean | undefined>;
  required?: Accessor<boolean | undefined>;
  step?: Accessor<number | undefined>;
  value?: Accessor<number | undefined>;
};

export type SpinButtonRootContractProps = Omit<
  JSX.HTMLAttributes<HTMLSpanElement>,
  "children" | "ref"
> & {
  ref?: HTMLSpanElement | ((element: HTMLSpanElement) => void);
};

export type SpinButtonInputContractProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "children" | "disabled" | "form" | "name" | "readOnly" | "ref" | "required" | "type" | "value"
> & {
  ref?: HTMLInputElement | ((element: HTMLInputElement) => void);
};

export type SpinButtonTriggerContractProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "ref"
> & {
  ref?: HTMLButtonElement | ((element: HTMLButtonElement) => void);
};

export type SpinButtonApi = {
  atMax: Accessor<boolean>;
  atMin: Accessor<boolean>;
  commitInputValue: (detail: SpinButtonValueChangeDetail) => number | undefined;
  decrement: (detail: SpinButtonValueChangeDetail) => number | undefined;
  disabled: Accessor<boolean>;
  form: Accessor<string | undefined>;
  getDecrementTriggerProps: (
    props: SpinButtonTriggerContractProps,
    part?: string,
  ) => Record<string, unknown>;
  getIncrementTriggerProps: (
    props: SpinButtonTriggerContractProps,
    part?: string,
  ) => Record<string, unknown>;
  getInputProps: (props: SpinButtonInputContractProps, part?: string) => Record<string, unknown>;
  getRootProps: (props: SpinButtonRootContractProps, part?: string) => Record<string, unknown>;
  increment: (detail: SpinButtonValueChangeDetail) => number | undefined;
  inputValue: Accessor<string>;
  invalid: Accessor<boolean>;
  max: Accessor<number | undefined>;
  min: Accessor<number | undefined>;
  name: Accessor<string | undefined>;
  readOnly: Accessor<boolean>;
  required: Accessor<boolean>;
  reset: () => number | undefined;
  setValue: (value: number | undefined, detail: SpinButtonValueChangeDetail) => number | undefined;
  step: Accessor<number>;
  value: Accessor<number | undefined>;
};

export function createSpinButtonController(
  options: SpinButtonControllerOptions = {},
): SpinButtonApi {
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const form = createMemo(() => options.form?.());
  const invalid = createMemo(() => options.invalid?.() ?? false);
  const max = createMemo(() => options.max?.());
  const min = createMemo(() => options.min?.());
  const name = createMemo(() => options.name?.());
  const readOnly = createMemo(() => options.readOnly?.() ?? false);
  const required = createMemo(() => options.required?.() ?? false);
  const step = createMemo(() => Math.max(options.step?.() ?? 1, Number.EPSILON));
  const largeStep = createMemo(() => Math.max(options.largeStep?.() ?? step() * 10, step()));
  const parse = (value: string) => options.parse?.(value) ?? defaultParse(value);
  const format = (value: number) => options.format?.(value) ?? defaultFormat(value);
  const [inputValue, setInputValue] = createSignal("");
  const [value, setValueState] = createControllableSignal<
    number | undefined,
    SpinButtonValueChangeDetail
  >({
    value: options.value,
    defaultValue: () => normalizeValue(options.defaultValue, min(), max(), step()),
    defaultDetail: { reason: "programmatic" },
    onChange: (nextValue, detail) => options.onValueChange?.(nextValue, detail),
  });
  const normalizedValue = createMemo(() => normalizeValue(value(), min(), max(), step()));
  const atMin = createMemo(() => {
    const currentValue = normalizedValue();
    const minValue = min();
    return currentValue !== undefined && minValue !== undefined && currentValue <= minValue;
  });
  const atMax = createMemo(() => {
    const currentValue = normalizedValue();
    const maxValue = max();
    return currentValue !== undefined && maxValue !== undefined && currentValue >= maxValue;
  });

  const syncInputValue = (nextValue: number | undefined) => {
    setInputValue(nextValue === undefined ? "" : format(nextValue));
  };

  createEffect(() => {
    syncInputValue(normalizedValue());
  });

  const setValue = (
    nextValue: number | undefined,
    detail: SpinButtonValueChangeDetail,
  ): number | undefined => {
    if ((disabled() || readOnly()) && detail.reason !== "programmatic") return normalizedValue();

    const normalized = normalizeValue(nextValue, min(), max(), step());
    const committed = setValueState(() => normalized, detail);
    syncInputValue(committed);
    return committed;
  };

  const incrementBy = (delta: number, detail: SpinButtonValueChangeDetail) => {
    const currentValue = normalizedValue() ?? min() ?? 0;
    return setValue(currentValue + delta, detail);
  };

  const commitInputValue = (detail: SpinButtonValueChangeDetail) => {
    const parsedValue = parse(inputValue());
    return setValue(parsedValue, detail);
  };

  const triggerProps = (
    props: SpinButtonTriggerContractProps,
    part: string,
    action: "increment" | "decrement",
  ) => ({
    ...props,
    type: props.type ?? "button",
    ...partDataAttributes("spin-button", part),
    get "aria-controls"() {
      return options.id?.();
    },
    get disabled() {
      return (
        props.disabled ?? (disabled() || readOnly() || (action === "increment" ? atMax() : atMin()))
      );
    },
    get "data-disabled"() {
      return dataBoolean(disabled());
    },
    get "data-invalid"() {
      return dataBoolean(invalid());
    },
    get "data-readonly"() {
      return dataBoolean(readOnly());
    },
    get "data-required"() {
      return dataBoolean(required());
    },
    get "data-at-min"() {
      return dataBoolean(atMin());
    },
    get "data-at-max"() {
      return dataBoolean(atMax());
    },
    onClick: (event: MouseEvent) => {
      callEventHandler(props.onClick, event);
      if (event.defaultPrevented) return;
      if (disabled() || readOnly()) return;
      if (action === "increment" && atMax()) return;
      if (action === "decrement" && atMin()) return;

      incrementBy(action === "increment" ? step() : -step(), { event, reason: action });
    },
    onPointerDown: (event: PointerEvent) => {
      callEventHandler(props.onPointerDown, event);
      if (event.defaultPrevented) return;
      if (disabled() || readOnly()) return;
      event.preventDefault();
    },
  });

  return {
    atMax,
    atMin,
    commitInputValue,
    decrement: (detail) => incrementBy(-step(), detail),
    disabled,
    form,
    getDecrementTriggerProps: (props, part = "decrement-trigger") =>
      triggerProps(props, part, "decrement"),
    getIncrementTriggerProps: (props, part = "increment-trigger") =>
      triggerProps(props, part, "increment"),
    getInputProps: (props, part = "input") => ({
      ...props,
      role: "spinbutton",
      type: "text",
      inputMode: props.inputMode ?? "decimal",
      ...partDataAttributes("spin-button", part),
      get "aria-disabled"() {
        return disabled() ? "true" : undefined;
      },
      get "aria-invalid"() {
        return invalid() ? "true" : undefined;
      },
      get "aria-readonly"() {
        return readOnly() ? "true" : undefined;
      },
      get "aria-required"() {
        return required() ? "true" : undefined;
      },
      get "aria-valuemax"() {
        return max();
      },
      get "aria-valuemin"() {
        return min();
      },
      get "aria-valuenow"() {
        return normalizedValue();
      },
      get "aria-valuetext"() {
        const currentValue = normalizedValue();
        return currentValue === undefined ? undefined : options.getValueText?.(currentValue);
      },
      get disabled() {
        return disabled();
      },
      get form() {
        return form();
      },
      get id() {
        return props.id ?? options.id?.();
      },
      get name() {
        return name();
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
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      get "data-invalid"() {
        return dataBoolean(invalid());
      },
      get "data-readonly"() {
        return dataBoolean(readOnly());
      },
      get "data-required"() {
        return dataBoolean(required());
      },
      get "data-at-min"() {
        return dataBoolean(atMin());
      },
      get "data-at-max"() {
        return dataBoolean(atMax());
      },
      onBlur: (event: FocusEvent) => {
        callEventHandler(props.onBlur, event);
        if (event.defaultPrevented || disabled() || readOnly()) return;
        commitInputValue({ event, reason: "blur" });
      },
      onInput: (event: InputEvent) => {
        callEventHandler(props.onInput, event);
        if (event.defaultPrevented || disabled() || readOnly()) return;

        const nextInputValue = (event.currentTarget as HTMLInputElement).value;
        setInputValue(nextInputValue);
        const parsedValue = parse(nextInputValue);
        if (parsedValue !== undefined) {
          setValue(parsedValue, { event, reason: "input" });
        }
      },
      onKeyDown: (event: KeyboardEvent) => {
        callEventHandler(props.onKeyDown, event);
        if (event.defaultPrevented) return;
        if (disabled() || readOnly()) return;

        const nextValue = getKeyboardValue(
          event.key,
          normalizedValue(),
          min(),
          max(),
          step(),
          largeStep(),
        );
        if (nextValue === undefined) return;

        event.preventDefault();
        setValue(nextValue, { event, reason: "keyboard" });
      },
    }),
    getRootProps: (props, part = "root") => ({
      ...props,
      ...partDataAttributes("spin-button", part),
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      get "data-invalid"() {
        return dataBoolean(invalid());
      },
      get "data-readonly"() {
        return dataBoolean(readOnly());
      },
      get "data-required"() {
        return dataBoolean(required());
      },
      get "data-at-min"() {
        return dataBoolean(atMin());
      },
      get "data-at-max"() {
        return dataBoolean(atMax());
      },
    }),
    increment: (detail) => incrementBy(step(), detail),
    inputValue,
    invalid,
    max,
    min,
    name,
    readOnly,
    required,
    reset: () => setValue(options.defaultValue, { reason: "programmatic" }),
    setValue,
    step,
    value: normalizedValue,
  };
}

function getKeyboardValue(
  key: string,
  value: number | undefined,
  min: number | undefined,
  max: number | undefined,
  step: number,
  largeStep: number,
) {
  const currentValue = value ?? min ?? 0;

  if (key === "ArrowUp") return currentValue + step;
  if (key === "ArrowDown") return currentValue - step;
  if (key === "PageUp") return currentValue + largeStep;
  if (key === "PageDown") return currentValue - largeStep;
  if (key === "Home") return min;
  if (key === "End") return max;
  return undefined;
}

function normalizeValue(
  value: number | undefined,
  min: number | undefined,
  max: number | undefined,
  step: number,
) {
  if (value === undefined || Number.isNaN(value)) return undefined;

  const minValue = min ?? Number.NEGATIVE_INFINITY;
  const maxValue = max ?? Number.POSITIVE_INFINITY;
  const clamped = Math.min(Math.max(value, minValue), maxValue);
  const base = min ?? 0;
  const snapped = Math.round((clamped - base) / step) * step + base;
  const precision = getDecimalPrecision(step);

  return Number(Math.min(Math.max(snapped, minValue), maxValue).toFixed(precision));
}

function defaultParse(value: string) {
  if (value.trim() === "") return undefined;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function defaultFormat(value: number) {
  return String(value);
}

function getDecimalPrecision(value: number) {
  const decimal = String(value).split(".")[1];
  return decimal?.length ?? 0;
}
