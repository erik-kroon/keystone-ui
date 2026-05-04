import {
  ContextMenu as CoreContextMenu,
  type ContextMenuCheckboxItemProps as CoreContextMenuCheckboxItemProps,
  type ContextMenuContentProps as CoreContextMenuContentProps,
  type ContextMenuGroupLabelProps as CoreContextMenuGroupLabelProps,
  type ContextMenuGroupProps as CoreContextMenuGroupProps,
  type ContextMenuItemProps as CoreContextMenuItemProps,
  type ContextMenuPartProps as CoreContextMenuPartProps,
  type ContextMenuPortalProps as CoreContextMenuPortalProps,
  type ContextMenuPositionerProps as CoreContextMenuPositionerProps,
  type ContextMenuRadioGroupProps as CoreContextMenuRadioGroupProps,
  type ContextMenuRadioItemProps as CoreContextMenuRadioItemProps,
  type ContextMenuRootProps as CoreContextMenuRootProps,
  type ContextMenuSeparatorProps as CoreContextMenuSeparatorProps,
  type ContextMenuTriggerProps as CoreContextMenuTriggerProps,
} from "@keystone-ui/core/context-menu";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ContextMenuProps = CoreContextMenuRootProps;
export type ContextMenuTriggerProps = CoreContextMenuTriggerProps;
export type ContextMenuPortalProps = CoreContextMenuPortalProps;
export type ContextMenuPositionerProps = CoreContextMenuPositionerProps;
export type ContextMenuContentProps = CoreContextMenuContentProps & {
  portal?: ContextMenuPortalProps;
  positionerClass?: string;
};
export type ContextMenuGroupProps = CoreContextMenuGroupProps;
export type ContextMenuGroupLabelProps = CoreContextMenuGroupLabelProps;
export type ContextMenuSeparatorProps = CoreContextMenuSeparatorProps;
export type ContextMenuItemProps = CoreContextMenuItemProps;
export type ContextMenuCheckboxItemProps = CoreContextMenuCheckboxItemProps;
export type ContextMenuRadioGroupProps = CoreContextMenuRadioGroupProps;
export type ContextMenuRadioItemProps = CoreContextMenuRadioItemProps;
export type ContextMenuItemIndicatorProps = CoreContextMenuPartProps<HTMLSpanElement>;

export function ContextMenu(props: ContextMenuProps) {
  return <CoreContextMenu.Root {...props} />;
}

export function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreContextMenu.Trigger {...rest} class={cn("ui-context-menu-trigger", local.class)} />;
}

export function ContextMenuPortal(props: ContextMenuPortalProps) {
  return <CoreContextMenu.Portal {...props} />;
}

export function ContextMenuPositioner(props: ContextMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreContextMenu.Positioner {...rest} class={cn("ui-context-menu-positioner", local.class)} />
  );
}

export function ContextMenuContent(props: ContextMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <ContextMenuPortal {...local.portal}>
      <ContextMenuPositioner class={local.positionerClass}>
        <CoreContextMenu.Content {...rest} class={cn("ui-context-menu-content", local.class)}>
          {local.children}
        </CoreContextMenu.Content>
      </ContextMenuPositioner>
    </ContextMenuPortal>
  );
}

export function ContextMenuGroup(props: ContextMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreContextMenu.Group {...rest} class={cn("ui-context-menu-group", local.class)} />;
}

export function ContextMenuGroupLabel(props: ContextMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreContextMenu.GroupLabel {...rest} class={cn("ui-context-menu-group-label", local.class)} />
  );
}

export function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreContextMenu.Separator {...rest} class={cn("ui-context-menu-separator", local.class)} />
  );
}

export function ContextMenuItem(props: ContextMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreContextMenu.Item {...rest} class={cn("ui-context-menu-item", local.class)} />;
}

export function ContextMenuCheckboxItem(props: ContextMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreContextMenu.CheckboxItem {...rest} class={cn("ui-context-menu-item", local.class)} />;
}

export function ContextMenuRadioGroup(props: ContextMenuRadioGroupProps) {
  return <CoreContextMenu.RadioGroup {...props} />;
}

export function ContextMenuRadioItem(props: ContextMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreContextMenu.RadioItem {...rest} class={cn("ui-context-menu-item", local.class)} />;
}

export function ContextMenuItemIndicator(props: ContextMenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreContextMenu.ItemIndicator
      {...rest}
      class={cn("ui-context-menu-item-indicator", local.class)}
    />
  );
}
