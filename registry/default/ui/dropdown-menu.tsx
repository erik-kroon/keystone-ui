import {
  DropdownMenu as KeystoneDropdownMenu,
  type DropdownMenuCheckboxItemProps as KeystoneDropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps as KeystoneDropdownMenuContentProps,
  type DropdownMenuGroupLabelProps as KeystoneDropdownMenuGroupLabelProps,
  type DropdownMenuGroupProps as KeystoneDropdownMenuGroupProps,
  type DropdownMenuItemProps as KeystoneDropdownMenuItemProps,
  type DropdownMenuPartProps as KeystoneDropdownMenuPartProps,
  type DropdownMenuPortalProps as KeystoneDropdownMenuPortalProps,
  type DropdownMenuPositionerProps as KeystoneDropdownMenuPositionerProps,
  type DropdownMenuRadioGroupProps as KeystoneDropdownMenuRadioGroupProps,
  type DropdownMenuRadioItemProps as KeystoneDropdownMenuRadioItemProps,
  type DropdownMenuRootProps as KeystoneDropdownMenuRootProps,
  type DropdownMenuSeparatorProps as KeystoneDropdownMenuSeparatorProps,
  type DropdownMenuTriggerProps as KeystoneDropdownMenuTriggerProps,
} from "@keystone-ui/keystone/dropdown-menu";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type DropdownMenuProps = KeystoneDropdownMenuRootProps;
export type DropdownMenuTriggerProps = KeystoneDropdownMenuTriggerProps;
export type DropdownMenuPortalProps = KeystoneDropdownMenuPortalProps;
export type DropdownMenuPositionerProps = KeystoneDropdownMenuPositionerProps;
export type DropdownMenuContentProps = KeystoneDropdownMenuContentProps & {
  portal?: DropdownMenuPortalProps;
  positionerClass?: string;
};
export type DropdownMenuGroupProps = KeystoneDropdownMenuGroupProps;
export type DropdownMenuGroupLabelProps = KeystoneDropdownMenuGroupLabelProps;
export type DropdownMenuSeparatorProps = KeystoneDropdownMenuSeparatorProps;
export type DropdownMenuItemProps = KeystoneDropdownMenuItemProps;
export type DropdownMenuCheckboxItemProps = KeystoneDropdownMenuCheckboxItemProps;
export type DropdownMenuRadioGroupProps = KeystoneDropdownMenuRadioGroupProps;
export type DropdownMenuRadioItemProps = KeystoneDropdownMenuRadioItemProps;
export type DropdownMenuItemIndicatorProps = KeystoneDropdownMenuPartProps<HTMLSpanElement>;

export function DropdownMenu(props: DropdownMenuProps) {
  return <KeystoneDropdownMenu.Root {...props} />;
}

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.Trigger
      {...rest}
      class={cn("mason-dropdown-menu-trigger", local.class)}
    />
  );
}

export function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <KeystoneDropdownMenu.Portal {...props} />;
}

export function DropdownMenuPositioner(props: DropdownMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.Positioner
      {...rest}
      class={cn("mason-dropdown-menu-positioner", local.class)}
    />
  );
}

export function DropdownMenuContent(props: DropdownMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <DropdownMenuPortal {...local.portal}>
      <DropdownMenuPositioner class={local.positionerClass}>
        <KeystoneDropdownMenu.Content
          {...rest}
          class={cn("mason-dropdown-menu-content", local.class)}
        >
          {local.children}
        </KeystoneDropdownMenu.Content>
      </DropdownMenuPositioner>
    </DropdownMenuPortal>
  );
}

export function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.Group {...rest} class={cn("mason-dropdown-menu-group", local.class)} />
  );
}

export function DropdownMenuGroupLabel(props: DropdownMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.GroupLabel
      {...rest}
      class={cn("mason-dropdown-menu-group-label", local.class)}
    />
  );
}

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.Separator
      {...rest}
      class={cn("mason-dropdown-menu-separator", local.class)}
    />
  );
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.Item {...rest} class={cn("mason-dropdown-menu-item", local.class)} />
  );
}

export function DropdownMenuCheckboxItem(props: DropdownMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.CheckboxItem
      {...rest}
      class={cn("mason-dropdown-menu-item", local.class)}
    />
  );
}

export function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return <KeystoneDropdownMenu.RadioGroup {...props} />;
}

export function DropdownMenuRadioItem(props: DropdownMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.RadioItem {...rest} class={cn("mason-dropdown-menu-item", local.class)} />
  );
}

export function DropdownMenuItemIndicator(props: DropdownMenuItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneDropdownMenu.ItemIndicator
      {...rest}
      class={cn("mason-dropdown-menu-item-indicator", local.class)}
    />
  );
}
