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

const classes = (...tokens: string[]) => tokens.join(" ");

const tabsRootClass = classes("flex", "w-full", "flex-col", "gap-3");

const tabsListClass = classes(
  "relative",
  "inline-flex",
  "w-fit",
  "items-center",
  "gap-1",
  "rounded-lg",
  "border",
  "border-input",
  "bg-muted",
  "p-1",
  "text-muted-foreground",
  "data-[orientation=vertical]:flex-col",
  "data-[orientation=vertical]:items-stretch",
);

const tabsTriggerClass = classes(
  "relative",
  "z-10",
  "inline-flex",
  "min-h-8",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "rounded-md",
  "px-3",
  "py-1.5",
  "text-sm",
  "font-medium",
  "outline-none",
  "transition-colors",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-1",
  "focus-visible:ring-offset-background",
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "data-selected:text-foreground",
  "data-selected:shadow-xs",
);

const tabsIndicatorClass = classes(
  "pointer-events-none",
  "absolute",
  "left-0",
  "top-0",
  "z-0",
  "rounded-md",
  "bg-background",
  "shadow-xs",
  "transition-[height,transform,width]",
  "duration-200",
  "ease-out",
  "[height:var(--keystone-tabs-indicator-height,0px)]",
  "[transform:translate3d(var(--keystone-tabs-indicator-x,0px),var(--keystone-tabs-indicator-y,0px),0)]",
  "[width:var(--keystone-tabs-indicator-width,0px)]",
);

const tabsContentClass = classes(
  "outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
);

export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.Root {...rest} class={cn("ui-tabs", tabsRootClass, local.class)} />;
}

export function TabsList(props: TabsListProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.List {...rest} class={cn("ui-tabs-list", tabsListClass, local.class)} />;
}

export function TabsTrigger(props: TabsTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreTabs.Trigger {...rest} class={cn("ui-tabs-trigger", tabsTriggerClass, local.class)} />
  );
}

export function TabsIndicator(props: TabsIndicatorProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreTabs.Indicator
      {...rest}
      class={cn("ui-tabs-indicator", tabsIndicatorClass, local.class)}
    />
  );
}

export function TabsContent(props: TabsContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreTabs.Content {...rest} class={cn("ui-tabs-content", tabsContentClass, local.class)} />
  );
}
