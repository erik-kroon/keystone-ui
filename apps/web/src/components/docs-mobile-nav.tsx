import { Link } from "@tanstack/solid-router";
import { createSignal, For, type JSX, Show } from "solid-js";
import {
  Sheet,
  SheetContent,
  SheetPanel,
  SheetTitle,
  SheetTrigger,
} from "@keystone-ui/ui/default/ui/sheet.tsx";

import type { NavGroup } from "@/lib/docs-data";

let navGroupsPromise: Promise<readonly NavGroup[]> | undefined;

const menuItems = [
  { href: "/docs", label: "Home" },
  { href: "/docs#components", label: "Components" },
  { href: "/docs#roadmap", label: "Roadmap" },
] as const;

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      class="size-5"
      fill="none"
      focusable="false"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </svg>
  );
}

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
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) ensureGroups();
  };

  return (
    <Sheet open={open()} onOpenChange={handleOpenChange} side="left">
      <SheetTrigger
        aria-label="Toggle Menu"
        class="relative -ms-1.5 inline-flex size-8 items-center justify-center rounded-lg border-0 bg-transparent text-foreground outline-none transition-colors hover:bg-transparent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background lg:hidden"
        type="button"
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        closeProps={{
          class:
            "end-6 top-8 size-8 border-0 bg-transparent text-foreground/80 shadow-none hover:bg-transparent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        }}
        backdropClass="z-60 bg-black/32 opacity-100 backdrop-blur-sm !transition-opacity !duration-[450ms] !ease-[cubic-bezier(0.32,0.72,0,1)]"
        class="border-sidebar-border bg-background shadow-2xl shadow-black/20 before:hidden !transition-[translate,box-shadow] !duration-[450ms] !ease-[cubic-bezier(0.32,0.72,0,1)] data-[side=left]:w-[calc(100%-(--spacing(12)))] data-[side=left]:max-w-md data-[side=left]:data-ending-style:-translate-x-full data-[side=left]:data-ending-style:opacity-100 data-[side=left]:data-starting-style:-translate-x-full data-[side=left]:data-starting-style:opacity-100"
        id="mobile-docs-navigation"
        positionerClass="z-70"
        showCloseButton
      >
        <SheetPanel class="scrollbar-none flex flex-col gap-12 p-6 pt-8" scrollFade={false}>
          <section class="flex flex-col gap-3">
            <SheetTitle class="font-semibold text-base leading-none">Menu</SheetTitle>
            <nav class="flex flex-col gap-1" aria-label="Primary mobile navigation">
              <For each={menuItems}>
                {(item) => (
                  <MobileNavLink href={item.href} onClick={close}>
                    {item.label}
                  </MobileNavLink>
                )}
              </For>
            </nav>
          </section>

          <nav class="flex flex-col gap-8" aria-label="Documentation navigation">
            <For each={groups()}>
              {(group) => (
                <section class="flex flex-col gap-3">
                  <h2 class="font-semibold text-foreground text-sm">{group.title}</h2>
                  <div class="flex flex-col gap-0.5">
                    <For each={group.items}>
                      {(item) => (
                        <MobileNavLink href={item.href} onClick={close}>
                          <span>{item.label}</span>
                          <Show when={item.badge}>{(badge) => <NewBadge>{badge()}</NewBadge>}</Show>
                        </MobileNavLink>
                      )}
                    </For>
                  </div>
                </section>
              )}
            </For>
          </nav>
        </SheetPanel>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavLink(
  props: Readonly<{ children: JSX.Element; href: string; onClick: () => void }>,
) {
  return (
    <Link
      class="flex min-h-9 items-center gap-2 rounded-md py-1.5 text-base text-muted-foreground leading-tight outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
      onClick={props.onClick}
      {...linkPropsForHref(props.href)}
    >
      {props.children}
    </Link>
  );
}

function linkPropsForHref(href: string) {
  const [to = "/docs", hash = ""] = href.split("#");

  return {
    to: to || "/docs",
    hash: hash || undefined,
  };
}
