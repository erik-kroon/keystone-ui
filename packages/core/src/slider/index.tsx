import { createContext, onCleanup, onMount, splitProps, useContext, type JSX } from "solid-js";
import { useDirection, type Direction as CoreDirection } from "../i18n/direction";
import {
  createSliderController,
  type SliderApi,
  type SliderHiddenInputContractProps,
  type SliderOrientation,
  type SliderRangeContractProps,
  type SliderRootContractProps,
  type SliderThumbContractProps,
  type SliderTrackContractProps,
  type SliderValueChangeDetail,
} from "./controller";

export type {
  SliderApi,
  SliderOrientation,
  SliderValueChangeDetail,
  SliderValueChangeReason,
} from "./controller";

export type CreateSliderOptions = Parameters<typeof createSliderController>[0];
export type SliderDirection = CoreDirection;

export type SliderPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  "data-part"?: string;
  "data-scope"?: string;
  "data-slot"?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type SliderRootProps = SliderPartProps<HTMLDivElement> &
  SliderRootContractProps & {
    defaultValue?: readonly number[];
    dir?: SliderDirection;
    disabled?: boolean;
    form?: string;
    invalid?: boolean;
    max?: number;
    minStepsBetweenThumbs?: number;
    min?: number;
    name?: string;
    onValueChange?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
    onValueCommit?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
    orientation?: SliderOrientation;
    readOnly?: boolean;
    required?: boolean;
    step?: number;
    value?: readonly number[];
  };

export type SliderTrackProps = SliderPartProps<HTMLDivElement> & SliderTrackContractProps;
export type SliderRangeProps = SliderPartProps<HTMLDivElement> & SliderRangeContractProps;
export type SliderThumbProps = SliderPartProps<HTMLButtonElement> &
  Omit<SliderThumbContractProps, "index"> & {
    index?: number;
  };
export type SliderHiddenInputProps = SliderPartProps<HTMLInputElement> &
  Omit<SliderHiddenInputContractProps, "index"> & {
    index?: number;
  };

const SliderContext = createContext<SliderApi>();

export function createSlider(options: CreateSliderOptions = {}): SliderApi {
  return createSliderController(options);
}

function useSlider(part: string) {
  const slider = useContext(SliderContext);

  if (!slider) {
    throw new Error(`Slider.${part} must be used within Slider.Root`);
  }

  return slider;
}

function Root(props: SliderRootProps) {
  const inheritedDir = useDirection();
  const [local, others] = splitProps(props, [
    "children",
    "defaultValue",
    "dir",
    "disabled",
    "form",
    "invalid",
    "max",
    "minStepsBetweenThumbs",
    "min",
    "name",
    "onValueChange",
    "onValueCommit",
    "orientation",
    "readOnly",
    "required",
    "step",
    "value",
  ]);
  const slider = createSlider({
    defaultValue: local.defaultValue,
    dir: () => local.dir ?? inheritedDir(),
    disabled: () => local.disabled,
    form: () => local.form,
    invalid: () => local.invalid,
    max: () => local.max,
    minStepsBetweenThumbs: () => local.minStepsBetweenThumbs,
    min: () => local.min,
    name: () => local.name,
    onValueChange: local.onValueChange,
    onValueCommit: local.onValueCommit,
    orientation: () => local.orientation,
    readOnly: () => local.readOnly,
    required: () => local.required,
    step: () => local.step,
    value: () => local.value,
  });
  const rootProps = slider.getRootProps(others);

  return (
    <SliderContext.Provider value={slider}>
      <div {...rootProps}>{local.children}</div>
    </SliderContext.Provider>
  );
}

function Track(props: SliderTrackProps) {
  const slider = useSlider("Track");
  const [local, others] = splitProps(props, ["children"]);
  const trackProps = slider.getTrackProps(others);

  return <div {...trackProps}>{local.children}</div>;
}

function Range(props: SliderRangeProps) {
  const slider = useSlider("Range");
  const [local, others] = splitProps(props, ["children"]);
  const rangeProps = slider.getRangeProps(others);

  return <div {...rangeProps}>{local.children}</div>;
}

function Thumb(props: SliderThumbProps) {
  const slider = useSlider("Thumb");
  const [local, others] = splitProps(props, ["children", "index"]);
  const index = () => local.index ?? 0;
  const thumbProps = slider.getThumbProps({ ...others, index: index() });

  return (
    <button {...thumbProps} data-active={slider.activeThumbIndex() === index() ? "" : undefined}>
      {local.children}
    </button>
  );
}

function HiddenInput(props: SliderHiddenInputProps) {
  const slider = useSlider("HiddenInput");
  const [local, others] = splitProps(props, ["index"]);
  let input: HTMLInputElement | undefined;

  onMount(() => {
    const form = input?.form;
    if (!form) return;

    const onReset = () => slider.reset();
    form.addEventListener("reset", onReset);
    onCleanup(() => form.removeEventListener("reset", onReset));
  });

  const inputProps = slider.getHiddenInputProps({
    ...others,
    index: local.index ?? 0,
    ref: (element) => {
      input = element;
      if (typeof others.ref === "function") others.ref(element);
    },
  });

  return <input {...inputProps} />;
}

export const Slider = {
  Root,
  Track,
  Range,
  Thumb,
  HiddenInput,
};
