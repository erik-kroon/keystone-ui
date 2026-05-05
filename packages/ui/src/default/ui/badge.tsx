import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "default"
  | "destructive"
  | "error"
  | "info"
  | "muted"
  | "outline"
  | "primary"
  | "secondary"
  | "solid"
  | "success"
  | "warning";
export type BadgeSize = "default" | "lg" | "md" | "sm";

export type BadgeProps = ParentProps<
  JSX.HTMLAttributes<HTMLSpanElement> & {
    size?: BadgeSize;
    variant?: BadgeVariant;
  }
>;

const classes = (...tokens: string[]) => tokens.join(" ");

const baseBadgeClass = classes(
  "ui-badge",
  "relative",
  "inline-flex",
  "shrink-0",
  "items-center",
  "justify-center",
  "gap-1",
  "whitespace-nowrap",
  "rounded-sm",
  "border",
  "border-transparent",
  "font-medium",
  "outline-none",
  "transition-shadow",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-1",
  "focus-visible:ring-offset-background",
  "disabled:pointer-events-none",
  "disabled:opacity-64",
  "[&_svg:not([class*='opacity-'])]:opacity-80",
  "[&_svg:not([class*='size-'])]:size-3.5",
  "sm:[&_svg:not([class*='size-'])]:size-3",
  "[&_svg]:pointer-events-none",
  "[&_svg]:shrink-0",
  "[button&,a&]:cursor-pointer",
  "[button&,a&]:pointer-coarse:after:absolute",
  "[button&,a&]:pointer-coarse:after:size-full",
  "[button&,a&]:pointer-coarse:after:min-h-11",
  "[button&,a&]:pointer-coarse:after:min-w-11",
);

const badgeVariantClass: Record<BadgeVariant, string> = {
  default: classes("bg-primary", "text-primary-foreground", "[button&,a&]:hover:bg-primary/90"),
  destructive: classes("bg-destructive", "text-white", "[button&,a&]:hover:bg-destructive/90"),
  error: classes("bg-destructive/8", "text-destructive-foreground", "dark:bg-destructive/16"),
  info: classes("bg-info/8", "text-info-foreground", "dark:bg-info/16"),
  muted: classes("bg-muted", "text-muted-foreground", "dark:bg-muted/64"),
  outline: classes(
    "border-input",
    "bg-background",
    "text-foreground",
    "dark:bg-input/32",
    "[button&,a&]:hover:bg-accent/50",
    "dark:[button&,a&]:hover:bg-input/48",
  ),
  primary: classes("bg-primary", "text-primary-foreground", "[button&,a&]:hover:bg-primary/90"),
  secondary: classes(
    "bg-secondary",
    "text-secondary-foreground",
    "[button&,a&]:hover:bg-secondary/90",
  ),
  solid: classes("bg-primary", "text-primary-foreground", "[button&,a&]:hover:bg-primary/90"),
  success: classes("bg-success/8", "text-success-foreground", "dark:bg-success/16"),
  warning: classes("bg-warning/8", "text-warning-foreground", "dark:bg-warning/16"),
};

const badgeSizeClass: Record<BadgeSize, string> = {
  default: classes(
    "h-5.5",
    "min-w-5.5",
    "px-[calc(--spacing(1)-1px)]",
    "text-sm",
    "sm:h-4.5",
    "sm:min-w-4.5",
    "sm:text-xs",
  ),
  lg: classes(
    "h-6.5",
    "min-w-6.5",
    "px-[calc(--spacing(1.5)-1px)]",
    "text-base",
    "sm:h-5.5",
    "sm:min-w-5.5",
    "sm:text-sm",
  ),
  md: classes(
    "h-5.5",
    "min-w-5.5",
    "px-[calc(--spacing(1)-1px)]",
    "text-sm",
    "sm:h-4.5",
    "sm:min-w-4.5",
    "sm:text-xs",
  ),
  sm: classes(
    "h-5",
    "min-w-5",
    "rounded-[.25rem]",
    "px-[calc(--spacing(1)-1px)]",
    "text-xs",
    "sm:h-4",
    "sm:min-w-4",
    "sm:text-[.625rem]",
  ),
};

export function badgeClass(props: { class?: string; size?: BadgeSize; variant?: BadgeVariant }) {
  const variant = props.variant ?? "default";
  const size = props.size ?? "default";

  return cn(baseBadgeClass, badgeVariantClass[variant], badgeSizeClass[size], props.class);
}

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ["class", "size", "variant"]);
  const size = () => local.size ?? "default";
  const variant = () => local.variant ?? "default";

  return (
    <span
      {...rest}
      data-scope="ui-badge"
      data-part="root"
      data-slot="badge"
      data-size={size()}
      data-variant={variant()}
      class={badgeClass({ class: local.class, size: size(), variant: variant() })}
    />
  );
}
