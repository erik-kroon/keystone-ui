import {
  Collapsible as CoreCollapsible,
  type CollapsibleContentProps as CoreCollapsibleContentProps,
  type CollapsibleRootProps as CoreCollapsibleRootProps,
  type CollapsibleTriggerProps as CoreCollapsibleTriggerProps,
} from "@keystone-ui/core/collapsible";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type CollapsibleProps = CoreCollapsibleRootProps;
export type CollapsibleTriggerProps = CoreCollapsibleTriggerProps;
export type CollapsibleContentProps = CoreCollapsibleContentProps;

export function Collapsible(props: CollapsibleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCollapsible.Root
      {...rest}
      data-slot="collapsible"
      class={cn("ui-collapsible", local.class)}
    />
  );
}

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCollapsible.Trigger
      {...rest}
      data-slot="collapsible-trigger"
      class={cn("ui-collapsible-trigger", local.class)}
    />
  );
}

export function CollapsibleContent(props: CollapsibleContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCollapsible.Content
      {...rest}
      data-slot="collapsible-content"
      class={cn(
        "ui-collapsible-content overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0",
        local.class,
      )}
    />
  );
}
