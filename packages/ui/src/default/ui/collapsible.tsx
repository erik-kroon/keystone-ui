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

  return <CoreCollapsible.Root {...rest} class={cn("ui-collapsible", local.class)} />;
}

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCollapsible.Trigger {...rest} class={cn("ui-collapsible-trigger", local.class)} />;
}

export function CollapsibleContent(props: CollapsibleContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCollapsible.Content {...rest} class={cn("ui-collapsible-content", local.class)} />;
}
