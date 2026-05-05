import { Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { Button } from "@/components/ui/button";
import { ShortcutDisplay } from "@/components/ui/shortcut-display";
import { cn } from "@/lib/cn";

export type TopbarProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> & {
    actions?: JSX.Element;
    brand?: JSX.Element;
    commandLabel?: JSX.Element;
    commandShortcut?: string;
    navigation?: JSX.Element;
    search?: JSX.Element;
    status?: JSX.Element;
    title?: JSX.Element;
    onCommand?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  }
>;

export type TopbarRootProps = JSX.HTMLAttributes<HTMLElement>;
export type TopbarBrandProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TopbarTitleProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TopbarNavigationProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TopbarSearchProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TopbarCommandTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  shortcut?: string;
};
export type TopbarActionsProps = JSX.HTMLAttributes<HTMLDivElement>;
export type TopbarStatusProps = JSX.HTMLAttributes<HTMLDivElement>;

const classes = (...tokens: string[]) => tokens.join(" ");

export function Topbar(props: TopbarProps) {
  const [local, rest] = splitProps(props, [
    "actions",
    "brand",
    "children",
    "commandLabel",
    "commandShortcut",
    "navigation",
    "onCommand",
    "search",
    "status",
    "title",
  ]);

  return (
    <TopbarRoot {...rest}>
      <Show when={local.brand ?? local.title}>
        <TopbarBrand>
          <Show when={local.brand}>
            <span data-scope="ui-topbar" data-part="brand-mark" class="shrink-0">
              {local.brand}
            </span>
          </Show>
          <Show when={local.title}>
            <TopbarTitle>{local.title}</TopbarTitle>
          </Show>
        </TopbarBrand>
      </Show>
      <Show when={local.navigation}>
        <TopbarNavigation>{local.navigation}</TopbarNavigation>
      </Show>
      <Show when={local.search}>
        <TopbarSearch>{local.search}</TopbarSearch>
      </Show>
      <Show when={local.onCommand}>
        <TopbarCommandTrigger onClick={local.onCommand} shortcut={local.commandShortcut}>
          {local.commandLabel ?? "Search"}
        </TopbarCommandTrigger>
      </Show>
      <Show when={local.status}>
        <TopbarStatus>{local.status}</TopbarStatus>
      </Show>
      <Show when={local.actions}>
        <TopbarActions>{local.actions}</TopbarActions>
      </Show>
      {local.children}
    </TopbarRoot>
  );
}

export function TopbarRoot(props: TopbarRootProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <header
      {...rest}
      data-scope="ui-topbar"
      data-part="root"
      class={cn(
        classes(
          "ui-topbar",
          "sticky",
          "top-0",
          "z-30",
          "flex",
          "min-h-14",
          "min-w-0",
          "flex-wrap",
          "items-center",
          "gap-2",
          "border-b",
          "bg-background/92",
          "px-3",
          "backdrop-blur",
          "supports-[backdrop-filter]:bg-background/72",
          "md:flex-nowrap",
        ),
        local.class,
      )}
    />
  );
}

export function TopbarBrand(props: TopbarBrandProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-topbar"
      data-part="brand"
      class={cn("ui-topbar-brand flex min-w-0 shrink-0 items-center gap-2", local.class)}
    />
  );
}

export function TopbarTitle(props: TopbarTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-topbar"
      data-part="title"
      class={cn("ui-topbar-title truncate font-semibold text-sm", local.class)}
    />
  );
}

export function TopbarNavigation(props: TopbarNavigationProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-topbar"
      data-part="navigation"
      class={cn("ui-topbar-navigation min-w-0 flex-1 overflow-x-auto", local.class)}
    />
  );
}

export function TopbarSearch(props: TopbarSearchProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-topbar"
      data-part="search"
      class={cn("ui-topbar-search min-w-40 flex-1 md:max-w-sm", local.class)}
    />
  );
}

export function TopbarCommandTrigger(props: TopbarCommandTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "shortcut"]);
  return (
    <span data-scope="ui-topbar" data-part="command-trigger" class="inline-flex min-w-0">
      <Button
        {...rest}
        variant="outline"
        size="sm"
        class={cn(
          "ui-topbar-command-trigger min-w-0 justify-between text-muted-foreground md:min-w-56",
          local.class,
        )}
      >
        <span class="truncate">{local.children}</span>
        <Show when={local.shortcut}>
          <ShortcutDisplay label={local.shortcut} class="ms-3 hidden md:inline-flex" />
        </Show>
      </Button>
    </span>
  );
}

export function TopbarActions(props: TopbarActionsProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-topbar"
      data-part="actions"
      class={cn("ui-topbar-actions ms-auto flex shrink-0 items-center gap-1.5", local.class)}
    />
  );
}

export function TopbarStatus(props: TopbarStatusProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-topbar"
      data-part="status"
      class={cn("ui-topbar-status flex shrink-0 items-center gap-1.5", local.class)}
    />
  );
}
