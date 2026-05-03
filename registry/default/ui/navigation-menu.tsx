import {
  NavigationMenu as KeystoneNavigationMenu,
  type NavigationMenuCheckboxItemProps as KeystoneNavigationMenuCheckboxItemProps,
  type NavigationMenuContentProps as KeystoneNavigationMenuContentProps,
  type NavigationMenuGroupLabelProps as KeystoneNavigationMenuGroupLabelProps,
  type NavigationMenuGroupProps as KeystoneNavigationMenuGroupProps,
  type NavigationMenuItemProps as KeystoneNavigationMenuItemProps,
  type NavigationMenuPartProps as KeystoneNavigationMenuPartProps,
  type NavigationMenuPortalProps as KeystoneNavigationMenuPortalProps,
  type NavigationMenuPositionerProps as KeystoneNavigationMenuPositionerProps,
  type NavigationMenuRadioGroupProps as KeystoneNavigationMenuRadioGroupProps,
  type NavigationMenuRadioItemProps as KeystoneNavigationMenuRadioItemProps,
  type NavigationMenuRootProps as KeystoneNavigationMenuRootProps,
  type NavigationMenuSeparatorProps as KeystoneNavigationMenuSeparatorProps,
  type NavigationMenuTriggerProps as KeystoneNavigationMenuTriggerProps,
} from "@keystone-ui/keystone/navigation-menu";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type NavigationMenuProps = KeystoneNavigationMenuRootProps;
export type NavigationMenuTriggerProps = KeystoneNavigationMenuTriggerProps;
export type NavigationMenuPortalProps = KeystoneNavigationMenuPortalProps;
export type NavigationMenuPositionerProps = KeystoneNavigationMenuPositionerProps;
export type NavigationMenuContentProps = KeystoneNavigationMenuContentProps & {
  portal?: NavigationMenuPortalProps;
  positionerClass?: string;
};
export type NavigationMenuGroupProps = KeystoneNavigationMenuGroupProps;
export type NavigationMenuGroupLabelProps = KeystoneNavigationMenuGroupLabelProps;
export type NavigationMenuSeparatorProps = KeystoneNavigationMenuSeparatorProps;
export type NavigationMenuItemProps = KeystoneNavigationMenuItemProps;
export type NavigationMenuCheckboxItemProps = KeystoneNavigationMenuCheckboxItemProps;
export type NavigationMenuRadioGroupProps = KeystoneNavigationMenuRadioGroupProps;
export type NavigationMenuRadioItemProps = KeystoneNavigationMenuRadioItemProps;
export type NavigationMenuItemIndicatorProps = KeystoneNavigationMenuPartProps<HTMLSpanElement>;

export function NavigationMenu(props: NavigationMenuProps) {
  return <KeystoneNavigationMenu.Root {...props} />;
}

export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.Trigger
      {...rest}
      class={cn("mason-navigation-menu-trigger", local.class)}
    />
  );
}

export function NavigationMenuPortal(props: NavigationMenuPortalProps) {
  return <KeystoneNavigationMenu.Portal {...props} />;
}

export function NavigationMenuPositioner(props: NavigationMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.Positioner
      {...rest}
      class={cn("mason-navigation-menu-positioner", local.class)}
    />
  );
}

export function NavigationMenuContent(props: NavigationMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <NavigationMenuPortal {...local.portal}>
      <NavigationMenuPositioner class={local.positionerClass}>
        <KeystoneNavigationMenu.Content
          {...rest}
          class={cn("mason-navigation-menu-content", local.class)}
        >
          {local.children}
        </KeystoneNavigationMenu.Content>
      </NavigationMenuPositioner>
    </NavigationMenuPortal>
  );
}

export function NavigationMenuGroup(props: NavigationMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.Group
      {...rest}
      class={cn("mason-navigation-menu-group", local.class)}
    />
  );
}

export function NavigationMenuGroupLabel(props: NavigationMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.GroupLabel
      {...rest}
      class={cn("mason-navigation-menu-group-label", local.class)}
    />
  );
}

export function NavigationMenuSeparator(props: NavigationMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.Separator
      {...rest}
      class={cn("mason-navigation-menu-separator", local.class)}
    />
  );
}

export function NavigationMenuItem(props: NavigationMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.Item {...rest} class={cn("mason-navigation-menu-item", local.class)} />
  );
}

export function NavigationMenuCheckboxItem(props: NavigationMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.CheckboxItem
      {...rest}
      class={cn("mason-navigation-menu-item", local.class)}
    />
  );
}

export function NavigationMenuRadioGroup(props: NavigationMenuRadioGroupProps) {
  return <KeystoneNavigationMenu.RadioGroup {...props} />;
}

export function NavigationMenuRadioItem(props: NavigationMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.RadioItem
      {...rest}
      class={cn("mason-navigation-menu-item", local.class)}
    />
  );
}

export function NavigationMenuItemIndicator(props: NavigationMenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneNavigationMenu.ItemIndicator
      {...rest}
      class={cn("mason-navigation-menu-item-indicator", local.class)}
    />
  );
}
