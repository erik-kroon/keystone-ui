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
export type TabsVariant = "default" | "underline";
export type TabsListProps = CoreTabsListProps & {
  variant?: TabsVariant;
};
export type TabsTriggerProps = CoreTabsTriggerProps;
export type TabsIndicatorProps = CoreTabsIndicatorProps;
export type TabsContentProps = CoreTabsContentProps;

const classes = (...tokens: string[]) => tokens.join(" ");

const tabsRootClass = classes("flex", "flex-col", "gap-2", "data-[orientation=vertical]:flex-row");

const tabsListClass = (variant: TabsVariant) =>
  classes(
    "relative",
    "z-0",
    "flex",
    "w-fit",
    "items-center",
    "justify-center",
    "gap-x-0.5",
    "text-muted-foreground",
    "data-[orientation=vertical]:flex-col",
    variant === "default"
      ? "rounded-lg bg-muted p-0.5 text-muted-foreground/72"
      : "data-[orientation=vertical]:px-1 data-[orientation=horizontal]:py-1 *:data-[slot=tabs-trigger]:hover:bg-accent",
  );

const tabsTriggerClass = classes(
  "relative",
  "flex",
  "h-9",
  "shrink-0",
  "grow",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "gap-1.5",
  "whitespace-nowrap",
  "rounded-md",
  "border",
  "border-transparent",
  "px-[calc(--spacing(2.5)-1px)]",
  "font-medium",
  "text-base",
  "outline-none",
  "transition-[color,background-color,box-shadow]",
  "hover:text-muted-foreground",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "data-disabled:pointer-events-none",
  "data-[orientation=vertical]:w-full",
  "data-[orientation=vertical]:justify-start",
  "data-selected:text-foreground",
  "data-disabled:opacity-64",
  "sm:h-8",
  "sm:text-sm",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "sm:[&_svg:not([class*='size-'])]:size-4",
  "[&_svg]:pointer-events-none",
  "[&_svg]:-mx-0.5",
  "[&_svg]:shrink-0",
  "data-selected:text-foreground",
);

const tabsIndicatorClass = (variant: TabsVariant = "default") =>
  classes(
    "absolute",
    "bottom-0",
    "left-0",
    "h-[var(--keystone-tabs-indicator-height,0px)]",
    "w-[var(--keystone-tabs-indicator-width,0px)]",
    "[transform:translate3d(var(--keystone-tabs-indicator-x,0px),var(--keystone-tabs-indicator-y,0px),0)]",
    "transition-[width,transform]",
    "duration-200",
    "ease-in-out",
    variant === "underline"
      ? "z-10 bg-primary data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px data-[orientation=horizontal]:translate-y-px"
      : "-z-1 rounded-md bg-background shadow-sm/5 dark:bg-input",
  );

const tabsContentClass = classes("flex-1", "outline-none");

export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreTabs.Root {...rest} class={cn("ui-tabs", tabsRootClass, local.class)} />;
}

export function TabsList(props: TabsListProps) {
  const [local, rest] = splitProps(props, ["children", "class", "variant"]);
  const variant = () => local.variant ?? "default";

  return (
    <CoreTabs.List
      {...rest}
      data-slot="tabs-list"
      class={cn("ui-tabs-list", tabsListClass(variant()), local.class)}
    >
      {local.children}
      <TabsIndicator variant={variant()} />
    </CoreTabs.List>
  );
}

export function TabsTrigger(props: TabsTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreTabs.Trigger
      {...rest}
      data-slot="tabs-trigger"
      class={cn("ui-tabs-trigger", tabsTriggerClass, local.class)}
    />
  );
}

export function TabsIndicator(props: TabsIndicatorProps & { variant?: TabsVariant }) {
  const [local, rest] = splitProps(props, ["class", "variant"]);

  return (
    <CoreTabs.Indicator
      {...rest}
      data-slot="tabs-indicator"
      class={cn("ui-tabs-indicator", tabsIndicatorClass(local.variant), local.class)}
    />
  );
}

export function TabsContent(props: TabsContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreTabs.Content
      {...rest}
      data-slot="tabs-content"
      class={cn("ui-tabs-content", tabsContentClass, local.class)}
    />
  );
}
