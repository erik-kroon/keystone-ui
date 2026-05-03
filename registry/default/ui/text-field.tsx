import { createFormControl } from "@keystone-ui/keystone/form";
import { createMemo, createSignal, Show, splitProps, type Accessor, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

type TanStackTextFieldApi = {
  name: string;
  state: {
    value: unknown;
    meta: {
      errors: unknown[];
      isTouched: boolean;
    };
  };
  handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  handleChange: (value: string) => void;
};

type TanStackFormApi = {
  Field: (props: {
    name: string;
    validators?: TextFieldValidators;
    children: (field: Accessor<TanStackTextFieldApi>) => JSX.Element;
  }) => JSX.Element;
};

type TextFieldValidatorContext = {
  value: string;
};

export type TextFieldValidators = {
  onChange?: (context: TextFieldValidatorContext) => unknown;
  onBlur?: (context: TextFieldValidatorContext) => unknown;
  onSubmit?: (context: TextFieldValidatorContext) => unknown;
};

type TextFieldInputProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  | "aria-describedby"
  | "aria-invalid"
  | "form"
  | "label"
  | "name"
  | "onBlur"
  | "onFocus"
  | "onInput"
  | "value"
>;

export type TextFieldProps = TextFieldInputProps & {
  form: unknown;
  name: string;
  label: JSX.Element;
  description?: JSX.Element;
  validators?: TextFieldValidators;
  error?: JSX.Element;
  fieldClass?: string;
  inputClass?: string;
  labelClass?: string;
  descriptionClass?: string;
  errorClass?: string;
};

export function TextField(props: TextFieldProps) {
  const [local, inputProps] = splitProps(props, [
    "class",
    "description",
    "descriptionClass",
    "disabled",
    "error",
    "errorClass",
    "fieldClass",
    "form",
    "id",
    "inputClass",
    "label",
    "labelClass",
    "name",
    "readOnly",
    "required",
    "validators",
  ]);
  const FormField = (local.form as TanStackFormApi).Field;

  return (
    <FormField name={local.name} validators={local.validators}>
      {(field) => (
        <TextFieldControl
          {...inputProps}
          description={local.description}
          descriptionClass={local.descriptionClass}
          disabled={local.disabled}
          error={local.error}
          errorClass={local.errorClass}
          field={field}
          fieldClass={local.fieldClass ?? local.class}
          id={local.id}
          inputClass={local.inputClass}
          label={local.label}
          labelClass={local.labelClass}
          readOnly={local.readOnly}
          required={local.required}
        />
      )}
    </FormField>
  );
}

function TextFieldControl(
  props: TextFieldInputProps & {
    description?: JSX.Element;
    descriptionClass?: string;
    error?: JSX.Element;
    errorClass?: string;
    field: Accessor<TanStackTextFieldApi>;
    fieldClass?: string;
    inputClass?: string;
    label: JSX.Element;
    labelClass?: string;
  },
) {
  let inputRef: HTMLInputElement | undefined;
  const [local, inputProps] = splitProps(props, [
    "description",
    "descriptionClass",
    "error",
    "errorClass",
    "field",
    "fieldClass",
    "inputClass",
    "label",
    "labelClass",
  ]);
  const [focused, setFocused] = createSignal(false);
  const fieldValue = createMemo(() => local.field().state.value);
  const firstError = createMemo(
    () => local.error ?? formatFieldError(local.field().state.meta.errors[0]),
  );
  const invalid = createMemo(() => local.field().state.meta.isTouched && Boolean(firstError()));
  const control = createFormControl({
    id: () => inputProps.id,
    name: () => local.field().name,
    value: () => {
      const value = fieldValue();
      return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
        ? value
        : undefined;
    },
    disabled: () => inputProps.disabled,
    focused,
    invalid,
    readonly: () => inputProps.readOnly,
    required: () => inputProps.required,
  });

  control.registerFormReset(() => inputRef);

  return (
    <div
      {...control.getRootProps()}
      data-scope="mason-text-field"
      data-part="root"
      class={cn("mason-text-field", local.fieldClass)}
    >
      <label
        {...control.getLabelProps()}
        data-scope="mason-text-field"
        data-part="label"
        class={cn("mason-text-field-label", local.labelClass)}
      >
        {local.label}
      </label>
      <input
        {...inputProps}
        {...control.getControlProps<HTMLInputElement>()}
        ref={(element) => {
          inputRef = element;
        }}
        type={inputProps.type ?? "text"}
        value={String(fieldValue() ?? "")}
        disabled={inputProps.disabled}
        readOnly={inputProps.readOnly}
        required={inputProps.required}
        onBlur={(event) => {
          setFocused(false);
          local.field().handleBlur(event);
        }}
        onFocus={() => setFocused(true)}
        onInput={(event) => local.field().handleChange(event.currentTarget.value)}
        data-scope="mason-text-field"
        data-part="input"
        class={cn("mason-text-field-input", inputProps.class, local.inputClass)}
      />
      <Show when={local.description}>
        <p
          {...control.getDescriptionProps()}
          data-scope="mason-text-field"
          data-part="description"
          class={cn("mason-text-field-description", local.descriptionClass)}
        >
          {local.description}
        </p>
      </Show>
      <Show when={invalid() && firstError()}>
        {(message) => (
          <p
            {...control.getErrorMessageProps()}
            role="alert"
            data-scope="mason-text-field"
            data-part="error"
            class={cn("mason-text-field-error", local.errorClass)}
          >
            {message()}
          </p>
        )}
      </Show>
    </div>
  );
}

function formatFieldError(error: unknown): JSX.Element | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : undefined;
  }
  return String(error);
}
