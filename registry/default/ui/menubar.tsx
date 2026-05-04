import {
  Menubar as CoreMenubar,
  type MenubarCheckboxItemProps as CoreMenubarCheckboxItemProps,
  type MenubarContentProps as CoreMenubarContentProps,
  type MenubarGroupLabelProps as CoreMenubarGroupLabelProps,
  type MenubarGroupProps as CoreMenubarGroupProps,
  type MenubarItemProps as CoreMenubarItemProps,
  type MenubarPartProps as CoreMenubarPartProps,
  type MenubarPortalProps as CoreMenubarPortalProps,
  type MenubarPositionerProps as CoreMenubarPositionerProps,
  type MenubarRadioGroupProps as CoreMenubarRadioGroupProps,
  type MenubarRadioItemProps as CoreMenubarRadioItemProps,
  type MenubarRootProps as CoreMenubarRootProps,
  type MenubarSeparatorProps as CoreMenubarSeparatorProps,
  type MenubarTriggerProps as CoreMenubarTriggerProps,
} from "@keystone-ui/core/menubar";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type MenubarProps = CoreMenubarRootProps;
export type MenubarTriggerProps = CoreMenubarTriggerProps;
export type MenubarPortalProps = CoreMenubarPortalProps;
export type MenubarPositionerProps = CoreMenubarPositionerProps;
export type MenubarContentProps = CoreMenubarContentProps & {
  portal?: MenubarPortalProps;
  positionerClass?: string;
};
export type MenubarGroupProps = CoreMenubarGroupProps;
export type MenubarGroupLabelProps = CoreMenubarGroupLabelProps;
export type MenubarSeparatorProps = CoreMenubarSeparatorProps;
export type MenubarItemProps = CoreMenubarItemProps;
export type MenubarCheckboxItemProps = CoreMenubarCheckboxItemProps;
export type MenubarRadioGroupProps = CoreMenubarRadioGroupProps;
export type MenubarRadioItemProps = CoreMenubarRadioItemProps;
export type MenubarItemIndicatorProps = CoreMenubarPartProps<HTMLSpanElement>;

export function Menubar(props: MenubarProps) {
  return <CoreMenubar.Root {...props} />;
}

export function MenubarTrigger(props: MenubarTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.Trigger {...rest} class={cn("ui-menubar-trigger", local.class)} />;
}

export function MenubarPortal(props: MenubarPortalProps) {
  return <CoreMenubar.Portal {...props} />;
}

export function MenubarPositioner(props: MenubarPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.Positioner {...rest} class={cn("ui-menubar-positioner", local.class)} />;
}

export function MenubarContent(props: MenubarContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <MenubarPortal {...local.portal}>
      <MenubarPositioner class={local.positionerClass}>
        <CoreMenubar.Content {...rest} class={cn("ui-menubar-content", local.class)}>
          {local.children}
        </CoreMenubar.Content>
      </MenubarPositioner>
    </MenubarPortal>
  );
}

export function MenubarGroup(props: MenubarGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.Group {...rest} class={cn("ui-menubar-group", local.class)} />;
}

export function MenubarGroupLabel(props: MenubarGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.GroupLabel {...rest} class={cn("ui-menubar-group-label", local.class)} />;
}

export function MenubarSeparator(props: MenubarSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.Separator {...rest} class={cn("ui-menubar-separator", local.class)} />;
}

export function MenubarItem(props: MenubarItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.Item {...rest} class={cn("ui-menubar-item", local.class)} />;
}

export function MenubarCheckboxItem(props: MenubarCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.CheckboxItem {...rest} class={cn("ui-menubar-item", local.class)} />;
}

export function MenubarRadioGroup(props: MenubarRadioGroupProps) {
  return <CoreMenubar.RadioGroup {...props} />;
}

export function MenubarRadioItem(props: MenubarRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreMenubar.RadioItem {...rest} class={cn("ui-menubar-item", local.class)} />;
}

export function MenubarItemIndicator(props: MenubarItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreMenubar.ItemIndicator {...rest} class={cn("ui-menubar-item-indicator", local.class)} />
  );
}
