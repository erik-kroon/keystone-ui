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

  return (
    <CoreSlider.Root
      {...rest}
      data-slot="slider"
      class={cn("ui-slider data-[orientation=horizontal]:w-full", local.class)}
    />
  );
}

export function SliderTrack(props: SliderTrackProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreSlider.Track
      {...rest}
      data-slot="slider-track"
      class={cn(
        "ui-slider-track relative grow select-none before:absolute before:rounded-full before:bg-input data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1 data-[orientation=horizontal]:before:inset-x-0.5 data-[orientation=vertical]:before:inset-x-0 data-[orientation=horizontal]:before:inset-y-0 data-[orientation=vertical]:before:inset-y-0.5",
        local.class,
      )}
    >
      {local.children ?? <SliderRange />}
    </CoreSlider.Track>
  );
}

export function SliderRange(props: SliderRangeProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreSlider.Range
      {...rest}
      data-slot="slider-indicator"
      class={cn(
        "ui-slider-range select-none rounded-full bg-primary data-[orientation=horizontal]:ms-0.5 data-[orientation=vertical]:mb-0.5",
        local.class,
      )}
    />
  );
}

export function SliderThumb(props: SliderThumbProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreSlider.Thumb
      {...rest}
      data-slot="slider-thumb"
      class={cn(
        "ui-slider-thumb block size-5 shrink-0 select-none rounded-full border border-input bg-white not-dark:bg-clip-padding shadow-xs/5 outline-none transition-[box-shadow,scale] before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-[3px] has-focus-visible:ring-ring/24 data-active:scale-120 sm:size-4 dark:border-background dark:has-focus-visible:ring-ring/48 [:has(*:focus-visible),[data-active]]:shadow-none",
        local.class,
      )}
    />
  );
}

export function SliderHiddenInput(props: SliderHiddenInputProps) {
  return <CoreSlider.HiddenInput {...props} />;
}
