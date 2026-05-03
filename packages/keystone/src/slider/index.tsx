import { createContext, splitProps, useContext, type JSX } from "solid-js";
import {
  createSliderController,
  type SliderApi,
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

export type SliderPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type SliderRootProps = SliderPartProps<HTMLDivElement> &
  SliderRootContractProps & {
    defaultValue?: readonly number[];
    disabled?: boolean;
    max?: number;
    min?: number;
    onValueChange?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
    onValueCommit?: (value: readonly number[], detail: SliderValueChangeDetail) => void;
    orientation?: SliderOrientation;
    step?: number;
    value?: readonly number[];
  };

export type SliderTrackProps = SliderPartProps<HTMLDivElement> & SliderTrackContractProps;
export type SliderRangeProps = SliderPartProps<HTMLDivElement> & SliderRangeContractProps;
export type SliderThumbProps = SliderPartProps<HTMLButtonElement> &
  Omit<SliderThumbContractProps, "index"> & {
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
  const [local, others] = splitProps(props, [
    "children",
    "defaultValue",
    "disabled",
    "max",
    "min",
    "onValueChange",
    "onValueCommit",
    "orientation",
    "step",
    "value",
  ]);
  const slider = createSlider({
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    max: () => local.max,
    min: () => local.min,
    onValueChange: local.onValueChange,
    onValueCommit: local.onValueCommit,
    orientation: () => local.orientation,
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
  const thumbProps = slider.getThumbProps({ ...others, index: local.index ?? 0 });

  return <button {...thumbProps}>{local.children}</button>;
}

export const Slider = {
  Root,
  Track,
  Range,
  Thumb,
};
