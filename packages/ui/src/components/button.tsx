import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "destructive-outline"
  | "ghost"
  | "link"
  | "outline"
  | "secondary"
  | "solid";
export type ButtonSize =
  | "default"
  | "icon"
  | "icon-lg"
  | "icon-sm"
  | "icon-xl"
  | "icon-xs"
  | "lg"
  | "md"
  | "sm"
  | "xl"
  | "xs";

export type ButtonProps = ParentProps<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    loadingLabel?: string;
    pressed?: boolean;
    size?: ButtonSize;
    variant?: ButtonVariant;
  }
>;

const classes = (...tokens: string[]) => tokens.join(" ");

const baseButtonClass = classes(
  "relative",
  "inline-flex",
  "shrink-0",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "rounded-lg",
  "border",
  "font-medium",
  "text-base",
  "outline-none",
  "transition-shadow",
  "before:pointer-events-none",
  "before:absolute",
  "before:inset-0",
  "before:rounded-[calc(var(--radius-lg)-1px)]",
  "pointer-coarse:after:absolute",
  "pointer-coarse:after:size-full",
  "pointer-coarse:after:min-h-11",
  "pointer-coarse:after:min-w-11",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-1",
  "focus-visible:ring-offset-background",
  "disabled:pointer-events-none",
  "disabled:opacity-64",
  "data-loading:select-none",
  "data-loading:text-transparent",
  "sm:text-sm",
  "[&_svg:not([class*='opacity-'])]:opacity-80",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "sm:[&_svg:not([class*='size-'])]:size-4",
  "[&_svg]:pointer-events-none",
  "[&_svg]:-mx-0.5",
  "[&_svg]:shrink-0",
);

const primaryButtonClass = classes(
  "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)]",
  "border-primary",
  "bg-primary",
  "text-primary-foreground",
  "shadow-primary/24",
  "shadow-xs",
  "hover:bg-primary/90",
  "data-pressed:bg-primary/90",
  "*:data-[slot=button-loading-indicator]:text-primary-foreground",
  "[:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)]",
  "[:disabled,:active,[data-pressed]]:shadow-none",
);

const buttonVariantClass: Record<ButtonVariant, string> = {
  default: primaryButtonClass,
  destructive: classes(
    "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)]",
    "border-destructive",
    "bg-destructive",
    "text-white",
    "shadow-destructive/24",
    "shadow-xs",
    "hover:bg-destructive/90",
    "data-pressed:bg-destructive/90",
    "*:data-[slot=button-loading-indicator]:text-white",
    "[:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)]",
    "[:disabled,:active,[data-pressed]]:shadow-none",
  ),
  "destructive-outline": classes(
    "border-input",
    "bg-popover",
    "not-dark:bg-clip-padding",
    "text-destructive-foreground",
    "shadow-xs/5",
    "not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)]",
    "hover:border-destructive/32",
    "hover:bg-destructive/4",
    "data-pressed:border-destructive/32",
    "data-pressed:bg-destructive/4",
    "*:data-[slot=button-loading-indicator]:text-foreground",
    "dark:bg-input/32",
    "dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)]",
    "dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)]",
    "[:disabled,:active,[data-pressed]]:shadow-none",
  ),
  ghost: classes(
    "border-transparent",
    "text-foreground",
    "hover:bg-accent",
    "data-pressed:bg-accent",
    "*:data-[slot=button-loading-indicator]:text-foreground",
  ),
  link: classes(
    "border-transparent",
    "text-foreground",
    "underline-offset-4",
    "hover:underline",
    "data-pressed:underline",
    "*:data-[slot=button-loading-indicator]:text-foreground",
  ),
  outline: classes(
    "border-input",
    "bg-popover",
    "not-dark:bg-clip-padding",
    "text-foreground",
    "shadow-xs/5",
    "not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)]",
    "hover:bg-accent/50",
    "data-pressed:bg-accent/50",
    "*:data-[slot=button-loading-indicator]:text-foreground",
    "dark:bg-input/32",
    "dark:data-pressed:bg-input/64",
    "dark:hover:bg-input/64",
    "dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)]",
    "dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)]",
    "[:disabled,:active,[data-pressed]]:shadow-none",
  ),
  secondary: classes(
    "border-transparent",
    "bg-secondary",
    "text-secondary-foreground",
    "hover:bg-secondary/90",
    "data-pressed:bg-secondary/90",
    "*:data-[slot=button-loading-indicator]:text-secondary-foreground",
    "[:active,[data-pressed]]:bg-secondary/80",
  ),
  solid: primaryButtonClass,
};

const buttonSizeClass: Record<ButtonSize, string> = {
  default: classes("h-9", "px-[calc(--spacing(3)-1px)]", "sm:h-8"),
  icon: classes("size-9", "sm:size-8"),
  "icon-lg": classes("size-10", "sm:size-9"),
  "icon-sm": classes("size-8", "sm:size-7"),
  "icon-xl": classes(
    "size-11",
    "sm:size-10",
    "[&_svg:not([class*='size-'])]:size-5",
    "sm:[&_svg:not([class*='size-'])]:size-4.5",
  ),
  "icon-xs": classes(
    "size-7",
    "rounded-md",
    "before:rounded-[calc(var(--radius-md)-1px)]",
    "sm:size-6",
    "not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-4",
    "sm:not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
  ),
  lg: classes("h-10", "px-[calc(--spacing(3.5)-1px)]", "sm:h-9"),
  md: classes("h-9", "px-[calc(--spacing(3)-1px)]", "sm:h-8"),
  sm: classes("h-8", "gap-1.5", "px-[calc(--spacing(2.5)-1px)]", "sm:h-7"),
  xl: classes(
    "h-11",
    "px-[calc(--spacing(4)-1px)]",
    "text-lg",
    "sm:h-10",
    "sm:text-base",
    "[&_svg:not([class*='size-'])]:size-5",
    "sm:[&_svg:not([class*='size-'])]:size-4.5",
  ),
  xs: classes(
    "h-7",
    "gap-1",
    "rounded-md",
    "px-[calc(--spacing(2)-1px)]",
    "text-sm",
    "before:rounded-[calc(var(--radius-md)-1px)]",
    "sm:h-6",
    "sm:text-xs",
    "[&_svg:not([class*='size-'])]:size-4",
    "sm:[&_svg:not([class*='size-'])]:size-3.5",
  ),
};

export function buttonClass(props: { class?: string; size?: ButtonSize; variant?: ButtonVariant }) {
  const variant = props.variant ?? "default";
  const size = props.size ?? "default";

  return cn(baseButtonClass, buttonVariantClass[variant], buttonSizeClass[size], props.class);
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "disabled",
    "loading",
    "loadingLabel",
    "pressed",
    "size",
    "type",
    "variant",
  ]);
  const variant = () => local.variant ?? "default";
  const size = () => local.size ?? "default";
  const loading = () => local.loading ?? false;
  const disabled = () => Boolean(local.disabled || loading());
  const loadingLabel = () => local.loadingLabel ?? "Loading";

  return (
    <button
      {...rest}
      aria-busy={loading() || undefined}
      aria-disabled={loading() || undefined}
      aria-pressed={local.pressed ?? undefined}
      disabled={disabled()}
      data-scope="ui-button"
      data-part="root"
      data-disabled={disabled() ? "" : undefined}
      data-loading={loading() ? "" : undefined}
      data-pressed={local.pressed ? "" : undefined}
      data-variant={variant()}
      data-size={size()}
      data-slot="button"
      type={local.type ?? "button"}
      class={buttonClass({ class: cn("ui-button", local.class), size: size(), variant: variant() })}
    >
      {local.children}
      {loading() && (
        <span
          aria-hidden="true"
          class={classes(
            "ui-button-loading-indicator",
            "pointer-events-none",
            "absolute",
            "inline-block",
            "size-4",
            "animate-spin",
            "rounded-full",
            "border-2",
            "border-current",
            "border-r-transparent",
          )}
          data-scope="ui-button"
          data-part="loading-indicator"
          data-slot="button-loading-indicator"
        />
      )}
      {loading() && (
        <span class="sr-only" data-scope="ui-button" data-part="loading-label">
          {loadingLabel()}
        </span>
      )}
    </button>
  );
}
