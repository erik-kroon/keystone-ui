import {
  DropdownMenu as CoreDropdownMenu,
  type DropdownMenuArrowProps as CoreDropdownMenuArrowProps,
  type DropdownMenuCheckboxItemProps as CoreDropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps as CoreDropdownMenuContentProps,
  type DropdownMenuGroupLabelProps as CoreDropdownMenuGroupLabelProps,
  type DropdownMenuGroupProps as CoreDropdownMenuGroupProps,
  type DropdownMenuItemProps as CoreDropdownMenuItemProps,
  type DropdownMenuLinkProps as CoreDropdownMenuLinkProps,
  type DropdownMenuPartProps as CoreDropdownMenuPartProps,
  type DropdownMenuPortalProps as CoreDropdownMenuPortalProps,
  type DropdownMenuPositionerProps as CoreDropdownMenuPositionerProps,
  type DropdownMenuRadioGroupProps as CoreDropdownMenuRadioGroupProps,
  type DropdownMenuRadioItemProps as CoreDropdownMenuRadioItemProps,
  type DropdownMenuRootProps as CoreDropdownMenuRootProps,
  type DropdownMenuSeparatorProps as CoreDropdownMenuSeparatorProps,
  type DropdownMenuTriggerProps as CoreDropdownMenuTriggerProps,
} from "@keystone-ui/core/dropdown-menu";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type DropdownMenuProps = CoreDropdownMenuRootProps;
export type DropdownMenuTriggerProps = CoreDropdownMenuTriggerProps;
export type DropdownMenuPortalProps = CoreDropdownMenuPortalProps;
export type DropdownMenuPositionerProps = CoreDropdownMenuPositionerProps;
export type DropdownMenuContentProps = CoreDropdownMenuContentProps & {
  portal?: DropdownMenuPortalProps;
  positionerClass?: string;
  viewportClass?: string;
};
export type DropdownMenuArrowProps = CoreDropdownMenuArrowProps;
export type DropdownMenuGroupProps = CoreDropdownMenuGroupProps;
export type DropdownMenuGroupLabelProps = CoreDropdownMenuGroupLabelProps & {
  inset?: boolean;
};
export type DropdownMenuSeparatorProps = CoreDropdownMenuSeparatorProps;
export type DropdownMenuItemProps = CoreDropdownMenuItemProps & {
  inset?: boolean;
  variant?: "default" | "destructive";
};
export type DropdownMenuLinkProps = CoreDropdownMenuLinkProps & {
  inset?: boolean;
  variant?: "default" | "destructive";
};
export type DropdownMenuCheckboxItemProps = CoreDropdownMenuCheckboxItemProps & {
  indicator?: JSX.Element;
  variant?: "default" | "switch";
};
export type DropdownMenuRadioGroupProps = CoreDropdownMenuRadioGroupProps;
export type DropdownMenuRadioItemProps = CoreDropdownMenuRadioItemProps & {
  indicator?: JSX.Element;
};
export type DropdownMenuItemIndicatorProps = CoreDropdownMenuPartProps<HTMLSpanElement>;
export type DropdownMenuItemLabelProps = CoreDropdownMenuPartProps<HTMLSpanElement>;
export type DropdownMenuItemDescriptionProps = CoreDropdownMenuPartProps<HTMLSpanElement>;
export type DropdownMenuShortcutProps = JSX.HTMLAttributes<HTMLElement>;
export type DropdownMenuSubProps = CoreDropdownMenuRootProps;
export type DropdownMenuSubTriggerProps = CoreDropdownMenuTriggerProps & {
  inset?: boolean;
};
export type DropdownMenuSubContentProps = DropdownMenuContentProps;

const classes = (...tokens: string[]) => tokens.join(" ");

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

function ChevronRightIcon() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function itemClass(inset?: boolean, variant?: "default" | "destructive") {
  return classes(
    "flex",
    "min-h-8",
    "cursor-default",
    "select-none",
    "items-center",
    "gap-2",
    "rounded-sm",
    "px-2",
    "py-1",
    "text-base",
    "text-foreground",
    "outline-none",
    "data-disabled:pointer-events-none",
    "data-highlighted:bg-accent",
    "data-highlighted:text-accent-foreground",
    "data-disabled:opacity-64",
    "sm:min-h-7",
    "sm:text-sm",
    "[&>svg:not([class*='opacity-'])]:opacity-80",
    "[&>svg:not([class*='size-'])]:size-4.5",
    "sm:[&>svg:not([class*='size-'])]:size-4",
    "[&>svg]:pointer-events-none",
    "[&>svg]:-mx-0.5",
    "[&>svg]:shrink-0",
    inset ? "ps-8" : "",
    variant === "destructive" ? "text-destructive-foreground" : "",
  );
}

function checkableItemClass(variant?: "default" | "switch") {
  return classes(
    "grid",
    "min-h-8",
    "in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]",
    "cursor-default",
    "items-center",
    "gap-2",
    "rounded-sm",
    "py-1",
    "ps-2",
    "text-base",
    "text-foreground",
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
    variant === "switch" ? "grid-cols-[1fr_auto]" : "grid-cols-[.75rem_1fr]",
    variant === "switch" ? "gap-4" : "",
    variant === "switch" ? "pe-1.5" : "pe-4",
  );
}

export function DropdownMenu(props: DropdownMenuProps) {
  return <CoreDropdownMenu.Root {...props} />;
}

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.Trigger
      {...rest}
      data-slot="dropdown-menu-trigger"
      class={cn("ui-dropdown-menu-trigger", local.class)}
    />
  );
}

export function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <CoreDropdownMenu.Portal {...props} />;
}

export function DropdownMenuPositioner(props: DropdownMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.Positioner
      {...rest}
      data-slot="dropdown-menu-positioner"
      class={cn(classes("ui-dropdown-menu-positioner", "z-50"), local.class)}
    />
  );
}

export function DropdownMenuContent(props: DropdownMenuContentProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "portal",
    "positionerClass",
    "viewportClass",
  ]);

  return (
    <DropdownMenuPortal {...local.portal}>
      <DropdownMenuPositioner class={local.positionerClass}>
        <CoreDropdownMenu.Content
          {...rest}
          data-slot="dropdown-menu-content"
          class={cn(
            classes(
              "ui-dropdown-menu-content",
              "relative",
              "flex",
              "not-[class*='w-']:min-w-32",
              "origin-(--transform-origin)",
              "rounded-lg",
              "border",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "shadow-lg/5",
              "outline-none",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-lg)-1px)]",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "focus:outline-none",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
            local.class,
          )}
        >
          <div
            data-scope="ui-dropdown-menu"
            data-part="viewport"
            data-slot="dropdown-menu-viewport"
            class={cn(
              classes(
                "ui-dropdown-menu-viewport",
                "max-h-(--available-height)",
                "w-full",
                "overflow-y-auto",
                "p-1",
              ),
              local.viewportClass,
            )}
          >
            {local.children}
          </div>
        </CoreDropdownMenu.Content>
      </DropdownMenuPositioner>
    </DropdownMenuPortal>
  );
}

export const DropdownMenuPopup = DropdownMenuContent;

export function DropdownMenuArrow(props: DropdownMenuArrowProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.Arrow
      {...rest}
      data-slot="dropdown-menu-arrow"
      class={cn("ui-dropdown-menu-arrow", local.class)}
    />
  );
}

export function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.Group
      {...rest}
      data-slot="dropdown-menu-group"
      class={cn("ui-dropdown-menu-group", local.class)}
    />
  );
}

export function DropdownMenuGroupLabel(props: DropdownMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class", "inset"]);
  return (
    <CoreDropdownMenu.GroupLabel
      {...rest}
      data-inset={local.inset ? "" : undefined}
      data-slot="dropdown-menu-label"
      class={cn(
        classes(
          "ui-dropdown-menu-group-label",
          "px-2",
          "py-1.5",
          "font-medium",
          "text-muted-foreground",
          "text-xs",
          "data-inset:ps-9",
          "sm:data-inset:ps-8",
        ),
        local.class,
      )}
    />
  );
}

export const DropdownMenuLabel = DropdownMenuGroupLabel;

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.Separator
      {...rest}
      data-slot="dropdown-menu-separator"
      class={cn(
        classes("ui-dropdown-menu-separator", "mx-2", "my-1", "h-px", "bg-border"),
        local.class,
      )}
    />
  );
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const [local, rest] = splitProps(props, ["class", "inset", "variant"]);
  return (
    <CoreDropdownMenu.Item
      {...rest}
      data-inset={local.inset ? "" : undefined}
      data-slot="dropdown-menu-item"
      data-variant={local.variant ?? "default"}
      class={cn(
        classes("ui-dropdown-menu-item", itemClass(local.inset, local.variant ?? "default")),
        local.class,
      )}
    />
  );
}

export function DropdownMenuLink(props: DropdownMenuLinkProps) {
  const [local, rest] = splitProps(props, ["class", "inset", "variant"]);
  return (
    <CoreDropdownMenu.Link
      {...rest}
      data-inset={local.inset ? "" : undefined}
      data-slot="dropdown-menu-link"
      data-variant={local.variant ?? "default"}
      class={cn(
        classes("ui-dropdown-menu-link", itemClass(local.inset, local.variant ?? "default")),
        local.class,
      )}
    />
  );
}

export function DropdownMenuCheckboxItem(props: DropdownMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "checked", "indicator", "variant"]);
  const variant = () => local.variant ?? "default";

  return (
    <CoreDropdownMenu.CheckboxItem
      {...rest}
      checked={local.checked}
      data-slot="dropdown-menu-checkbox-item"
      class={cn(
        classes("ui-dropdown-menu-checkbox-item", checkableItemClass(variant())),
        local.class,
      )}
    >
      {variant() === "switch" ? (
        <>
          <span class="col-start-1">{local.children}</span>
          <CoreDropdownMenu.ItemIndicator
            data-slot="dropdown-menu-switch-indicator"
            class={classes(
              "ui-dropdown-menu-switch-indicator",
              "inset-shadow-[0_1px_--theme(--color-black/4%)]",
              "inline-flex",
              "h-[calc(var(--thumb-size)+2px)]",
              "w-[calc(var(--thumb-size)*2-2px)]",
              "shrink-0",
              "items-center",
              "rounded-full",
              "p-px",
              "outline-none",
              "transition-[background-color,box-shadow]",
              "duration-200",
              "[--thumb-size:--spacing(4)]",
              "focus-visible:ring-2",
              "focus-visible:ring-ring",
              "focus-visible:ring-offset-1",
              "focus-visible:ring-offset-background",
              "data-checked:bg-primary",
              "data-unchecked:bg-input",
              "data-disabled:opacity-64",
              "sm:[--thumb-size:--spacing(3)]",
            )}
          >
            <span
              class={classes(
                "pointer-events-none",
                "block",
                "aspect-square",
                "h-full",
                "origin-left",
                "rounded-(--thumb-size)",
                "bg-background",
                "shadow-sm/5",
                "will-change-transform",
                "[transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s]",
                "in-[[data-slot=dropdown-menu-checkbox-item][data-checked]]:origin-[var(--thumb-size)_50%]",
                "in-[[data-slot=dropdown-menu-checkbox-item][data-checked]]:translate-x-[calc(var(--thumb-size)-4px)]",
                "in-[[data-slot=dropdown-menu-checkbox-item]:active]:not-data-disabled:scale-x-110",
                "in-[[data-slot=dropdown-menu-checkbox-item]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.10)]",
              )}
            />
          </CoreDropdownMenu.ItemIndicator>
        </>
      ) : (
        <>
          <DropdownMenuItemIndicator class="col-start-1 -ms-0.5">
            {local.indicator ?? <CheckIcon />}
          </DropdownMenuItemIndicator>
          <span class="col-start-2">{local.children}</span>
        </>
      )}
    </CoreDropdownMenu.CheckboxItem>
  );
}

export function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <CoreDropdownMenu.RadioGroup {...props} />;
}

export function DropdownMenuRadioItem(props: DropdownMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);
  return (
    <CoreDropdownMenu.RadioItem
      {...rest}
      data-slot="dropdown-menu-radio-item"
      class={cn(classes("ui-dropdown-menu-radio-item", checkableItemClass("default")), local.class)}
    >
      <DropdownMenuItemIndicator class="col-start-1 -ms-0.5">
        {local.indicator ?? <CheckIcon />}
      </DropdownMenuItemIndicator>
      <span class="col-start-2">{local.children}</span>
    </CoreDropdownMenu.RadioItem>
  );
}

export function DropdownMenuItemIndicator(props: DropdownMenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.ItemIndicator
      {...rest}
      data-slot="dropdown-menu-item-indicator"
      class={cn("ui-dropdown-menu-item-indicator", local.class)}
    />
  );
}

export function DropdownMenuItemLabel(props: DropdownMenuItemLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.ItemLabel
      {...rest}
      data-slot="dropdown-menu-item-label"
      class={cn("ui-dropdown-menu-item-label", local.class)}
    />
  );
}

export function DropdownMenuItemDescription(props: DropdownMenuItemDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.ItemDescription
      {...rest}
      data-slot="dropdown-menu-item-description"
      class={cn(
        classes("ui-dropdown-menu-item-description", "text-muted-foreground", "text-xs"),
        local.class,
      )}
    />
  );
}

export function DropdownMenuShortcut(props: DropdownMenuShortcutProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <kbd
      {...rest}
      data-scope="ui-dropdown-menu"
      data-part="shortcut"
      data-slot="dropdown-menu-shortcut"
      class={cn(
        classes(
          "ui-dropdown-menu-shortcut",
          "ms-auto",
          "font-medium",
          "font-sans",
          "text-muted-foreground/72",
          "text-xs",
          "tracking-widest",
        ),
        local.class,
      )}
    />
  );
}

export function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <CoreDropdownMenu.SubRoot {...props} />;
}

export function DropdownMenuSubTrigger(props: DropdownMenuSubTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "inset"]);
  return (
    <CoreDropdownMenu.SubTrigger
      {...rest}
      data-inset={local.inset ? "" : undefined}
      data-slot="dropdown-menu-sub-trigger"
      class={cn(
        classes(
          "ui-dropdown-menu-sub-trigger",
          "flex",
          "min-h-8",
          "items-center",
          "gap-2",
          "rounded-sm",
          "px-2",
          "py-1",
          "text-base",
          "text-foreground",
          "outline-none",
          "data-disabled:pointer-events-none",
          "data-highlighted:bg-accent",
          "data-open:bg-accent",
          "data-inset:ps-8",
          "data-highlighted:text-accent-foreground",
          "data-open:text-accent-foreground",
          "data-disabled:opacity-64",
          "sm:min-h-7",
          "sm:text-sm",
          "[&>svg:not(:last-child)]:-mx-0.5",
          "[&_svg:not([class*='size-'])]:size-4.5",
          "sm:[&_svg:not([class*='size-'])]:size-4",
          "[&_svg]:pointer-events-none",
        ),
        local.class,
      )}
    >
      {local.children}
      <span class="ms-auto -me-0.5 opacity-80">
        <ChevronRightIcon />
      </span>
    </CoreDropdownMenu.SubTrigger>
  );
}

export function DropdownMenuSubContent(props: DropdownMenuSubContentProps) {
  const [local, rest] = splitProps(props, ["positionerClass"]);
  return (
    <DropdownMenuContent
      {...rest}
      positionerClass={cn("ui-dropdown-menu-sub-positioner", local.positionerClass)}
    />
  );
}

export const DropdownMenuPrimitive = CoreDropdownMenu;
