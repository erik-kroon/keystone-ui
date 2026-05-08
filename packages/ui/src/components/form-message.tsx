import { Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { formatFieldError, getTanStackFormState } from "@/components/ui/tanstack-form";
import { cn } from "@/lib/cn";

type TanStackMessageField = {
  state?: {
    meta?: {
      errors?: readonly unknown[];
      isTouched?: boolean;
      isValidating?: boolean;
    };
  };
};

export type FormMessageProps = ParentProps<
  JSX.HTMLAttributes<HTMLParagraphElement> & {
    errors?: readonly unknown[];
    field?: unknown;
    form?: unknown;
    forceMount?: boolean;
    invalid?: boolean;
    touched?: boolean;
  }
>;

const classes = (...tokens: string[]) => tokens.join(" ");

export function FormMessage(props: FormMessageProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "errors",
    "field",
    "forceMount",
    "form",
    "invalid",
    "touched",
  ]);
  const field = () => local.field as TanStackMessageField | undefined;
  const errors = () =>
    local.errors ?? field()?.state?.meta?.errors ?? getTanStackFormState(local.form).errors ?? [];
  const message = () => local.children ?? errors().map(formatFieldError).filter(Boolean).join(", ");
  const hasMessage = () => Boolean(message());
  const touched = () => local.touched ?? field()?.state?.meta?.isTouched;
  const invalid = () => local.invalid ?? errors().length > 0;

  return (
    <Show when={local.forceMount || hasMessage()}>
      <p
        {...rest}
        role={invalid() && hasMessage() ? "alert" : undefined}
        aria-live={invalid() && hasMessage() ? "polite" : undefined}
        data-scope="ui-form-message"
        data-part="root"
        data-slot="form-message"
        data-invalid={invalid() ? "" : undefined}
        data-touched={touched() ? "" : undefined}
        data-validating={field()?.state?.meta?.isValidating ? "" : undefined}
        class={cn(
          classes("ui-form-message", "text-destructive-foreground", "text-xs"),
          local.class,
        )}
      >
        {message()}
      </p>
    </Show>
  );
}
