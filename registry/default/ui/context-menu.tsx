import {
  ContextMenu as KeystoneContextMenu,
  type ContextMenuCheckboxItemProps as KeystoneContextMenuCheckboxItemProps,
  type ContextMenuContentProps as KeystoneContextMenuContentProps,
  type ContextMenuGroupLabelProps as KeystoneContextMenuGroupLabelProps,
  type ContextMenuGroupProps as KeystoneContextMenuGroupProps,
  type ContextMenuItemProps as KeystoneContextMenuItemProps,
  type ContextMenuPartProps as KeystoneContextMenuPartProps,
  type ContextMenuPortalProps as KeystoneContextMenuPortalProps,
  type ContextMenuPositionerProps as KeystoneContextMenuPositionerProps,
  type ContextMenuRadioGroupProps as KeystoneContextMenuRadioGroupProps,
  type ContextMenuRadioItemProps as KeystoneContextMenuRadioItemProps,
  type ContextMenuRootProps as KeystoneContextMenuRootProps,
  type ContextMenuSeparatorProps as KeystoneContextMenuSeparatorProps,
  type ContextMenuTriggerProps as KeystoneContextMenuTriggerProps,
} from "@keystone-ui/keystone/context-menu";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ContextMenuProps = KeystoneContextMenuRootProps;
export type ContextMenuTriggerProps = KeystoneContextMenuTriggerProps;
export type ContextMenuPortalProps = KeystoneContextMenuPortalProps;
export type ContextMenuPositionerProps = KeystoneContextMenuPositionerProps;
export type ContextMenuContentProps = KeystoneContextMenuContentProps & {
  portal?: ContextMenuPortalProps;
  positionerClass?: string;
};
export type ContextMenuGroupProps = KeystoneContextMenuGroupProps;
export type ContextMenuGroupLabelProps = KeystoneContextMenuGroupLabelProps;
export type ContextMenuSeparatorProps = KeystoneContextMenuSeparatorProps;
export type ContextMenuItemProps = KeystoneContextMenuItemProps;
export type ContextMenuCheckboxItemProps = KeystoneContextMenuCheckboxItemProps;
export type ContextMenuRadioGroupProps = KeystoneContextMenuRadioGroupProps;
export type ContextMenuRadioItemProps = KeystoneContextMenuRadioItemProps;
export type ContextMenuItemIndicatorProps = KeystoneContextMenuPartProps<HTMLSpanElement>;

export function ContextMenu(props: ContextMenuProps) {
  return <KeystoneContextMenu.Root {...props} />;
}

export function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.Trigger {...rest} class={cn("mason-context-menu-trigger", local.class)} />
  );
}

export function ContextMenuPortal(props: ContextMenuPortalProps) {
  return <KeystoneContextMenu.Portal {...props} />;
}

export function ContextMenuPositioner(props: ContextMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.Positioner
      {...rest}
      class={cn("mason-context-menu-positioner", local.class)}
    />
  );
}

export function ContextMenuContent(props: ContextMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <ContextMenuPortal {...local.portal}>
      <ContextMenuPositioner class={local.positionerClass}>
        <KeystoneContextMenu.Content
          {...rest}
          class={cn("mason-context-menu-content", local.class)}
        >
          {local.children}
        </KeystoneContextMenu.Content>
      </ContextMenuPositioner>
    </ContextMenuPortal>
  );
}

export function ContextMenuGroup(props: ContextMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.Group {...rest} class={cn("mason-context-menu-group", local.class)} />
  );
}

export function ContextMenuGroupLabel(props: ContextMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.GroupLabel
      {...rest}
      class={cn("mason-context-menu-group-label", local.class)}
    />
  );
}

export function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.Separator
      {...rest}
      class={cn("mason-context-menu-separator", local.class)}
    />
  );
}

export function ContextMenuItem(props: ContextMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneContextMenu.Item {...rest} class={cn("mason-context-menu-item", local.class)} />;
}

export function ContextMenuCheckboxItem(props: ContextMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.CheckboxItem
      {...rest}
      class={cn("mason-context-menu-item", local.class)}
    />
  );
}

export function ContextMenuRadioGroup(props: ContextMenuRadioGroupProps) {
  return <KeystoneContextMenu.RadioGroup {...props} />;
}

export function ContextMenuRadioItem(props: ContextMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.RadioItem {...rest} class={cn("mason-context-menu-item", local.class)} />
  );
}

export function ContextMenuItemIndicator(props: ContextMenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneContextMenu.ItemIndicator
      {...rest}
      class={cn("mason-context-menu-item-indicator", local.class)}
    />
  );
}
