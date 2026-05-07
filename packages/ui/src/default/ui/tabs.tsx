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
      ? "rounded-lg bg-transparent p-0 text-muted-foreground/72"
      : "data-[orientation=vertical]:px-1 data-[orientation=horizontal]:py-1 *:data-[slot=tabs-tab]:hover:bg-accent",
  );

const tabsTriggerClass = classes(
  "relative",
  "flex",
  "z-10",
  "h-9",
  "shrink-0",
  "grow",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "gap-1.5",
  "whitespace-nowrap",
  "rounded-lg",
  "border-0",
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
  "data-selected:[anchor-name:--keystone-tabs-active]",
  "data-active:text-foreground",
  "data-selected:text-foreground",
  "data-disabled:opacity-64",
  "sm:h-8",
  "sm:text-sm",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "sm:[&_svg:not([class*='size-'])]:size-4",
  "[&_svg]:pointer-events-none",
  "[&_svg]:-mx-0.5",
  "[&_svg]:shrink-0",
);

const tabsIndicatorClass = (variant: TabsVariant = "default") =>
  classes(
    "absolute",
    "bottom-0",
    "left-0",
    "pointer-events-none",
    "z-0",
    "h-(--active-tab-height)",
    "w-(--active-tab-width)",
    "translate-x-(--active-tab-left)",
    "-translate-y-(--active-tab-bottom)",
    "transition-[width,translate]",
    "duration-200",
    "ease-in-out",
    variant === "underline"
      ? "z-10 bg-primary data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px data-[orientation=horizontal]:translate-y-px"
      : "rounded-lg bg-accent shadow-none supports-[anchor-name:--keystone-tabs-active]:data-[state=idle]:[bottom:auto] supports-[anchor-name:--keystone-tabs-active]:data-[state=idle]:[height:anchor-size(--keystone-tabs-active_height)] supports-[anchor-name:--keystone-tabs-active]:data-[state=idle]:[left:anchor(--keystone-tabs-active_left)] supports-[anchor-name:--keystone-tabs-active]:data-[state=idle]:[top:anchor(--keystone-tabs-active_top)] supports-[anchor-name:--keystone-tabs-active]:data-[state=idle]:[translate:0_0] supports-[anchor-name:--keystone-tabs-active]:data-[state=idle]:[width:anchor-size(--keystone-tabs-active_width)]",
  );

const tabsContentClass = classes("flex-1", "outline-none");

export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreTabs.Root {...rest} data-slot="tabs" class={cn("ui-tabs", tabsRootClass, local.class)} />
  );
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
      data-slot="tabs-tab"
      class={cn("ui-tabs-trigger ui-tabs-tab", tabsTriggerClass, local.class)}
    />
  );
}

export function TabsIndicator(props: TabsIndicatorProps & { variant?: TabsVariant }) {
  const [local, rest] = splitProps(props, ["class", "variant"]);

  return (
    <CoreTabs.Indicator
      {...rest}
      data-slot="tab-indicator"
      class={cn(
        "ui-tabs-indicator ui-tab-indicator",
        tabsIndicatorClass(local.variant),
        local.class,
      )}
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
