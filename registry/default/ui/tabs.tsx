import {
  Tabs as KeystoneTabs,
  type TabsContentProps as KeystoneTabsContentProps,
  type TabsIndicatorProps as KeystoneTabsIndicatorProps,
  type TabsListProps as KeystoneTabsListProps,
  type TabsRootProps as KeystoneTabsRootProps,
  type TabsTriggerProps as KeystoneTabsTriggerProps,
} from "@keystone-ui/keystone/tabs";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type TabsProps = KeystoneTabsRootProps;
export type TabsListProps = KeystoneTabsListProps;
export type TabsTriggerProps = KeystoneTabsTriggerProps;
export type TabsIndicatorProps = KeystoneTabsIndicatorProps;
export type TabsContentProps = KeystoneTabsContentProps;

export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneTabs.Root {...rest} class={cn("mason-tabs", local.class)} />;
}

export function TabsList(props: TabsListProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneTabs.List {...rest} class={cn("mason-tabs-list", local.class)} />;
}

export function TabsTrigger(props: TabsTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneTabs.Trigger {...rest} class={cn("mason-tabs-trigger", local.class)} />;
}

export function TabsIndicator(props: TabsIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneTabs.Indicator {...rest} class={cn("mason-tabs-indicator", local.class)} />;
}

export function TabsContent(props: TabsContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneTabs.Content {...rest} class={cn("mason-tabs-content", local.class)} />;
}
