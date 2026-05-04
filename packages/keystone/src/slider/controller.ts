import { createMemo, untrack, type Accessor, type JSX } from "solid-js";
import {
  callEventHandler,
  createControllableSignal,
  dataBoolean,
  partDataAttributes,
} from "../utils/index";
import type { Direction } from "../i18n/direction";

export type SliderOrientation = "horizontal" | "vertical";

export type SliderValueChangeReason = "keyboard" | "pointer" | "track" | "programmatic";

export type SliderValueChangeDetail = {
  event?: Event;
  reason: SliderValueChangeReason;
  thumbIndex?: number;
};

export type SliderControllerOptions = {
  defaultValue?: readonly number[];
  dir?: Accessor<Direction | undefined>;
  disabled?: Accessor<boolean | undefined>;
  form?: Accessor<string | undefined>;
  invalid?: Accessor<boolean | undefined>;
  max?: Accessor<number | undefined>;
  minStepsBetweenThumbs?: Accessor<number | undefined>;
  min?: Accessor<number | undefined>;
  name?: Accessor<string | undefined>;
  onValueChange?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
  onValueCommit?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
  orientation?: Accessor<SliderOrientation | undefined>;
  readOnly?: Accessor<boolean | undefined>;
  required?: Accessor<boolean | undefined>;
  step?: Accessor<number | undefined>;
  value?: Accessor<readonly number[] | undefined>;
};

export type SliderRootContractProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "ref"
> & {
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

export type SliderTrackContractProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "ref"
> & {
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

export type SliderRangeContractProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "ref"
> & {
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

export type SliderThumbContractProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "ref"
> & {
  index: number;
  ref?: HTMLButtonElement | ((element: HTMLButtonElement) => void);
};

export type SliderHiddenInputContractProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "children" | "checked" | "ref" | "type" | "value"
> & {
  index: number;
  ref?: HTMLInputElement | ((element: HTMLInputElement) => void);
};

export type SliderApi = {
  dir: Accessor<Direction>;
  disabled: Accessor<boolean>;
  form: Accessor<string | undefined>;
  getHiddenInputProps: (props: SliderHiddenInputContractProps) => Record<string, unknown>;
  getPercent: (value: number) => number;
  getRangeProps: (props: SliderRangeContractProps) => Record<string, unknown>;
  getRootProps: (props: SliderRootContractProps) => Record<string, unknown>;
  getThumbProps: (props: SliderThumbContractProps) => Record<string, unknown>;
  getTrackProps: (props: SliderTrackContractProps) => Record<string, unknown>;
  invalid: Accessor<boolean>;
  max: Accessor<number>;
  min: Accessor<number>;
  minStepsBetweenThumbs: Accessor<number>;
  name: Accessor<string | undefined>;
  orientation: Accessor<SliderOrientation>;
  readOnly: Accessor<boolean>;
  required: Accessor<boolean>;
  reset: () => readonly number[];
  step: Accessor<number>;
  setValueAtIndex: (
    thumbIndex: number,
    nextValue: number,
    detail: SliderValueChangeDetail,
  ) => readonly number[];
  value: Accessor<readonly number[]>;
};

export function createSliderController(options: SliderControllerOptions = {}): SliderApi {
  const min = createMemo(() => options.min?.() ?? 0);
  const max = createMemo(() => Math.max(options.max?.() ?? 100, min()));
  const step = createMemo(() => Math.max(options.step?.() ?? 1, Number.EPSILON));
  const minStepsBetweenThumbs = createMemo(() =>
    Math.max(options.minStepsBetweenThumbs?.() ?? 0, 0),
  );
  const dir = createMemo((): Direction => (options.dir?.() === "rtl" ? "rtl" : "ltr"));
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const form = createMemo(() => options.form?.());
  const invalid = createMemo(() => options.invalid?.() ?? false);
  const name = createMemo(() => options.name?.());
  const orientation = createMemo(() => options.orientation?.() ?? "horizontal");
  const readOnly = createMemo(() => options.readOnly?.() ?? false);
  const required = createMemo(() => options.required?.() ?? false);
  let trackElement: HTMLDivElement | undefined;
  let activeThumbIndex: number | undefined;
  const [value, setValueState] = createControllableSignal<
    readonly number[],
    SliderValueChangeDetail
  >({
    value: options.value,
    defaultValue: () =>
      normalizeValues(
        options.defaultValue ?? [min()],
        min(),
        max(),
        step(),
        minStepsBetweenThumbs(),
      ),
    defaultDetail: { reason: "programmatic" },
    onChange: (nextValue, detail) => options.onValueChange?.(nextValue, detail),
  });
  const normalizedValue = createMemo(() =>
    normalizeValues(value(), min(), max(), step(), minStepsBetweenThumbs()),
  );
  const getPercent = (currentValue: number) => {
    if (max() === min()) return 0;
    return ((snapValue(currentValue, min(), max(), step()) - min()) / (max() - min())) * 100;
  };

  const setThumbValue = (
    thumbIndex: number,
    nextValue: number,
    detail: SliderValueChangeDetail,
  ) => {
    if ((disabled() || readOnly()) && detail.reason !== "programmatic") return normalizedValue();

    const nextValues = setValueState(
      (currentValue) => {
        const values = normalizeValues(currentValue, min(), max(), step(), minStepsBetweenThumbs());
        values[thumbIndex] = snapValue(nextValue, min(), max(), step());
        return constrainThumbSpacing(values, min(), max(), step(), minStepsBetweenThumbs()).sort(
          (a, b) => a - b,
        );
      },
      { ...detail, thumbIndex },
    );
    return nextValues;
  };

  const commitValue = (detail: SliderValueChangeDetail) => {
    options.onValueCommit?.(normalizedValue(), detail);
  };

  const setValueFromPoint = (event: PointerEvent, reason: "pointer" | "track") => {
    if (!trackElement) return;

    const valueFromPoint = getValueFromPointer(
      event,
      trackElement,
      min(),
      max(),
      orientation(),
      dir(),
    );
    const thumbIndex = activeThumbIndex ?? getClosestThumbIndex(normalizedValue(), valueFromPoint);
    activeThumbIndex = thumbIndex;
    setThumbValue(thumbIndex, valueFromPoint, { event, reason });
  };

  const stopDragging = (event: PointerEvent) => {
    if (activeThumbIndex === undefined) return;

    const thumbIndex = activeThumbIndex;
    activeThumbIndex = undefined;
    document.removeEventListener("pointermove", moveDragging);
    document.removeEventListener("pointerup", stopDragging);
    commitValue({ event, reason: "pointer", thumbIndex });
  };

  const moveDragging = (event: PointerEvent) => {
    event.preventDefault();
    setValueFromPoint(event, "pointer");
  };

  const startDragging = (event: PointerEvent, thumbIndex?: number) => {
    if (disabled() || readOnly()) return;

    activeThumbIndex = thumbIndex;
    setValueFromPoint(event, thumbIndex === undefined ? "track" : "pointer");
    document.addEventListener("pointermove", moveDragging);
    document.addEventListener("pointerup", stopDragging);
  };

  return {
    dir,
    disabled,
    form,
    getHiddenInputProps: (props) => {
      const { index, ...inputProps } = props;

      return {
        ...inputProps,
        type: "hidden",
        ...partDataAttributes("slider", "hidden-input"),
        get disabled() {
          return inputProps.disabled ?? disabled();
        },
        get form() {
          return inputProps.form ?? form();
        },
        get name() {
          return inputProps.name ?? name();
        },
        get required() {
          return inputProps.required ?? required();
        },
        get value() {
          return String(normalizedValue()[index] ?? min());
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
        get "data-orientation"() {
          return orientation();
        },
        get "data-dir"() {
          return dir();
        },
        get "data-index"() {
          return String(index);
        },
        onChange: (event: Event) => {
          callEventHandler(inputProps.onChange, event);
          if (event.defaultPrevented || disabled() || readOnly()) return;
          setThumbValue(index, Number((event.currentTarget as HTMLInputElement).value), {
            event,
            reason: "programmatic",
            thumbIndex: index,
          });
        },
        onInput: (event: InputEvent) => {
          callEventHandler(inputProps.onInput, event);
          if (event.defaultPrevented || disabled() || readOnly()) return;
          setThumbValue(index, Number((event.currentTarget as HTMLInputElement).value), {
            event,
            reason: "programmatic",
            thumbIndex: index,
          });
        },
      };
    },
    getPercent,
    getRangeProps: (props) => ({
      ...props,
      ...partDataAttributes("slider", "range"),
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      get "data-invalid"() {
        return dataBoolean(invalid());
      },
      get "data-orientation"() {
        return orientation();
      },
      get "data-dir"() {
        return dir();
      },
      get "data-readonly"() {
        return dataBoolean(readOnly());
      },
      get "data-required"() {
        return dataBoolean(required());
      },
      get style() {
        const values = normalizedValue();
        const start = values[0] ?? min();
        const end = values.at(-1) ?? start;
        const css = {
          ...(typeof props.style === "object" ? props.style : {}),
          "--keystone-slider-range-start": `${untrack(() => getPercent(start))}%`,
          "--keystone-slider-range-end": `${untrack(() => getPercent(end))}%`,
        };

        return typeof props.style === "string" ? props.style : css;
      },
    }),
    getRootProps: (props) => ({
      ...props,
      ...partDataAttributes("slider", "root"),
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      get "data-invalid"() {
        return dataBoolean(invalid());
      },
      get "data-orientation"() {
        return orientation();
      },
      get "data-dir"() {
        return dir();
      },
      get "data-readonly"() {
        return dataBoolean(readOnly());
      },
      get "data-required"() {
        return dataBoolean(required());
      },
    }),
    getThumbProps: (props) => {
      const { index, ...thumbProps } = props;

      return {
        ...thumbProps,
        type: thumbProps.type ?? "button",
        role: "slider",
        ...partDataAttributes("slider", "thumb"),
        get "aria-disabled"() {
          return disabled() ? "true" : undefined;
        },
        get "aria-invalid"() {
          return invalid() ? "true" : undefined;
        },
        get "aria-orientation"() {
          return orientation();
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
          return normalizedValue()[index] ?? min();
        },
        get disabled() {
          return thumbProps.disabled ?? disabled();
        },
        get "data-disabled"() {
          return dataBoolean(disabled());
        },
        get "data-invalid"() {
          return dataBoolean(invalid());
        },
        get "data-orientation"() {
          return orientation();
        },
        get "data-dir"() {
          return dir();
        },
        get "data-readonly"() {
          return dataBoolean(readOnly());
        },
        get "data-required"() {
          return dataBoolean(required());
        },
        get "data-index"() {
          return String(index);
        },
        get style() {
          const css = {
            ...(typeof thumbProps.style === "object" ? thumbProps.style : {}),
            "--keystone-slider-thumb-percent": `${untrack(() =>
              getPercent(normalizedValue()[index] ?? min()),
            )}%`,
          };

          return typeof thumbProps.style === "string" ? thumbProps.style : css;
        },
        onKeyDown: (event: KeyboardEvent) => {
          callEventHandler(thumbProps.onKeyDown, event);
          if (event.defaultPrevented) return;
          if (disabled() || readOnly()) return;

          const delta = getKeyboardDelta(event.key, step(), max() - min(), orientation(), dir());
          if (delta === undefined) return;

          event.preventDefault();
          const currentValue = normalizedValue()[index] ?? min();
          const nextValue =
            event.key === "Home" ? min() : event.key === "End" ? max() : currentValue + delta;
          setThumbValue(index, nextValue, { event, reason: "keyboard" });
          commitValue({ event, reason: "keyboard", thumbIndex: index });
        },
        onPointerDown: (event: PointerEvent) => {
          callEventHandler(thumbProps.onPointerDown, event);
          if (event.defaultPrevented) return;
          if (disabled() || readOnly()) return;

          event.preventDefault();
          startDragging(event, index);
        },
      };
    },
    getTrackProps: (props) => ({
      ...props,
      ref: (element: HTMLDivElement) => {
        trackElement = element;
        if (typeof props.ref === "function") props.ref(element);
      },
      ...partDataAttributes("slider", "track"),
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      get "data-invalid"() {
        return dataBoolean(invalid());
      },
      get "data-orientation"() {
        return orientation();
      },
      get "data-dir"() {
        return dir();
      },
      get "data-readonly"() {
        return dataBoolean(readOnly());
      },
      get "data-required"() {
        return dataBoolean(required());
      },
      onPointerDown: (event: PointerEvent) => {
        callEventHandler(props.onPointerDown, event);
        if (event.defaultPrevented) return;
        if (disabled() || readOnly()) return;

        event.preventDefault();
        startDragging(event);
      },
    }),
    invalid,
    max,
    min,
    minStepsBetweenThumbs,
    name,
    orientation,
    readOnly,
    required,
    reset: () =>
      setValueState(
        () =>
          normalizeValues(
            options.defaultValue ?? [min()],
            min(),
            max(),
            step(),
            minStepsBetweenThumbs(),
          ),
        {
          reason: "programmatic",
        },
      ),
    step,
    setValueAtIndex: setThumbValue,
    value: normalizedValue,
  };
}

function getKeyboardDelta(
  key: string,
  step: number,
  range: number,
  orientation: SliderOrientation,
  dir: Direction,
) {
  const forward = orientation === "horizontal" && dir === "rtl" ? "ArrowLeft" : "ArrowRight";
  const backward = orientation === "horizontal" && dir === "rtl" ? "ArrowRight" : "ArrowLeft";

  if (key === forward || key === "ArrowUp") return step;
  if (key === backward || key === "ArrowDown") return -step;
  if (key === "PageUp") return step * 10;
  if (key === "PageDown") return step * -10;
  if (key === "Home" || key === "End") return range;
  return undefined;
}

function getClosestThumbIndex(values: readonly number[], nextValue: number) {
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  values.forEach((value, index) => {
    const distance = Math.abs(value - nextValue);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function getValueFromPointer(
  event: PointerEvent,
  element: HTMLElement,
  min: number,
  max: number,
  orientation: SliderOrientation,
  dir: Direction,
) {
  const rect = element.getBoundingClientRect();
  const rawPercent =
    orientation === "vertical"
      ? (rect.bottom - event.clientY) / rect.height
      : dir === "rtl"
        ? (rect.right - event.clientX) / rect.width
        : (event.clientX - rect.left) / rect.width;
  const percent = Math.min(Math.max(rawPercent, 0), 1);

  return min + percent * (max - min);
}

function normalizeValues(
  values: readonly number[],
  min: number,
  max: number,
  step: number,
  minStepsBetweenThumbs: number,
): number[] {
  const nextValues = values.length > 0 ? values : [min];
  return constrainThumbSpacing(
    nextValues.map((value) => snapValue(value, min, max, step)).sort((a, b) => a - b),
    min,
    max,
    step,
    minStepsBetweenThumbs,
  );
}

function constrainThumbSpacing(
  values: number[],
  min: number,
  max: number,
  step: number,
  minStepsBetweenThumbs: number,
) {
  if (values.length <= 1 || minStepsBetweenThumbs <= 0) return values;

  const minDistance = minStepsBetweenThumbs * step;
  const nextValues = values.map((value) => snapValue(value, min, max, step)).sort((a, b) => a - b);

  for (let index = 1; index < nextValues.length; index += 1) {
    const previousValue = nextValues[index - 1];
    const currentValue = nextValues[index];
    if (
      previousValue !== undefined &&
      currentValue !== undefined &&
      currentValue - previousValue < minDistance
    ) {
      nextValues[index] = snapValue(previousValue + minDistance, min, max, step);
    }
  }

  for (let index = nextValues.length - 2; index >= 0; index -= 1) {
    const nextValue = nextValues[index + 1];
    const currentValue = nextValues[index];
    if (
      nextValue !== undefined &&
      currentValue !== undefined &&
      nextValue - currentValue < minDistance
    ) {
      nextValues[index] = snapValue(nextValue - minDistance, min, max, step);
    }
  }

  return nextValues.map((value) => snapValue(value, min, max, step));
}

function snapValue(value: number, min: number, max: number, step: number) {
  const clamped = Math.min(Math.max(value, min), max);
  const snapped = Math.round((clamped - min) / step) * step + min;
  const precision = getDecimalPrecision(step);

  return Number(Math.min(Math.max(snapped, min), max).toFixed(precision));
}

function getDecimalPrecision(value: number) {
  const decimal = String(value).split(".")[1];
  return decimal?.length ?? 0;
}
