import { splitProps, type JSX } from "solid-js";
import { Input, type InputProps } from "@/components/ui/input";
import {
  TanStackField,
  type TanStackFieldApi,
  type TanStackFieldProps,
} from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type TextFieldValidatorContext = {
  value: string;
};

export type TextFieldValidators = {
  onChange?: (context: TextFieldValidatorContext) => unknown;
  onBlur?: (context: TextFieldValidatorContext) => unknown;
  onSubmit?: (context: TextFieldValidatorContext) => unknown;
};

type TextFieldInputProps = Omit<
  InputProps,
  | "aria-describedby"
  | "aria-invalid"
  | "disabled"
  | "form"
  | "id"
  | "invalid"
  | "name"
  | "onBlur"
  | "onFocus"
  | "onInput"
  | "readOnly"
  | "required"
  | "value"
>;

export type TextFieldProps = Omit<
  TanStackFieldProps<string, HTMLInputElement>,
  "children" | "validators"
> &
  TextFieldInputProps & {
    validators?: TextFieldValidators;
    inputClass?: string;
  };

export function TextField(props: TextFieldProps) {
  const [local, inputProps] = splitProps(props, [
    "class",
    "description",
    "descriptionClass",
    "disabled",
    "error",
    "errorClass",
    "form",
    "formId",
    "id",
    "inputClass",
    "invalid",
    "label",
    "labelClass",
    "name",
    "readOnly",
    "required",
    "validators",
  ]);

  return (
    <TanStackField<string, HTMLInputElement>
      class={cn("ui-text-field", local.class)}
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
        <TextFieldControl
          {...inputProps}
          controlProps={context.control.getControlProps<HTMLInputElement>()}
          disabled={local.disabled}
          field={context.field}
          formId={local.formId}
          inputClass={local.inputClass}
          invalid={context.invalid()}
          readOnly={local.readOnly}
          required={local.required}
          setFocused={context.setFocused}
          value={context.value()}
        />
      )}
    </TanStackField>
  );
}

function TextFieldControl(
  props: TextFieldInputProps & {
    controlProps: JSX.HTMLAttributes<HTMLInputElement>;
    disabled?: boolean;
    field: () => TanStackFieldApi<string, HTMLInputElement>;
    formId?: string;
    inputClass?: string;
    invalid: boolean;
    readOnly?: boolean;
    required?: boolean;
    setFocused: (focused: boolean) => void;
    value: string;
  },
) {
  const [local, inputProps] = splitProps(props, [
    "controlProps",
    "disabled",
    "field",
    "formId",
    "inputClass",
    "invalid",
    "readOnly",
    "required",
    "setFocused",
    "value",
  ]);

  return (
    <Input
      {...local.controlProps}
      {...inputProps}
      data-scope="ui-text-field"
      data-part="input"
      data-slot="text-field-input"
      disabled={local.disabled}
      form={local.formId}
      invalid={local.invalid}
      name={local.field().name}
      readOnly={local.readOnly}
      required={local.required}
      type={inputProps.type ?? "text"}
      value={String(local.value ?? "")}
      onBlur={(event) => {
        local.setFocused(false);
        local.field().handleBlur(event);
      }}
      onFocus={() => local.setFocused(true)}
      onInput={(event) => local.field().handleChange(event.currentTarget.value)}
      class={cn("ui-text-field-input", inputProps.class, local.inputClass)}
    />
  );
}
