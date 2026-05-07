import { Link } from "@tanstack/solid-router";
import { DocsCommandSearch } from "@/components/docs-command-search";
import { DocsMobileNav } from "@/components/docs-mobile-nav";

function KeystoneLogoMark() {
  return (
    <svg aria-hidden="true" class="size-5.5 fill-current" focusable="false" viewBox="9 11 46 42">
      <path
        d="M12 14h40L41 50H23L12 14z"
        transform="translate(32 32) scale(1.12) translate(-32 -32)"
      />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" class="size-4 fill-current" focusable="false" viewBox="0 0 24 24">
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2.15c-3.21.7-3.89-1.36-3.89-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.75.41-1.26.74-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18A10.9 10.9 0 0 1 12 5.97c.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.07.79 2.16v3.15c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function Header() {
  return (
    <header class="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/64">
      <div class="relative mx-auto flex h-(--header-height) w-full max-w-[1416px] items-center justify-between gap-2 px-4 lg:px-6">
        <div class="flex min-w-0 items-center gap-2">
          <DocsMobileNav />
          <Link to="/docs" class="flex min-w-0 items-center gap-2.5" aria-label="Keystone UI home">
            <span class="flex size-6 shrink-0 items-center justify-center text-white">
              <KeystoneLogoMark />
            </span>
            <span class="min-w-0 truncate font-semibold text-[1.2rem] leading-5">Keystone UI</span>
          </Link>
        </div>

        <nav
          class="pointer-events-none absolute inset-x-0 hidden items-center justify-center gap-7 text-muted-foreground text-sm md:flex"
          aria-label="Primary"
        >
          <Link
            class="pointer-events-auto rounded-md px-2 py-1 outline-none transition-colors hover:text-accent-foreground focus-visible:text-accent-foreground"
            to="/docs"
            hash="components"
          >
            Components
          </Link>
          <Link
            class="pointer-events-auto rounded-md px-2 py-1 outline-none transition-colors hover:text-accent-foreground focus-visible:text-accent-foreground"
            to="/docs"
            hash="roadmap"
          >
            Roadmap
          </Link>
        </nav>

        <nav class="flex items-center text-sm text-muted-foreground" aria-label="Actions">
          <DocsCommandSearch />
          <span
            aria-hidden="true"
            class="mx-3.5 hidden h-5 w-px shrink-0 bg-border md:block dark:bg-border/90"
          />
          <a
            class="hidden size-5 items-center justify-center rounded-md outline-none transition-colors hover:text-accent-foreground focus-visible:text-accent-foreground sm:flex"
            href="https://github.com/erik-kroon/keystone-ui"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub repository"
          >
            <GitHubMark />
          </a>
        </nav>
      </div>
    </header>
  );
}
