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
import { splitProps } from "solid-js";
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

export function Menu(props: MenuProps) {
  return <CoreMenu.Root {...props} />;
}

export function MenuTrigger(props: MenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.Trigger {...rest} class={cn("ui-menu-trigger", local.class)} />;
}

export function MenuPortal(props: MenuPortalProps) {
  return <CoreMenu.Portal {...props} />;
}

export function MenuPositioner(props: MenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.Positioner {...rest} class={cn("ui-menu-positioner", local.class)} />;
}

export function MenuContent(props: MenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <MenuPortal {...local.portal}>
      <MenuPositioner class={local.positionerClass}>
        <CoreMenu.Content {...rest} class={cn("ui-menu-content", local.class)}>
          {local.children}
        </CoreMenu.Content>
      </MenuPositioner>
    </MenuPortal>
  );
}

export function MenuGroup(props: MenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.Group {...rest} class={cn("ui-menu-group", local.class)} />;
}

export function MenuGroupLabel(props: MenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.GroupLabel {...rest} class={cn("ui-menu-group-label", local.class)} />;
}

export function MenuSeparator(props: MenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.Separator {...rest} class={cn("ui-menu-separator", local.class)} />;
}

export function MenuItem(props: MenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.Item {...rest} class={cn("ui-menu-item", local.class)} />;
}

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.CheckboxItem {...rest} class={cn("ui-menu-item", local.class)} />;
}

export function MenuRadioGroup(props: MenuRadioGroupProps) {
  return <CoreMenu.RadioGroup {...props} />;
}

export function MenuRadioItem(props: MenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.RadioItem {...rest} class={cn("ui-menu-item", local.class)} />;
}

export function MenuItemIndicator(props: MenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenu.ItemIndicator {...rest} class={cn("ui-menu-item-indicator", local.class)} />;
}
