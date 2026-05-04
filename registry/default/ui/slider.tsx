import {
  Slider as CoreSlider,
  type SliderHiddenInputProps as CoreSliderHiddenInputProps,
  type SliderRangeProps as CoreSliderRangeProps,
  type SliderRootProps as CoreSliderRootProps,
  type SliderThumbProps as CoreSliderThumbProps,
  type SliderTrackProps as CoreSliderTrackProps,
} from "@keystone-ui/core/slider";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type SliderProps = CoreSliderRootProps;
export type SliderTrackProps = CoreSliderTrackProps;
export type SliderRangeProps = CoreSliderRangeProps;
export type SliderThumbProps = CoreSliderThumbProps;
export type SliderHiddenInputProps = CoreSliderHiddenInputProps;

export function Slider(props: SliderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreSlider.Root {...rest} class={cn("ui-slider", local.class)} />;
}

export function SliderTrack(props: SliderTrackProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreSlider.Track {...rest} class={cn("ui-slider-track", local.class)}>
      {local.children ?? <SliderRange />}
    </CoreSlider.Track>
  );
}

export function SliderRange(props: SliderRangeProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreSlider.Range {...rest} class={cn("ui-slider-range", local.class)} />;
}

export function SliderThumb(props: SliderThumbProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreSlider.Thumb {...rest} class={cn("ui-slider-thumb", local.class)} />;
}

export function SliderHiddenInput(props: SliderHiddenInputProps) {
  return <CoreSlider.HiddenInput {...props} />;
}
