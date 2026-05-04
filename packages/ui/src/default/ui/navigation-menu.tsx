import {
  NavigationMenu as CoreNavigationMenu,
  type NavigationMenuCheckboxItemProps as CoreNavigationMenuCheckboxItemProps,
  type NavigationMenuContentProps as CoreNavigationMenuContentProps,
  type NavigationMenuGroupLabelProps as CoreNavigationMenuGroupLabelProps,
  type NavigationMenuGroupProps as CoreNavigationMenuGroupProps,
  type NavigationMenuItemProps as CoreNavigationMenuItemProps,
  type NavigationMenuLinkProps as CoreNavigationMenuLinkProps,
  type NavigationMenuPartProps as CoreNavigationMenuPartProps,
  type NavigationMenuPortalProps as CoreNavigationMenuPortalProps,
  type NavigationMenuPositionerProps as CoreNavigationMenuPositionerProps,
  type NavigationMenuRadioGroupProps as CoreNavigationMenuRadioGroupProps,
  type NavigationMenuRadioItemProps as CoreNavigationMenuRadioItemProps,
  type NavigationMenuRootProps as CoreNavigationMenuRootProps,
  type NavigationMenuSeparatorProps as CoreNavigationMenuSeparatorProps,
  type NavigationMenuTriggerProps as CoreNavigationMenuTriggerProps,
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
export type NavigationMenuItemProps = CoreNavigationMenuItemProps;
export type NavigationMenuLinkProps = CoreNavigationMenuLinkProps;
export type NavigationMenuCheckboxItemProps = CoreNavigationMenuCheckboxItemProps;
export type NavigationMenuRadioGroupProps = CoreNavigationMenuRadioGroupProps;
export type NavigationMenuRadioItemProps = CoreNavigationMenuRadioItemProps;
export type NavigationMenuItemIndicatorProps = CoreNavigationMenuPartProps<HTMLSpanElement>;

export function NavigationMenu(props: NavigationMenuProps) {
  return <CoreNavigationMenu.Root {...props} />;
}

export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.Trigger {...rest} class={cn("ui-navigation-menu-trigger", local.class)} />
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
        <CoreNavigationMenu.Content {...rest} class={cn("ui-navigation-menu-content", local.class)}>
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

export function NavigationMenuItem(props: NavigationMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreNavigationMenu.Item {...rest} class={cn("ui-navigation-menu-item", local.class)} />;
}

export function NavigationMenuLink(props: NavigationMenuLinkProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreNavigationMenu.Link {...rest} class={cn("ui-navigation-menu-link", local.class)} />;
}

export function NavigationMenuCheckboxItem(props: NavigationMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.CheckboxItem {...rest} class={cn("ui-navigation-menu-item", local.class)} />
  );
}

export function NavigationMenuRadioGroup(props: NavigationMenuRadioGroupProps) {
  return <CoreNavigationMenu.RadioGroup {...props} />;
}

export function NavigationMenuRadioItem(props: NavigationMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreNavigationMenu.RadioItem {...rest} class={cn("ui-navigation-menu-item", local.class)} />
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
