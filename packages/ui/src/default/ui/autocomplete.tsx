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
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export type AutocompleteProps = CoreAutocompleteRootProps;
export type AutocompleteSize = "sm" | "default" | "lg" | number;
export type AutocompleteInputProps = Omit<CoreAutocompleteInputProps, "size"> & {
  clearProps?: AutocompleteClearProps;
  inputClass?: string;
  showClear?: boolean;
  showTrigger?: boolean;
  size?: AutocompleteSize;
  startAddon?: JSX.Element;
  triggerProps?: AutocompleteTriggerProps;
};
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
export type AutocompleteSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;
export type AutocompleteEmptyProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

const classes = (...tokens: string[]) => tokens.join(" ");

function TriggerIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function actionButtonClass(size: AutocompleteSize) {
  return classes(
    "absolute",
    "top-1/2",
    "inline-flex",
    "size-8",
    "shrink-0",
    "-translate-y-1/2",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "rounded-md",
    "border",
    "border-transparent",
    "opacity-80",
    "outline-none",
    "transition-colors",
    "pointer-coarse:after:absolute",
    "pointer-coarse:after:min-h-11",
    "pointer-coarse:after:min-w-11",
    "hover:opacity-100",
    "has-[+[data-slot=autocomplete-clear]]:hidden",
    "sm:size-7",
    "[&_svg:not([class*='size-'])]:size-4.5",
    "sm:[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    size === "sm" ? "end-0" : "end-0.5",
  );
}

export function Autocomplete(props: AutocompleteProps) {
  return <CoreAutocomplete.Root {...props} />;
}

export function AutocompleteInput(props: AutocompleteInputProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "clearProps",
    "inputClass",
    "showClear",
    "showTrigger",
    "size",
    "startAddon",
    "triggerProps",
  ]);
  const size = () => local.size ?? "default";

  return (
    <span
      data-scope="ui-autocomplete"
      data-part="input-group"
      data-slot="autocomplete-input-group"
      class={cn(
        "ui-autocomplete-input-group relative w-full not-has-[>*.w-full]:w-fit text-foreground has-disabled:opacity-64",
        local.class,
      )}
    >
      {local.startAddon && (
        <span
          aria-hidden="true"
          data-scope="ui-autocomplete"
          data-part="start-addon"
          data-slot="autocomplete-start-addon"
          class="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5"
        >
          {local.startAddon}
        </span>
      )}
      <CoreAutocomplete.Input
        {...rest}
        data-size={typeof size() === "string" ? size() : undefined}
        data-slot="autocomplete-input"
        class={cn(
          Boolean(local.startAddon) &&
            "data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=autocomplete-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8)-1px)]",
          (local.showTrigger || local.showClear) &&
            (size() === "sm"
              ? "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=input]:pe-6.5"
              : "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=input]:pe-7"),
          local.inputClass,
        )}
        as={(inputProps: JSX.InputHTMLAttributes<HTMLInputElement>) => (
          <Input {...inputProps} nativeInput size={size()} />
        )}
      />
      {local.showTrigger && (
        <AutocompleteTrigger class={actionButtonClass(size())} {...local.triggerProps}>
          <span data-scope="ui-autocomplete" data-part="icon" data-slot="autocomplete-icon">
            <TriggerIcon />
          </span>
        </AutocompleteTrigger>
      )}
      {local.showClear && (
        <AutocompleteClear class={actionButtonClass(size())} {...local.clearProps}>
          <ClearIcon />
        </AutocompleteClear>
      )}
    </span>
  );
}

export function AutocompleteTrigger(props: AutocompleteTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.Trigger
      {...rest}
      data-slot="autocomplete-trigger"
      class={cn("ui-autocomplete-trigger", local.class)}
    />
  );
}

export function AutocompleteClear(props: AutocompleteClearProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.Clear
      {...rest}
      data-slot="autocomplete-clear"
      class={cn("ui-autocomplete-clear", local.class)}
    />
  );
}

export function AutocompletePortal(props: AutocompletePortalProps) {
  return <CoreAutocomplete.Portal {...props} />;
}

export function AutocompletePositioner(props: AutocompletePositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.Positioner
      {...rest}
      data-slot="autocomplete-positioner"
      class={cn("ui-autocomplete-positioner z-50 select-none", local.class)}
    />
  );
}

export function AutocompleteContent(props: AutocompleteContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <AutocompletePortal {...local.portal}>
      <AutocompletePositioner class={local.positionerClass}>
        <span
          data-scope="ui-autocomplete"
          data-part="surface"
          class={cn(
            "ui-autocomplete-surface relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            local.class,
          )}
        >
          <CoreAutocomplete.Content
            {...rest}
            data-slot="autocomplete-popup"
            class="ui-autocomplete-content flex max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground"
          >
            {local.children}
          </CoreAutocomplete.Content>
        </span>
      </AutocompletePositioner>
    </AutocompletePortal>
  );
}

export function AutocompleteListbox(props: AutocompleteListboxProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.Listbox
      {...rest}
      data-slot="autocomplete-list"
      class={cn(
        "ui-autocomplete-listbox not-empty:scroll-py-1 not-empty:px-1 not-empty:py-1 overflow-y-auto in-data-has-overflow-y:pe-3",
        local.class,
      )}
    />
  );
}

export function AutocompleteGroup(props: AutocompleteGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.Group
      {...rest}
      data-slot="autocomplete-group"
      class={cn("ui-autocomplete-group [[role=group]+&]:mt-1.5", local.class)}
    />
  );
}

export function AutocompleteGroupLabel(props: AutocompleteGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.GroupLabel
      {...rest}
      data-slot="autocomplete-group-label"
      class={cn(
        "ui-autocomplete-group-label px-2 py-1.5 font-medium text-muted-foreground text-xs",
        local.class,
      )}
    />
  );
}

export function AutocompleteItem(props: AutocompleteItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.Item
      {...rest}
      data-slot="autocomplete-item"
      class={cn(
        "ui-autocomplete-item flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm",
        local.class,
      )}
    />
  );
}

export function AutocompleteItemText(props: AutocompleteItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.ItemText
      {...rest}
      data-slot="autocomplete-item-text"
      class={cn("ui-autocomplete-item-text", local.class)}
    />
  );
}

export function AutocompleteItemIndicator(props: AutocompleteItemIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreAutocomplete.ItemIndicator
      {...rest}
      data-slot="autocomplete-item-indicator"
      class={cn("ui-autocomplete-item-indicator", local.class)}
    />
  );
}

export function AutocompleteSeparator(props: AutocompleteSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      role="separator"
      data-scope="ui-autocomplete"
      data-part="separator"
      data-slot="autocomplete-separator"
      class={cn("ui-autocomplete-separator mx-2 my-1 h-px bg-border last:hidden", local.class)}
    />
  );
}

export function AutocompleteEmpty(props: AutocompleteEmptyProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-autocomplete"
      data-part="empty"
      data-slot="autocomplete-empty"
      class={cn(
        "ui-autocomplete-empty not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm",
        local.class,
      )}
    />
  );
}
