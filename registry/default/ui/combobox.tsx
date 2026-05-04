import {
  Combobox as CoreCombobox,
  type ComboboxClearProps as CoreComboboxClearProps,
  type ComboboxContentProps as CoreComboboxContentProps,
  type ComboboxGroupLabelProps as CoreComboboxGroupLabelProps,
  type ComboboxGroupProps as CoreComboboxGroupProps,
  type ComboboxInputProps as CoreComboboxInputProps,
  type ComboboxItemIndicatorProps as CoreComboboxItemIndicatorProps,
  type ComboboxItemProps as CoreComboboxItemProps,
  type ComboboxItemTextProps as CoreComboboxItemTextProps,
  type ComboboxListboxProps as CoreComboboxListboxProps,
  type ComboboxPortalProps as CoreComboboxPortalProps,
  type ComboboxPositionerProps as CoreComboboxPositionerProps,
  type ComboboxRootProps as CoreComboboxRootProps,
  type ComboboxTriggerProps as CoreComboboxTriggerProps,
} from "@keystone-ui/core/combobox";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ComboboxProps = CoreComboboxRootProps;
export type ComboboxInputProps = CoreComboboxInputProps;
export type ComboboxTriggerProps = CoreComboboxTriggerProps;
export type ComboboxClearProps = CoreComboboxClearProps;
export type ComboboxPortalProps = CoreComboboxPortalProps;
export type ComboboxPositionerProps = CoreComboboxPositionerProps;
export type ComboboxContentProps = CoreComboboxContentProps & {
  portal?: ComboboxPortalProps;
  positionerClass?: string;
};
export type ComboboxListboxProps = CoreComboboxListboxProps;
export type ComboboxGroupProps = CoreComboboxGroupProps;
export type ComboboxGroupLabelProps = CoreComboboxGroupLabelProps;
export type ComboboxItemProps = CoreComboboxItemProps;
export type ComboboxItemTextProps = CoreComboboxItemTextProps;
export type ComboboxItemIndicatorProps = CoreComboboxItemIndicatorProps;

export function Combobox(props: ComboboxProps) {
  return <CoreCombobox.Root {...props} />;
}

export function ComboboxInput(props: ComboboxInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Input {...rest} class={cn("ui-combobox-input", local.class)} />;
}

export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Trigger {...rest} class={cn("ui-combobox-trigger", local.class)} />;
}

export function ComboboxClear(props: ComboboxClearProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Clear {...rest} class={cn("ui-combobox-clear", local.class)} />;
}

export function ComboboxPortal(props: ComboboxPortalProps) {
  return <CoreCombobox.Portal {...props} />;
}

export function ComboboxPositioner(props: ComboboxPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Positioner {...rest} class={cn("ui-combobox-positioner", local.class)} />;
}

export function ComboboxContent(props: ComboboxContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <ComboboxPortal {...local.portal}>
      <ComboboxPositioner class={local.positionerClass}>
        <CoreCombobox.Content {...rest} class={cn("ui-combobox-content", local.class)}>
          {local.children}
        </CoreCombobox.Content>
      </ComboboxPositioner>
    </ComboboxPortal>
  );
}

export function ComboboxListbox(props: ComboboxListboxProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Listbox {...rest} class={cn("ui-combobox-listbox", local.class)} />;
}

export function ComboboxGroup(props: ComboboxGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Group {...rest} class={cn("ui-combobox-group", local.class)} />;
}

export function ComboboxGroupLabel(props: ComboboxGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.GroupLabel {...rest} class={cn("ui-combobox-group-label", local.class)} />;
}

export function ComboboxItem(props: ComboboxItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Item {...rest} class={cn("ui-combobox-item", local.class)} />;
}

export function ComboboxItemText(props: ComboboxItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.ItemText {...rest} class={cn("ui-combobox-item-text", local.class)} />;
}

export function ComboboxItemIndicator(props: ComboboxItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.ItemIndicator {...rest} class={cn("ui-combobox-item-indicator", local.class)} />
  );
}
