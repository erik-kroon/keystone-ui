import {
  Menubar as KeystoneMenubar,
  type MenubarCheckboxItemProps as KeystoneMenubarCheckboxItemProps,
  type MenubarContentProps as KeystoneMenubarContentProps,
  type MenubarGroupLabelProps as KeystoneMenubarGroupLabelProps,
  type MenubarGroupProps as KeystoneMenubarGroupProps,
  type MenubarItemProps as KeystoneMenubarItemProps,
  type MenubarPartProps as KeystoneMenubarPartProps,
  type MenubarPortalProps as KeystoneMenubarPortalProps,
  type MenubarPositionerProps as KeystoneMenubarPositionerProps,
  type MenubarRadioGroupProps as KeystoneMenubarRadioGroupProps,
  type MenubarRadioItemProps as KeystoneMenubarRadioItemProps,
  type MenubarRootProps as KeystoneMenubarRootProps,
  type MenubarSeparatorProps as KeystoneMenubarSeparatorProps,
  type MenubarTriggerProps as KeystoneMenubarTriggerProps,
} from "@keystone-ui/keystone/menubar";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type MenubarProps = KeystoneMenubarRootProps;
export type MenubarTriggerProps = KeystoneMenubarTriggerProps;
export type MenubarPortalProps = KeystoneMenubarPortalProps;
export type MenubarPositionerProps = KeystoneMenubarPositionerProps;
export type MenubarContentProps = KeystoneMenubarContentProps & {
  portal?: MenubarPortalProps;
  positionerClass?: string;
};
export type MenubarGroupProps = KeystoneMenubarGroupProps;
export type MenubarGroupLabelProps = KeystoneMenubarGroupLabelProps;
export type MenubarSeparatorProps = KeystoneMenubarSeparatorProps;
export type MenubarItemProps = KeystoneMenubarItemProps;
export type MenubarCheckboxItemProps = KeystoneMenubarCheckboxItemProps;
export type MenubarRadioGroupProps = KeystoneMenubarRadioGroupProps;
export type MenubarRadioItemProps = KeystoneMenubarRadioItemProps;
export type MenubarItemIndicatorProps = KeystoneMenubarPartProps<HTMLSpanElement>;

export function Menubar(props: MenubarProps) {
  return <KeystoneMenubar.Root {...props} />;
}

export function MenubarTrigger(props: MenubarTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenubar.Trigger {...rest} class={cn("mason-menubar-trigger", local.class)} />;
}

export function MenubarPortal(props: MenubarPortalProps) {
  return <KeystoneMenubar.Portal {...props} />;
}

export function MenubarPositioner(props: MenubarPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneMenubar.Positioner {...rest} class={cn("mason-menubar-positioner", local.class)} />
  );
}

export function MenubarContent(props: MenubarContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <MenubarPortal {...local.portal}>
      <MenubarPositioner class={local.positionerClass}>
        <KeystoneMenubar.Content {...rest} class={cn("mason-menubar-content", local.class)}>
          {local.children}
        </KeystoneMenubar.Content>
      </MenubarPositioner>
    </MenubarPortal>
  );
}

export function MenubarGroup(props: MenubarGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenubar.Group {...rest} class={cn("mason-menubar-group", local.class)} />;
}

export function MenubarGroupLabel(props: MenubarGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneMenubar.GroupLabel {...rest} class={cn("mason-menubar-group-label", local.class)} />
  );
}

export function MenubarSeparator(props: MenubarSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenubar.Separator {...rest} class={cn("mason-menubar-separator", local.class)} />;
}

export function MenubarItem(props: MenubarItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenubar.Item {...rest} class={cn("mason-menubar-item", local.class)} />;
}

export function MenubarCheckboxItem(props: MenubarCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenubar.CheckboxItem {...rest} class={cn("mason-menubar-item", local.class)} />;
}

export function MenubarRadioGroup(props: MenubarRadioGroupProps) {
  return <KeystoneMenubar.RadioGroup {...props} />;
}

export function MenubarRadioItem(props: MenubarRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneMenubar.RadioItem {...rest} class={cn("mason-menubar-item", local.class)} />;
}

export function MenubarItemIndicator(props: MenubarItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneMenubar.ItemIndicator
      {...rest}
      class={cn("mason-menubar-item-indicator", local.class)}
    />
  );
}
