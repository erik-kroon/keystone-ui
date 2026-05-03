import {
  Combobox as KeystoneCombobox,
  type ComboboxClearProps as KeystoneComboboxClearProps,
  type ComboboxContentProps as KeystoneComboboxContentProps,
  type ComboboxGroupLabelProps as KeystoneComboboxGroupLabelProps,
  type ComboboxGroupProps as KeystoneComboboxGroupProps,
  type ComboboxInputProps as KeystoneComboboxInputProps,
  type ComboboxItemIndicatorProps as KeystoneComboboxItemIndicatorProps,
  type ComboboxItemProps as KeystoneComboboxItemProps,
  type ComboboxItemTextProps as KeystoneComboboxItemTextProps,
  type ComboboxListboxProps as KeystoneComboboxListboxProps,
  type ComboboxPortalProps as KeystoneComboboxPortalProps,
  type ComboboxPositionerProps as KeystoneComboboxPositionerProps,
  type ComboboxRootProps as KeystoneComboboxRootProps,
  type ComboboxTriggerProps as KeystoneComboboxTriggerProps,
} from "@keystone-ui/keystone/combobox";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ComboboxProps = KeystoneComboboxRootProps;
export type ComboboxInputProps = KeystoneComboboxInputProps;
export type ComboboxTriggerProps = KeystoneComboboxTriggerProps;
export type ComboboxClearProps = KeystoneComboboxClearProps;
export type ComboboxPortalProps = KeystoneComboboxPortalProps;
export type ComboboxPositionerProps = KeystoneComboboxPositionerProps;
export type ComboboxContentProps = KeystoneComboboxContentProps & {
  portal?: ComboboxPortalProps;
  positionerClass?: string;
};
export type ComboboxListboxProps = KeystoneComboboxListboxProps;
export type ComboboxGroupProps = KeystoneComboboxGroupProps;
export type ComboboxGroupLabelProps = KeystoneComboboxGroupLabelProps;
export type ComboboxItemProps = KeystoneComboboxItemProps;
export type ComboboxItemTextProps = KeystoneComboboxItemTextProps;
export type ComboboxItemIndicatorProps = KeystoneComboboxItemIndicatorProps;

export function Combobox(props: ComboboxProps) {
  return <KeystoneCombobox.Root {...props} />;
}

export function ComboboxInput(props: ComboboxInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Input {...rest} class={cn("mason-combobox-input", local.class)} />;
}

export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Trigger {...rest} class={cn("mason-combobox-trigger", local.class)} />;
}

export function ComboboxClear(props: ComboboxClearProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Clear {...rest} class={cn("mason-combobox-clear", local.class)} />;
}

export function ComboboxPortal(props: ComboboxPortalProps) {
  return <KeystoneCombobox.Portal {...props} />;
}

export function ComboboxPositioner(props: ComboboxPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.Positioner {...rest} class={cn("mason-combobox-positioner", local.class)} />
  );
}

export function ComboboxContent(props: ComboboxContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <ComboboxPortal {...local.portal}>
      <ComboboxPositioner class={local.positionerClass}>
        <KeystoneCombobox.Content {...rest} class={cn("mason-combobox-content", local.class)}>
          {local.children}
        </KeystoneCombobox.Content>
      </ComboboxPositioner>
    </ComboboxPortal>
  );
}

export function ComboboxListbox(props: ComboboxListboxProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Listbox {...rest} class={cn("mason-combobox-listbox", local.class)} />;
}

export function ComboboxGroup(props: ComboboxGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Group {...rest} class={cn("mason-combobox-group", local.class)} />;
}

export function ComboboxGroupLabel(props: ComboboxGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.GroupLabel {...rest} class={cn("mason-combobox-group-label", local.class)} />
  );
}

export function ComboboxItem(props: ComboboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Item {...rest} class={cn("mason-combobox-item", local.class)} />;
}

export function ComboboxItemText(props: ComboboxItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.ItemText {...rest} class={cn("mason-combobox-item-text", local.class)} />
  );
}

export function ComboboxItemIndicator(props: ComboboxItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.ItemIndicator
      {...rest}
      class={cn("mason-combobox-item-indicator", local.class)}
    />
  );
}
