import {
  Autocomplete as CoreAutocomplete,
  type AutocompleteClearProps as CoreAutocompleteClearProps,
  type AutocompleteContentProps as CoreAutocompleteContentProps,
  type AutocompleteGroupLabelProps as CoreAutocompleteGroupLabelProps,
  type AutocompleteGroupProps as CoreAutocompleteGroupProps,
  type AutocompleteInputProps as CoreAutocompleteInputProps,
  type AutocompleteItemIndicatorProps as CoreAutocompleteItemIndicatorProps,
  type AutocompleteItemProps as CoreAutocompleteItemProps,
  type AutocompleteItemTextProps as CoreAutocompleteItemTextProps,
  type AutocompleteListboxProps as CoreAutocompleteListboxProps,
  type AutocompletePortalProps as CoreAutocompletePortalProps,
  type AutocompletePositionerProps as CoreAutocompletePositionerProps,
  type AutocompleteRootProps as CoreAutocompleteRootProps,
  type AutocompleteTriggerProps as CoreAutocompleteTriggerProps,
} from "@keystone-ui/core/autocomplete";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type AutocompleteProps = CoreAutocompleteRootProps;
export type AutocompleteInputProps = CoreAutocompleteInputProps;
export type AutocompleteTriggerProps = CoreAutocompleteTriggerProps;
export type AutocompleteClearProps = CoreAutocompleteClearProps;
export type AutocompletePortalProps = CoreAutocompletePortalProps;
export type AutocompletePositionerProps = CoreAutocompletePositionerProps;
export type AutocompleteContentProps = CoreAutocompleteContentProps & {
  portal?: AutocompletePortalProps;
  positionerClass?: string;
};
export type AutocompleteListboxProps = CoreAutocompleteListboxProps;
export type AutocompleteGroupProps = CoreAutocompleteGroupProps;
export type AutocompleteGroupLabelProps = CoreAutocompleteGroupLabelProps;
export type AutocompleteItemProps = CoreAutocompleteItemProps;
export type AutocompleteItemTextProps = CoreAutocompleteItemTextProps;
export type AutocompleteItemIndicatorProps = CoreAutocompleteItemIndicatorProps;

export function Autocomplete(props: AutocompleteProps) {
  return <CoreAutocomplete.Root {...props} />;
}

export function AutocompleteInput(props: AutocompleteInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreAutocomplete.Input {...rest} class={cn("ui-autocomplete-input", local.class)} />;
}

export function AutocompleteTrigger(props: AutocompleteTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreAutocomplete.Trigger {...rest} class={cn("ui-autocomplete-trigger", local.class)} />;
}

export function AutocompleteClear(props: AutocompleteClearProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreAutocomplete.Clear {...rest} class={cn("ui-autocomplete-clear", local.class)} />;
}

export function AutocompletePortal(props: AutocompletePortalProps) {
  return <CoreAutocomplete.Portal {...props} />;
}

export function AutocompletePositioner(props: AutocompletePositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.Positioner {...rest} class={cn("ui-autocomplete-positioner", local.class)} />
  );
}

export function AutocompleteContent(props: AutocompleteContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <AutocompletePortal {...local.portal}>
      <AutocompletePositioner class={local.positionerClass}>
        <CoreAutocomplete.Content {...rest} class={cn("ui-autocomplete-content", local.class)}>
          {local.children}
        </CoreAutocomplete.Content>
      </AutocompletePositioner>
    </AutocompletePortal>
  );
}

export function AutocompleteListbox(props: AutocompleteListboxProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreAutocomplete.Listbox {...rest} class={cn("ui-autocomplete-listbox", local.class)} />;
}

export function AutocompleteGroup(props: AutocompleteGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreAutocomplete.Group {...rest} class={cn("ui-autocomplete-group", local.class)} />;
}

export function AutocompleteGroupLabel(props: AutocompleteGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.GroupLabel {...rest} class={cn("ui-autocomplete-group-label", local.class)} />
  );
}

export function AutocompleteItem(props: AutocompleteItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreAutocomplete.Item {...rest} class={cn("ui-autocomplete-item", local.class)} />;
}

export function AutocompleteItemText(props: AutocompleteItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.ItemText {...rest} class={cn("ui-autocomplete-item-text", local.class)} />
  );
}

export function AutocompleteItemIndicator(props: AutocompleteItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.ItemIndicator
      {...rest}
      class={cn("ui-autocomplete-item-indicator", local.class)}
    />
  );
}
