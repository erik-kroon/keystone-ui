import {
  Autocomplete as KeystoneAutocomplete,
  type AutocompleteClearProps as KeystoneAutocompleteClearProps,
  type AutocompleteContentProps as KeystoneAutocompleteContentProps,
  type AutocompleteGroupLabelProps as KeystoneAutocompleteGroupLabelProps,
  type AutocompleteGroupProps as KeystoneAutocompleteGroupProps,
  type AutocompleteInputProps as KeystoneAutocompleteInputProps,
  type AutocompleteItemIndicatorProps as KeystoneAutocompleteItemIndicatorProps,
  type AutocompleteItemProps as KeystoneAutocompleteItemProps,
  type AutocompleteItemTextProps as KeystoneAutocompleteItemTextProps,
  type AutocompleteListboxProps as KeystoneAutocompleteListboxProps,
  type AutocompletePortalProps as KeystoneAutocompletePortalProps,
  type AutocompletePositionerProps as KeystoneAutocompletePositionerProps,
  type AutocompleteRootProps as KeystoneAutocompleteRootProps,
  type AutocompleteTriggerProps as KeystoneAutocompleteTriggerProps,
} from "@keystone-ui/keystone/autocomplete";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type AutocompleteProps = KeystoneAutocompleteRootProps;
export type AutocompleteInputProps = KeystoneAutocompleteInputProps;
export type AutocompleteTriggerProps = KeystoneAutocompleteTriggerProps;
export type AutocompleteClearProps = KeystoneAutocompleteClearProps;
export type AutocompletePortalProps = KeystoneAutocompletePortalProps;
export type AutocompletePositionerProps = KeystoneAutocompletePositionerProps;
export type AutocompleteContentProps = KeystoneAutocompleteContentProps & {
  portal?: AutocompletePortalProps;
  positionerClass?: string;
};
export type AutocompleteListboxProps = KeystoneAutocompleteListboxProps;
export type AutocompleteGroupProps = KeystoneAutocompleteGroupProps;
export type AutocompleteGroupLabelProps = KeystoneAutocompleteGroupLabelProps;
export type AutocompleteItemProps = KeystoneAutocompleteItemProps;
export type AutocompleteItemTextProps = KeystoneAutocompleteItemTextProps;
export type AutocompleteItemIndicatorProps = KeystoneAutocompleteItemIndicatorProps;

export function Autocomplete(props: AutocompleteProps) {
  return <KeystoneAutocomplete.Root {...props} />;
}

export function AutocompleteInput(props: AutocompleteInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.Input {...rest} class={cn("mason-autocomplete-input", local.class)} />
  );
}

export function AutocompleteTrigger(props: AutocompleteTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.Trigger {...rest} class={cn("mason-autocomplete-trigger", local.class)} />
  );
}

export function AutocompleteClear(props: AutocompleteClearProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.Clear {...rest} class={cn("mason-autocomplete-clear", local.class)} />
  );
}

export function AutocompletePortal(props: AutocompletePortalProps) {
  return <KeystoneAutocomplete.Portal {...props} />;
}

export function AutocompletePositioner(props: AutocompletePositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.Positioner
      {...rest}
      class={cn("mason-autocomplete-positioner", local.class)}
    />
  );
}

export function AutocompleteContent(props: AutocompleteContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <AutocompletePortal {...local.portal}>
      <AutocompletePositioner class={local.positionerClass}>
        <KeystoneAutocomplete.Content
          {...rest}
          class={cn("mason-autocomplete-content", local.class)}
        >
          {local.children}
        </KeystoneAutocomplete.Content>
      </AutocompletePositioner>
    </AutocompletePortal>
  );
}

export function AutocompleteListbox(props: AutocompleteListboxProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.Listbox {...rest} class={cn("mason-autocomplete-listbox", local.class)} />
  );
}

export function AutocompleteGroup(props: AutocompleteGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.Group {...rest} class={cn("mason-autocomplete-group", local.class)} />
  );
}

export function AutocompleteGroupLabel(props: AutocompleteGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.GroupLabel
      {...rest}
      class={cn("mason-autocomplete-group-label", local.class)}
    />
  );
}

export function AutocompleteItem(props: AutocompleteItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneAutocomplete.Item {...rest} class={cn("mason-autocomplete-item", local.class)} />;
}

export function AutocompleteItemText(props: AutocompleteItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.ItemText
      {...rest}
      class={cn("mason-autocomplete-item-text", local.class)}
    />
  );
}

export function AutocompleteItemIndicator(props: AutocompleteItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneAutocomplete.ItemIndicator
      {...rest}
      class={cn("mason-autocomplete-item-indicator", local.class)}
    />
  );
}
