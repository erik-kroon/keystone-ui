import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

type TanStackFormApi = {
  handleSubmit: () => unknown;
  state?: TanStackFormState;
};

export type TanStackFormState = {
  canSubmit?: boolean;
  errors?: readonly unknown[];
  isDirty?: boolean;
  isSubmitted?: boolean;
  isSubmitting?: boolean;
  isTouched?: boolean;
  isValid?: boolean;
  isValidating?: boolean;
  submissionAttempts?: number;
};

export type TanStackFormProps = ParentProps<
  Omit<JSX.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
    form: unknown;
    onSubmit?: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  }
>;
export type TanStackFormSubmitProps = ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;
export type TanStackFormErrorsProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    form?: unknown;
    errors?: readonly unknown[];
  }
>;

const classes = (...tokens: string[]) => tokens.join(" ");

export function TanStackForm(props: TanStackFormProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "form",
    "onSubmit",
    "preventDefault",
    "stopPropagation",
  ]);
  const form = () => local.form as TanStackFormApi;
  const state = () => getTanStackFormState(local.form);
  const submitting = () => Boolean(state().isSubmitting);
  const validating = () => Boolean(state().isValidating);
  const canSubmit = () => state().canSubmit ?? true;
  const valid = () => state().isValid;

  return (
    <form
      {...rest}
      aria-busy={submitting() || validating() || undefined}
      data-scope="ui-tanstack-form"
      data-part="root"
      data-slot="tanstack-form"
      data-submitting={submitting() ? "" : undefined}
      data-validating={validating() ? "" : undefined}
      data-invalid={valid() === false ? "" : undefined}
      data-can-submit={canSubmit() ? "" : undefined}
      data-dirty={state().isDirty ? "" : undefined}
      data-touched={state().isTouched ? "" : undefined}
      data-submitted={state().isSubmitted ? "" : undefined}
      data-submission-attempts={state().submissionAttempts}
      class={cn(classes("ui-tanstack-form", "space-y-4"), local.class)}
      onSubmit={(event) => {
        local.onSubmit?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (local.preventDefault ?? true) {
          event.preventDefault();
        }
        if (local.stopPropagation ?? true) {
          event.stopPropagation();
        }

        void form().handleSubmit();
      }}
    >
      {local.children}
    </form>
  );
}

export type TanStackFormSubmitStateProps = TanStackFormSubmitProps & {
  form?: unknown;
  disableWhenCannotSubmit?: boolean;
  disableWhenSubmitting?: boolean;
};

export function TanStackFormSubmit(props: TanStackFormSubmitStateProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "disabled",
    "disableWhenCannotSubmit",
    "disableWhenSubmitting",
    "form",
    "type",
  ]);
  const state = () => getTanStackFormState(local.form);
  const submitting = () => Boolean(state().isSubmitting);
  const canSubmit = () => state().canSubmit ?? true;
  const disabled = () =>
    Boolean(
      local.disabled ||
      ((local.disableWhenSubmitting ?? true) && submitting()) ||
      ((local.disableWhenCannotSubmit ?? true) && !canSubmit()),
    );

  return (
    <button
      {...rest}
      data-scope="ui-tanstack-form"
      data-part="submit"
      data-slot="tanstack-form-submit"
      data-submitting={submitting() ? "" : undefined}
      data-can-submit={canSubmit() ? "" : undefined}
      disabled={disabled()}
      type={local.type ?? "submit"}
      class={cn("ui-tanstack-form-submit", local.class)}
    />
  );
}

export function TanStackFormErrors(props: TanStackFormErrorsProps) {
  const [local, rest] = splitProps(props, ["children", "class", "errors", "form"]);
  const errors = () => local.errors ?? getTanStackFormState(local.form).errors ?? [];

  return (
    <div
      {...rest}
      role={errors().length > 0 ? "alert" : undefined}
      data-scope="ui-tanstack-form"
      data-part="errors"
      data-slot="tanstack-form-errors"
      class={cn(
        classes(
          "ui-tanstack-form-errors",
          "empty:hidden",
          "text-destructive-foreground",
          "text-sm",
        ),
        local.class,
      )}
    >
      {local.children ?? errors().map(formatFieldError).filter(Boolean).join(", ")}
    </div>
  );
}

export function getTanStackFormState(form: unknown): TanStackFormState {
  return ((form as TanStackFormApi | undefined)?.state ?? {}) as TanStackFormState;
}

export function formatFieldError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : undefined;
  }
  return String(error);
}
