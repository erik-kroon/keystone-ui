import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

type TanStackFormApi = {
  handleSubmit: () => unknown;
  state?: {
    canSubmit?: boolean;
    isSubmitting?: boolean;
    isValidating?: boolean;
    isValid?: boolean;
    errors?: unknown[];
  };
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
  const submitting = () => Boolean(form().state?.isSubmitting);
  const validating = () => Boolean(form().state?.isValidating);
  const canSubmit = () => form().state?.canSubmit ?? true;
  const valid = () => form().state?.isValid;

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

export function TanStackFormSubmit(props: TanStackFormSubmitProps) {
  const [local, rest] = splitProps(props, ["class", "type"]);

  return (
    <button
      {...rest}
      data-scope="ui-tanstack-form"
      data-part="submit"
      data-slot="tanstack-form-submit"
      type={local.type ?? "submit"}
      class={cn("ui-tanstack-form-submit", local.class)}
    />
  );
}

export function TanStackFormErrors(props: TanStackFormErrorsProps) {
  const [local, rest] = splitProps(props, ["children", "class", "errors"]);
  const errors = () => local.errors ?? [];

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

export function formatFieldError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : undefined;
  }
  return String(error);
}
