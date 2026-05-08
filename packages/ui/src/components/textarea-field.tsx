import { splitProps, type JSX } from "solid-js";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import {
  TanStackField,
  type TanStackFieldApi,
  type TanStackFieldProps,
} from "@/components/ui/tanstack-field";
import { cn } from "@/lib/cn";

type TextareaFieldValidatorContext = {
  value: string;
};

export type TextareaFieldValidators = {
  onChange?: (context: TextareaFieldValidatorContext) => unknown;
  onBlur?: (context: TextareaFieldValidatorContext) => unknown;
  onSubmit?: (context: TextareaFieldValidatorContext) => unknown;
};

type TextareaFieldControlProps = Omit<
  TextareaProps,
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

export type TextareaFieldProps = Omit<
  TanStackFieldProps<string, HTMLTextAreaElement>,
  "children" | "validators"
> &
  TextareaFieldControlProps & {
    validators?: TextareaFieldValidators;
    textareaClass?: string;
  };

export function TextareaField(props: TextareaFieldProps) {
  const [local, textareaProps] = splitProps(props, [
    "class",
    "description",
    "descriptionClass",
    "disabled",
    "error",
    "errorClass",
    "form",
    "formId",
    "id",
    "invalid",
    "label",
    "labelClass",
    "name",
    "readOnly",
    "required",
    "textareaClass",
    "validators",
  ]);

  return (
    <TanStackField<string, HTMLTextAreaElement>
      class={cn("ui-textarea-field", local.class)}
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
        <TextareaFieldControl
          {...textareaProps}
          controlProps={context.control.getControlProps<HTMLTextAreaElement>()}
          disabled={local.disabled}
          field={context.field}
          formId={local.formId}
          invalid={context.invalid()}
          readOnly={local.readOnly}
          required={local.required}
          setFocused={context.setFocused}
          textareaClass={local.textareaClass}
          value={context.value()}
        />
      )}
    </TanStackField>
  );
}

function TextareaFieldControl(
  props: TextareaFieldControlProps & {
    controlProps: JSX.HTMLAttributes<HTMLTextAreaElement>;
    disabled?: boolean;
    field: () => TanStackFieldApi<string, HTMLTextAreaElement>;
    formId?: string;
    invalid: boolean;
    readOnly?: boolean;
    required?: boolean;
    setFocused: (focused: boolean) => void;
    textareaClass?: string;
    value: string;
  },
) {
  const [local, textareaProps] = splitProps(props, [
    "controlProps",
    "disabled",
    "field",
    "formId",
    "invalid",
    "readOnly",
    "required",
    "setFocused",
    "textareaClass",
    "value",
  ]);

  return (
    <Textarea
      {...local.controlProps}
      {...textareaProps}
      data-scope="ui-textarea-field"
      data-part="textarea"
      data-slot="textarea-field-control"
      disabled={local.disabled}
      form={local.formId}
      invalid={local.invalid}
      name={local.field().name}
      readOnly={local.readOnly}
      required={local.required}
      value={String(local.value ?? "")}
      onBlur={(event) => {
        local.setFocused(false);
        local.field().handleBlur(event);
      }}
      onFocus={() => local.setFocused(true)}
      onInput={(event) => local.field().handleChange(event.currentTarget.value)}
      class={cn("ui-textarea-field-control", textareaProps.class, local.textareaClass)}
    />
  );
}
