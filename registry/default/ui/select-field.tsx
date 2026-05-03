import { Select as KeystoneSelect } from "@keystone-ui/keystone/select";
import { createMemo, For, Show, type Accessor, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

type TanStackSelectFieldApi = {
  name: string;
  state: {
    value: unknown;
    meta: {
      errors: unknown[];
      isTouched: boolean;
    };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void;
};

type SelectFieldValidatorContext = {
  value: string;
};

export type SelectFieldValidators = {
  onChange?: (context: SelectFieldValidatorContext) => unknown;
  onBlur?: (context: SelectFieldValidatorContext) => unknown;
  onSubmit?: (context: SelectFieldValidatorContext) => unknown;
};

type TanStackFormApi = {
  Field: (props: {
    name: string;
    validators?: SelectFieldValidators;
    children: (field: Accessor<TanStackSelectFieldApi>) => JSX.Element;
  }) => JSX.Element;
};

export type SelectFieldOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type SelectFieldProps = {
  form: unknown;
  name: string;
  label: JSX.Element;
  options: readonly SelectFieldOption[];
  placeholder?: string;
  description?: JSX.Element;
  validators?: SelectFieldValidators;
  error?: JSX.Element;
  class?: string;
  triggerClass?: string;
  contentClass?: string;
  itemClass?: string;
  labelClass?: string;
  descriptionClass?: string;
  errorClass?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
};

export function SelectField(props: SelectFieldProps) {
  const FormField = (props.form as TanStackFormApi).Field;

  return (
    <FormField name={props.name} validators={props.validators}>
      {(field) => <SelectFieldControl {...props} field={field} />}
    </FormField>
  );
}

function SelectFieldControl(props: SelectFieldProps & { field: Accessor<TanStackSelectFieldApi> }) {
  const value = createMemo(() => {
    const fieldValue = props.field().state.value;
    return typeof fieldValue === "string" ? fieldValue : undefined;
  });
  const firstError = createMemo(
    () => props.error ?? formatFieldError(props.field().state.meta.errors[0]),
  );
  const invalid = createMemo(
    () => props.invalid || (props.field().state.meta.isTouched && Boolean(firstError())),
  );

  return (
    <div
      data-scope="mason-select-field"
      data-part="root"
      data-invalid={invalid() ? "" : undefined}
      class={cn("mason-select-field", props.class)}
    >
      <KeystoneSelect.Root
        name={props.field().name}
        value={value()}
        placeholder={props.placeholder}
        disabled={props.disabled}
        invalid={invalid()}
        required={props.required}
        onOpenChange={(open) => {
          if (!open) props.field().handleBlur();
        }}
        onValueChange={(next) => props.field().handleChange(next ?? "")}
      >
        <label
          for={`keystone-select-trigger-${props.name}`}
          data-scope="mason-select-field"
          data-part="label"
          class={cn("mason-select-field-label", props.labelClass)}
        >
          {props.label}
        </label>
        <KeystoneSelect.Trigger
          id={`keystone-select-trigger-${props.name}`}
          data-scope="mason-select-field"
          data-part="trigger"
          class={cn("mason-select-field-trigger", props.triggerClass)}
        >
          <KeystoneSelect.Value placeholder={props.placeholder} />
          <span aria-hidden="true" data-scope="mason-select-field" data-part="indicator">
            v
          </span>
        </KeystoneSelect.Trigger>
        <Show when={props.description}>
          <p
            data-scope="mason-select-field"
            data-part="description"
            class={cn("mason-select-field-description", props.descriptionClass)}
          >
            {props.description}
          </p>
        </Show>
        <Show when={invalid() && firstError()}>
          {(message) => (
            <p
              role="alert"
              data-scope="mason-select-field"
              data-part="error"
              class={cn("mason-select-field-error", props.errorClass)}
            >
              {message()}
            </p>
          )}
        </Show>
        <KeystoneSelect.Portal>
          <KeystoneSelect.Positioner>
            <KeystoneSelect.Content
              data-scope="mason-select-field"
              data-part="content"
              class={cn("mason-select-field-content", props.contentClass)}
            >
              <KeystoneSelect.Listbox
                data-scope="mason-select-field"
                data-part="listbox"
                class="mason-select-field-listbox"
              >
                <For each={props.options}>
                  {(option) => (
                    <KeystoneSelect.Item
                      value={option.value}
                      disabled={option.disabled}
                      data-scope="mason-select-field"
                      data-part="item"
                      class={cn("mason-select-field-item", props.itemClass)}
                    >
                      {option.label}
                    </KeystoneSelect.Item>
                  )}
                </For>
              </KeystoneSelect.Listbox>
            </KeystoneSelect.Content>
          </KeystoneSelect.Positioner>
        </KeystoneSelect.Portal>
      </KeystoneSelect.Root>
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
