import { Link } from "@tanstack/solid-router";
import { Code2, Layers, Moon, Sun } from "lucide-solid";
import { createSignal, Show } from "solid-js";

import { DocsCommandSearch } from "@/components/docs-command-search";
import { MobileNav, ProductDropdown } from "@/components/docs-shell";
import { navGroups } from "@/lib/docs-data";

export default function Header() {
  const [dark, setDark] = createSignal(true);

  const toggleTheme = () => {
    const nextDark = !dark();
    document.documentElement.classList.toggle("dark", nextDark);
    setDark(nextDark);
  };

  return (
    <header class="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/64">
      <div class="relative mx-auto flex h-(--header-height) w-full max-w-[1416px] items-center justify-between gap-2 px-4 lg:px-6">
        <div class="flex min-w-0 items-center gap-2">
          <MobileNav groups={navGroups} />
          <Link to="/docs" class="flex min-w-0 items-center gap-2.5" aria-label="Keystone UI home">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input bg-popover shadow-xs/5">
              <Layers size={17} stroke-width={2.1} />
            </span>
            <span class="min-w-0">
              <span class="block truncate text-sm font-semibold leading-4">Keystone UI</span>
              <span class="hidden truncate text-xs leading-4 text-muted-foreground sm:block">
                Solid primitives and source registry
              </span>
            </span>
          </Link>
        </div>

        <DocsCommandSearch />

        <nav class="flex items-center gap-5 text-sm text-muted-foreground" aria-label="Primary">
          <ProductDropdown
            items={[
              { label: "Core primitives", href: "/docs#core-ui-layers" },
              { label: "UI registry", href: "/docs/components/button" },
              { label: "Mason CLI", href: "/docs#get-started", badge: "0.1" },
            ]}
          />
          <a
            class="hidden rounded-md px-2 py-1 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground sm:inline"
            href="/docs#components"
          >
            Components
          </a>
          <a
            class="hidden rounded-md px-2 py-1 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground sm:inline"
            href="/docs#roadmap"
          >
            Roadmap
          </a>
          <a
            class="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-popover shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24"
            href="https://github.com/erik-kroon/keystone-ui"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub repository"
          >
            <Code2 size={16} />
          </a>
          <button
            aria-label={dark() ? "Use light mode" : "Use dark mode"}
            class="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-popover text-foreground shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24"
            onClick={toggleTheme}
            type="button"
          >
            <Show when={dark()} fallback={<Moon size={16} />}>
              <Sun size={16} />
            </Show>
          </button>
        </nav>
      </div>
    </header>
  );
}
