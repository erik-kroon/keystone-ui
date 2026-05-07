import { Check, ChevronDown, Clipboard, Menu, Package, X } from "lucide-solid";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { Link, useRouterState } from "@tanstack/solid-router";

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
        "absolute top-1.5 right-1.5 z-10 inline-flex size-9 items-center justify-center rounded-md border-0 bg-code text-code-foreground opacity-70 outline-none transition-colors hover:bg-code-highlight hover:opacity-100 focus-visible:bg-code-highlight focus-visible:opacity-100 data-copied:bg-code-highlight data-copied:opacity-100 sm:size-8",
        props.class,
      )}
      data-copied={copied() ? "" : undefined}
      data-slot="copy-button"
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

export function CopyPageButton(
  props: Readonly<{ class?: string; icon?: JSX.Element; markdown: string }>,
) {
  const [copied, setCopied] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const copy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(props.markdown);
    setCopied(true);
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      aria-label={copied() ? "Copied markdown" : "Copy markdown"}
      class={cn(buttonClass, secondaryButtonClass, props.class)}
      data-copied={copied() ? "" : undefined}
      onClick={copy}
      title={copied() ? "Copied markdown" : "Copy markdown"}
      type="button"
    >
      <Show when={copied()} fallback={props.icon ?? <Clipboard size={15} />}>
        <Check size={15} />
      </Show>
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
    <figure data-rehype-pretty-code-figure="">
      <Show when={props.title}>
        <figcaption
          class="flex items-center gap-2 text-[.8125rem] text-code-foreground [&_svg]:size-4.5 [&_svg]:text-code-foreground sm:[&_svg]:size-4"
          data-language={props.language}
          data-rehype-pretty-code-title=""
        >
          <span class="inline-flex h-5 items-center rounded-md border border-border/64 bg-code-highlight px-1.5 font-medium text-[0.6875rem] text-code-foreground/72 leading-none">
            {props.language}
          </span>
          <Show when={props.title}>{(title) => <span class="font-medium">{title()}</span>}</Show>
        </figcaption>
      </Show>
      <Show when={props.copy ?? true}>
        <CopyButton value={props.code} />
      </Show>
      <div class="contents" innerHTML={renderCodeBlock(props.code)} />
    </figure>
  );
}

const codePreClass =
  "m-0 max-h-[450px] min-w-0 w-max overflow-auto px-4 py-3.5 font-mono text-[.8125rem] leading-snug outline-none has-data-[highlighted-line]:px-0 has-data-[line-numbers]:ps-0 !bg-transparent";

function renderCodeBlock(code: string) {
  const lines = code.split("\n");

  return `<pre class="${codePreClass}" tabindex="0"><code data-line-numbers="">${lines
    .map(
      (line) =>
        `<span class="line" data-line="">${highlightCodeLine(line) || tokenSpan(" ")}</span>`,
    )
    .join("\n")}</code></pre>`;
}

const keywordTokens = new Set([
  "as",
  "async",
  "await",
  "const",
  "export",
  "from",
  "function",
  "if",
  "import",
  "in",
  "let",
  "return",
  "satisfies",
  "type",
]);
const keywordColor = ["#D73A49", "#F97583"] as const;
const stringColor = ["#032F62", "#9ECBFF"] as const;
const numberColor = ["#005CC5", "#79B8FF"] as const;
const functionColor = ["#6F42C1", "#B392F0"] as const;
const tagColor = ["#22863A", "#85E89D"] as const;
const textColor = ["#24292E", "#E1E4E8"] as const;
const commentColor = ["#6A737D", "#8B949E"] as const;

function highlightCodeLine(line: string) {
  let index = 0;
  let html = "";

  while (index < line.length) {
    const rest = line.slice(index);

    if (rest.startsWith("//")) {
      html += tokenSpan(rest, commentColor);
      break;
    }

    const quote = line[index];
    if (quote === '"' || quote === "'" || quote === "`") {
      const end = findStringEnd(line, index, quote);
      html += tokenSpan(line.slice(index, end), stringColor);
      index = end;
      continue;
    }

    const wordMatch = /^[A-Za-z_$][\w$-]*/.exec(rest);
    if (wordMatch) {
      const word = wordMatch[0];
      const before = line.slice(0, index);
      const after = line.slice(index + word.length);

      html += tokenSpan(word, tokenColorForWord(word, before, after));
      index += word.length;
      continue;
    }

    const numberMatch = /^\d+(?:\.\d+)?/.exec(rest);
    if (numberMatch) {
      html += tokenSpan(numberMatch[0], numberColor);
      index += numberMatch[0].length;
      continue;
    }

    html += tokenSpan(line[index] ?? "", textColor);
    index += 1;
  }

  return html;
}

function findStringEnd(line: string, start: number, quote: string) {
  for (let index = start + 1; index < line.length; index += 1) {
    if (line[index] === "\\") {
      index += 1;
      continue;
    }
    if (line[index] === quote) return index + 1;
  }

  return line.length;
}

function tokenColorForWord(word: string, before: string, after: string) {
  if (keywordTokens.has(word)) return keywordColor;
  if (word === "true" || word === "false" || word === "null" || word === "undefined") {
    return numberColor;
  }
  if (/<\/?$/.test(before.trimEnd())) return tagColor;
  if (/^\s*=/.test(after)) return functionColor;
  if (/^\s*\(/.test(after)) return functionColor;

  return textColor;
}

function tokenSpan(value: string, colors: readonly [string, string] = textColor) {
  return `<span style="--shiki-light:${colors[0]};--shiki-dark:${colors[1]}">${escapeHtml(
    value,
  )}</span>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
          class="fixed inset-y-0 left-0 z-70 flex h-svh w-[min(22rem,calc(100vw-2rem))] flex-col bg-background shadow-2xl"
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
          <nav class="scrollbar-none min-h-0 overflow-y-auto p-4">
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
            <Link
              class="flex min-h-9 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-muted-foreground text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
              {...linkPropsForHref(item.href)}
            >
              <span>{item.label}</span>
              <Show when={item.badge}>{(badge) => <NewBadge>{badge()}</NewBadge>}</Show>
            </Link>
          )}
        </For>
      </div>
    </details>
  );
}

export function DocsChrome(props: Readonly<{ children: JSX.Element }>) {
  return (
    <main class="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      <div class="mx-auto grid min-h-[calc(100svh-var(--header-height))] w-full max-w-[1416px] grid-cols-1 px-0 [--sidebar-width:220px] [--top-spacing:0px] lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*3)] xl:grid-cols-[var(--sidebar-width)_minmax(0,1fr)_18rem]">
        <aside class="hidden lg:block">
          <div class="scrollbar-none sticky top-(--header-height) h-[calc(100svh-var(--header-height))] overflow-y-auto px-4 py-2">
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
      <article class="relative flex w-full min-w-0 flex-1 flex-col lg:mt-5 lg:mr-4 lg:mb-8">
        <div class="flex min-h-full flex-col border-sidebar-border bg-card text-card-foreground shadow-lg/5 max-lg:border-none lg:rounded-2xl lg:border">
          <div class="flex-1 border-border bg-card max-lg:rounded-none lg:-m-px lg:rounded-2xl lg:border">
            <div class="mx-auto w-full max-w-[880px] px-4 pt-4 pb-6 sm:px-6 lg:px-8 lg:pt-5 lg:pb-8">
              {props.children}
            </div>
          </div>
          <SiteFooter />
        </div>
      </article>
      <aside class="sticky top-(--header-height) z-30 ms-auto hidden h-[calc(100svh-var(--header-height))] w-72 flex-col overflow-hidden overscroll-none xl:flex">
        <div class="flex min-h-0 flex-col gap-2 overflow-y-auto pt-0 pb-2">
          <div class="h-(--top-spacing) shrink-0" />
          <DocsToc items={props.page.toc} />
        </div>
      </aside>
    </>
  );
}

export function DocsSidebar(props: Readonly<{ groups: readonly NavGroup[] }>) {
  const location = useRouterState({ select: (state) => state.location });
  const isActive = (href: string) => {
    const [hrefPath = "/docs", hrefHash = ""] = href.split("#");
    const pathname = location().pathname === "/" ? "/docs" : location().pathname;
    const hash = location().hash.replace(/^#/, "");

    return pathname === hrefPath && hash === hrefHash;
  };

  return (
    <nav aria-label="Documentation">
      <For each={props.groups}>
        {(group) => (
          <div class="mb-4 min-w-0">
            <h2 class="flex h-7 min-w-0 items-center px-0 font-medium text-sidebar-accent-foreground text-sm">
              {group.title}
            </h2>
            <div class="grid min-w-0 gap-0.5">
              <For each={group.items}>
                {(item) => (
                  <Link
                    aria-current={isActive(item.href) ? "page" : undefined}
                    class={cn(
                      "flex min-h-8 w-full min-w-0 items-center justify-between gap-3 rounded-md px-3.5 py-1.5 text-sm leading-tight outline-none transition-colors hover:text-sidebar-accent-foreground focus-visible:text-sidebar-accent-foreground",
                      isActive(item.href)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground",
                    )}
                    activeOptions={{ exact: true, includeHash: true }}
                    {...linkPropsForHref(item.href)}
                  >
                    <span class="truncate">{item.label}</span>
                    <Show when={item.badge}>{(badge) => <NewBadge>{badge()}</NewBadge>}</Show>
                  </Link>
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
      <div class="z-10 flex flex-col gap-1 pt-0 pr-4 pb-2 pl-6 text-sm">
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

function linkPropsForHref(href: string) {
  const [to = "/docs", hash = ""] = href.split("#");

  return {
    to: to || "/docs",
    hash: hash || undefined,
  };
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
