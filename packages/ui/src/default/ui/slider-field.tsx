import { For } from "solid-js";
import {
  Slider,
  SliderHiddenInput,
  SliderThumb,
  SliderTrack,
  type SliderHiddenInputProps,
  type SliderProps,
  type SliderThumbProps,
  type SliderTrackProps,
} from "@/components/ui/slider";
import { TanStackField, type TanStackFieldProps } from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type SliderFieldValidatorContext = {
  value: readonly number[];
};

export type SliderFieldValidators = {
  onChange?: (context: SliderFieldValidatorContext) => unknown;
  onBlur?: (context: SliderFieldValidatorContext) => unknown;
  onSubmit?: (context: SliderFieldValidatorContext) => unknown;
};

type SliderFieldRootProps = Omit<
  SliderProps,
  | "children"
  | "defaultValue"
  | "disabled"
  | "form"
  | "invalid"
  | "name"
  | "readOnly"
  | "required"
  | "value"
>;

export type SliderFieldProps = Omit<
  TanStackFieldProps<readonly number[], HTMLDivElement>,
  "children" | "validators"
> & {
  validators?: SliderFieldValidators;
  sliderProps?: SliderFieldRootProps;
  trackProps?: Omit<SliderTrackProps, "children" | "class">;
  thumbProps?: Omit<SliderThumbProps, "class" | "index">;
  hiddenInputProps?: Omit<SliderHiddenInputProps, "index">;
  sliderClass?: string;
  trackClass?: string;
  thumbClass?: string;
};

export function SliderField(props: SliderFieldProps) {
  return (
    <TanStackField<readonly number[], HTMLDivElement>
      class={cn("ui-slider-field", props.class)}
      description={props.description}
      descriptionClass={props.descriptionClass}
      disabled={props.disabled}
      error={props.error}
      errorClass={props.errorClass}
      form={props.form}
      formId={props.formId}
      id={props.id}
      invalid={props.invalid}
      label={props.label}
      labelClass={props.labelClass}
      name={props.name}
      readOnly={props.readOnly}
      required={props.required}
      validators={props.validators}
    >
      {(context) => {
        const value = () => (Array.isArray(context.value()) ? context.value() : [0]);

        return (
          <Slider
            {...props.sliderProps}
            aria-describedby={[
              props.description ? context.descriptionId() : undefined,
              context.invalid() && context.firstError() ? context.errorId() : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={context.invalid() || undefined}
            aria-labelledby={props.label ? context.labelId() : undefined}
            data-scope="ui-slider-field"
            data-part="slider"
            data-slot="slider-field-control"
            disabled={props.disabled}
            form={props.formId}
            id={context.controlId()}
            invalid={context.invalid()}
            name={context.field().name}
            readOnly={props.readOnly}
            required={props.required}
            value={value()}
            onBlur={() => {
              context.setFocused(false);
              context.field().handleBlur();
            }}
            onFocus={() => context.setFocused(true)}
            onValueChange={(next, detail) => {
              props.sliderProps?.onValueChange?.(next, detail);
              context.field().handleChange(next);
            }}
            onValueCommit={(next, detail) => {
              props.sliderProps?.onValueCommit?.(next, detail);
              context.field().handleBlur();
            }}
            class={cn("ui-slider-field-control", props.sliderProps?.class, props.sliderClass)}
          >
            <SliderTrack
              {...props.trackProps}
              data-scope="ui-slider-field"
              data-part="track"
              data-slot="slider-field-track"
              class={cn("ui-slider-field-track", props.trackClass)}
            />
            <For each={value()}>
              {(_, index) => (
                <>
                  <SliderThumb
                    {...props.thumbProps}
                    index={index()}
                    data-scope="ui-slider-field"
                    data-part="thumb"
                    data-slot="slider-field-thumb"
                    class={cn("ui-slider-field-thumb", props.thumbClass)}
                  />
                  <SliderHiddenInput {...props.hiddenInputProps} index={index()} />
                </>
              )}
            </For>
          </Slider>
        );
      }}
    </TanStackField>
  );
}
