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
    "border-border",
    "bg-transparent",
    "text-foreground",
    "dark:bg-input/32",
    "*:data-[slot=alert-icon]:text-muted-foreground",
  ),
  error: classes(
    "border-destructive/32",
    "bg-destructive/4",
    "text-foreground",
    "*:data-[slot=alert-icon]:text-destructive",
  ),
  info: classes(
    "border-primary/32",
    "bg-primary/4",
    "text-foreground",
    "*:data-[slot=alert-icon]:text-primary",
  ),
  success: classes(
    "border-emerald-500/32",
    "bg-emerald-500/4",
    "text-foreground",
    "*:data-[slot=alert-icon]:text-emerald-700",
    "dark:*:data-[slot=alert-icon]:text-emerald-300",
  ),
  warning: classes(
    "border-amber-500/32",
    "bg-amber-500/4",
    "text-foreground",
    "*:data-[slot=alert-icon]:text-amber-700",
    "dark:*:data-[slot=alert-icon]:text-amber-300",
  ),
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
        "grid-cols-[1rem_minmax(0,1fr)]",
        "items-start",
        "gap-x-3",
        "gap-y-2.5",
        "rounded-xl",
        "border",
        "px-3",
        "py-3.5",
        "text-sm",
        "shadow-xs/5",
        "has-data-[slot=alert-action]:grid-cols-[1rem_minmax(0,1fr)]",
        "sm:has-data-[slot=alert-action]:grid-cols-[1rem_minmax(0,1fr)_auto]",
        "before:pointer-events-none",
        "before:absolute",
        "before:inset-0",
        "before:rounded-[calc(var(--radius-xl)-1px)]",
        "not-dark:before:shadow-[0_1px_--theme(--color-black/4%)]",
        "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
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
      "row-span-2",
      "row-start-1",
      "mt-0.5",
      "flex",
      "size-4",
      "items-center",
      "justify-center",
    ),
    props,
  );
}

export function AlertTitle(props: AlertPartProps) {
  return alertPart(
    "title",
    classes("ui-alert-title", "col-start-2", "row-start-1", "min-w-0", "font-medium", "leading-5"),
    props,
  );
}

export function AlertDescription(props: AlertPartProps) {
  return alertPart(
    "description",
    classes(
      "ui-alert-description",
      "col-start-2",
      "min-w-0",
      "text-muted-foreground",
      "leading-5",
      "[&_p:not(:first-child)]:mt-2.5",
      "[&_a]:font-medium",
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
      "col-start-2",
      "inline-flex",
      "flex-wrap",
      "items-center",
      "gap-1",
      "pt-0.5",
      "sm:col-start-3",
      "sm:row-span-2",
      "sm:row-start-1",
      "sm:justify-self-end",
      "sm:pt-0",
    ),
    props,
  );
}
