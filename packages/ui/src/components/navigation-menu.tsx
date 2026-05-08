import {
  NavigationMenu as CoreNavigationMenu,
  type NavigationMenuCheckboxItemProps as CoreNavigationMenuCheckboxItemProps,
  type NavigationMenuContentProps as CoreNavigationMenuContentProps,
  type NavigationMenuGroupLabelProps as CoreNavigationMenuGroupLabelProps,
  type NavigationMenuGroupProps as CoreNavigationMenuGroupProps,
  type NavigationMenuIndicatorProps as CoreNavigationMenuIndicatorProps,
  type NavigationMenuItemProps as CoreNavigationMenuItemProps,
  type NavigationMenuListProps as CoreNavigationMenuListProps,
  type NavigationMenuLinkProps as CoreNavigationMenuLinkProps,
  type NavigationMenuMenuProps as CoreNavigationMenuMenuProps,
  type NavigationMenuPartProps as CoreNavigationMenuPartProps,
  type NavigationMenuPortalProps as CoreNavigationMenuPortalProps,
  type NavigationMenuPositionerProps as CoreNavigationMenuPositionerProps,
  type NavigationMenuRadioGroupProps as CoreNavigationMenuRadioGroupProps,
  type NavigationMenuRadioItemProps as CoreNavigationMenuRadioItemProps,
  type NavigationMenuRootProps as CoreNavigationMenuRootProps,
  type NavigationMenuSeparatorProps as CoreNavigationMenuSeparatorProps,
  type NavigationMenuTriggerProps as CoreNavigationMenuTriggerProps,
  type NavigationMenuViewportProps as CoreNavigationMenuViewportProps,
} from "@keystone-ui/core/navigation-menu";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type NavigationMenuProps = CoreNavigationMenuRootProps;
export type NavigationMenuTriggerProps = CoreNavigationMenuTriggerProps;
export type NavigationMenuPortalProps = CoreNavigationMenuPortalProps;
export type NavigationMenuPositionerProps = CoreNavigationMenuPositionerProps;
export type NavigationMenuContentProps = CoreNavigationMenuContentProps & {
  portal?: NavigationMenuPortalProps;
  positionerClass?: string;
};
export type NavigationMenuGroupProps = CoreNavigationMenuGroupProps;
export type NavigationMenuGroupLabelProps = CoreNavigationMenuGroupLabelProps;
export type NavigationMenuSeparatorProps = CoreNavigationMenuSeparatorProps;
export type NavigationMenuListProps = CoreNavigationMenuListProps;
export type NavigationMenuMenuProps = CoreNavigationMenuMenuProps;
export type NavigationMenuItemProps = CoreNavigationMenuItemProps;
export type NavigationMenuLinkProps = CoreNavigationMenuLinkProps;
export type NavigationMenuCheckboxItemProps = CoreNavigationMenuCheckboxItemProps;
export type NavigationMenuRadioGroupProps = CoreNavigationMenuRadioGroupProps;
export type NavigationMenuRadioItemProps = CoreNavigationMenuRadioItemProps;
export type NavigationMenuIndicatorProps = CoreNavigationMenuIndicatorProps;
export type NavigationMenuItemIndicatorProps = CoreNavigationMenuPartProps<HTMLSpanElement>;
export type NavigationMenuViewportProps = CoreNavigationMenuViewportProps & {
  portal?: NavigationMenuPortalProps;
  positionerClass?: string;
};

export function NavigationMenu(props: NavigationMenuProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreNavigationMenu.Root {...rest} class={cn("ui-navigation-menu", local.class)} />;
}

export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.Trigger
      {...rest}
      class={cn("ui-navigation-menu-trigger cursor-pointer", local.class)}
    />
  );
}

export function NavigationMenuPortal(props: NavigationMenuPortalProps) {
  return <CoreNavigationMenu.Portal {...props} />;
}

export function NavigationMenuPositioner(props: NavigationMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.Positioner
      {...rest}
      class={cn("ui-navigation-menu-positioner", local.class)}
    />
  );
}

export function NavigationMenuContent(props: NavigationMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <NavigationMenuPortal {...local.portal}>
      <NavigationMenuPositioner class={local.positionerClass}>
        <CoreNavigationMenu.Content
          {...rest}
          class={cn(
            "ui-navigation-menu-content origin-(--transform-origin) transition-[width,height,scale,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[scale,opacity] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
            local.class,
          )}
        >
          {local.children}
        </CoreNavigationMenu.Content>
      </NavigationMenuPositioner>
    </NavigationMenuPortal>
  );
}

export function NavigationMenuGroup(props: NavigationMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreNavigationMenu.Group {...rest} class={cn("ui-navigation-menu-group", local.class)} />;
}

export function NavigationMenuGroupLabel(props: NavigationMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.GroupLabel
      {...rest}
      class={cn("ui-navigation-menu-group-label", local.class)}
    />
  );
}

export function NavigationMenuSeparator(props: NavigationMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.Separator
      {...rest}
      class={cn("ui-navigation-menu-separator", local.class)}
    />
  );
}

export function NavigationMenuList(props: NavigationMenuListProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreNavigationMenu.List {...rest} class={cn("ui-navigation-menu-list", local.class)} />;
}

export function NavigationMenuMenu(props: NavigationMenuMenuProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreNavigationMenu.Menu {...rest} class={cn("ui-navigation-menu-menu", local.class)} />;
}

export function NavigationMenuItem(props: NavigationMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreNavigationMenu.Item {...rest} class={cn("ui-navigation-menu-item", local.class)} />;
}

export function NavigationMenuLink(props: NavigationMenuLinkProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.Link
      {...rest}
      class={cn("ui-navigation-menu-link cursor-pointer", local.class)}
    />
  );
}

export function NavigationMenuCheckboxItem(props: NavigationMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.CheckboxItem
      {...rest}
      class={cn("ui-navigation-menu-item cursor-pointer", local.class)}
    />
  );
}

export function NavigationMenuRadioGroup(props: NavigationMenuRadioGroupProps) {
  return <CoreNavigationMenu.RadioGroup {...props} />;
}

export function NavigationMenuRadioItem(props: NavigationMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.RadioItem
      {...rest}
      class={cn("ui-navigation-menu-item cursor-pointer", local.class)}
    />
  );
}

export function NavigationMenuIndicator(props: NavigationMenuIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.Indicator
      {...rest}
      class={cn("ui-navigation-menu-indicator", local.class)}
    />
  );
}

export function NavigationMenuItemIndicator(props: NavigationMenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.ItemIndicator
      {...rest}
      class={cn("ui-navigation-menu-item-indicator", local.class)}
    />
  );
}

export function NavigationMenuViewport(props: NavigationMenuViewportProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <NavigationMenuPortal {...local.portal}>
      <NavigationMenuPositioner class={local.positionerClass}>
        <CoreNavigationMenu.Viewport
          {...rest}
          class={cn(
            "ui-navigation-menu-viewport origin-(--transform-origin) transition-[width,height,scale,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[scale,opacity] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
            local.class,
          )}
        >
          {local.children}
        </CoreNavigationMenu.Viewport>
      </NavigationMenuPositioner>
    </NavigationMenuPortal>
  );
}
