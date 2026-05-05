import { Check, ChevronDown, Clipboard, Menu, Package, X } from "lucide-solid";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";

import type { NavGroup, NavItem } from "@/lib/docs-data";

function classes(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export function PageHeader(props: JSX.HTMLAttributes<HTMLElement>) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <section {...rest} class={classes("page-header", local.class)}>
      {local.children}
    </section>
  );
}

export function PageHeaderHeading(props: JSX.HTMLAttributes<HTMLHeadingElement>) {
  const [local, rest] = splitProps(props, ["class"]);

  return <h1 {...rest} class={classes("page-header-heading", local.class)} />;
}

export function PageHeaderDescription(props: JSX.HTMLAttributes<HTMLParagraphElement>) {
  const [local, rest] = splitProps(props, ["class"]);

  return <p {...rest} class={classes("page-header-description", local.class)} />;
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
      class={classes("copy-button", props.class)}
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

export function CodeBlock(
  props: Readonly<{
    code: string;
    language: string;
    title?: string;
    copy?: boolean;
  }>,
) {
  return (
    <figure class="code-figure" data-language={props.language}>
      <Show when={props.title}>
        {(title) => (
          <figcaption class="code-caption">
            <span class="code-language">{props.language}</span>
            <span>{title()}</span>
          </figcaption>
        )}
      </Show>
      <Show when={props.copy ?? true}>
        <CopyButton value={props.code} />
      </Show>
      <pre class="code-block">
        <code>{props.code}</code>
      </pre>
    </figure>
  );
}

export function MobileNav(props: Readonly<{ groups: Array<NavGroup> }>) {
  const [open, setOpen] = createSignal(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        aria-controls="mobile-docs-navigation"
        aria-expanded={open()}
        aria-label="Open documentation navigation"
        class="mobile-nav-trigger"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu size={18} />
      </button>
      <Show when={open()}>
        <div class="mobile-nav-backdrop" onClick={close} />
        <aside
          aria-label="Documentation navigation"
          class="mobile-nav-panel"
          id="mobile-docs-navigation"
        >
          <div class="mobile-nav-header">
            <div>
              <div class="mobile-nav-kicker">Keystone UI</div>
              <div class="mobile-nav-title">Documentation</div>
            </div>
            <button
              aria-label="Close documentation navigation"
              class="icon-button"
              onClick={close}
              type="button"
            >
              <X size={18} />
            </button>
          </div>
          <nav class="mobile-nav-scroll">
            <a class="mobile-nav-link" href="/" onClick={close}>
              Home
            </a>
            <For each={props.groups}>
              {(group) => (
                <section class="mobile-nav-group">
                  <h2>{group.title}</h2>
                  <For each={group.items}>
                    {(item) => (
                      <a class="mobile-nav-link" href={item.href} onClick={close}>
                        <span>{item.label}</span>
                        <Show when={item.badge}>
                          {(badge) => <span class="new-badge">{badge()}</span>}
                        </Show>
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

export function ProductDropdown(props: Readonly<{ items: Array<NavItem> }>) {
  return (
    <details class="product-dropdown">
      <summary>
        <Package size={15} />
        Layers
        <ChevronDown size={14} />
      </summary>
      <div class="product-dropdown-menu">
        <For each={props.items}>
          {(item) => (
            <a class="product-dropdown-item" href={item.href}>
              <span>{item.label}</span>
              <Show when={item.badge}>{(badge) => <span class="new-badge">{badge()}</span>}</Show>
            </a>
          )}
        </For>
      </div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer class="site-footer">
      <div class="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          <strong class="text-foreground">Keystone UI</strong> is early Solid primitive and registry
          infrastructure.
        </p>
        <a href="#introduction">Back to top</a>
      </div>
    </footer>
  );
}
