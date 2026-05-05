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
  "leading-none",
  "tabular-nums",
  "[&_svg:not([class*='size-'])]:size-3.5",
  "[&_svg]:pointer-events-none",
  "[&_svg]:shrink-0",
);

const badgeVariantClass: Record<BadgeVariant, string> = {
  default: classes(
    "bg-primary",
    "text-primary-foreground",
    "shadow-primary/16",
    "shadow-xs",
    "dark:shadow-none",
  ),
  destructive: classes(
    "bg-destructive",
    "text-white",
    "shadow-destructive/16",
    "shadow-xs",
    "dark:shadow-none",
  ),
  error: classes("bg-destructive/8", "text-destructive-foreground", "dark:bg-destructive/16"),
  info: classes("bg-primary/8", "text-primary", "dark:bg-primary/16"),
  muted: classes("bg-muted", "text-muted-foreground", "dark:bg-muted/64"),
  outline: classes(
    "border-input",
    "bg-popover",
    "text-foreground",
    "shadow-xs/5",
    "dark:bg-input/32",
  ),
  primary: classes(
    "bg-primary",
    "text-primary-foreground",
    "shadow-primary/16",
    "shadow-xs",
    "dark:shadow-none",
  ),
  solid: classes(
    "bg-primary",
    "text-primary-foreground",
    "shadow-primary/16",
    "shadow-xs",
    "dark:shadow-none",
  ),
  success: classes(
    "bg-emerald-500/8",
    "text-emerald-700",
    "dark:bg-emerald-500/16",
    "dark:text-emerald-300",
  ),
  warning: classes(
    "bg-amber-500/8",
    "text-amber-700",
    "dark:bg-amber-500/16",
    "dark:text-amber-300",
  ),
};

const badgeSizeClass: Record<BadgeSize, string> = {
  default: classes("h-5.5", "px-1.5", "text-sm", "sm:h-4.5", "sm:text-xs"),
  lg: classes("h-6.5", "px-2", "text-base", "sm:h-5.5", "sm:text-sm"),
  md: classes("h-5.5", "px-1.5", "text-sm", "sm:h-4.5", "sm:text-xs"),
  sm: classes("h-5", "px-1.5", "text-xs", "sm:h-4", "sm:text-[0.625rem]"),
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
