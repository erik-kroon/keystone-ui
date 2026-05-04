import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";
import { Label, type LabelProps } from "@/components/ui/label";

export type FieldProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type FieldDescriptionProps = ParentProps<JSX.HTMLAttributes<HTMLParagraphElement>>;
export type FieldErrorProps = ParentProps<JSX.HTMLAttributes<HTMLParagraphElement>>;

export function Field(props: FieldProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div {...rest} data-scope="ui-field" data-part="root" class={cn("ui-field", local.class)} />
  );
}

export function FieldLabel(props: LabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <Label
      {...rest}
      data-scope="ui-field"
      data-part="label"
      class={cn("ui-field-label", local.class)}
    />
  );
}

export function FieldDescription(props: FieldDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <p
      {...rest}
      data-scope="ui-field"
      data-part="description"
      class={cn("ui-field-description", local.class)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <p
      {...rest}
      role="alert"
      data-scope="ui-field"
      data-part="error"
      class={cn("ui-field-error", local.class)}
    />
  );
}
