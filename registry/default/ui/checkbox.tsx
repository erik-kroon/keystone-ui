import {
  Checkbox as CoreCheckbox,
  type CheckboxControlProps as CoreCheckboxControlProps,
  type CheckboxHiddenInputProps as CoreCheckboxHiddenInputProps,
  type CheckboxIndicatorProps as CoreCheckboxIndicatorProps,
  type CheckboxRootProps as CoreCheckboxRootProps,
} from "@keystone-ui/core/checkbox";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type CheckboxProps = CoreCheckboxRootProps & {
  indicator?: JSX.Element;
};
export type CheckboxControlProps = CoreCheckboxControlProps;
export type CheckboxIndicatorProps = CoreCheckboxIndicatorProps;
export type CheckboxHiddenInputProps = CoreCheckboxHiddenInputProps;

const classes = (...tokens: string[]) => tokens.join(" ");

const checkboxControlClass = classes(
  "relative",
  "inline-flex",
  "size-4.5",
  "shrink-0",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "rounded-[.25rem]",
  "border",
  "border-input",
  "bg-background",
  "not-dark:bg-clip-padding",
  "shadow-xs/5",
  "outline-none",
  "ring-ring",
  "transition-shadow",
  "before:pointer-events-none",
  "before:absolute",
  "before:inset-0",
  "before:rounded-[3px]",
  "not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]",
  "focus-visible:ring-2",
  "focus-visible:ring-offset-1",
  "focus-visible:ring-offset-background",
  "aria-invalid:border-destructive/36",
  "focus-visible:aria-invalid:border-destructive/64",
  "focus-visible:aria-invalid:ring-destructive/48",
  "data-disabled:cursor-not-allowed",
  "data-disabled:opacity-64",
  "sm:size-4",
  "dark:not-data-checked:bg-input/32",
  "dark:aria-invalid:ring-destructive/24",
  "dark:not-data-disabled:not-data-checked:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
  "[[data-disabled],[data-checked],[aria-invalid]]:shadow-none",
);

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      class={classes("size-3.5", "sm:size-3", "in-data-[state=indeterminate]:hidden")}
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      aria-hidden="true"
      class={classes("hidden", "size-3.5", "sm:size-3", "in-data-[state=indeterminate]:block")}
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M5.252 12h13.496" />
    </svg>
  );
}

export function Checkbox(props: CheckboxProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <CoreCheckbox.Root
      {...rest}
      class={cn(classes("ui-checkbox", "inline-flex", "items-center"), local.class)}
    >
      {local.children ?? (
        <>
          <CheckboxControl>
            <CheckboxIndicator>{local.indicator ?? <CheckboxIndicatorIcon />}</CheckboxIndicator>
          </CheckboxControl>
          <CheckboxHiddenInput />
        </>
      )}
    </CoreCheckbox.Root>
  );
}

export function CheckboxControl(props: CheckboxControlProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCheckbox.Control
      {...rest}
      data-slot="checkbox"
      class={cn(checkboxControlClass, "ui-checkbox-control", local.class)}
    />
  );
}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCheckbox.Indicator
      {...rest}
      data-slot="checkbox-indicator"
      class={cn(
        classes(
          "ui-checkbox-indicator",
          "absolute",
          "-inset-px",
          "flex",
          "items-center",
          "justify-center",
          "rounded-[.25rem]",
          "text-primary-foreground",
          "data-checked:bg-primary",
          "data-[state=indeterminate]:text-foreground",
        ),
        local.class,
      )}
    />
  );
}

export function CheckboxIndicatorIcon() {
  return (
    <>
      <MinusIcon />
      <CheckIcon />
    </>
  );
}

export function CheckboxHiddenInput(props: CheckboxHiddenInputProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCheckbox.HiddenInput
      {...rest}
      data-slot="checkbox-input"
      class={cn("ui-checkbox-input", local.class)}
    />
  );
}

export const CheckboxPrimitive = CoreCheckbox;
