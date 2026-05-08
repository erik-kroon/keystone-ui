import { splitProps, type JSX } from "solid-js";
import { Input, type InputProps } from "@/components/ui/input";
import {
  TanStackField,
  type TanStackFieldApi,
  type TanStackFieldProps,
} from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type FileFieldValidatorContext = {
  value: readonly File[];
};

export type FileFieldValidators = {
  onChange?: (context: FileFieldValidatorContext) => unknown;
  onBlur?: (context: FileFieldValidatorContext) => unknown;
  onSubmit?: (context: FileFieldValidatorContext) => unknown;
};

type FileFieldInputProps = Omit<
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
  | "type"
  | "value"
>;

export type FileFieldProps = Omit<
  TanStackFieldProps<readonly File[], HTMLInputElement>,
  "children" | "validators"
> &
  FileFieldInputProps & {
    validators?: FileFieldValidators;
    inputClass?: string;
  };

export function FileField(props: FileFieldProps) {
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
    <TanStackField<readonly File[], HTMLInputElement>
      class={cn("ui-file-field", local.class)}
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
        <FileFieldControl
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
        />
      )}
    </TanStackField>
  );
}

function FileFieldControl(
  props: FileFieldInputProps & {
    controlProps: JSX.HTMLAttributes<HTMLInputElement>;
    disabled?: boolean;
    field: () => TanStackFieldApi<readonly File[], HTMLInputElement>;
    formId?: string;
    inputClass?: string;
    invalid: boolean;
    readOnly?: boolean;
    required?: boolean;
    setFocused: (focused: boolean) => void;
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
  ]);

  return (
    <Input
      {...local.controlProps}
      {...inputProps}
      data-scope="ui-file-field"
      data-part="input"
      data-slot="file-field-input"
      disabled={local.disabled}
      form={local.formId}
      invalid={local.invalid}
      name={local.field().name}
      readOnly={local.readOnly}
      required={local.required}
      type="file"
      onBlur={(event) => {
        local.setFocused(false);
        local.field().handleBlur(event);
      }}
      onFocus={() => local.setFocused(true)}
      onInput={(event) => local.field().handleChange(Array.from(event.currentTarget.files ?? []))}
      class={cn("ui-file-field-input", inputProps.class, local.inputClass)}
    />
  );
}
