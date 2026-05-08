import {
  Menu as CoreMenu,
  type MenuCheckboxItemProps as CoreMenuCheckboxItemProps,
  type MenuContentProps as CoreMenuContentProps,
  type MenuGroupLabelProps as CoreMenuGroupLabelProps,
  type MenuGroupProps as CoreMenuGroupProps,
  type MenuItemProps as CoreMenuItemProps,
  type MenuPartProps as CoreMenuPartProps,
  type MenuPortalProps as CoreMenuPortalProps,
  type MenuPositionerProps as CoreMenuPositionerProps,
  type MenuRadioGroupProps as CoreMenuRadioGroupProps,
  type MenuRadioItemProps as CoreMenuRadioItemProps,
  type MenuRootProps as CoreMenuRootProps,
  type MenuSeparatorProps as CoreMenuSeparatorProps,
  type MenuTriggerProps as CoreMenuTriggerProps,
} from "@keystone-ui/core/menu";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type MenuProps = CoreMenuRootProps;
export type MenuTriggerProps = CoreMenuTriggerProps;
export type MenuPortalProps = CoreMenuPortalProps;
export type MenuPositionerProps = CoreMenuPositionerProps;
export type MenuContentProps = CoreMenuContentProps & {
  portal?: MenuPortalProps;
  positionerClass?: string;
};
export type MenuGroupProps = CoreMenuGroupProps;
export type MenuGroupLabelProps = CoreMenuGroupLabelProps;
export type MenuSeparatorProps = CoreMenuSeparatorProps;
export type MenuItemProps = CoreMenuItemProps;
export type MenuCheckboxItemProps = CoreMenuCheckboxItemProps;
export type MenuRadioGroupProps = CoreMenuRadioGroupProps;
export type MenuRadioItemProps = CoreMenuRadioItemProps;
export type MenuItemIndicatorProps = CoreMenuPartProps<HTMLSpanElement>;
export type MenuShortcutProps = JSX.HTMLAttributes<HTMLElement>;

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
      class="ms-auto -me-0.5 opacity-80"
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

const menuItemClass = classes(
  "flex",
  "min-h-8",
  "cursor-pointer",
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
  "data-inset:ps-8",
  "data-[variant=destructive]:text-destructive-foreground",
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
);

export function Menu(props: MenuProps) {
  return <CoreMenu.Root {...props} />;
}

export function MenuTrigger(props: MenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenu.Trigger
      {...rest}
      data-slot="menu-trigger"
      class={cn("ui-menu-trigger cursor-pointer", local.class)}
    />
  );
}

export function MenuPortal(props: MenuPortalProps) {
  return <CoreMenu.Portal {...props} />;
}

export function MenuPositioner(props: MenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenu.Positioner
      {...rest}
      data-slot="menu-positioner"
      class={cn("ui-menu-positioner z-50", local.class)}
    />
  );
}

export function MenuContent(props: MenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <MenuPortal {...local.portal}>
      <MenuPositioner class={local.positionerClass}>
        <CoreMenu.Content
          {...rest}
          data-slot="menu-content"
          class={cn(
            "ui-menu-content relative flex not-[class*='w-']:min-w-32 origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            "transition-[width,height,scale,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[scale,opacity] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
            local.class,
          )}
        >
          <div class="max-h-(--available-height) w-full overflow-y-auto p-1">{local.children}</div>
        </CoreMenu.Content>
      </MenuPositioner>
    </MenuPortal>
  );
}

export function MenuGroup(props: MenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenu.Group {...rest} data-slot="menu-group" class={cn("ui-menu-group", local.class)} />
  );
}

export function MenuGroupLabel(props: MenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenu.GroupLabel
      {...rest}
      data-slot="menu-label"
      class={cn(
        "ui-menu-group-label px-2 py-1.5 font-medium text-muted-foreground text-xs data-inset:ps-9 sm:data-inset:ps-8",
        local.class,
      )}
    />
  );
}

export function MenuSeparator(props: MenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenu.Separator
      {...rest}
      data-slot="menu-separator"
      class={cn("ui-menu-separator mx-2 my-1 h-px bg-border", local.class)}
    />
  );
}

export function MenuItem(props: MenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenu.Item
      {...rest}
      data-slot="menu-item"
      class={cn("ui-menu-item", menuItemClass, local.class)}
    />
  );
}

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);
  return (
    <CoreMenu.CheckboxItem
      {...rest}
      data-slot="menu-checkbox-item"
      class={cn(
        "ui-menu-checkbox-item grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-pointer grid-cols-[.75rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        local.class,
      )}
    >
      <MenuItemIndicator class="col-start-1 -ms-0.5">
        <CheckIcon />
      </MenuItemIndicator>
      <span class="col-start-2">{local.children}</span>
    </CoreMenu.CheckboxItem>
  );
}

export function MenuRadioGroup(props: MenuRadioGroupProps) {
  return <CoreMenu.RadioGroup {...props} data-slot="menu-radio-group" />;
}

export function MenuRadioItem(props: MenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);
  return (
    <CoreMenu.RadioItem
      {...rest}
      data-slot="menu-radio-item"
      class={cn(
        "ui-menu-radio-item grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-pointer grid-cols-[.75rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        local.class,
      )}
    >
      <MenuItemIndicator class="col-start-1 -ms-0.5">
        <CheckIcon />
      </MenuItemIndicator>
      <span class="col-start-2">{local.children}</span>
    </CoreMenu.RadioItem>
  );
}

export function MenuItemIndicator(props: MenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenu.ItemIndicator
      {...rest}
      data-slot="menu-item-indicator"
      class={cn("ui-menu-item-indicator", local.class)}
    />
  );
}

export function MenuShortcut(props: MenuShortcutProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <kbd
      {...rest}
      data-slot="menu-shortcut"
      class={cn(
        "ui-menu-shortcut ms-auto font-medium font-sans text-muted-foreground/72 text-xs tracking-widest",
        local.class,
      )}
    />
  );
}

export function MenuSub(props: MenuProps) {
  return <CoreMenu.SubRoot {...props} data-slot="menu-sub" />;
}

export function MenuSubTrigger(props: MenuTriggerProps & { inset?: boolean }) {
  const [local, rest] = splitProps(props, ["children", "class", "inset"]);
  return (
    <CoreMenu.SubTrigger
      {...rest}
      data-inset={local.inset ? "" : undefined}
      data-slot="menu-sub-trigger"
      class={cn(
        "ui-menu-sub-trigger flex min-h-8 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-open:bg-accent data-popup-open:bg-accent data-inset:ps-8 data-highlighted:text-accent-foreground data-open:text-accent-foreground data-popup-open:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not(:last-child)]:-mx-0.5 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        local.class,
      )}
    >
      {local.children}
      <ChevronRightIcon />
    </CoreMenu.SubTrigger>
  );
}

export function MenuSubContent(props: MenuContentProps) {
  const [local, rest] = splitProps(props, ["class", "positionerClass"]);
  return (
    <MenuContent
      {...rest}
      data-slot="menu-sub-content"
      class={local.class}
      positionerClass={local.positionerClass}
    />
  );
}
