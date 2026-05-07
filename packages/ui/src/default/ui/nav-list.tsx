import { For, Show, splitProps, type JSX } from "solid-js";
import { Badge } from "@/components/ui/badge";
import { ShortcutDisplay } from "@/components/ui/shortcut-display";
import { cn } from "@/lib/cn";

export type NavListItem = {
  id: string;
  label: JSX.Element;
  href?: string;
  icon?: JSX.Element;
  badge?: JSX.Element;
  count?: number | string;
  current?: boolean;
  disabled?: boolean;
  shortcut?: string;
  status?: JSX.Element;
  description?: JSX.Element;
  onSelect?: (item: NavListItem, event: MouseEvent) => void;
};

export type NavListGroup = {
  id: string;
  label?: JSX.Element;
  items: readonly NavListItem[];
  defaultOpen?: boolean;
};

export type NavListState = {
  current?: boolean;
  disabled?: boolean;
};

export type NavListProps = Omit<JSX.HTMLAttributes<HTMLElement>, "children"> & {
  groups?: readonly NavListGroup[];
  items?: readonly NavListItem[];
  getItemState?: (item: NavListItem) => NavListState;
  orientation?: "horizontal" | "vertical";
};

export type NavListRootProps = JSX.HTMLAttributes<HTMLElement> & {
  orientation?: "horizontal" | "vertical";
};
export type NavListGroupProps = JSX.HTMLAttributes<HTMLDivElement>;
export type NavListGroupLabelProps = JSX.HTMLAttributes<HTMLDivElement>;
export type NavListItemsProps = JSX.HTMLAttributes<HTMLDivElement>;
export type NavListItemProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> &
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "a" | "button";
    current?: boolean;
  };
export type NavListItemContentProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  badge?: JSX.Element;
  count?: number | string;
  description?: JSX.Element;
  icon?: JSX.Element;
  label: JSX.Element;
  shortcut?: string;
  status?: JSX.Element;
};

const classes = (...tokens: string[]) => tokens.join(" ");

export function NavList(props: NavListProps) {
  const [local, rest] = splitProps(props, ["groups", "items", "getItemState", "orientation"]);
  const groups = () =>
    local.groups ?? [
      {
        id: "default",
        items: local.items ?? [],
      },
    ];

  return (
    <NavListRoot {...rest} orientation={local.orientation}>
      <For each={groups()}>
        {(group) => (
          <NavListGroup>
            <Show when={group.label}>
              <NavListGroupLabel>{group.label}</NavListGroupLabel>
            </Show>
            <NavListItems>
              <For each={group.items}>
                {(item) => {
                  const state = () => local.getItemState?.(item) ?? {};
                  const current = () => state().current ?? item.current ?? false;
                  const disabled = () => state().disabled ?? item.disabled ?? false;
                  return (
                    <NavListItem
                      as={item.href ? "a" : "button"}
                      aria-current={current() ? "page" : undefined}
                      current={current()}
                      disabled={disabled()}
                      href={item.href}
                      onClick={(event: MouseEvent) => item.onSelect?.(item, event)}
                    >
                      <NavListItemContent
                        badge={item.badge}
                        count={item.count}
                        description={item.description}
                        icon={item.icon}
                        label={item.label}
                        shortcut={item.shortcut}
                        status={item.status}
                      />
                    </NavListItem>
                  );
                }}
              </For>
            </NavListItems>
          </NavListGroup>
        )}
      </For>
    </NavListRoot>
  );
}

export function NavListRoot(props: NavListRootProps) {
  const [local, rest] = splitProps(props, ["class", "orientation"]);
  const orientation = () => local.orientation ?? "vertical";

  return (
    <nav
      {...rest}
      data-scope="ui-nav-list"
      data-part="root"
      data-orientation={orientation()}
      class={cn(
        classes(
          "ui-nav-list",
          "flex",
          "min-w-0",
          "data-[orientation=horizontal]:items-center",
          "data-[orientation=horizontal]:gap-1",
          "data-[orientation=vertical]:flex-col",
          "data-[orientation=vertical]:gap-3",
        ),
        local.class,
      )}
    />
  );
}

export function NavListGroup(props: NavListGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-nav-list"
      data-part="group"
      class={cn("ui-nav-list-group flex min-w-0 flex-col gap-1", local.class)}
    />
  );
}

export function NavListGroupLabel(props: NavListGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-nav-list"
      data-part="group-label"
      class={cn(
        "ui-nav-list-group-label px-2 font-medium text-muted-foreground text-xs",
        local.class,
      )}
    />
  );
}

export function NavListItems(props: NavListItemsProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-nav-list"
      data-part="items"
      class={cn("ui-nav-list-items flex min-w-0 flex-col gap-0.5", local.class)}
    />
  );
}

export function NavListItem(props: NavListItemProps) {
  const [local, rest] = splitProps(props, ["as", "class", "current", "type"]);
  const itemClass = () =>
    cn(
      classes(
        "ui-nav-list-item",
        "group/nav-list-item",
        "flex",
        "min-h-8",
        "w-full",
        "min-w-0",
        "cursor-pointer",
        "items-center",
        "gap-2",
        "rounded-lg",
        "px-2",
        "py-1.5",
        "text-start",
        "text-foreground",
        "text-sm",
        "outline-none",
        "transition-[background-color,color,box-shadow]",
        "hover:bg-accent",
        "hover:text-accent-foreground",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "disabled:pointer-events-none",
        "disabled:opacity-56",
        "aria-disabled:pointer-events-none",
        "aria-disabled:opacity-56",
        "data-current:bg-accent",
        "data-current:text-accent-foreground",
      ),
      local.class,
    );

  if (local.as === "a") {
    return (
      <a
        {...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
        data-scope="ui-nav-list"
        data-part="item"
        data-current={local.current ? "" : undefined}
        class={itemClass()}
      />
    );
  }

  return (
    <button
      {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
      data-scope="ui-nav-list"
      data-part="item"
      data-current={local.current ? "" : undefined}
      type={local.type ?? "button"}
      class={itemClass()}
    />
  );
}

export function NavListItemContent(props: NavListItemContentProps) {
  const [local, rest] = splitProps(props, [
    "badge",
    "class",
    "count",
    "description",
    "icon",
    "label",
    "shortcut",
    "status",
  ]);

  return (
    <span
      {...rest}
      data-scope="ui-nav-list"
      data-part="item-content"
      class={cn("ui-nav-list-item-content flex min-w-0 flex-1 items-center gap-2", local.class)}
    >
      <Show when={local.icon}>
        <span
          aria-hidden="true"
          data-scope="ui-nav-list"
          data-part="item-icon"
          class="flex size-4 shrink-0 items-center justify-center text-muted-foreground group-data-current/nav-list-item:text-current"
        >
          {local.icon}
        </span>
      </Show>
      <span data-scope="ui-nav-list" data-part="item-text" class="min-w-0 flex-1">
        <span data-scope="ui-nav-list" data-part="item-label" class="block truncate">
          {local.label}
        </span>
        <Show when={local.description}>
          <span
            data-scope="ui-nav-list"
            data-part="item-description"
            class="block truncate text-muted-foreground text-xs"
          >
            {local.description}
          </span>
        </Show>
      </span>
      <Show when={local.status}>
        <span data-scope="ui-nav-list" data-part="item-status" class="shrink-0">
          {local.status}
        </span>
      </Show>
      <Show when={local.badge ?? local.count}>
        <span data-scope="ui-nav-list" data-part="item-badge" class="inline-flex shrink-0">
          <Badge variant="muted" class="h-5 px-1.5 text-[0.6875rem]">
            {local.badge ?? local.count}
          </Badge>
        </span>
      </Show>
      <Show when={local.shortcut}>
        <span
          data-scope="ui-nav-list"
          data-part="item-shortcut"
          class="hidden shrink-0 md:inline-flex"
        >
          <ShortcutDisplay label={local.shortcut} />
        </span>
      </Show>
    </span>
  );
}
