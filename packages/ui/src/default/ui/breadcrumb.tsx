import { For, Show, splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

export type BreadcrumbItemData = {
  current?: boolean;
  disabled?: boolean;
  href?: string;
  label: JSX.Element;
};

export type BreadcrumbProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> & {
    items?: readonly BreadcrumbItemData[];
    label?: string;
    linkClass?: string;
    listClass?: string;
    pageClass?: string;
    separator?: JSX.Element;
    separatorClass?: string;
  }
>;
export type BreadcrumbListProps = ParentProps<JSX.OlHTMLAttributes<HTMLOListElement>>;
export type BreadcrumbItemProps = ParentProps<JSX.LiHTMLAttributes<HTMLLIElement>>;
export type BreadcrumbLinkProps = ParentProps<JSX.AnchorHTMLAttributes<HTMLAnchorElement>>;
export type BreadcrumbPageProps = ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>;
export type BreadcrumbSeparatorProps = ParentProps<JSX.LiHTMLAttributes<HTMLLIElement>>;
export type BreadcrumbEllipsisProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const classes = (...tokens: string[]) => tokens.join(" ");

function ChevronSeparator() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function Breadcrumb(props: BreadcrumbProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "items",
    "label",
    "linkClass",
    "listClass",
    "pageClass",
    "separator",
    "separatorClass",
  ]);

  return (
    <nav
      {...rest}
      aria-label={local.label ?? rest["aria-label"] ?? "Breadcrumb"}
      data-scope="ui-breadcrumb"
      data-part="root"
      data-slot="breadcrumb"
      class={cn("ui-breadcrumb", local.class)}
    >
      <Show when={local.items} fallback={local.children}>
        {(items) => (
          <BreadcrumbList class={local.listClass}>
            <For each={items()}>
              {(item, index) => {
                const current = () => item.current || index() === items().length - 1;

                return (
                  <>
                    <BreadcrumbItem data-current={current() ? "" : undefined}>
                      <Show
                        when={!current() && item.href && !item.disabled}
                        fallback={
                          <BreadcrumbPage class={local.pageClass}>{item.label}</BreadcrumbPage>
                        }
                      >
                        <BreadcrumbLink
                          class={local.linkClass}
                          href={item.href}
                          aria-disabled={item.disabled || undefined}
                        >
                          {item.label}
                        </BreadcrumbLink>
                      </Show>
                    </BreadcrumbItem>
                    <Show when={index() < items().length - 1}>
                      <BreadcrumbSeparator class={local.separatorClass}>
                        {local.separator}
                      </BreadcrumbSeparator>
                    </Show>
                  </>
                );
              }}
            </For>
          </BreadcrumbList>
        )}
      </Show>
    </nav>
  );
}

export function BreadcrumbList(props: BreadcrumbListProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <ol
      {...rest}
      data-scope="ui-breadcrumb"
      data-part="list"
      data-slot="breadcrumb-list"
      class={cn(
        classes(
          "ui-breadcrumb-list",
          "flex",
          "min-w-0",
          "flex-wrap",
          "items-center",
          "gap-1.5",
          "text-muted-foreground",
          "text-sm",
        ),
        local.class,
      )}
    />
  );
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <li
      {...rest}
      data-scope="ui-breadcrumb"
      data-part="item"
      data-slot="breadcrumb-item"
      class={cn("ui-breadcrumb-item inline-flex min-w-0 items-center gap-1.5", local.class)}
    />
  );
}

export function BreadcrumbLink(props: BreadcrumbLinkProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <a
      {...rest}
      data-scope="ui-breadcrumb"
      data-part="link"
      data-slot="breadcrumb-link"
      class={cn(
        classes(
          "ui-breadcrumb-link",
          "min-w-0",
          "truncate",
          "rounded-md",
          "outline-none",
          "transition-colors",
          "hover:text-foreground",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
          "aria-disabled:pointer-events-none",
          "aria-disabled:opacity-64",
        ),
        local.class,
      )}
    />
  );
}

export function BreadcrumbPage(props: BreadcrumbPageProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      aria-current={rest["aria-current"] ?? "page"}
      data-scope="ui-breadcrumb"
      data-part="page"
      data-slot="breadcrumb-page"
      class={cn("ui-breadcrumb-page min-w-0 truncate font-medium text-foreground", local.class)}
    />
  );
}

export function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <li
      {...rest}
      aria-hidden="true"
      data-scope="ui-breadcrumb"
      data-part="separator"
      data-slot="breadcrumb-separator"
      role="presentation"
      class={cn(
        "ui-breadcrumb-separator inline-flex shrink-0 items-center text-muted-foreground/56 [&_svg]:size-3.5",
        local.class,
      )}
    >
      {local.children ?? <ChevronSeparator />}
    </li>
  );
}

export function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  const [local, rest] = splitProps(props, ["class", "label"]);

  return (
    <button
      {...rest}
      aria-label={local.label ?? rest["aria-label"] ?? "Show breadcrumb menu"}
      data-scope="ui-breadcrumb"
      data-part="ellipsis"
      data-slot="breadcrumb-ellipsis"
      type={rest.type ?? "button"}
      class={cn(
        classes(
          "ui-breadcrumb-ellipsis",
          "inline-flex",
          "size-7",
          "items-center",
          "justify-center",
          "rounded-md",
          "text-muted-foreground",
          "outline-none",
          "transition-colors",
          "hover:bg-accent",
          "hover:text-accent-foreground",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
          "disabled:pointer-events-none",
          "disabled:opacity-64",
        ),
        local.class,
      )}
    >
      <span aria-hidden="true" class="text-lg leading-none">
        ...
      </span>
    </button>
  );
}
