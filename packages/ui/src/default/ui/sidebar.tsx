import {
  createMemo,
  For,
  Show,
  splitProps,
  type ComponentProps,
  type JSX,
  type ParentProps,
} from "solid-js";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Separator, type SeparatorProps } from "@/components/ui/separator";
import {
  SidebarProvider as SidebarStoreProvider,
  useSidebarStore,
  type SidebarProviderProps as SidebarStoreProviderProps,
} from "@/stores/sidebar-store";
import { cn } from "@/lib/cn";

export type SidebarItem = {
  badge?: JSX.Element;
  description?: JSX.Element;
  disabled?: boolean;
  href: string;
  icon?: JSX.Element;
  id: string;
  label: JSX.Element;
};

export type SidebarProviderProps = SidebarStoreProviderProps;
export type SidebarLayoutProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    collapsedWidth?: string;
    mobileWidth?: string;
    width?: string;
  }
>;
export type SidebarProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> & {
    collapsible?: "icon" | "offcanvas" | "none";
    side?: "left" | "right";
    variant?: "floating" | "inset" | "sidebar";
  }
>;
export type SidebarMobileProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SidebarHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SidebarContentProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SidebarFooterProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SidebarGroupProps = ParentProps<JSX.HTMLAttributes<HTMLElement>>;
export type SidebarGroupLabelProps = ParentProps<JSX.HTMLAttributes<HTMLHeadingElement>>;
export type SidebarGroupActionProps = ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;
export type SidebarGroupContentProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SidebarNavProps = ParentProps<JSX.HTMLAttributes<HTMLElement>>;
export type SidebarMenuProps = ParentProps<JSX.HTMLAttributes<HTMLUListElement>>;
export type SidebarMenuItemProps = ParentProps<JSX.LiHTMLAttributes<HTMLLIElement>>;
export type SidebarMenuLinkProps = ParentProps<
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean;
    itemId?: string;
  }
>;
export type SidebarMenuButtonProps = ButtonProps & {
  active?: boolean;
  itemId?: string;
  menuSize?: "default" | "lg" | "sm";
  menuVariant?: "default" | "outline";
  tooltip?: JSX.Element;
};
export type SidebarMenuActionProps = ParentProps<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    showOnHover?: boolean;
  }
>;
export type SidebarMenuBadgeProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type SidebarMenuSkeletonProps = JSX.HTMLAttributes<HTMLDivElement> & {
  showIcon?: boolean;
  width?: string;
};
export type SidebarMenuSubProps = ParentProps<JSX.HTMLAttributes<HTMLUListElement>>;
export type SidebarMenuSubItemProps = ParentProps<JSX.LiHTMLAttributes<HTMLLIElement>>;
export type SidebarMenuSubButtonProps = ParentProps<
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean;
    size?: "md" | "sm";
  }
>;
export type SidebarTriggerProps = Omit<ButtonProps, "aria-controls" | "aria-expanded"> & {
  controls?: string;
};
export type SidebarRailProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  side?: "left" | "right";
};
export type SidebarInsetProps = ParentProps<JSX.HTMLAttributes<HTMLElement>>;
export type SidebarInputProps = InputProps;
export type SidebarSeparatorProps = SeparatorProps;
export type SidebarItemsProps = {
  ariaLabel?: string;
  items: SidebarItem[];
  class?: string;
};

function stateAttributes() {
  const store = useSidebarStore();

  return {
    "data-mobile": store.isMobile() ? "" : undefined,
    "data-open-mobile": store.openMobile() ? "" : undefined,
    "data-state": store.state(),
  };
}

function callUserFirst<T extends Event>(
  event: T,
  handler: JSX.EventHandlerUnion<HTMLElement, T> | undefined,
) {
  if (typeof handler === "function") {
    handler(event as T & { currentTarget: HTMLElement; target: Element });
  }
}

export function SidebarProvider(props: SidebarProviderProps) {
  return <SidebarStoreProvider {...props} />;
}

export function useSidebar() {
  return useSidebarStore();
}

export function SidebarLayout(props: SidebarLayoutProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "collapsedWidth",
    "mobileWidth",
    "style",
    "width",
  ]);
  const style = () =>
    ({
      "--sidebar-width": local.width ?? "16rem",
      "--sidebar-width-icon": local.collapsedWidth ?? "3rem",
      "--sidebar-width-mobile": local.mobileWidth ?? "18rem",
      ...((typeof local.style === "object" ? local.style : {}) as JSX.CSSProperties),
    }) as JSX.CSSProperties;

  return (
    <div
      {...rest}
      {...stateAttributes()}
      class={cn(
        "ui-sidebar-layout flex min-h-svh w-full bg-background text-foreground",
        local.class,
      )}
      data-scope="ui-sidebar"
      data-part="layout"
      style={style()}
    >
      {local.children}
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const [local, rest] = splitProps(props, ["children", "class", "collapsible", "side", "variant"]);
  const collapsible = () => local.collapsible ?? "icon";
  const variant = () => local.variant ?? "sidebar";

  return (
    <aside
      aria-label={rest["aria-label"] ?? "Sidebar"}
      {...rest}
      {...stateAttributes()}
      class={cn(
        "ui-sidebar group/sidebar relative hidden min-h-svh w-(--sidebar-width) shrink-0 flex-col border-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200 ease-linear lg:flex",
        "data-[state=collapsed]:w-(--sidebar-width-icon)",
        variant() === "floating" && "m-2 min-h-[calc(100svh-1rem)] rounded-lg border shadow-sm",
        variant() === "inset" && "m-2 min-h-[calc(100svh-1rem)] rounded-xl border shadow-sm",
        local.side === "right" ? "order-last border-l" : "border-r",
        collapsible() === "offcanvas" &&
          "data-[state=collapsed]:-translate-x-full data-[state=collapsed]:w-(--sidebar-width)",
        collapsible() === "none" && "w-(--sidebar-width)",
        local.class,
      )}
      data-collapsible={collapsible()}
      data-part="root"
      data-side={local.side ?? "left"}
      data-variant={variant()}
      data-scope="ui-sidebar"
    >
      {local.children}
    </aside>
  );
}

export function SidebarMobile(props: SidebarMobileProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);
  const store = useSidebarStore();

  return (
    <Show when={store.openMobile()}>
      <div
        {...rest}
        aria-modal="true"
        class={cn(
          "ui-sidebar-mobile fixed inset-0 z-50 w-(--sidebar-width-mobile) bg-sidebar text-sidebar-foreground lg:hidden",
          local.class,
        )}
        data-open-mobile=""
        data-part="mobile"
        data-scope="ui-sidebar"
        data-state="expanded"
        role="dialog"
      >
        {local.children}
      </div>
    </Show>
  );
}

export function SidebarHeader(props: SidebarHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      class={cn("ui-sidebar-header flex flex-col gap-2 p-2", local.class)}
      data-part="header"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarContent(props: SidebarContentProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      class={cn(
        "ui-sidebar-content flex min-h-0 flex-1 flex-col gap-0 overflow-auto data-[state=collapsed]:overflow-hidden",
        local.class,
      )}
      data-part="content"
      data-scope="ui-sidebar"
      {...stateAttributes()}
    />
  );
}

export function SidebarFooter(props: SidebarFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      class={cn("ui-sidebar-footer flex flex-col gap-2 p-2", local.class)}
      data-part="footer"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarGroup(props: SidebarGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <section
      {...rest}
      class={cn("ui-sidebar-group relative flex w-full min-w-0 flex-col p-2", local.class)}
      data-part="group"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarGroupLabel(props: SidebarGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <h2
      {...rest}
      class={cn(
        "ui-sidebar-group-label flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=collapsed]:-mt-8 data-[state=collapsed]:opacity-0",
        local.class,
      )}
      data-part="group-label"
      data-scope="ui-sidebar"
      {...stateAttributes()}
    />
  );
}

export function SidebarGroupAction(props: SidebarGroupActionProps) {
  const [local, rest] = splitProps(props, ["class", "type"]);
  return (
    <button
      {...rest}
      class={cn(
        "ui-sidebar-group-action absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none transition-transform after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=collapsed]:hidden md:after:hidden",
        local.class,
      )}
      data-part="group-action"
      data-scope="ui-sidebar"
      {...stateAttributes()}
      type={local.type ?? "button"}
    />
  );
}

export function SidebarGroupContent(props: SidebarGroupContentProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      class={cn("ui-sidebar-group-content w-full text-sm", local.class)}
      data-part="group-content"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarNav(props: SidebarNavProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <nav
      aria-label={rest["aria-label"] ?? "Sidebar navigation"}
      {...rest}
      class={cn("ui-sidebar-nav", local.class)}
      data-part="nav"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarMenu(props: SidebarMenuProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ul
      {...rest}
      class={cn("ui-sidebar-menu flex w-full min-w-0 flex-col gap-0", local.class)}
      data-part="menu"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarMenuItem(props: SidebarMenuItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <li
      {...rest}
      class={cn("ui-sidebar-menu-item group/menu-item relative", local.class)}
      data-part="menu-item"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarMenuLink(props: SidebarMenuLinkProps) {
  const [local, rest] = splitProps(props, ["active", "children", "class", "itemId", "onClick"]);
  const store = useSidebarStore();
  const isActive = () => local.active ?? store.activeItemId() === local.itemId;

  function handleClick(event: MouseEvent) {
    callUserFirst(event, local.onClick as JSX.EventHandlerUnion<HTMLElement, MouseEvent>);
    if (event.defaultPrevented) return;
    if (local.itemId) {
      store.setActiveItemId(local.itemId);
    }
    if (store.isMobile()) {
      store.setOpenMobile(false, { reason: "trigger" });
    }
  }

  return (
    <a
      {...rest}
      aria-current={isActive() ? "page" : undefined}
      class={cn(
        "ui-sidebar-menu-link flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "data-[active]:bg-sidebar-accent data-[active]:font-medium data-[active]:text-sidebar-accent-foreground",
        "data-[state=collapsed]:size-8 data-[state=collapsed]:justify-center data-[state=collapsed]:p-2",
        local.class,
      )}
      data-active={isActive() ? "" : undefined}
      data-part="menu-link"
      data-scope="ui-sidebar"
      {...stateAttributes()}
      onClick={handleClick}
    >
      {local.children}
    </a>
  );
}

export function SidebarMenuButton(props: SidebarMenuButtonProps) {
  const [local, rest] = splitProps(props, [
    "active",
    "children",
    "class",
    "itemId",
    "menuSize",
    "menuVariant",
    "onClick",
    "tooltip",
  ]);
  const store = useSidebarStore();
  const isActive = () => local.active ?? store.activeItemId() === local.itemId;
  const menuSize = () => local.menuSize ?? "default";
  const showTooltip = () =>
    Boolean(local.tooltip && store.state() === "collapsed" && !store.isMobile());

  function handleClick(event: MouseEvent) {
    callUserFirst(event, local.onClick as JSX.EventHandlerUnion<HTMLElement, MouseEvent>);
    if (event.defaultPrevented) return;
    if (local.itemId) {
      store.setActiveItemId(local.itemId);
    }
  }

  const button = (
    <Button
      {...rest}
      class={cn(
        "ui-sidebar-menu-button peer/menu-button w-full justify-start overflow-hidden rounded-md p-2 text-left outline-none transition-[width,height,padding] data-[state=collapsed]:size-8 data-[state=collapsed]:justify-center data-[state=collapsed]:p-2",
        menuSize() === "sm" && "h-7 text-xs",
        menuSize() === "default" && "h-8 text-sm",
        menuSize() === "lg" && "h-12 text-sm data-[state=collapsed]:p-0",
        local.menuVariant === "outline" &&
          "border border-sidebar-border bg-background shadow-xs hover:border-sidebar-accent",
        local.class,
      )}
      data-active={isActive() ? "" : undefined}
      data-part="menu-button"
      data-scope="ui-sidebar"
      data-size={menuSize()}
      {...stateAttributes()}
      onClick={handleClick}
      pressed={isActive()}
      variant={rest.variant ?? "ghost"}
    >
      {local.children}
    </Button>
  );

  return (
    <>
      {button}
      <Show when={showTooltip()}>
        <span
          class="ui-sidebar-menu-tooltip pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm"
          data-part="menu-tooltip"
          data-scope="ui-sidebar"
          role="tooltip"
        >
          {local.tooltip}
        </span>
      </Show>
    </>
  );
}

export function SidebarMenuAction(props: SidebarMenuActionProps) {
  const [local, rest] = splitProps(props, ["class", "showOnHover", "type"]);
  return (
    <button
      {...rest}
      class={cn(
        "ui-sidebar-menu-action absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none transition-[opacity,transform] after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=collapsed]:hidden md:after:hidden",
        local.showOnHover &&
          "opacity-100 md:opacity-0 md:group-focus-within/menu-item:opacity-100 md:group-hover/menu-item:opacity-100",
        local.class,
      )}
      data-part="menu-action"
      data-scope="ui-sidebar"
      {...stateAttributes()}
      type={local.type ?? "button"}
    />
  );
}

export function SidebarMenuBadge(props: SidebarMenuBadgeProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      class={cn(
        "ui-sidebar-menu-badge pointer-events-none absolute right-1 top-1.5 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground/70 data-[state=collapsed]:hidden",
        local.class,
      )}
      data-part="menu-badge"
      data-scope="ui-sidebar"
      {...stateAttributes()}
    />
  );
}

export function SidebarMenuSkeleton(props: SidebarMenuSkeletonProps) {
  const [local, rest] = splitProps(props, ["class", "showIcon", "style", "width"]);
  const style = createMemo(
    () =>
      ({
        "--sidebar-skeleton-width": local.width ?? "72%",
        ...((typeof local.style === "object" ? local.style : {}) as JSX.CSSProperties),
      }) as JSX.CSSProperties,
  );

  return (
    <div
      {...rest}
      class={cn(
        "ui-sidebar-menu-skeleton flex h-8 items-center gap-2 rounded-md px-2",
        local.class,
      )}
      data-part="menu-skeleton"
      data-scope="ui-sidebar"
      style={style()}
    >
      <Show when={local.showIcon}>
        <span
          class="size-4 shrink-0 rounded-md bg-sidebar-accent"
          data-part="menu-skeleton-icon"
          data-scope="ui-sidebar"
        />
      </Show>
      <span
        class="h-4 max-w-(--sidebar-skeleton-width) flex-1 rounded-md bg-sidebar-accent"
        data-part="menu-skeleton-text"
        data-scope="ui-sidebar"
      />
    </div>
  );
}

export function SidebarMenuSub(props: SidebarMenuSubProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <ul
      {...rest}
      class={cn(
        "ui-sidebar-menu-sub mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 data-[state=collapsed]:hidden",
        local.class,
      )}
      data-part="menu-sub"
      data-scope="ui-sidebar"
      {...stateAttributes()}
    />
  );
}

export function SidebarMenuSubItem(props: SidebarMenuSubItemProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <li
      {...rest}
      class={cn("ui-sidebar-menu-sub-item group/menu-sub-item relative", local.class)}
      data-part="menu-sub-item"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarMenuSubButton(props: SidebarMenuSubButtonProps) {
  const [local, rest] = splitProps(props, ["active", "class", "size"]);
  return (
    <a
      {...rest}
      aria-current={local.active ? "page" : undefined}
      class={cn(
        "ui-sidebar-menu-sub-button flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[active]:bg-sidebar-accent data-[active]:text-sidebar-accent-foreground data-[state=collapsed]:hidden",
        (local.size ?? "md") === "md" ? "text-sm" : "text-xs",
        local.class,
      )}
      data-active={local.active ? "" : undefined}
      data-part="menu-sub-button"
      data-scope="ui-sidebar"
      data-size={local.size ?? "md"}
      {...stateAttributes()}
    />
  );
}

export function SidebarTrigger(props: SidebarTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "controls", "onClick"]);
  const store = useSidebarStore();

  function handleClick(event: MouseEvent) {
    callUserFirst(event, local.onClick as JSX.EventHandlerUnion<HTMLElement, MouseEvent>);
    if (event.defaultPrevented) return;
    store.toggle({ reason: "trigger" });
  }

  return (
    <Button
      aria-controls={local.controls}
      aria-expanded={store.isMobile() ? store.openMobile() : store.open()}
      aria-label={rest["aria-label"] ?? "Toggle sidebar"}
      {...rest}
      class={cn("ui-sidebar-trigger", local.class)}
      data-part="trigger"
      data-scope="ui-sidebar"
      {...stateAttributes()}
      onClick={handleClick}
      type={rest.type ?? "button"}
      variant={rest.variant ?? "ghost"}
    >
      {local.children}
    </Button>
  );
}

export function SidebarRail(props: SidebarRailProps) {
  const [local, rest] = splitProps(props, ["class", "onClick", "side", "title", "type"]);
  const store = useSidebarStore();

  function handleClick(event: MouseEvent) {
    callUserFirst(event, local.onClick as JSX.EventHandlerUnion<HTMLElement, MouseEvent>);
    if (event.defaultPrevented) return;
    store.toggle({ reason: "trigger" });
  }

  return (
    <button
      aria-label={rest["aria-label"] ?? "Toggle sidebar"}
      {...rest}
      class={cn(
        "ui-sidebar-rail absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-px hover:after:bg-sidebar-border data-[side=left]:-right-4 data-[side=right]:left-0 sm:flex",
        local.class,
      )}
      data-part="rail"
      data-scope="ui-sidebar"
      data-side={local.side ?? "left"}
      onClick={handleClick}
      tabIndex={-1}
      title={local.title ?? "Toggle sidebar"}
      type={local.type ?? "button"}
    />
  );
}

export function SidebarInset(props: SidebarInsetProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <main
      {...rest}
      class={cn(
        "ui-sidebar-inset relative flex min-w-0 flex-1 flex-col bg-background data-[variant=inset]:m-2 data-[variant=inset]:ml-0 data-[variant=inset]:rounded-xl data-[variant=inset]:shadow-sm",
        local.class,
      )}
      data-part="inset"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarInput(props: SidebarInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <Input
      {...rest}
      class={cn("ui-sidebar-input h-8 w-full bg-background shadow-none", local.class)}
      data-part="input"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarSeparator(props: SidebarSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <Separator
      {...rest}
      class={cn("ui-sidebar-separator mx-2 w-auto bg-sidebar-border", local.class)}
      data-part="separator"
      data-scope="ui-sidebar"
    />
  );
}

export function SidebarItems(props: SidebarItemsProps) {
  return (
    <SidebarNav aria-label={props.ariaLabel} class={props.class}>
      <SidebarMenu>
        <For each={props.items}>
          {(item) => (
            <SidebarMenuItem>
              <SidebarMenuLink
                aria-disabled={item.disabled ? "true" : undefined}
                href={item.disabled ? undefined : item.href}
                itemId={item.id}
                onClick={(event) => {
                  if (item.disabled) {
                    event.preventDefault();
                  }
                }}
              >
                <Show when={item.icon}>
                  <span aria-hidden="true" data-part="menu-icon" data-scope="ui-sidebar">
                    {item.icon}
                  </span>
                </Show>
                <span class="truncate data-[state=collapsed]:sr-only" {...stateAttributes()}>
                  {item.label}
                </span>
                <Show when={item.badge}>
                  <span
                    class="ml-auto text-xs text-sidebar-foreground/70 data-[state=collapsed]:hidden"
                    data-part="menu-badge"
                    data-scope="ui-sidebar"
                    {...stateAttributes()}
                  >
                    {item.badge}
                  </span>
                </Show>
              </SidebarMenuLink>
            </SidebarMenuItem>
          )}
        </For>
      </SidebarMenu>
    </SidebarNav>
  );
}

export type SidebarComponentProps = ComponentProps<typeof Sidebar>;
