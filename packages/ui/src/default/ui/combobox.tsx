import {
  Combobox as CoreCombobox,
  type ComboboxArrowProps as CoreComboboxArrowProps,
  type ComboboxClearProps as CoreComboboxClearProps,
  type ComboboxContentProps as CoreComboboxContentProps,
  type ComboboxGroupLabelProps as CoreComboboxGroupLabelProps,
  type ComboboxGroupProps as CoreComboboxGroupProps,
  type ComboboxInputProps as CoreComboboxInputProps,
  type ComboboxItemIndicatorProps as CoreComboboxItemIndicatorProps,
  type ComboboxItemProps as CoreComboboxItemProps,
  type ComboboxItemTextProps as CoreComboboxItemTextProps,
  type ComboboxListboxProps as CoreComboboxListboxProps,
  type ComboboxPortalProps as CoreComboboxPortalProps,
  type ComboboxPositionerProps as CoreComboboxPositionerProps,
  type ComboboxRootProps as CoreComboboxRootProps,
  type ComboboxTriggerProps as CoreComboboxTriggerProps,
} from "@keystone-ui/core/combobox";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ComboboxProps = CoreComboboxRootProps;
export type ComboboxSize = "sm" | "default" | "lg" | number;
export type ComboboxInputProps = Omit<CoreComboboxInputProps, "size"> & {
  clearProps?: ComboboxClearProps;
  inputClass?: string;
  showClear?: boolean;
  showTrigger?: boolean;
  size?: ComboboxSize;
  startAddon?: JSX.Element;
  triggerProps?: ComboboxTriggerProps;
};
export type ComboboxChipsInputProps = Omit<CoreComboboxInputProps, "size"> & {
  size?: ComboboxSize;
};
export type ComboboxTriggerProps = CoreComboboxTriggerProps;
export type ComboboxClearProps = CoreComboboxClearProps;
export type ComboboxPortalProps = CoreComboboxPortalProps;
export type ComboboxPositionerProps = CoreComboboxPositionerProps;
export type ComboboxContentProps = CoreComboboxContentProps & {
  portal?: ComboboxPortalProps;
  positionerClass?: string;
};
export type ComboboxListboxProps = CoreComboboxListboxProps;
export type ComboboxGroupProps = CoreComboboxGroupProps;
export type ComboboxGroupLabelProps = CoreComboboxGroupLabelProps;
export type ComboboxItemProps = CoreComboboxItemProps & {
  indicator?: JSX.Element;
};
export type ComboboxItemTextProps = CoreComboboxItemTextProps;
export type ComboboxItemIndicatorProps = CoreComboboxItemIndicatorProps;
export type ComboboxArrowProps = CoreComboboxArrowProps;
export type ComboboxSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ComboboxEmptyProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type ComboboxStatusProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

function TriggerIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
    </svg>
  );
}

function actionButtonClass(size: ComboboxSize) {
  return classes(
    "absolute",
    "top-1/2",
    "inline-flex",
    "size-8",
    "shrink-0",
    "-translate-y-1/2",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "rounded-md",
    "border",
    "border-transparent",
    "opacity-80",
    "outline-none",
    "transition-opacity",
    "pointer-coarse:after:absolute",
    "pointer-coarse:after:min-h-11",
    "pointer-coarse:after:min-w-11",
    "hover:opacity-100",
    "has-[+[data-slot=combobox-clear]]:hidden",
    "sm:size-7",
    "[&_svg:not([class*='size-'])]:size-4.5",
    "sm:[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    size === "sm" ? "end-0" : "end-0.5",
  );
}

export function Combobox(props: ComboboxProps) {
  return <CoreCombobox.Root {...props} />;
}

export function ComboboxInput(props: ComboboxInputProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "clearProps",
    "inputClass",
    "showClear",
    "showTrigger",
    "size",
    "startAddon",
    "triggerProps",
  ]);
  const size = () => local.size ?? "default";

  return (
    <span
      data-scope="ui-combobox"
      data-part="input-group"
      data-slot="combobox-input-group"
      class={cn(
        classes(
          "ui-combobox-input-group",
          "relative",
          "w-full",
          "not-has-[>*.w-full]:w-fit",
          "text-foreground",
          "has-disabled:opacity-64",
        ),
        local.class,
      )}
    >
      {local.startAddon && (
        <span
          aria-hidden="true"
          data-scope="ui-combobox"
          data-part="start-addon"
          data-slot="combobox-start-addon"
          class={classes(
            "pointer-events-none",
            "absolute",
            "inset-y-0",
            "start-px",
            "z-10",
            "flex",
            "items-center",
            "ps-[calc(--spacing(3)-1px)]",
            "opacity-80",
            "has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)]",
            "[&_svg:not([class*='size-'])]:size-4.5",
            "sm:[&_svg:not([class*='size-'])]:size-4",
            "[&_svg]:-mx-0.5",
          )}
        >
          {local.startAddon}
        </span>
      )}
      <CoreCombobox.Input
        {...rest}
        data-size={typeof size() === "string" ? size() : undefined}
        data-slot="combobox-input"
        size={typeof size() === "number" ? size() : undefined}
        class={cn(
          classes(
            "ui-combobox-input",
            "h-8.5",
            "w-full",
            "min-w-0",
            "rounded-lg",
            "border",
            "border-input",
            "bg-background",
            "not-dark:bg-clip-padding",
            "px-[calc(--spacing(3)-1px)]",
            "text-base",
            "text-foreground",
            "shadow-xs/5",
            "outline-none",
            "ring-ring/24",
            "transition-shadow",
            "placeholder:text-muted-foreground/72",
            "data-invalid:border-destructive/36",
            "focus-visible:border-ring",
            "focus-visible:ring-[3px]",
            "sm:h-7.5",
            "sm:text-sm",
            "dark:bg-input/32",
          ),
          size() === "sm" && classes("h-7.5", "px-[calc(--spacing(2.5)-1px)]", "sm:h-6.5"),
          size() === "lg" && classes("h-9.5", "sm:h-8.5"),
          Boolean(local.startAddon) &&
            classes(
              "ps-[calc(--spacing(8.5)-1px)]",
              "sm:ps-[calc(--spacing(8)-1px)]",
              "data-[size=sm]:ps-[calc(--spacing(7.5)-1px)]",
              "sm:data-[size=sm]:ps-[calc(--spacing(7)-1px)]",
            ),
          (local.showTrigger ?? true) && (size() === "sm" ? "pe-6.5" : "pe-7"),
          local.inputClass,
        )}
      />
      {(local.showTrigger ?? true) && (
        <ComboboxTrigger class={actionButtonClass(size())} {...local.triggerProps}>
          <span data-scope="ui-combobox" data-part="icon" data-slot="combobox-icon">
            <TriggerIcon />
          </span>
        </ComboboxTrigger>
      )}
      {local.showClear && (
        <ComboboxClear class={actionButtonClass(size())} {...local.clearProps}>
          <ClearIcon />
        </ComboboxClear>
      )}
    </span>
  );
}

export function ComboboxChipsInput(props: ComboboxChipsInputProps) {
  const [local, rest] = splitProps(props, ["class", "size"]);
  const size = () => local.size ?? "default";

  return (
    <CoreCombobox.Input
      {...rest}
      data-size={typeof size() === "string" ? size() : undefined}
      data-slot="combobox-chips-input"
      size={typeof size() === "number" ? size() : undefined}
      class={cn(
        classes(
          "ui-combobox-chips-input",
          "min-w-12",
          "flex-1",
          "text-base",
          "outline-none",
          "sm:text-sm",
          "[[data-slot=combobox-chip]+&]:ps-0.5",
        ),
        size() === "sm" ? "ps-1.5" : "ps-2",
        local.class,
      )}
    />
  );
}

export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.Trigger
      {...rest}
      data-slot="combobox-trigger"
      class={cn("ui-combobox-trigger", local.class)}
    />
  );
}

export function ComboboxClear(props: ComboboxClearProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.Clear
      {...rest}
      data-slot="combobox-clear"
      class={cn("ui-combobox-clear", local.class)}
    />
  );
}

export function ComboboxPortal(props: ComboboxPortalProps) {
  return <CoreCombobox.Portal {...props} />;
}

export function ComboboxPositioner(props: ComboboxPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.Positioner
      {...rest}
      data-slot="combobox-positioner"
      class={cn(classes("ui-combobox-positioner", "z-50", "select-none"), local.class)}
    />
  );
}

export function ComboboxContent(props: ComboboxContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <ComboboxPortal {...local.portal}>
      <ComboboxPositioner class={local.positionerClass}>
        <span
          data-scope="ui-combobox"
          data-part="surface"
          class={cn(
            classes(
              "ui-combobox-surface",
              "relative",
              "flex",
              "max-h-full",
              "min-w-(--anchor-width)",
              "max-w-(--available-width)",
              "origin-(--transform-origin)",
              "rounded-lg",
              "border",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "shadow-lg/5",
              "transition-[scale,opacity]",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-lg)-1px)]",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
            local.class,
          )}
        >
          <CoreCombobox.Content
            {...rest}
            data-slot="combobox-popup"
            class={classes(
              "ui-combobox-content",
              "flex",
              "max-h-[min(var(--available-height),23rem)]",
              "flex-1",
              "flex-col",
              "text-foreground",
            )}
          >
            {local.children}
          </CoreCombobox.Content>
        </span>
      </ComboboxPositioner>
    </ComboboxPortal>
  );
}

export const ComboboxPopup = ComboboxContent;

export function ComboboxListbox(props: ComboboxListboxProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.Listbox
      {...rest}
      data-slot="combobox-list"
      class={cn(
        classes(
          "ui-combobox-listbox",
          "not-empty:scroll-py-1",
          "not-empty:px-1",
          "not-empty:py-1",
          "overflow-y-auto",
          "in-data-has-overflow-y:pe-3",
        ),
        local.class,
      )}
    />
  );
}

export const ComboboxList = ComboboxListbox;

export function ComboboxGroup(props: ComboboxGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.Group
      {...rest}
      data-slot="combobox-group"
      class={cn(classes("ui-combobox-group", "[[role=group]+&]:mt-1.5"), local.class)}
    />
  );
}

export function ComboboxGroupLabel(props: ComboboxGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.GroupLabel
      {...rest}
      data-slot="combobox-group-label"
      class={cn(
        classes(
          "ui-combobox-group-label",
          "px-2",
          "py-1.5",
          "font-medium",
          "text-muted-foreground",
          "text-xs",
        ),
        local.class,
      )}
    />
  );
}

export function ComboboxItem(props: ComboboxItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);
  return (
    <CoreCombobox.Item
      {...rest}
      data-slot="combobox-item"
      class={cn(
        classes(
          "ui-combobox-item",
          "grid",
          "min-h-8",
          "in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]",
          "cursor-default",
          "grid-cols-[1rem_1fr]",
          "items-center",
          "gap-2",
          "rounded-sm",
          "py-1",
          "ps-2",
          "pe-4",
          "text-base",
          "outline-none",
          "data-disabled:pointer-events-none",
          "data-highlighted:bg-accent",
          "data-highlighted:text-accent-foreground",
          "data-disabled:opacity-64",
          "sm:min-h-7",
          "sm:text-sm",
          "[&_svg:not([class*='size-'])]:size-4.5",
          "sm:[&_svg:not([class*='size-'])]:size-4",
          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
        ),
        local.class,
      )}
    >
      <ComboboxItemIndicator class="col-start-1">
        {local.indicator ?? <CheckIcon />}
      </ComboboxItemIndicator>
      <ComboboxItemText class="col-start-2">{local.children}</ComboboxItemText>
    </CoreCombobox.Item>
  );
}

export function ComboboxItemText(props: ComboboxItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.ItemText
      {...rest}
      data-slot="combobox-item-text"
      class={cn("ui-combobox-item-text", local.class)}
    />
  );
}

export function ComboboxItemIndicator(props: ComboboxItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.ItemIndicator
      {...rest}
      data-slot="combobox-item-indicator"
      class={cn("ui-combobox-item-indicator", local.class)}
    />
  );
}

export function ComboboxArrow(props: ComboboxArrowProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.Arrow
      {...rest}
      data-slot="combobox-arrow"
      class={cn("ui-combobox-arrow", local.class)}
    />
  );
}

export function ComboboxSeparator(props: ComboboxSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      role="separator"
      data-scope="ui-combobox"
      data-part="separator"
      data-slot="combobox-separator"
      class={cn(
        classes("ui-combobox-separator", "mx-2", "my-1", "h-px", "bg-border", "last:hidden"),
        local.class,
      )}
    />
  );
}

export function ComboboxEmpty(props: ComboboxEmptyProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-combobox"
      data-part="empty"
      data-slot="combobox-empty"
      class={cn(
        classes(
          "ui-combobox-empty",
          "not-empty:p-2",
          "text-center",
          "text-base",
          "text-muted-foreground",
          "sm:text-sm",
        ),
        local.class,
      )}
    />
  );
}

export function ComboboxStatus(props: ComboboxStatusProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-combobox"
      data-part="status"
      data-slot="combobox-status"
      class={cn(
        classes(
          "ui-combobox-status",
          "px-3",
          "py-2",
          "font-medium",
          "text-muted-foreground",
          "text-xs",
          "empty:m-0",
          "empty:p-0",
        ),
        local.class,
      )}
    />
  );
}

export function ComboboxValue(props: ComboboxItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      {...rest}
      data-scope="ui-combobox"
      data-part="value"
      data-slot="combobox-value"
      class={cn("ui-combobox-value", local.class)}
    />
  );
}

export const ComboboxPrimitive = CoreCombobox;
