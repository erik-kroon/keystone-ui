import { Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type AppShellProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    commandMenu?: JSX.Element;
    inspector?: JSX.Element;
    main?: JSX.Element;
    sidebar?: JSX.Element;
    sidebarState?: "collapsed" | "expanded";
    topbar?: JSX.Element;
  }
>;

export type AppShellRootProps = JSX.HTMLAttributes<HTMLDivElement> & {
  sidebarState?: "collapsed" | "expanded";
};
export type AppShellTopbarProps = JSX.HTMLAttributes<HTMLDivElement>;
export type AppShellSidebarProps = JSX.HTMLAttributes<HTMLElement>;
export type AppShellMainProps = JSX.HTMLAttributes<HTMLElement>;
export type AppShellInspectorProps = JSX.HTMLAttributes<HTMLElement>;
export type AppShellCommandSurfaceProps = JSX.HTMLAttributes<HTMLDivElement>;

const classes = (...tokens: string[]) => tokens.join(" ");

export function AppShell(props: AppShellProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "commandMenu",
    "inspector",
    "main",
    "sidebar",
    "sidebarState",
    "topbar",
  ]);

  return (
    <AppShellRoot {...rest} sidebarState={local.sidebarState}>
      <Show when={local.topbar}>
        <AppShellTopbar>{local.topbar}</AppShellTopbar>
      </Show>
      <Show when={local.sidebar}>
        <AppShellSidebar>{local.sidebar}</AppShellSidebar>
      </Show>
      <AppShellMain>{local.main ?? local.children}</AppShellMain>
      <Show when={local.inspector}>
        <AppShellInspector>{local.inspector}</AppShellInspector>
      </Show>
      <Show when={local.commandMenu}>
        <AppShellCommandSurface>{local.commandMenu}</AppShellCommandSurface>
      </Show>
    </AppShellRoot>
  );
}

export function AppShellRoot(props: AppShellRootProps) {
  const [local, rest] = splitProps(props, ["class", "sidebarState"]);
  return (
    <div
      {...rest}
      data-scope="ui-app-shell"
      data-part="root"
      data-sidebar-state={local.sidebarState}
      class={cn(
        classes(
          "ui-app-shell",
          "grid",
          "min-h-dvh",
          "min-w-0",
          "bg-background",
          "text-foreground",
          "[grid-template-areas:'topbar'_'main'_'sidebar'_'inspector']",
          "grid-rows-[auto_minmax(0,1fr)_auto_auto]",
          "lg:[grid-template-areas:'topbar_topbar_topbar'_'sidebar_main_inspector']",
          "lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)_minmax(18rem,24rem)]",
          "lg:grid-rows-[auto_minmax(0,1fr)]",
          "data-[sidebar-state=collapsed]:lg:grid-cols-[4rem_minmax(0,1fr)_minmax(18rem,24rem)]",
        ),
        local.class,
      )}
    />
  );
}

export function AppShellTopbar(props: AppShellTopbarProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-app-shell"
      data-part="topbar"
      class={cn("ui-app-shell-topbar min-w-0 [grid-area:topbar]", local.class)}
    />
  );
}

export function AppShellSidebar(props: AppShellSidebarProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <aside
      {...rest}
      data-scope="ui-app-shell"
      data-part="sidebar"
      class={cn(
        classes(
          "ui-app-shell-sidebar",
          "min-w-0",
          "border-t",
          "bg-muted/24",
          "p-2",
          "[grid-area:sidebar]",
          "lg:min-h-0",
          "lg:overflow-auto",
          "lg:border-t-0",
          "lg:border-e",
        ),
        local.class,
      )}
    />
  );
}

export function AppShellMain(props: AppShellMainProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <main
      {...rest}
      data-scope="ui-app-shell"
      data-part="main"
      class={cn("ui-app-shell-main min-h-0 min-w-0 overflow-auto [grid-area:main]", local.class)}
    />
  );
}

export function AppShellInspector(props: AppShellInspectorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <aside
      {...rest}
      data-scope="ui-app-shell"
      data-part="inspector"
      class={cn(
        classes(
          "ui-app-shell-inspector",
          "min-w-0",
          "border-t",
          "bg-muted/16",
          "p-3",
          "[grid-area:inspector]",
          "lg:min-h-0",
          "lg:overflow-auto",
          "lg:border-s",
          "lg:border-t-0",
        ),
        local.class,
      )}
    />
  );
}

export function AppShellCommandSurface(props: AppShellCommandSurfaceProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-app-shell"
      data-part="command-surface"
      class={cn("ui-app-shell-command-surface contents", local.class)}
    />
  );
}
