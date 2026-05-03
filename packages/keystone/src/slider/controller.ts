import { createMemo, untrack, type Accessor, type JSX } from "solid-js";
import {
  callEventHandler,
  createControllableSignal,
  dataBoolean,
  partDataAttributes,
} from "../utils/index";

export type SliderOrientation = "horizontal" | "vertical";

export type SliderValueChangeReason = "keyboard" | "pointer" | "track" | "programmatic";

export type SliderValueChangeDetail = {
  event?: Event;
  reason: SliderValueChangeReason;
  thumbIndex?: number;
};

export type SliderControllerOptions = {
  defaultValue?: readonly number[];
  disabled?: Accessor<boolean | undefined>;
  max?: Accessor<number | undefined>;
  min?: Accessor<number | undefined>;
  onValueChange?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
  onValueCommit?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
  orientation?: Accessor<SliderOrientation | undefined>;
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

export type SliderApi = {
  disabled: Accessor<boolean>;
  getPercent: (value: number) => number;
  getRangeProps: (props: SliderRangeContractProps) => Record<string, unknown>;
  getRootProps: (props: SliderRootContractProps) => Record<string, unknown>;
  getThumbProps: (props: SliderThumbContractProps) => Record<string, unknown>;
  getTrackProps: (props: SliderTrackContractProps) => Record<string, unknown>;
  max: Accessor<number>;
  min: Accessor<number>;
  orientation: Accessor<SliderOrientation>;
  step: Accessor<number>;
  value: Accessor<readonly number[]>;
};

export function createSliderController(options: SliderControllerOptions = {}): SliderApi {
  const min = createMemo(() => options.min?.() ?? 0);
  const max = createMemo(() => Math.max(options.max?.() ?? 100, min()));
  const step = createMemo(() => Math.max(options.step?.() ?? 1, Number.EPSILON));
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const orientation = createMemo(() => options.orientation?.() ?? "horizontal");
  let pendingDetail: SliderValueChangeDetail | undefined;
  let trackElement: HTMLDivElement | undefined;
  let activeThumbIndex: number | undefined;
  const [value, setValueState] = createControllableSignal<readonly number[]>({
    value: options.value,
    defaultValue: () => normalizeValues(options.defaultValue ?? [min()], min(), max(), step()),
    onChange: (nextValue) => {
      options.onValueChange?.(nextValue, pendingDetail ?? { reason: "programmatic" });
    },
  });
  const normalizedValue = createMemo(() => normalizeValues(value(), min(), max(), step()));
  const getPercent = (currentValue: number) => {
    if (max() === min()) return 0;
    return ((snapValue(currentValue, min(), max(), step()) - min()) / (max() - min())) * 100;
  };

  const setThumbValue = (
    thumbIndex: number,
    nextValue: number,
    detail: SliderValueChangeDetail,
  ) => {
    if (disabled() && detail.reason !== "programmatic") return normalizedValue();

    pendingDetail = { ...detail, thumbIndex };
    const nextValues = setValueState((currentValue) => {
      const values = normalizeValues(currentValue, min(), max(), step());
      values[thumbIndex] = snapValue(nextValue, min(), max(), step());
      return values.slice().sort((a, b) => a - b);
    });
    pendingDetail = undefined;
    return nextValues;
  };

  const commitValue = (detail: SliderValueChangeDetail) => {
    options.onValueCommit?.(normalizedValue(), detail);
  };

  const setValueFromPoint = (event: PointerEvent, reason: "pointer" | "track") => {
    if (!trackElement) return;

    const valueFromPoint = getValueFromPointer(event, trackElement, min(), max(), orientation());
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
    if (disabled()) return;

    activeThumbIndex = thumbIndex;
    setValueFromPoint(event, thumbIndex === undefined ? "track" : "pointer");
    document.addEventListener("pointermove", moveDragging);
    document.addEventListener("pointerup", stopDragging);
  };

  return {
    disabled,
    getPercent,
    getRangeProps: (props) => ({
      ...props,
      ...partDataAttributes("slider", "range"),
      get "data-disabled"() {
        return dataBoolean(disabled());
      },
      get "data-orientation"() {
        return orientation();
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
      get "data-orientation"() {
        return orientation();
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
        get "aria-orientation"() {
          return orientation();
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
        get "data-orientation"() {
          return orientation();
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

          const delta = getKeyboardDelta(event.key, step(), max() - min());
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
      get "data-orientation"() {
        return orientation();
      },
      onPointerDown: (event: PointerEvent) => {
        callEventHandler(props.onPointerDown, event);
        if (event.defaultPrevented) return;

        event.preventDefault();
        startDragging(event);
      },
    }),
    max,
    min,
    orientation,
    step,
    value: normalizedValue,
  };
}

function getKeyboardDelta(key: string, step: number, range: number) {
  if (key === "ArrowRight" || key === "ArrowUp") return step;
  if (key === "ArrowLeft" || key === "ArrowDown") return -step;
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
) {
  const rect = element.getBoundingClientRect();
  const rawPercent =
    orientation === "vertical"
      ? (rect.bottom - event.clientY) / rect.height
      : (event.clientX - rect.left) / rect.width;
  const percent = Math.min(Math.max(rawPercent, 0), 1);

  return min + percent * (max - min);
}

function normalizeValues(
  values: readonly number[],
  min: number,
  max: number,
  step: number,
): number[] {
  const nextValues = values.length > 0 ? values : [min];
  return nextValues.map((value) => snapValue(value, min, max, step)).sort((a, b) => a - b);
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
