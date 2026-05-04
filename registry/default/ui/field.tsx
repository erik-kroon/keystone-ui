import {
  Field as CoreField,
  type FieldControlProps as CoreFieldControlProps,
  type FieldDescriptionProps as CoreFieldDescriptionProps,
  type FieldErrorMessageProps as CoreFieldErrorMessageProps,
  type FieldHiddenInputProps as CoreFieldHiddenInputProps,
  type FieldLabelProps as CoreFieldLabelProps,
  type FieldRootProps as CoreFieldRootProps,
} from "@keystone-ui/core/form";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type FieldProps = CoreFieldRootProps;
export type FieldLabelProps = CoreFieldLabelProps;
export type FieldItemProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type FieldControlProps = CoreFieldControlProps<HTMLInputElement> &
  JSX.InputHTMLAttributes<HTMLInputElement>;
export type FieldDescriptionProps = CoreFieldDescriptionProps;
export type FieldErrorProps = CoreFieldErrorMessageProps;
export type FieldHiddenInputProps = CoreFieldHiddenInputProps;

const classes = (...tokens: string[]) => tokens.join(" ");

export function Field(props: FieldProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreField.Root
      {...rest}
      data-slot="field"
      class={cn(classes("ui-field", "flex", "flex-col", "items-start", "gap-2"), local.class)}
    />
  );
}

export function FieldLabel(props: FieldLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreField.Label
      {...rest}
      data-slot="field-label"
      class={cn(
        classes(
          "ui-field-label",
          "inline-flex",
          "items-center",
          "gap-2",
          "font-medium",
          "text-base/4.5",
          "text-foreground",
          "data-disabled:opacity-64",
          "sm:text-sm/4",
        ),
        local.class,
      )}
    />
  );
}

export function FieldItem(props: FieldItemProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-field"
      data-part="item"
      data-slot="field-item"
      class={cn(classes("ui-field-item", "flex"), local.class)}
    />
  );
}

export function FieldControl(props: FieldControlProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreField.Control
      {...rest}
      data-slot="field-control"
      class={cn(
        classes(
          "ui-field-control",
          "h-8.5",
          "w-full",
          "min-w-0",
          "rounded-lg",
          "border",
          "border-input",
          "bg-background",
          "px-[calc(--spacing(3)-1px)]",
          "text-base",
          "text-foreground",
          "shadow-xs/5",
          "outline-none",
          "ring-ring/24",
          "transition-shadow",
          "placeholder:text-muted-foreground/72",
          "data-invalid:border-destructive/36",
          "data-invalid:ring-destructive/16",
          "data-disabled:opacity-64",
          "data-focused:border-ring",
          "data-focused:ring-[3px]",
          "sm:h-7.5",
          "sm:text-sm",
        ),
        local.class,
      )}
    />
  );
}

export function FieldDescription(props: FieldDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreField.Description
      {...rest}
      data-slot="field-description"
      class={cn(classes("ui-field-description", "text-muted-foreground", "text-xs"), local.class)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreField.ErrorMessage
      {...rest}
      data-slot="field-error"
      class={cn(classes("ui-field-error", "text-destructive-foreground", "text-xs"), local.class)}
    />
  );
}

export function FieldHiddenInput(props: FieldHiddenInputProps) {
  return <CoreField.HiddenInput {...props} data-slot="field-hidden-input" />;
}

export const FieldPrimitive = CoreField;
