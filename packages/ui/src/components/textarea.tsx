import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  "data-part"?: string;
  "data-scope"?: string;
  "data-slot"?: string;
  invalid?: boolean;
  rootClass?: string;
  size?: "sm" | "default" | "lg" | number;
  unstyled?: boolean;
};

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(props, [
    "aria-invalid",
    "class",
    "data-part",
    "data-scope",
    "data-slot",
    "disabled",
    "invalid",
    "rootClass",
    "size",
    "unstyled",
  ]);
  const size = () => local.size ?? "default";
  const invalid = () => Boolean(local.invalid || local["aria-invalid"]);

  return (
    <span
      data-scope="ui-textarea"
      data-part="root"
      data-disabled={local.disabled ? "" : undefined}
      data-invalid={invalid() ? "" : undefined}
      data-size={size()}
      data-slot="textarea-control"
      class={
        cn(
          !local.unstyled &&
            "ui-textarea-control relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          local.rootClass,
        ) || undefined
      }
    >
      <textarea
        {...rest}
        aria-invalid={invalid() || undefined}
        disabled={local.disabled}
        data-scope={local["data-scope"] ?? "ui-textarea"}
        data-part={local["data-part"] ?? "textarea"}
        data-slot={local["data-slot"] ?? "textarea"}
        class={cn(
          "ui-textarea field-sizing-content min-h-17.5 w-full rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] outline-none max-sm:min-h-20.5",
          size() === "sm" &&
            "min-h-16.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)] max-sm:min-h-19.5",
          size() === "lg" && "min-h-18.5 py-[calc(--spacing(2)-1px)] max-sm:min-h-21.5",
          local.class,
        )}
      />
    </span>
  );
}
