import {
  Select as CoreSelect,
  type SelectArrowProps as CoreSelectArrowProps,
  type SelectContentProps as CoreSelectContentProps,
  type SelectGroupLabelProps as CoreSelectGroupLabelProps,
  type SelectGroupProps as CoreSelectGroupProps,
  type SelectItemIndicatorProps as CoreSelectItemIndicatorProps,
  type SelectItemProps as CoreSelectItemProps,
  type SelectItemTextProps as CoreSelectItemTextProps,
  type SelectListboxProps as CoreSelectListboxProps,
  type SelectPortalProps as CoreSelectPortalProps,
  type SelectPositionerProps as CoreSelectPositionerProps,
  type SelectRootProps as CoreSelectRootProps,
  type SelectTriggerProps as CoreSelectTriggerProps,
  type SelectValueProps as CoreSelectValueProps,
} from "@keystone-ui/core/select";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type SelectProps = CoreSelectRootProps;
export type SelectSize = "sm" | "default" | "lg";
export type SelectButtonProps = ParentProps<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: SelectSize;
  }
>;
export type SelectTriggerProps = CoreSelectTriggerProps & {
  indicator?: JSX.Element;
  size?: SelectSize;
};
export type SelectValueProps = CoreSelectValueProps;
export type SelectPortalProps = CoreSelectPortalProps;
export type SelectPositionerProps = CoreSelectPositionerProps;
export type SelectContentProps = CoreSelectContentProps & {
  listboxClass?: string;
  portal?: SelectPortalProps;
  positionerClass?: string;
};
export type SelectListboxProps = CoreSelectListboxProps;
export type SelectGroupProps = CoreSelectGroupProps;
export type SelectGroupLabelProps = CoreSelectGroupLabelProps;
export type SelectItemProps = CoreSelectItemProps & {
  indicator?: JSX.Element;
};
export type SelectItemTextProps = CoreSelectItemTextProps;
export type SelectItemIndicatorProps = CoreSelectItemIndicatorProps;
export type SelectArrowProps = CoreSelectArrowProps;
export type SelectSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;
export type SelectLabelProps = ParentProps<JSX.LabelHTMLAttributes<HTMLLabelElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

const triggerBaseClass = classes(
  "relative",
  "inline-flex",
  "min-h-9",
  "w-full",
  "min-w-36",
  "select-none",
  "items-center",
  "justify-between",
  "gap-2",
  "rounded-lg",
  "border",
  "border-input",
  "bg-background",
  "not-dark:bg-clip-padding",
  "px-[calc(--spacing(3)-1px)]",
  "text-left",
  "text-base",
  "text-foreground",
  "shadow-xs/5",
  "outline-none",
  "ring-ring/24",
  "transition-shadow",
  "before:pointer-events-none",
  "before:absolute",
  "before:inset-0",
  "before:rounded-[calc(var(--radius-lg)-1px)]",
  "not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)]",
  "pointer-coarse:after:absolute",
  "pointer-coarse:after:size-full",
  "pointer-coarse:after:min-h-11",
  "focus-visible:border-ring",
  "focus-visible:ring-[3px]",
  "aria-invalid:border-destructive/36",
  "focus-visible:aria-invalid:border-destructive/64",
  "focus-visible:aria-invalid:ring-destructive/16",
  "data-disabled:pointer-events-none",
  "data-disabled:opacity-64",
  "sm:min-h-8",
  "sm:text-sm",
  "dark:bg-input/32",
  "dark:aria-invalid:ring-destructive/24",
  "dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)]",
  "[&_svg:not([class*='opacity-'])]:opacity-80",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "sm:[&_svg:not([class*='size-'])]:size-4",
  "[&_svg]:pointer-events-none",
  "[&_svg]:shrink-0",
  "[[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none",
);

const triggerIconClass = classes("-me-1", "size-4.5", "opacity-80", "sm:size-4");

function triggerClass(size: SelectSize | undefined, className: string | undefined) {
  return cn(
    triggerBaseClass,
    size === "sm" && classes("min-h-8", "gap-1.5", "px-[calc(--spacing(2.5)-1px)]", "sm:min-h-7"),
    size === "lg" && classes("min-h-10", "sm:min-h-9"),
    className,
  );
}

function IndicatorIcon() {
  return (
    <svg
      aria-hidden="true"
      class={triggerIconClass}
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

export function Select(props: SelectProps) {
  return <CoreSelect.Root {...props} />;
}

export function SelectButton(props: SelectButtonProps) {
  const [local, rest] = splitProps(props, ["children", "class", "size", "type"]);

  return (
    <button
      {...rest}
      data-scope="ui-select"
      data-part="button"
      data-slot="select-button"
      type={local.type ?? "button"}
      class={triggerClass(local.size, cn("ui-select-button", "min-w-0", local.class))}
    >
      <span
        data-scope="ui-select"
        data-part="button-label"
        class={classes("flex-1", "truncate", "in-data-placeholder:text-muted-foreground/72")}
      >
        {local.children}
      </span>
      <IndicatorIcon />
    </button>
  );
}

export function SelectTrigger(props: SelectTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator", "size"]);

  return (
    <CoreSelect.Trigger
      {...rest}
      data-slot="select-trigger"
      class={triggerClass(local.size, cn("ui-select-trigger", local.class))}
    >
      {local.children}
      <span data-scope="ui-select" data-part="icon" data-slot="select-icon">
        {local.indicator ?? <IndicatorIcon />}
      </span>
    </CoreSelect.Trigger>
  );
}

export function SelectValue(props: SelectValueProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreSelect.Value
      {...rest}
      data-slot="select-value"
      class={cn(
        classes("ui-select-value", "flex-1", "truncate", "data-placeholder:text-muted-foreground"),
        local.class,
      )}
    />
  );
}

export function SelectPortal(props: SelectPortalProps) {
  return <CoreSelect.Portal {...props} />;
}

export function SelectPositioner(props: SelectPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSelect.Positioner
      {...rest}
      data-slot="select-positioner"
      class={cn(classes("ui-select-positioner", "z-50", "select-none"), local.class)}
    />
  );
}

export function SelectContent(props: SelectContentProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "listboxClass",
    "portal",
    "positionerClass",
  ]);

  return (
    <SelectPortal {...local.portal}>
      <SelectPositioner class={local.positionerClass}>
        <CoreSelect.Content
          {...rest}
          data-slot="select-content"
          class={cn(
            classes(
              "ui-select-content",
              "origin-(--transform-origin)",
              "text-foreground",
              "outline-none",
            ),
            local.class,
          )}
        >
          <div
            data-scope="ui-select"
            data-part="surface"
            class={classes(
              "relative",
              "h-full",
              "min-w-(--anchor-width)",
              "rounded-lg",
              "border",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "shadow-lg/5",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-lg)-1px)]",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            )}
          >
            <SelectListbox class={local.listboxClass}>{local.children}</SelectListbox>
          </div>
        </CoreSelect.Content>
      </SelectPositioner>
    </SelectPortal>
  );
}

export const SelectPopup = SelectContent;

export function SelectListbox(props: SelectListboxProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSelect.Listbox
      {...rest}
      data-slot="select-list"
      class={cn(
        classes("ui-select-listbox", "max-h-(--available-height)", "overflow-y-auto", "p-1"),
        local.class,
      )}
    />
  );
}

export function SelectGroup(props: SelectGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSelect.Group
      {...rest}
      data-slot="select-group"
      class={cn("ui-select-group", local.class)}
    />
  );
}

export function SelectGroupLabel(props: SelectGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSelect.GroupLabel
      {...rest}
      data-slot="select-group-label"
      class={cn(
        classes(
          "ui-select-group-label",
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

export function SelectLabel(props: SelectLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <label
      {...rest}
      data-scope="ui-select"
      data-part="label"
      data-slot="select-label"
      class={cn(
        classes(
          "ui-select-label",
          "not-in-data-[slot=field]:mb-2",
          "inline-flex",
          "cursor-default",
          "items-center",
          "gap-2",
          "font-medium",
          "text-base/4.5",
          "text-foreground",
          "sm:text-sm/4",
        ),
        local.class,
      )}
    />
  );
}

export function SelectItem(props: SelectItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <CoreSelect.Item
      {...rest}
      data-slot="select-item"
      class={cn(
        classes(
          "ui-select-item",
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
      <SelectItemIndicator class="col-start-1">
        {local.indicator ?? <CheckIcon />}
      </SelectItemIndicator>
      <SelectItemText class="col-start-2 min-w-0">{local.children}</SelectItemText>
    </CoreSelect.Item>
  );
}

export function SelectItemText(props: SelectItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSelect.ItemText
      {...rest}
      data-slot="select-item-text"
      class={cn("ui-select-item-text", local.class)}
    />
  );
}

export function SelectItemIndicator(props: SelectItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSelect.ItemIndicator
      {...rest}
      data-slot="select-item-indicator"
      class={cn("ui-select-item-indicator", local.class)}
    />
  );
}

export function SelectArrow(props: SelectArrowProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreSelect.Arrow
      {...rest}
      data-slot="select-arrow"
      class={cn("ui-select-arrow", local.class)}
    />
  );
}

export function SelectSeparator(props: SelectSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      role="separator"
      data-scope="ui-select"
      data-part="separator"
      data-slot="select-separator"
      class={cn(classes("ui-select-separator", "mx-2", "my-1", "h-px", "bg-border"), local.class)}
    />
  );
}

export const SelectPrimitive = CoreSelect;
