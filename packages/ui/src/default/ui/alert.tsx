import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type AlertVariant = "default" | "error" | "info" | "success" | "warning";

export type AlertProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    variant?: AlertVariant;
  }
>;

export type AlertPartProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

const alertVariantClass: Record<AlertVariant, string> = {
  default: classes(
    "bg-transparent",
    "dark:bg-input/32",
    "*:data-[slot=alert-icon]:text-muted-foreground",
  ),
  error: classes(
    "border-destructive/32",
    "bg-destructive/4",
    "*:data-[slot=alert-icon]:text-destructive",
  ),
  info: classes("border-info/32", "bg-info/4", "*:data-[slot=alert-icon]:text-info"),
  success: classes("border-success/32", "bg-success/4", "*:data-[slot=alert-icon]:text-success"),
  warning: classes("border-warning/32", "bg-warning/4", "*:data-[slot=alert-icon]:text-warning"),
};

function alertPart(part: string, className: string, props: AlertPartProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-alert"
      data-part={part}
      data-slot={`alert-${part}`}
      class={cn(className, local.class)}
    />
  );
}

export function Alert(props: AlertProps) {
  const [local, rest] = splitProps(props, ["class", "variant", "role", "aria-live"]);
  const variant = () => local.variant ?? "default";
  const role = () => local.role ?? (variant() === "error" ? "alert" : "status");

  return (
    <div
      {...rest}
      role={role()}
      aria-live={local["aria-live"] ?? (role() === "status" ? "polite" : undefined)}
      data-scope="ui-alert"
      data-part="root"
      data-slot="alert"
      data-variant={variant()}
      class={cn(
        "ui-alert",
        "relative",
        "grid",
        "w-full",
        "items-start",
        "gap-x-2",
        "gap-y-0.5",
        "rounded-xl",
        "border",
        "px-3.5",
        "py-3",
        "text-card-foreground",
        "text-sm",
        "has-data-[slot=alert-action]:grid-cols-[1fr_auto]",
        "has-data-[slot=alert-icon]:grid-cols-[calc(var(--spacing)*4)_1fr]",
        "has-data-[slot=alert-icon]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto]",
        "has-data-[slot=alert-icon]:gap-x-2",
        "[&_[data-slot=alert-icon]>svg:not([class*='size-'])]:size-4",
        "[&_[data-slot=alert-icon]>svg]:shrink-0",
        alertVariantClass[variant()],
        local.class,
      )}
    />
  );
}

export function AlertIcon(props: AlertPartProps) {
  return alertPart(
    "icon",
    classes(
      "ui-alert-icon",
      "col-start-1",
      "[[data-slot=alert]>_&]:col-start-1",
      "[[data-slot=alert]>_&]:row-start-1",
      "flex",
      "h-lh",
      "w-4",
      "items-center",
      "justify-center",
    ),
    props,
  );
}

export function AlertTitle(props: AlertPartProps) {
  return alertPart(
    "title",
    classes(
      "ui-alert-title",
      "[[data-slot=alert]:has(>[data-slot=alert-icon])>_&]:col-start-2",
      "font-medium",
    ),
    props,
  );
}

export function AlertDescription(props: AlertPartProps) {
  return alertPart(
    "description",
    classes(
      "ui-alert-description",
      "[[data-slot=alert]:has(>[data-slot=alert-icon])>_&]:col-start-2",
      "flex",
      "flex-col",
      "gap-2.5",
      "text-muted-foreground",
      "[&_a:hover]:text-primary",
      "[&_a]:underline",
      "[&_a]:underline-offset-4",
    ),
    props,
  );
}

export function AlertAction(props: AlertPartProps) {
  return alertPart(
    "action",
    classes(
      "ui-alert-action",
      "flex",
      "gap-1",
      "[[data-slot=alert]:has(>[data-slot=alert-icon])>_&]:col-start-3",
      "max-sm:col-start-2",
      "max-sm:mt-2",
      "sm:row-end-3",
      "sm:row-start-1",
      "sm:self-center",
    ),
    props,
  );
}
