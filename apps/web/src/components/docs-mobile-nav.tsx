import { Menu, X } from "lucide-solid";
import { Link } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";

import type { NavGroup } from "@/lib/docs-data";

let navGroupsPromise: Promise<readonly NavGroup[]> | undefined;

function NewBadge(props: Readonly<{ children: string }>) {
  return (
    <span class="inline-flex shrink-0 rounded-md bg-info/10 px-1.5 py-0.5 text-[0.68rem] font-medium leading-none text-info-foreground">
      {props.children}
    </span>
  );
}

export function DocsMobileNav() {
  const [open, setOpen] = createSignal(false);
  const [groups, setGroups] = createSignal<readonly NavGroup[]>([]);
  const close = () => setOpen(false);
  const ensureGroups = () => {
    if (groups().length > 0) return;

    navGroupsPromise ??= import("@/lib/docs-data").then((module) => module.navGroups);
    void navGroupsPromise.then(setGroups);
  };
  const openMenu = () => {
    setOpen(true);
    ensureGroups();
  };

  return (
    <>
      <button
        aria-controls="mobile-docs-navigation"
        aria-expanded={open()}
        aria-label="Open documentation navigation"
        class="inline-flex size-9 items-center justify-center rounded-md border border-input bg-popover text-foreground shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 lg:hidden"
        onClick={openMenu}
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
            <For each={groups()}>
              {(group) => (
                <section class="mt-6 first:mt-0">
                  <h2 class="mb-2 font-semibold text-foreground text-xs">{group.title}</h2>
                  <For each={group.items}>
                    {(item) => (
                      <Link
                        class="flex min-h-9 items-center justify-between gap-3 rounded-md px-3.5 py-1.5 text-sidebar-foreground text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground"
                        onClick={close}
                        {...linkPropsForHref(item.href)}
                      >
                        <span>{item.label}</span>
                        <Show when={item.badge}>{(badge) => <NewBadge>{badge()}</NewBadge>}</Show>
                      </Link>
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

function linkPropsForHref(href: string) {
  const [to = "/docs", hash = ""] = href.split("#");

  return {
    to: to || "/docs",
    hash: hash || undefined,
  };
}
