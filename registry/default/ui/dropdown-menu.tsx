import {
  DropdownMenu as CoreDropdownMenu,
  type DropdownMenuCheckboxItemProps as CoreDropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps as CoreDropdownMenuContentProps,
  type DropdownMenuGroupLabelProps as CoreDropdownMenuGroupLabelProps,
  type DropdownMenuGroupProps as CoreDropdownMenuGroupProps,
  type DropdownMenuItemProps as CoreDropdownMenuItemProps,
  type DropdownMenuPartProps as CoreDropdownMenuPartProps,
  type DropdownMenuPortalProps as CoreDropdownMenuPortalProps,
  type DropdownMenuPositionerProps as CoreDropdownMenuPositionerProps,
  type DropdownMenuRadioGroupProps as CoreDropdownMenuRadioGroupProps,
  type DropdownMenuRadioItemProps as CoreDropdownMenuRadioItemProps,
  type DropdownMenuRootProps as CoreDropdownMenuRootProps,
  type DropdownMenuSeparatorProps as CoreDropdownMenuSeparatorProps,
  type DropdownMenuTriggerProps as CoreDropdownMenuTriggerProps,
} from "@keystone-ui/core/dropdown-menu";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type DropdownMenuProps = CoreDropdownMenuRootProps;
export type DropdownMenuTriggerProps = CoreDropdownMenuTriggerProps;
export type DropdownMenuPortalProps = CoreDropdownMenuPortalProps;
export type DropdownMenuPositionerProps = CoreDropdownMenuPositionerProps;
export type DropdownMenuContentProps = CoreDropdownMenuContentProps & {
  portal?: DropdownMenuPortalProps;
  positionerClass?: string;
};
export type DropdownMenuGroupProps = CoreDropdownMenuGroupProps;
export type DropdownMenuGroupLabelProps = CoreDropdownMenuGroupLabelProps;
export type DropdownMenuSeparatorProps = CoreDropdownMenuSeparatorProps;
export type DropdownMenuItemProps = CoreDropdownMenuItemProps;
export type DropdownMenuCheckboxItemProps = CoreDropdownMenuCheckboxItemProps;
export type DropdownMenuRadioGroupProps = CoreDropdownMenuRadioGroupProps;
export type DropdownMenuRadioItemProps = CoreDropdownMenuRadioItemProps;
export type DropdownMenuItemIndicatorProps = CoreDropdownMenuPartProps<HTMLSpanElement>;

export function DropdownMenu(props: DropdownMenuProps) {
  return <CoreDropdownMenu.Root {...props} />;
}

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreDropdownMenu.Trigger {...rest} class={cn("ui-dropdown-menu-trigger", local.class)} />;
}

export function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <CoreDropdownMenu.Portal {...props} />;
}

export function DropdownMenuPositioner(props: DropdownMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.Positioner {...rest} class={cn("ui-dropdown-menu-positioner", local.class)} />
  );
}

export function DropdownMenuContent(props: DropdownMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <DropdownMenuPortal {...local.portal}>
      <DropdownMenuPositioner class={local.positionerClass}>
        <CoreDropdownMenu.Content {...rest} class={cn("ui-dropdown-menu-content", local.class)}>
          {local.children}
        </CoreDropdownMenu.Content>
      </DropdownMenuPositioner>
    </DropdownMenuPortal>
  );
}

export function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreDropdownMenu.Group {...rest} class={cn("ui-dropdown-menu-group", local.class)} />;
}

export function DropdownMenuGroupLabel(props: DropdownMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.GroupLabel
      {...rest}
      class={cn("ui-dropdown-menu-group-label", local.class)}
    />
  );
}

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.Separator {...rest} class={cn("ui-dropdown-menu-separator", local.class)} />
  );
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreDropdownMenu.Item {...rest} class={cn("ui-dropdown-menu-item", local.class)} />;
}

export function DropdownMenuCheckboxItem(props: DropdownMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.CheckboxItem {...rest} class={cn("ui-dropdown-menu-item", local.class)} />
  );
}

export function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <CoreDropdownMenu.RadioGroup {...props} />;
}

export function DropdownMenuRadioItem(props: DropdownMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreDropdownMenu.RadioItem {...rest} class={cn("ui-dropdown-menu-item", local.class)} />;
}

export function DropdownMenuItemIndicator(props: DropdownMenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreDropdownMenu.ItemIndicator
      {...rest}
      class={cn("ui-dropdown-menu-item-indicator", local.class)}
    />
  );
}
