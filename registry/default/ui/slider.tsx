import {
  Slider as KeystoneSlider,
  type SliderRangeProps as KeystoneSliderRangeProps,
  type SliderRootProps as KeystoneSliderRootProps,
  type SliderThumbProps as KeystoneSliderThumbProps,
  type SliderTrackProps as KeystoneSliderTrackProps,
} from "@keystone-ui/keystone/slider";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type SliderProps = KeystoneSliderRootProps;
export type SliderTrackProps = KeystoneSliderTrackProps;
export type SliderRangeProps = KeystoneSliderRangeProps;
export type SliderThumbProps = KeystoneSliderThumbProps;

export function Slider(props: SliderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneSlider.Root {...rest} class={cn("mason-slider", local.class)} />;
}

export function SliderTrack(props: SliderTrackProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <KeystoneSlider.Track {...rest} class={cn("mason-slider-track", local.class)}>
      {local.children ?? <SliderRange />}
    </KeystoneSlider.Track>
  );
}

export function SliderRange(props: SliderRangeProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneSlider.Range {...rest} class={cn("mason-slider-range", local.class)} />;
}

export function SliderThumb(props: SliderThumbProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneSlider.Thumb {...rest} class={cn("mason-slider-thumb", local.class)} />;
}
