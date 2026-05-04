import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type InputSize = "sm" | "default" | "lg" | number;

export type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  invalid?: boolean;
  nativeInput?: boolean;
  size?: InputSize;
  unstyled?: boolean;
};

const classes = (...tokens: string[]) => tokens.join(" ");

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, [
    "aria-invalid",
    "class",
    "disabled",
    "invalid",
    "nativeInput",
    "size",
    "type",
    "unstyled",
  ]);
  const size = () => local.size ?? "default";
  const invalid = () => Boolean(local.invalid || local["aria-invalid"]);
  const inputClass = () =>
    cn(
      classes(
        "ui-input",
        "h-8.5",
        "w-full",
        "min-w-0",
        "rounded-[inherit]",
        "px-[calc(--spacing(3)-1px)]",
        "leading-8.5",
        "outline-none",
        "[transition:background-color_5000000s_ease-in-out_0s]",
        "placeholder:text-muted-foreground/72",
        "sm:h-7.5",
        "sm:leading-7.5",
      ),
      size() === "sm" &&
        classes(
          "h-7.5",
          "px-[calc(--spacing(2.5)-1px)]",
          "leading-7.5",
          "sm:h-6.5",
          "sm:leading-6.5",
        ),
      size() === "lg" && classes("h-9.5", "leading-9.5", "sm:h-8.5", "sm:leading-8.5"),
      local.type === "search" &&
        classes(
          "[&::-webkit-search-cancel-button]:appearance-none",
          "[&::-webkit-search-decoration]:appearance-none",
          "[&::-webkit-search-results-button]:appearance-none",
          "[&::-webkit-search-results-decoration]:appearance-none",
        ),
      local.type === "file" &&
        classes(
          "text-muted-foreground",
          "file:me-3",
          "file:bg-transparent",
          "file:font-medium",
          "file:text-foreground",
          "file:text-sm",
        ),
    );

  return (
    <span
      data-scope="ui-input"
      data-part="root"
      data-disabled={local.disabled ? "" : undefined}
      data-invalid={invalid() ? "" : undefined}
      data-size={size()}
      data-slot="input-control"
      class={
        cn(
          !local.unstyled &&
            classes(
              "ui-input-control",
              "relative",
              "inline-flex",
              "w-full",
              "rounded-lg",
              "border",
              "border-input",
              "bg-background",
              "not-dark:bg-clip-padding",
              "text-base",
              "text-foreground",
              "shadow-xs/5",
              "ring-ring/24",
              "transition-shadow",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-lg)-1px)]",
              "not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]",
              "has-focus-visible:has-aria-invalid:border-destructive/64",
              "has-focus-visible:has-aria-invalid:ring-destructive/16",
              "has-aria-invalid:border-destructive/36",
              "has-focus-visible:border-ring",
              "has-autofill:bg-foreground/4",
              "has-disabled:opacity-64",
              "has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none",
              "has-focus-visible:ring-[3px]",
              "sm:text-sm",
              "dark:bg-input/32",
              "dark:has-autofill:bg-foreground/8",
              "dark:has-aria-invalid:ring-destructive/24",
              "dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
          local.class,
        ) || undefined
      }
    >
      <input
        {...rest}
        aria-invalid={invalid() || undefined}
        disabled={local.disabled}
        data-scope="ui-input"
        data-part="input"
        data-slot="input"
        size={typeof size() === "number" ? size() : undefined}
        type={local.type}
        class={inputClass()}
      />
    </span>
  );
}
