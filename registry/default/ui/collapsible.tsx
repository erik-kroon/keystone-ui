import {
  Collapsible as KeystoneCollapsible,
  type CollapsibleContentProps as KeystoneCollapsibleContentProps,
  type CollapsibleRootProps as KeystoneCollapsibleRootProps,
  type CollapsibleTriggerProps as KeystoneCollapsibleTriggerProps,
} from "@keystone-ui/keystone/collapsible";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type CollapsibleProps = KeystoneCollapsibleRootProps;
export type CollapsibleTriggerProps = KeystoneCollapsibleTriggerProps;
export type CollapsibleContentProps = KeystoneCollapsibleContentProps;

export function Collapsible(props: CollapsibleProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneCollapsible.Root {...rest} class={cn("mason-collapsible", local.class)} />;
}

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneCollapsible.Trigger {...rest} class={cn("mason-collapsible-trigger", local.class)} />
  );
}

export function CollapsibleContent(props: CollapsibleContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneCollapsible.Content {...rest} class={cn("mason-collapsible-content", local.class)} />
  );
}
