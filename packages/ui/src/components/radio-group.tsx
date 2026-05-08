import {
  RadioGroup as CoreRadioGroup,
  type RadioGroupHiddenInputProps as CoreRadioGroupHiddenInputProps,
  type RadioGroupItemIndicatorProps as CoreRadioGroupItemIndicatorProps,
  type RadioGroupItemProps as CoreRadioGroupItemProps,
  type RadioGroupRootProps as CoreRadioGroupRootProps,
} from "@keystone-ui/core/radio-group";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type RadioGroupProps = CoreRadioGroupRootProps;
export type RadioGroupItemProps = CoreRadioGroupItemProps & {
  indicator?: JSX.Element;
};
export type RadioGroupItemIndicatorProps = CoreRadioGroupItemIndicatorProps;
export type RadioGroupHiddenInputProps = CoreRadioGroupHiddenInputProps;

const classes = (...tokens: string[]) => tokens.join(" ");

const radioClass = classes(
  "relative",
  "inline-flex",
  "size-4.5",
  "shrink-0",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "rounded-full",
  "border",
  "border-input",
  "bg-background",
  "not-dark:bg-clip-padding",
  "shadow-xs/5",
  "outline-none",
  "transition-shadow",
  "before:pointer-events-none",
  "before:absolute",
  "before:inset-0",
  "before:rounded-full",
  "not-group-data-checked:not-group-data-disabled:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-1",
  "focus-visible:ring-offset-background",
  "aria-invalid:border-destructive/36",
  "focus-visible:aria-invalid:border-destructive/64",
  "focus-visible:aria-invalid:ring-destructive/48",
  "data-disabled:cursor-not-allowed",
  "data-disabled:opacity-64",
  "sm:size-4",
  "dark:not-group-data-checked:bg-input/32",
  "dark:aria-invalid:ring-destructive/24",
  "dark:not-group-data-disabled:not-group-data-checked:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
  "group-data-checked:shadow-none",
  "group-data-disabled:shadow-none",
  "aria-invalid:shadow-none",
);

const radioIndicatorClass = classes(
  "absolute",
  "-inset-px",
  "flex",
  "size-4.5",
  "items-center",
  "justify-center",
  "rounded-full",
  "before:size-2",
  "before:rounded-full",
  "before:bg-primary-foreground",
  "data-checked:bg-primary",
  "data-unchecked:hidden",
  "sm:size-4",
  "sm:before:size-1.5",
);

export function RadioGroup(props: RadioGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreRadioGroup.Root
      {...rest}
      data-slot="radio-group"
      class={cn("ui-radio-group flex flex-col gap-3", local.class)}
    />
  );
}

export function RadioGroupItem(props: RadioGroupItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <CoreRadioGroup.Item
      {...rest}
      data-slot="radio-group-item"
      class={cn(
        "ui-radio-group-item group inline-flex cursor-pointer items-center gap-2 text-sm data-disabled:cursor-not-allowed",
        local.class,
      )}
    >
      <span
        data-scope="ui-radio-group"
        data-part="item-control"
        data-slot="radio"
        class={cn(radioClass, "ui-radio-group-item-control")}
      >
        <RadioGroupItemIndicator forceMount>{local.indicator ?? ""}</RadioGroupItemIndicator>
      </span>
      <span data-scope="ui-radio-group" data-part="item-label" data-slot="radio-label">
        {local.children}
      </span>
      <RadioGroupHiddenInput />
    </CoreRadioGroup.Item>
  );
}

export function RadioGroupItemIndicator(props: RadioGroupItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreRadioGroup.ItemIndicator
      {...rest}
      data-slot="radio-indicator"
      class={cn("ui-radio-group-item-indicator", radioIndicatorClass, local.class)}
    />
  );
}

export function RadioGroupHiddenInput(props: RadioGroupHiddenInputProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreRadioGroup.HiddenInput
      {...rest}
      data-slot="radio-group-input"
      class={cn("ui-radio-group-input sr-only", local.class)}
    />
  );
}
