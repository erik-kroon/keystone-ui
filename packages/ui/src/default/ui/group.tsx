import { splitProps, type JSX, type ParentProps } from "solid-js";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

export type GroupOrientation = "horizontal" | "vertical";
export type GroupVariant = "default" | "attached" | "inset";
export type GroupSize = "sm" | "default" | "lg";

export type GroupProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean;
    invalid?: boolean;
    orientation?: GroupOrientation;
    selected?: boolean;
    size?: GroupSize;
    variant?: GroupVariant;
  }
>;

export type GroupItemProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type GroupLabelProps = ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>;
export type GroupDescriptionProps = ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>;
export type GroupTextProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type GroupSeparatorProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
  }
>;

const classes = (...tokens: string[]) => tokens.join(" ");

const groupSizeClass: Record<GroupSize, string> = {
  sm: classes("gap-1", "text-xs"),
  default: classes("gap-1.5", "text-sm"),
  lg: classes("gap-2", "text-sm"),
};

const groupVariantClass: Record<GroupVariant, string> = {
  default: classes("ui-group-default"),
  attached: classes(
    "ui-group-attached",
    "isolate",
    "gap-0",
    "data-[orientation=horizontal]:*:not-first:-ms-px",
    "data-[orientation=vertical]:*:not-first:-mt-px",
    "[&>[data-slot=button]:not(:first-child)]:rounded-s-none",
    "[&>[data-slot=button]:not(:last-child)]:rounded-e-none",
    "[&>[data-slot=input-control]:not(:first-child)]:rounded-s-none",
    "[&>[data-slot=input-control]:not(:last-child)]:rounded-e-none",
    "[&>[data-slot=group-item]:not(:first-child)]:rounded-s-none",
    "[&>[data-slot=group-item]:not(:last-child)]:rounded-e-none",
    "data-[orientation=vertical]:[&>[data-slot=button]:not(:first-child)]:rounded-t-none",
    "data-[orientation=vertical]:[&>[data-slot=button]:not(:last-child)]:rounded-b-none",
    "data-[orientation=vertical]:[&>[data-slot=input-control]:not(:first-child)]:rounded-t-none",
    "data-[orientation=vertical]:[&>[data-slot=input-control]:not(:last-child)]:rounded-b-none",
    "data-[orientation=vertical]:[&>[data-slot=group-item]:not(:first-child)]:rounded-t-none",
    "data-[orientation=vertical]:[&>[data-slot=group-item]:not(:last-child)]:rounded-b-none",
  ),
  inset: classes(
    "ui-group-inset",
    "rounded-xl",
    "border",
    "border-border",
    "bg-muted/40",
    "p-1.5",
    "shadow-xs/5",
    "dark:bg-muted/24",
  ),
};

function groupPart<T extends HTMLElement>(
  part: string,
  className: string,
  props: ParentProps<JSX.HTMLAttributes<T>>,
  slot = `group-${part}`,
) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...(rest as JSX.HTMLAttributes<HTMLDivElement>)}
      data-scope="ui-group"
      data-part={part}
      data-slot={slot}
      class={cn(className, local.class)}
    />
  );
}

export function Group(props: GroupProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "disabled",
    "invalid",
    "orientation",
    "selected",
    "size",
    "variant",
  ]);
  const orientation = () => local.orientation ?? "horizontal";
  const size = () => local.size ?? "default";
  const variant = () => local.variant ?? "default";

  return (
    <div
      {...rest}
      data-scope="ui-group"
      data-part="root"
      data-disabled={local.disabled ? "" : undefined}
      data-invalid={local.invalid ? "" : undefined}
      data-orientation={orientation()}
      data-selected={local.selected ? "" : undefined}
      data-size={size()}
      data-slot="group"
      data-variant={variant()}
      class={cn(
        classes(
          "ui-group",
          "flex",
          "w-fit",
          "*:focus-visible:z-1",
          "has-[>[data-slot=group]]:gap-2",
          "*:has-focus-visible:z-1",
          "dark:*:[[data-slot=separator]:has(~button:hover):not(:has(~[data-slot=separator]~[data-slot]:hover)),[data-slot=separator]:has(~[data-slot][data-pressed]):not(:has(~[data-slot=separator]~[data-slot][data-pressed]))]:before:bg-input/64",
          "dark:*:[button:hover~[data-slot=separator]:not([data-slot]:hover~[data-slot=separator]~[data-slot=separator]),[data-slot][data-pressed]~[data-slot=separator]:not([data-slot][data-pressed]~[data-slot=separator]~[data-slot=separator])]:before:bg-input/64",
        ),
        orientation() === "horizontal" &&
          classes(
            "*:pointer-coarse:after:min-w-auto",
            "*:data-slot:has-[~[data-slot]]:rounded-e-none",
            "*:data-slot:has-[~[data-slot]]:border-e-0",
            "*:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:-end-[0.5px]",
            "*:data-slot:has-[~[data-slot]]:before:rounded-e-none",
            "*:[[data-slot]~[data-slot]:not([data-slot=separator])]:before:-start-[0.5px]",
            "*:[[data-slot]~[data-slot]]:rounded-s-none",
            "*:[[data-slot]~[data-slot]]:border-s-0",
            "*:[[data-slot]~[data-slot]]:before:rounded-s-none",
          ),
        orientation() === "vertical" &&
          classes(
            "flex-col",
            "*:pointer-coarse:after:min-h-auto",
            "*:data-slot:has-[~[data-slot]]:rounded-b-none",
            "*:data-slot:has-[~[data-slot]]:border-b-0",
            "*:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:-bottom-[0.5px]",
            "*:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:hidden",
            "*:data-slot:has-[~[data-slot]]:before:rounded-b-none",
            "dark:*:last:before:hidden",
            "dark:*:first:before:block",
            "*:[[data-slot]~[data-slot]:not([data-slot=separator])]:before:-top-[0.5px]",
            "*:[[data-slot]~[data-slot]]:rounded-t-none",
            "*:[[data-slot]~[data-slot]]:border-t-0",
            "*:[[data-slot]~[data-slot]]:before:rounded-t-none",
          ),
        groupSizeClass[size()],
        variant() !== "default" && groupVariantClass[variant()],
        local.class,
      )}
    />
  );
}

export function GroupText(props: GroupTextProps) {
  return groupPart(
    "text",
    classes(
      "ui-group-text",
      "relative",
      "inline-flex",
      "items-center",
      "gap-2",
      "whitespace-nowrap",
      "rounded-lg",
      "border",
      "border-input",
      "bg-muted",
      "not-dark:bg-clip-padding",
      "px-[calc(--spacing(3)-1px)]",
      "text-base",
      "text-muted-foreground",
      "shadow-xs/5",
      "outline-none",
      "transition-shadow",
      "before:pointer-events-none",
      "before:absolute",
      "before:inset-0",
      "before:rounded-[calc(var(--radius-lg)-1px)]",
      "before:shadow-[0_1px_--theme(--color-black/6%)]",
      "sm:text-sm",
      "dark:bg-input/64",
      "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      "[&_svg:not([class*='size-'])]:size-4.5",
      "sm:[&_svg:not([class*='size-'])]:size-4",
      "[&_svg]:-mx-0.5",
      "[&_svg]:shrink-0",
    ),
    props,
    "group-text",
  );
}

export function GroupSeparator(props: GroupSeparatorProps) {
  const [local, rest] = splitProps(props, ["class", "orientation"]);

  return (
    <Separator
      {...rest}
      data-slot="separator"
      orientation={local.orientation ?? "vertical"}
      class={cn(
        "ui-group-separator pointer-events-none relative z-2 bg-input before:absolute before:inset-0 has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:translate-x-px has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:bg-ring dark:before:bg-input/32 [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+&,[data-slot=number-field]:focus-within+input+&]:bg-ring [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+input+&]:-translate-x-px",
        local.class,
      )}
    />
  );
}

export {
  Group as ButtonGroup,
  GroupText as ButtonGroupText,
  GroupSeparator as ButtonGroupSeparator,
};

export function GroupItem(props: GroupItemProps) {
  return groupPart(
    "item",
    classes(
      "ui-group-item",
      "inline-flex",
      "min-w-0",
      "items-center",
      "gap-2",
      "rounded-lg",
      "border",
      "border-border",
      "bg-background",
      "px-3",
      "py-1.5",
      "text-sm",
      "shadow-xs/5",
    ),
    props,
    "group-item",
  );
}

export function GroupLabel(props: GroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      data-scope="ui-group"
      data-part="label"
      data-slot="group-label"
      class={cn("ui-group-label", "font-medium", "text-foreground", local.class)}
    />
  );
}

export function GroupDescription(props: GroupDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      data-scope="ui-group"
      data-part="description"
      data-slot="group-description"
      class={cn("ui-group-description", "text-muted-foreground", local.class)}
    />
  );
}
