import { For, type JSX } from "solid-js";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
  type RadioGroupProps,
} from "@/components/ui/radio-group";
import { TanStackField, type TanStackFieldProps } from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type RadioGroupFieldValidatorContext = {
  value: string;
};

export type RadioGroupFieldValidators = {
  onChange?: (context: RadioGroupFieldValidatorContext) => unknown;
  onBlur?: (context: RadioGroupFieldValidatorContext) => unknown;
  onSubmit?: (context: RadioGroupFieldValidatorContext) => unknown;
};

export type RadioGroupFieldOption = {
  disabled?: boolean;
  indicator?: JSX.Element;
  label: JSX.Element;
  value: string;
};

type RadioGroupFieldRootProps = Omit<
  RadioGroupProps,
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

export type RadioGroupFieldProps = Omit<
  TanStackFieldProps<string, HTMLDivElement>,
  "children" | "validators"
> & {
  options: readonly RadioGroupFieldOption[];
  validators?: RadioGroupFieldValidators;
  radioGroupProps?: RadioGroupFieldRootProps;
  itemProps?: Omit<RadioGroupItemProps, "children" | "disabled" | "indicator" | "value">;
  radioGroupClass?: string;
  itemClass?: string;
};

export function RadioGroupField(props: RadioGroupFieldProps) {
  return (
    <TanStackField<string, HTMLDivElement>
      class={cn("ui-radio-group-field", props.class)}
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
      {(context) => (
        <RadioGroup
          {...props.radioGroupProps}
          aria-describedby={[
            props.description ? context.descriptionId() : undefined,
            context.invalid() && context.firstError() ? context.errorId() : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={context.invalid() || undefined}
          aria-labelledby={props.label ? context.labelId() : undefined}
          data-scope="ui-radio-group-field"
          data-part="radio-group"
          data-slot="radio-group-field-control"
          disabled={props.disabled}
          form={props.formId}
          id={context.controlId()}
          invalid={context.invalid()}
          name={context.field().name}
          readOnly={props.readOnly}
          required={props.required}
          value={typeof context.value() === "string" ? context.value() : undefined}
          onBlur={() => {
            context.setFocused(false);
            context.field().handleBlur();
          }}
          onFocus={() => context.setFocused(true)}
          onValueChange={(value, detail) => {
            props.radioGroupProps?.onValueChange?.(value, detail);
            context.field().handleChange(value ?? "");
          }}
          class={cn(
            "ui-radio-group-field-control",
            props.radioGroupProps?.class,
            props.radioGroupClass,
          )}
        >
          <For each={props.options}>
            {(option) => (
              <RadioGroupItem
                {...props.itemProps}
                value={option.value}
                disabled={option.disabled}
                indicator={option.indicator}
                data-scope="ui-radio-group-field"
                data-part="item"
                data-slot="radio-group-field-item"
                class={cn("ui-radio-group-field-item", props.itemProps?.class, props.itemClass)}
              >
                {option.label}
              </RadioGroupItem>
            )}
          </For>
        </RadioGroup>
      )}
    </TanStackField>
  );
}
