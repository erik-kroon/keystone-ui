import {
  Tabs as CoreTabs,
  type TabsContentProps as CoreTabsContentProps,
  type TabsIndicatorProps as CoreTabsIndicatorProps,
  type TabsListProps as CoreTabsListProps,
  type TabsRootProps as CoreTabsRootProps,
  type TabsTriggerProps as CoreTabsTriggerProps,
} from "@keystone-ui/core/tabs";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type TabsProps = CoreTabsRootProps;
export type TabsListProps = CoreTabsListProps;
export type TabsTriggerProps = CoreTabsTriggerProps;
export type TabsIndicatorProps = CoreTabsIndicatorProps;
export type TabsContentProps = CoreTabsContentProps;

export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.Root {...rest} class={cn("ui-tabs", local.class)} />;
}

export function TabsList(props: TabsListProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.List {...rest} class={cn("ui-tabs-list", local.class)} />;
}

export function TabsTrigger(props: TabsTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.Trigger {...rest} class={cn("ui-tabs-trigger", local.class)} />;
}

export function TabsIndicator(props: TabsIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.Indicator {...rest} class={cn("ui-tabs-indicator", local.class)} />;
}

export function TabsContent(props: TabsContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.Content {...rest} class={cn("ui-tabs-content", local.class)} />;
}
