import { splitProps, type JSX, type ParentProps } from "solid-js";
import { getTanStackFormState } from "@/components/ui/tanstack-form";
import { cn } from "@/lib/cn";

export type FormSubmitProps = ParentProps<
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "form"> & {
    form?: unknown;
    formId?: string;
    disableWhenCannotSubmit?: boolean;
    disableWhenSubmitting?: boolean;
  }
>;

export function FormSubmit(props: FormSubmitProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "disabled",
    "disableWhenCannotSubmit",
    "disableWhenSubmitting",
    "form",
    "formId",
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
      data-scope="ui-form-submit"
      data-part="root"
      data-slot="form-submit"
      data-submitting={submitting() ? "" : undefined}
      data-can-submit={canSubmit() ? "" : undefined}
      disabled={disabled()}
      form={local.formId}
      type={local.type ?? "submit"}
      class={cn("ui-form-submit", local.class)}
    />
  );
}
