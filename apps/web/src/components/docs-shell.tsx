import { Check, ChevronDown, Clipboard, FileText, Menu, Package, X } from "lucide-solid";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { useRouterState } from "@tanstack/solid-router";

import {
  navGroups,
  type DocsPage,
  type NavGroup,
  type NavItem,
  type TocItem,
} from "@/lib/docs-data";

export function cn(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export const buttonClass =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8";
export const primaryButtonClass =
  "border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/85";
export const secondaryButtonClass =
  "bg-popover text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80";

export function PageHeader(props: JSX.HTMLAttributes<HTMLElement>) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <section {...rest} class={cn("scroll-mt-24", local.class)}>
      {local.children}
    </section>
  );
}

export function PageHeaderHeading(props: JSX.HTMLAttributes<HTMLHeadingElement>) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <h1
      {...rest}
      class={cn(
        "m-0 scroll-m-20 font-heading font-semibold text-3xl text-foreground tracking-normal xl:text-4xl",
        local.class,
      )}
    />
  );
}

export function PageHeaderDescription(props: JSX.HTMLAttributes<HTMLParagraphElement>) {
  const [local, rest] = splitProps(props, ["class"]);

  return <p {...rest} class={cn("m-0 max-w-2xl text-muted-foreground sm:text-lg", local.class)} />;
}

export function Badge(props: JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      class={cn(
        "inline-flex h-5 items-center justify-center rounded-md border border-input bg-muted px-1.5 text-[0.72rem] font-medium leading-none text-foreground transition-colors",
        local.class,
      )}
    />
  );
}

export function NewBadge(props: JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <span
      {...rest}
      class={cn(
        "inline-flex shrink-0 rounded-md bg-info/10 px-1.5 py-0.5 text-[0.68rem] font-medium leading-none text-info-foreground",
        local.class,
      )}
    />
  );
}

export function ActionLink(props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [local, rest] = splitProps(props, ["class"]);

  return <a {...rest} class={cn(buttonClass, local.class)} />;
}

export function CopyButton(props: Readonly<{ value: string; label?: string; class?: string }>) {
  const [copied, setCopied] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const copy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(props.value);
    setCopied(true);
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      aria-label={copied() ? "Copied" : (props.label ?? "Copy code")}
      class={cn(
        "absolute top-1.5 right-1.5 z-10 inline-flex size-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground opacity-80 outline-none transition-colors hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:bg-accent focus-visible:text-foreground focus-visible:opacity-100 data-copied:bg-accent data-copied:text-foreground data-copied:opacity-100",
        props.class,
      )}
      data-copied={copied() ? "" : undefined}
      onClick={copy}
      title={copied() ? "Copied" : (props.label ?? "Copy code")}
      type="button"
    >
      <span class="sr-only">{copied() ? "Copied" : (props.label ?? "Copy code")}</span>
      <Show when={copied()} fallback={<Clipboard size={15} />}>
        <Check size={15} />
      </Show>
    </button>
  );
}

export function CopyPageButton(props: Readonly<{ markdown: string }>) {
  return (
    <button
      class={cn(buttonClass, secondaryButtonClass)}
      onClick={async () => navigator.clipboard?.writeText(props.markdown)}
      type="button"
    >
      <FileText size={15} />
      Copy Markdown
    </button>
  );
}

export function CodeBlock(
  props: Readonly<{
    code: string;
    copy?: boolean;
    language: string;
    title?: string;
  }>,
) {
  return (
    <figure class="relative mt-6 overflow-hidden rounded-xl border border-border bg-code text-code-foreground outline-none">
      <Show when={props.title || props.language}>
        <figcaption class="flex min-h-11 items-center gap-2 border-border/64 border-b px-4 py-2.5 pr-12 font-mono text-code-foreground text-xs">
          <span class="rounded bg-code-highlight px-1.5 py-0.5 font-mono text-[0.68rem] text-code-foreground uppercase">
            {props.language}
          </span>
          <Show when={props.title}>{(title) => <span>{title()}</span>}</Show>
        </figcaption>
      </Show>
      <Show when={props.copy ?? true}>
        <CopyButton value={props.code} />
      </Show>
      <pre class="m-0 overflow-x-auto px-4 py-3.5 font-mono text-[0.8125rem] leading-6">
        <code class="bg-transparent p-0 text-inherit text-sm">{props.code}</code>
      </pre>
    </figure>
  );
}

export function MobileNav(props: Readonly<{ groups: readonly NavGroup[] }>) {
  const [open, setOpen] = createSignal(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        aria-controls="mobile-docs-navigation"
        aria-expanded={open()}
        aria-label="Open documentation navigation"
        class="inline-flex size-9 items-center justify-center rounded-md border border-input bg-popover text-foreground shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu size={18} />
      </button>
      <Show when={open()}>
        <div class="fixed inset-0 z-60 h-svh bg-foreground/20" onClick={close} />
        <aside
          aria-label="Documentation navigation"
          class="fixed inset-y-0 left-0 z-70 flex h-svh w-[min(22rem,calc(100vw-2rem))] flex-col border-sidebar-border border-r bg-background shadow-2xl"
          id="mobile-docs-navigation"
        >
          <div class="flex items-center justify-between gap-4 border-sidebar-border border-b p-4">
            <div>
              <div class="text-muted-foreground text-xs">Keystone UI</div>
              <div class="font-semibold text-base text-foreground">Documentation</div>
            </div>
            <button
              aria-label="Close documentation navigation"
              class="inline-flex size-9 items-center justify-center rounded-md border border-input bg-popover text-foreground shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24"
              onClick={close}
              type="button"
            >
              <X size={18} />
            </button>
          </div>
          <nav class="min-h-0 overflow-y-auto p-4">
            <For each={props.groups}>
              {(group) => (
                <section class="mt-6 first:mt-0">
                  <h2 class="mb-2 font-semibold text-foreground text-xs">{group.title}</h2>
                  <For each={group.items}>
                    {(item) => (
                      <a
                        class="flex min-h-9 items-center justify-between gap-3 rounded-md px-3.5 py-1.5 text-sidebar-foreground text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground"
                        href={item.href}
                        onClick={close}
                      >
                        <span>{item.label}</span>
                        <Show when={item.badge}>{(badge) => <NewBadge>{badge()}</NewBadge>}</Show>
                      </a>
                    )}
                  </For>
                </section>
              )}
            </For>
          </nav>
        </aside>
      </Show>
    </>
  );
}

export function ProductDropdown(props: Readonly<{ items: readonly NavItem[] }>) {
  return (
    <details class="group relative hidden md:block">
      <summary class="flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-md px-2 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground [&::-webkit-details-marker]:hidden">
        <Package size={15} />
        Layers
        <ChevronDown size={14} />
      </summary>
      <div class="absolute top-[calc(100%+0.45rem)] right-0 z-50 min-w-56 rounded-lg border border-border bg-popover p-1 shadow-xl">
        <For each={props.items}>
          {(item) => (
            <a
              class="flex min-h-9 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-muted-foreground text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
              href={item.href}
            >
              <span>{item.label}</span>
              <Show when={item.badge}>{(badge) => <NewBadge>{badge()}</NewBadge>}</Show>
            </a>
          )}
        </For>
      </div>
    </details>
  );
}

export function DocsChrome(props: Readonly<{ children: JSX.Element }>) {
  return (
    <main class="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      <div class="mx-auto grid min-h-[calc(100svh-var(--header-height))] w-full max-w-[1416px] grid-cols-1 px-0 [--sidebar-width:220px] [--top-spacing:0px] lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)] xl:grid-cols-[var(--sidebar-width)_minmax(0,1fr)_18rem]">
        <aside class="hidden border-sidebar-border border-r lg:block">
          <div class="sticky top-(--header-height) h-[calc(100svh-var(--header-height))] overflow-y-auto px-4 py-2">
            <div class="h-(--top-spacing) shrink-0" />
            <DocsSidebar groups={navGroups} />
          </div>
        </aside>
        {props.children}
      </div>
    </main>
  );
}

export function DocsPageFrame(props: Readonly<{ children: JSX.Element; page: DocsPage }>) {
  return (
    <>
      <article class="relative flex w-full min-w-0 flex-1 flex-col lg:mt-8 lg:mr-4 lg:mb-8">
        <div class="flex min-h-full flex-col border-sidebar-border bg-card text-card-foreground shadow-lg/5 max-lg:border-none lg:rounded-2xl lg:border">
          <div class="flex-1 border-border bg-card max-lg:rounded-none lg:-m-px lg:rounded-2xl lg:border">
            <div class="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:p-8">{props.children}</div>
          </div>
          <SiteFooter />
        </div>
      </article>
      <aside class="sticky top-(--header-height) z-30 ms-auto hidden h-[calc(100svh-var(--header-height))] w-72 flex-col overflow-hidden overscroll-none xl:flex">
        <div class="flex min-h-0 flex-col gap-2 overflow-y-auto py-2">
          <div class="h-(--top-spacing) shrink-0" />
          <DocsToc items={props.page.toc} />
        </div>
      </aside>
    </>
  );
}

export function DocsSidebar(props: Readonly<{ groups: readonly NavGroup[] }>) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isActive = (href: string) => {
    const path = href.split("#")[0] || "/docs";
    return pathname() === path || (pathname() === "/" && path === "/docs");
  };

  return (
    <nav aria-label="Documentation">
      <For each={props.groups}>
        {(group) => (
          <div class="mb-4">
            <h2 class="flex h-7 items-center px-0 font-medium text-sidebar-accent-foreground text-sm">
              {group.title}
            </h2>
            <div class="grid gap-0.5">
              <For each={group.items}>
                {(item) => (
                  <a
                    aria-current={isActive(item.href) ? "page" : undefined}
                    class={cn(
                      "flex min-h-8 items-center justify-between gap-3 rounded-md px-3.5 py-1.5 text-sm leading-tight outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground",
                      isActive(item.href)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground",
                    )}
                    href={item.href}
                  >
                    <span class="truncate">{item.label}</span>
                    <Show when={item.badge}>{(badge) => <NewBadge>{badge()}</NewBadge>}</Show>
                  </a>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </nav>
  );
}

export function DocsToc(props: Readonly<{ items: readonly TocItem[] }>) {
  return (
    <>
      <div class="z-10 flex flex-col gap-1 py-2 pr-4 pl-6 text-sm">
        <p class="flex h-7 items-center font-medium text-xs">On This Page</p>
        <nav
          aria-label="On this page"
          class="relative ms-3.5 flex flex-col gap-0.5 before:absolute before:inset-y-0 before:-left-3.25 before:w-px before:bg-border"
        >
          <For each={props.items}>
            {(item) => (
              <a
                class="relative py-1 text-[0.8125rem] text-sidebar-foreground leading-4.5 no-underline outline-none transition-colors before:absolute before:inset-y-px before:-left-3.25 before:w-px before:rounded-full before:bg-transparent hover:text-foreground hover:before:w-0.5 hover:before:bg-primary focus-visible:text-foreground focus-visible:before:w-0.5 focus-visible:before:bg-primary"
                href={item.href}
              >
                {item.label}
              </a>
            )}
          </For>
        </nav>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer class="flex items-center justify-between gap-4 px-4 py-6 text-muted-foreground text-sm lg:rounded-b-2xl lg:px-8">
      <p class="m-0">
        <strong class="text-foreground">Keystone UI</strong> is early Solid primitive and registry
        infrastructure.
      </p>
      <a class="font-semibold text-foreground" href="#top">
        Back to top
      </a>
    </footer>
  );
}
