import { createFormControl, type FormControlApi } from "@keystone-ui/core/form";
import { createMemo, createSignal, Show, splitProps, type Accessor, type JSX } from "solid-js";
import { cn } from "@/lib/cn";
import { formatFieldError } from "@/components/ui/tanstack-form";

export type TanStackFieldApi<TValue = unknown, TElement extends HTMLElement = HTMLElement> = {
  name: string;
  state: {
    value: TValue;
    meta: {
      errors: unknown[];
      isTouched: boolean;
      isDirty?: boolean;
      isValidating?: boolean;
    };
  };
  handleBlur: (event?: FocusEvent & { currentTarget?: TElement }) => void;
  handleChange: (value: TValue) => void;
};

export type TanStackFormApi<TValue = unknown, TElement extends HTMLElement = HTMLElement> = {
  Field: (props: {
    name: string;
    validators?: unknown;
    children: (field: Accessor<TanStackFieldApi<TValue, TElement>>) => JSX.Element;
  }) => JSX.Element;
};

export type TanStackFieldRenderContext<
  TValue = unknown,
  TElement extends HTMLElement = HTMLElement,
> = {
  control: FormControlApi;
  field: Accessor<TanStackFieldApi<TValue, TElement>>;
  firstError: Accessor<JSX.Element | undefined>;
  focused: Accessor<boolean>;
  invalid: Accessor<boolean>;
  setFocused: (focused: boolean) => void;
  value: Accessor<TValue>;
};

export type TanStackFieldProps<TValue = unknown, TElement extends HTMLElement = HTMLElement> = {
  children: (context: TanStackFieldRenderContext<TValue, TElement>) => JSX.Element;
  form: unknown;
  name: string;
  validators?: unknown;
  label?: JSX.Element;
  description?: JSX.Element;
  error?: JSX.Element;
  class?: string;
  labelClass?: string;
  descriptionClass?: string;
  errorClass?: string;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
};

const classes = (...tokens: string[]) => tokens.join(" ");

export function TanStackField<TValue = unknown, TElement extends HTMLElement = HTMLElement>(
  props: TanStackFieldProps<TValue, TElement>,
) {
  const FormField = (props.form as TanStackFormApi<TValue, TElement>).Field;

  return (
    <FormField name={props.name} validators={props.validators}>
      {(field) => <TanStackFieldControl {...props} field={field} />}
    </FormField>
  );
}

function TanStackFieldControl<TValue = unknown, TElement extends HTMLElement = HTMLElement>(
  props: TanStackFieldProps<TValue, TElement> & {
    field: Accessor<TanStackFieldApi<TValue, TElement>>;
  },
) {
  const [local] = splitProps(props, [
    "children",
    "class",
    "description",
    "descriptionClass",
    "disabled",
    "error",
    "errorClass",
    "field",
    "id",
    "invalid",
    "label",
    "labelClass",
    "readOnly",
    "required",
  ]);
  const [focused, setFocused] = createSignal(false);
  const value = createMemo(() => local.field().state.value);
  const firstError = createMemo(
    () => local.error ?? formatFieldError(local.field().state.meta.errors[0]),
  );
  const invalid = createMemo(
    () => local.invalid || (local.field().state.meta.isTouched && Boolean(firstError())),
  );
  const control = createFormControl({
    id: () => local.id,
    name: () => local.field().name,
    value: () => {
      const current = value();
      return typeof current === "string" ||
        typeof current === "number" ||
        typeof current === "boolean"
        ? current
        : undefined;
    },
    disabled: () => local.disabled,
    focused,
    invalid,
    readonly: () => local.readOnly,
    required: () => local.required,
  });
  const context = {
    control,
    field: local.field,
    firstError,
    focused,
    invalid,
    setFocused,
    value,
  } satisfies TanStackFieldRenderContext<TValue, TElement>;

  return (
    <div
      {...control.getRootProps()}
      data-scope="ui-tanstack-field"
      data-part="root"
      data-slot="tanstack-field"
      data-dirty={local.field().state.meta.isDirty ? "" : undefined}
      data-validating={local.field().state.meta.isValidating ? "" : undefined}
      class={cn(
        classes("ui-tanstack-field", "flex", "flex-col", "items-start", "gap-2"),
        local.class,
      )}
    >
      <Show when={local.label}>
        <label
          {...control.getLabelProps()}
          data-scope="ui-tanstack-field"
          data-part="label"
          data-slot="tanstack-field-label"
          class={cn(
            classes(
              "ui-tanstack-field-label",
              "inline-flex",
              "items-center",
              "gap-2",
              "font-medium",
              "text-base/4.5",
              "text-foreground",
              "data-disabled:opacity-64",
              "sm:text-sm/4",
            ),
            local.labelClass,
          )}
        >
          {local.label}
        </label>
      </Show>
      {local.children(context)}
      <Show when={local.description}>
        <p
          {...control.getDescriptionProps()}
          data-scope="ui-tanstack-field"
          data-part="description"
          data-slot="tanstack-field-description"
          class={cn(
            classes("ui-tanstack-field-description", "text-muted-foreground", "text-xs"),
            local.descriptionClass,
          )}
        >
          {local.description}
        </p>
      </Show>
      <Show when={invalid() && firstError()}>
        {(message) => (
          <p
            {...control.getErrorMessageProps()}
            role="alert"
            data-scope="ui-tanstack-field"
            data-part="error"
            data-slot="tanstack-field-error"
            class={cn(
              classes("ui-tanstack-field-error", "text-destructive-foreground", "text-xs"),
              local.errorClass,
            )}
          >
            {message()}
          </p>
        )}
      </Show>
    </div>
  );
}
