import { Link } from "@tanstack/solid-router";
import { Code2, Command, Layers, Search } from "lucide-solid";

export default function Header() {
  return (
    <header class="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div class="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" class="flex min-w-0 items-center gap-2.5" aria-label="Keystone UI home">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
            <Layers size={17} stroke-width={2.1} />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold leading-4">Keystone UI</span>
            <span class="hidden truncate text-xs leading-4 text-muted-foreground sm:block">
              Solid primitives and source registry
            </span>
          </span>
        </Link>

        <button
          class="hidden h-9 min-w-[260px] items-center justify-between rounded-md border border-border bg-card px-3 text-sm text-muted-foreground shadow-xs md:flex"
          type="button"
        >
          <span class="flex items-center gap-2">
            <Search size={15} />
            Search docs
          </span>
          <span class="flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.68rem]">
            <Command size={11} />K
          </span>
        </button>

        <nav class="flex items-center gap-5 text-sm text-muted-foreground" aria-label="Primary">
          <a class="hidden hover:text-foreground sm:inline" href="#components">
            Components
          </a>
          <a class="hidden hover:text-foreground sm:inline" href="#roadmap">
            Roadmap
          </a>
          <a
            class="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card hover:text-foreground"
            href="https://github.com/erik-kroon/core-ui"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub repository"
          >
            <Code2 size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
