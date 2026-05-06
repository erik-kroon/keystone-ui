import {
  NumberField as CoreNumberField,
  type NumberFieldDecrementTriggerProps as CoreNumberFieldDecrementTriggerProps,
  type NumberFieldIncrementTriggerProps as CoreNumberFieldIncrementTriggerProps,
  type NumberFieldInputProps as CoreNumberFieldInputProps,
  type NumberFieldRootProps as CoreNumberFieldRootProps,
} from "@keystone-ui/core/number-field";
import { splitProps, type JSX } from "solid-js";
import {
  TanStackField,
  type TanStackFieldApi,
  type TanStackFieldProps,
} from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type NumberFieldValidatorContext = {
  value: number | undefined;
};

export type NumberFieldValidators = {
  onChange?: (context: NumberFieldValidatorContext) => unknown;
  onBlur?: (context: NumberFieldValidatorContext) => unknown;
  onSubmit?: (context: NumberFieldValidatorContext) => unknown;
};

type NumberFieldRootProps = Omit<
  CoreNumberFieldRootProps,
  | "children"
  | "defaultValue"
  | "disabled"
  | "form"
  | "id"
  | "invalid"
  | "name"
  | "readOnly"
  | "required"
  | "value"
>;
type NumberFieldInputProps = Omit<
  CoreNumberFieldInputProps,
  | "aria-describedby"
  | "aria-invalid"
  | "aria-labelledby"
  | "disabled"
  | "form"
  | "id"
  | "name"
  | "readOnly"
  | "required"
>;
type NumberFieldTriggerProps = Omit<
  CoreNumberFieldIncrementTriggerProps & CoreNumberFieldDecrementTriggerProps,
  "children" | "class"
>;

export type NumberFieldProps = Omit<
  TanStackFieldProps<number | undefined, HTMLInputElement>,
  "children" | "validators"
> &
  NumberFieldRootProps & {
    validators?: NumberFieldValidators;
    decrementLabel?: JSX.Element;
    incrementLabel?: JSX.Element;
    inputProps?: NumberFieldInputProps;
    decrementTriggerProps?: NumberFieldTriggerProps;
    incrementTriggerProps?: NumberFieldTriggerProps;
    inputClass?: string;
    triggerClass?: string;
    decrementTriggerClass?: string;
    incrementTriggerClass?: string;
    hideSteppers?: boolean;
  };

const classes = (...tokens: string[]) => tokens.join(" ");

export function NumberField(props: NumberFieldProps) {
  const [local, rootProps] = splitProps(props, [
    "class",
    "decrementLabel",
    "decrementTriggerClass",
    "decrementTriggerProps",
    "description",
    "descriptionClass",
    "disabled",
    "error",
    "errorClass",
    "form",
    "formId",
    "hideSteppers",
    "id",
    "incrementLabel",
    "incrementTriggerClass",
    "incrementTriggerProps",
    "inputClass",
    "inputProps",
    "invalid",
    "label",
    "labelClass",
    "name",
    "readOnly",
    "required",
    "triggerClass",
    "validators",
  ]);

  return (
    <TanStackField<number | undefined, HTMLInputElement>
      class={cn("ui-number-field", local.class)}
      description={local.description}
      descriptionClass={local.descriptionClass}
      disabled={local.disabled}
      error={local.error}
      errorClass={local.errorClass}
      form={local.form}
      formId={local.formId}
      id={local.id}
      invalid={local.invalid}
      label={local.label}
      labelClass={local.labelClass}
      name={local.name}
      readOnly={local.readOnly}
      required={local.required}
      validators={local.validators}
    >
      {(context) => (
        <NumberFieldControl
          {...rootProps}
          controlProps={context.control.getControlProps<HTMLInputElement>()}
          decrementLabel={local.decrementLabel}
          decrementTriggerClass={local.decrementTriggerClass}
          decrementTriggerProps={local.decrementTriggerProps}
          disabled={local.disabled}
          field={context.field}
          formId={local.formId}
          hideSteppers={local.hideSteppers}
          incrementLabel={local.incrementLabel}
          incrementTriggerClass={local.incrementTriggerClass}
          incrementTriggerProps={local.incrementTriggerProps}
          inputClass={local.inputClass}
          inputProps={local.inputProps}
          invalid={context.invalid()}
          readOnly={local.readOnly}
          required={local.required}
          setFocused={context.setFocused}
          triggerClass={local.triggerClass}
          value={context.value()}
        />
      )}
    </TanStackField>
  );
}

function NumberFieldControl(
  props: NumberFieldRootProps & {
    controlProps: JSX.HTMLAttributes<HTMLInputElement>;
    decrementLabel?: JSX.Element;
    decrementTriggerClass?: string;
    decrementTriggerProps?: NumberFieldTriggerProps;
    disabled?: boolean;
    field: () => TanStackFieldApi<number | undefined, HTMLInputElement>;
    formId?: string;
    hideSteppers?: boolean;
    incrementLabel?: JSX.Element;
    incrementTriggerClass?: string;
    incrementTriggerProps?: NumberFieldTriggerProps;
    inputClass?: string;
    inputProps?: NumberFieldInputProps;
    invalid: boolean;
    readOnly?: boolean;
    required?: boolean;
    setFocused: (focused: boolean) => void;
    triggerClass?: string;
    value: number | undefined;
  },
) {
  const [local, numberFieldProps] = splitProps(props, [
    "controlProps",
    "decrementLabel",
    "decrementTriggerClass",
    "decrementTriggerProps",
    "disabled",
    "field",
    "formId",
    "hideSteppers",
    "incrementLabel",
    "incrementTriggerClass",
    "incrementTriggerProps",
    "inputClass",
    "inputProps",
    "invalid",
    "readOnly",
    "required",
    "setFocused",
    "triggerClass",
    "value",
  ]);
  const triggerClass = () =>
    cn(
      classes(
        "ui-number-field-trigger",
        "inline-flex",
        "h-full",
        "w-8.5",
        "shrink-0",
        "items-center",
        "justify-center",
        "border-input",
        "bg-transparent",
        "text-muted-foreground",
        "outline-none",
        "transition-colors",
        "hover:bg-foreground/6",
        "hover:text-foreground",
        "focus-visible:bg-foreground/6",
        "focus-visible:text-foreground",
        "disabled:pointer-events-none",
        "disabled:opacity-48",
        "sm:w-7.5",
      ),
      local.triggerClass,
    );

  return (
    <CoreNumberField.Root
      {...numberFieldProps}
      data-scope="ui-number-field"
      data-part="root"
      data-slot="number-field-control"
      disabled={local.disabled}
      form={local.formId}
      id={local.controlProps.id}
      invalid={local.invalid}
      name={local.field().name}
      readOnly={local.readOnly}
      required={local.required}
      value={typeof local.value === "number" ? local.value : undefined}
      onValueChange={(value, detail) => {
        numberFieldProps.onValueChange?.(value, detail);
        local.field().handleChange(value);
      }}
      class={cn(
        classes(
          "ui-number-field-control",
          "relative",
          "inline-flex",
          "h-8.5",
          "w-full",
          "overflow-hidden",
          "rounded-lg",
          "border",
          "border-input",
          "bg-background",
          "not-dark:bg-clip-padding",
          "text-base",
          "text-foreground",
          "shadow-xs/5",
          "ring-ring/24",
          "transition-shadow",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-lg)-1px)]",
          "not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]",
          "has-focus-visible:has-aria-invalid:border-destructive/64",
          "has-focus-visible:has-aria-invalid:ring-destructive/16",
          "has-aria-invalid:border-destructive/36",
          "has-focus-visible:border-ring",
          "has-disabled:opacity-64",
          "has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none",
          "has-focus-visible:ring-[3px]",
          "sm:h-7.5",
          "sm:text-sm",
          "dark:bg-input/32",
          "dark:has-aria-invalid:ring-destructive/24",
          "dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        ),
        numberFieldProps.class,
      )}
    >
      {!local.hideSteppers && (
        <CoreNumberField.DecrementTrigger
          {...local.decrementTriggerProps}
          aria-label={local.decrementTriggerProps?.["aria-label"] ?? "Decrease value"}
          data-scope="ui-number-field"
          data-part="decrement-trigger"
          data-slot="number-field-decrement-trigger"
          class={cn(triggerClass(), "border-r", local.decrementTriggerClass)}
        >
          {local.decrementLabel ?? <span aria-hidden="true">-</span>}
        </CoreNumberField.DecrementTrigger>
      )}
      <CoreNumberField.Input
        {...local.controlProps}
        {...local.inputProps}
        data-scope="ui-number-field"
        data-part="input"
        data-slot="number-field-input"
        onBlur={(event) => {
          const onBlur = (
            local.inputProps as
              | { onBlur?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void }
              | undefined
          )?.onBlur;
          onBlur?.(event);
          if (event.defaultPrevented) return;

          local.setFocused(false);
          local.field().handleBlur(event);
        }}
        onFocus={(event) => {
          const onFocus = (
            local.inputProps as
              | { onFocus?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void }
              | undefined
          )?.onFocus;
          onFocus?.(event);
          if (event.defaultPrevented) return;
          local.setFocused(true);
        }}
        class={cn(
          classes(
            "ui-number-field-input",
            "h-full",
            "min-w-0",
            "flex-1",
            "bg-transparent",
            "px-[calc(--spacing(3)-1px)]",
            "tabular-nums",
            "text-center",
            "outline-none",
            "[transition:background-color_5000000s_ease-in-out_0s]",
            "placeholder:text-muted-foreground/72",
            "sm:px-[calc(--spacing(2.5)-1px)]",
          ),
          local.inputProps?.class,
          local.inputClass,
        )}
      />
      {!local.hideSteppers && (
        <CoreNumberField.IncrementTrigger
          {...local.incrementTriggerProps}
          aria-label={local.incrementTriggerProps?.["aria-label"] ?? "Increase value"}
          data-scope="ui-number-field"
          data-part="increment-trigger"
          data-slot="number-field-increment-trigger"
          class={cn(triggerClass(), "border-l", local.incrementTriggerClass)}
        >
          {local.incrementLabel ?? <span aria-hidden="true">+</span>}
        </CoreNumberField.IncrementTrigger>
      )}
    </CoreNumberField.Root>
  );
}
