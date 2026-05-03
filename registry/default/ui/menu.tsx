import {
  Menu as KeystoneMenu,
  type MenuCheckboxItemProps as KeystoneMenuCheckboxItemProps,
  type MenuContentProps as KeystoneMenuContentProps,
  type MenuGroupLabelProps as KeystoneMenuGroupLabelProps,
  type MenuGroupProps as KeystoneMenuGroupProps,
  type MenuItemProps as KeystoneMenuItemProps,
  type MenuPartProps as KeystoneMenuPartProps,
  type MenuPortalProps as KeystoneMenuPortalProps,
  type MenuPositionerProps as KeystoneMenuPositionerProps,
  type MenuRadioGroupProps as KeystoneMenuRadioGroupProps,
  type MenuRadioItemProps as KeystoneMenuRadioItemProps,
  type MenuRootProps as KeystoneMenuRootProps,
  type MenuSeparatorProps as KeystoneMenuSeparatorProps,
  type MenuTriggerProps as KeystoneMenuTriggerProps,
} from "@keystone-ui/keystone/menu";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type MenuProps = KeystoneMenuRootProps;
export type MenuTriggerProps = KeystoneMenuTriggerProps;
export type MenuPortalProps = KeystoneMenuPortalProps;
export type MenuPositionerProps = KeystoneMenuPositionerProps;
export type MenuContentProps = KeystoneMenuContentProps & {
  portal?: MenuPortalProps;
  positionerClass?: string;
};
export type MenuGroupProps = KeystoneMenuGroupProps;
export type MenuGroupLabelProps = KeystoneMenuGroupLabelProps;
export type MenuSeparatorProps = KeystoneMenuSeparatorProps;
export type MenuItemProps = KeystoneMenuItemProps;
export type MenuCheckboxItemProps = KeystoneMenuCheckboxItemProps;
export type MenuRadioGroupProps = KeystoneMenuRadioGroupProps;
export type MenuRadioItemProps = KeystoneMenuRadioItemProps;
export type MenuItemIndicatorProps = KeystoneMenuPartProps<HTMLSpanElement>;

export function Menu(props: MenuProps) {
  return <KeystoneMenu.Root {...props} />;
}

export function MenuTrigger(props: MenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.Trigger {...rest} class={cn("mason-menu-trigger", local.class)} />;
}

export function MenuPortal(props: MenuPortalProps) {
  return <KeystoneMenu.Portal {...props} />;
}

export function MenuPositioner(props: MenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.Positioner {...rest} class={cn("mason-menu-positioner", local.class)} />;
}

export function MenuContent(props: MenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <MenuPortal {...local.portal}>
      <MenuPositioner class={local.positionerClass}>
        <KeystoneMenu.Content {...rest} class={cn("mason-menu-content", local.class)}>
          {local.children}
        </KeystoneMenu.Content>
      </MenuPositioner>
    </MenuPortal>
  );
}

export function MenuGroup(props: MenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.Group {...rest} class={cn("mason-menu-group", local.class)} />;
}

export function MenuGroupLabel(props: MenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.GroupLabel {...rest} class={cn("mason-menu-group-label", local.class)} />;
}

export function MenuSeparator(props: MenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.Separator {...rest} class={cn("mason-menu-separator", local.class)} />;
}

export function MenuItem(props: MenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.Item {...rest} class={cn("mason-menu-item", local.class)} />;
}

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.CheckboxItem {...rest} class={cn("mason-menu-item", local.class)} />;
}

export function MenuRadioGroup(props: MenuRadioGroupProps) {
  return <KeystoneMenu.RadioGroup {...props} />;
}

export function MenuRadioItem(props: MenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenu.RadioItem {...rest} class={cn("mason-menu-item", local.class)} />;
}

export function MenuItemIndicator(props: MenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneMenu.ItemIndicator {...rest} class={cn("mason-menu-item-indicator", local.class)} />
  );
}
