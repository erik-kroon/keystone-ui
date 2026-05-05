import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type KbdSize = "sm" | "default" | "lg";
export type KbdVariant = "default" | "muted" | "outline";

export type KbdProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> & {
    size?: KbdSize;
    variant?: KbdVariant;
  }
>;

export type KbdGroupProps = ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>;
export type KbdSeparatorProps = ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

const kbdSizeClass: Record<KbdSize, string> = {
  sm: classes("h-4.5", "min-w-4.5", "px-1", "text-[0.625rem]"),
  default: classes("h-5", "min-w-5", "px-1.5", "text-[0.6875rem]"),
  lg: classes("h-6", "min-w-6", "px-2", "text-xs"),
};

const kbdVariantClass: Record<KbdVariant, string> = {
  default: classes("border-input", "bg-background", "text-foreground", "shadow-xs/5"),
  muted: classes("border-transparent", "bg-muted", "text-muted-foreground"),
  outline: classes("border-input", "bg-transparent", "text-foreground"),
};

export function Kbd(props: KbdProps) {
  const [local, rest] = splitProps(props, ["class", "size", "variant"]);
  const size = () => local.size ?? "default";
  const variant = () => local.variant ?? "default";

  return (
    <kbd
      {...rest}
      data-scope="ui-kbd"
      data-part="root"
      data-size={size()}
      data-slot="kbd"
      data-variant={variant()}
      class={cn(
        classes(
          "ui-kbd",
          "inline-flex",
          "shrink-0",
          "items-center",
          "justify-center",
          "rounded",
          "border",
          "font-medium",
          "font-sans",
          "leading-none",
          "whitespace-nowrap",
        ),
        kbdSizeClass[size()],
        kbdVariantClass[variant()],
        local.class,
      )}
    />
  );
}

export function KbdGroup(props: KbdGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      data-scope="ui-kbd"
      data-part="group"
      data-slot="kbd-group"
      class={cn(
        classes("ui-kbd-group", "inline-flex", "min-w-0", "items-center", "gap-1"),
        local.class,
      )}
    />
  );
}

export function KbdSeparator(props: KbdSeparatorProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <span
      {...rest}
      aria-hidden="true"
      data-scope="ui-kbd"
      data-part="separator"
      data-slot="kbd-separator"
      class={cn(
        classes("ui-kbd-separator", "text-muted-foreground/56", "text-xs", "leading-none"),
        local.class,
      )}
    >
      {local.children ?? "+"}
    </span>
  );
}
