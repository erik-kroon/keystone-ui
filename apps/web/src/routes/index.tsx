import { createFileRoute } from "@tanstack/solid-router";
import { ChevronRight, Command, Search, Sparkles } from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/")({
  component: DocsHome,
});

type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

type NavGroup = {
  title: string;
  items: Array<NavItem>;
};

const navGroups: Array<NavGroup> = [
  {
    title: "Overview",
    items: [
      { label: "Introduction", href: "#introduction" },
      { label: "Get Started", href: "#get-started" },
      { label: "Styling", href: "#styling" },
      { label: "Migrating from Radix", href: "#migrating" },
      { label: "Skills", href: "#skills", badge: "New" },
      { label: "Changelog", href: "#changelog", badge: "New" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "#accordion" },
      { label: "Alert", href: "#components" },
      { label: "Alert Dialog", href: "#components" },
      { label: "Autocomplete", href: "#components" },
      { label: "Avatar", href: "#components" },
      { label: "Badge", href: "#components" },
      { label: "Breadcrumb", href: "#components" },
      { label: "Button", href: "#components" },
      { label: "Calendar", href: "#components" },
      { label: "Card", href: "#components" },
      { label: "Checkbox", href: "#components" },
      { label: "Collapsible", href: "#components" },
      { label: "Combobox", href: "#components" },
      { label: "Dialog", href: "#components" },
      { label: "Field", href: "#components" },
      { label: "Form", href: "#components" },
      { label: "Input", href: "#components" },
      { label: "Menu", href: "#components" },
      { label: "Popover", href: "#components" },
      { label: "Select", href: "#components" },
      { label: "Sheet", href: "#components" },
      { label: "Tabs", href: "#components" },
      { label: "Toast", href: "#components" },
      { label: "Tooltip", href: "#components" },
    ],
  },
  {
    title: "Hooks",
    items: [
      { label: "useControllableState", href: "#hooks" },
      { label: "useCopyToClipboard", href: "#hooks" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Registry contract", href: "#registry" },
      { label: "Primitive contracts", href: "#contracts" },
    ],
  },
];

const tocItems = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Core and UI Layers", href: "#core-ui-layers" },
  { label: "Styling Model", href: "#styling" },
  { label: "Component Inventory", href: "#components" },
  { label: "Registry Ownership", href: "#registry" },
  { label: "Roadmap", href: "#roadmap" },
];

const componentRows = [
  ["Accordion", "Available", "Core primitive plus editable UI source."],
  ["Dialog", "Available", "Focus, dismissal, portals, and overlay layering."],
  ["Select", "In progress", "Collection, popup field, keyboard navigation, and typeahead."],
  ["Data Table", "UI layer", "TanStack Table source for dense app workspaces."],
  ["TanStack Form Field", "UI layer", "Solid form integration without leaking into Core."],
];

function DocsHome() {
  return (
    <main class="min-h-0 bg-background text-foreground">
      <div class="mx-auto grid min-h-[calc(100svh-57px)] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)] xl:grid-cols-[264px_minmax(0,1fr)_240px]">
        <aside class="hidden border-r border-border/80 lg:block">
          <div class="sticky top-[57px] h-[calc(100svh-57px)] overflow-y-auto px-6 py-8">
            <DocsSidebar />
          </div>
        </aside>

        <article class="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <MobileNavigation />

          <div class="mx-auto max-w-[760px]">
            <section id="introduction" class="scroll-mt-24 border-b border-border pb-12">
              <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-[0.78rem] font-medium text-muted-foreground">
                <Sparkles size={14} />
                Keystone UI documentation shell
              </div>
              <h1 class="max-w-[12ch] text-4xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-5xl">
                Solid primitives and source-owned UI.
              </h1>
              <p class="mt-5 max-w-2xl text-[1.05rem] leading-7 text-muted-foreground">
                Keystone UI is a headless Core primitive layer and a copy-paste UI source registry
                for Solid applications. The docs layout mirrors the dense, three-column reference
                pattern used by coss ui while keeping Keystone's Core/UI boundaries explicit.
              </p>
              <div class="mt-8 flex flex-wrap items-center gap-3">
                <a class="ks-button ks-button-primary" href="#get-started">
                  Get Started
                  <ChevronRight size={16} />
                </a>
                <a class="ks-button ks-button-secondary" href="#components">
                  Browse Components
                </a>
              </div>
            </section>

            <section id="how-it-works" class="docs-section">
              <h2>How It Works</h2>
              <p>
                Core owns intrinsic primitive behavior: accessibility, keyboard interaction,
                controlled and uncontrolled state, stable data attributes, and overlay mechanics. UI
                owns styled Solid source that users install, read, and edit inside their app.
              </p>
              <div class="not-prose mt-6 grid gap-3 sm:grid-cols-2">
                <InfoPanel title="Core" value="unstyled behavior" />
                <InfoPanel title="UI" value="copy-paste Solid source" />
              </div>
            </section>

            <section id="get-started" class="docs-section">
              <h2>Get Started</h2>
              <p>
                Install from the Mason registry when you want owned source. Import directly from
                Core when you need primitive behavior without Keystone's styled app layer.
              </p>
              <pre class="code-block">
                <code>{`bunx mason add button dialog select-field
bun add @keystone-ui/core`}</code>
              </pre>
            </section>

            <section id="core-ui-layers" class="docs-section">
              <h2>Core and UI Layers</h2>
              <p>
                Core must remain independent from TanStack app libraries. UI can use TanStack Form,
                Table, Store, Router, and Hotkeys where they create better app-level source.
              </p>
            </section>

            <section id="styling" class="docs-section">
              <h2>Styling</h2>
              <p>
                This web app uses Tailwind v4 with tokenized CSS variables for the docs shell. Core
                primitives stay styling-agnostic and expose stable <code>data-scope</code> and{" "}
                <code>data-part</code> attributes for user-owned styling.
              </p>
            </section>

            <section id="migrating" class="docs-section">
              <h2>Migrating from Radix</h2>
              <p>
                Keystone is Solid-native and behavior-first. Migration docs should map common Radix
                mental models to Core primitive anatomy, event composition, and UI registry source.
              </p>
            </section>

            <section id="components" class="docs-section">
              <h2>Component Inventory</h2>
              <p>
                Build depth before breadth: kernel utilities, overlays, fields/forms, and
                select/combobox come before a broad styled component catalog.
              </p>
              <div class="not-prose mt-6 overflow-hidden rounded-lg border border-border">
                <For each={componentRows}>
                  {(row) => (
                    <div class="grid gap-2 border-b border-border px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[150px_120px_1fr]">
                      <strong>{row[0]}</strong>
                      <span class="text-muted-foreground">{row[1]}</span>
                      <span class="text-muted-foreground">{row[2]}</span>
                    </div>
                  )}
                </For>
              </div>
            </section>

            <section id="accordion" class="docs-section">
              <h2>Accordion</h2>
              <p>
                Accordion is the model for the component page frame: overview, install command,
                anatomy, controlled state, keyboard behavior, styling contract, and parity notes.
              </p>
            </section>

            <section id="skills" class="docs-section">
              <h2>Skills</h2>
              <p>
                Agent-facing docs should stay close to implementation contracts: registry shape,
                primitive metadata, parity references, and active milestone constraints.
              </p>
            </section>

            <section id="registry" class="docs-section">
              <h2>Registry Ownership</h2>
              <p>
                UI source installed by Mason should be readable, local, and replaceable. Registry
                items carry dependencies, target paths, metadata, and parity notes.
              </p>
            </section>

            <section id="contracts" class="docs-section">
              <h2>Primitive Contracts</h2>
              <p>
                Contract pages document parts, ARIA relationships, data attributes, CSS variables,
                SSR notes, and accessibility expectations before listing props.
              </p>
            </section>

            <section id="changelog" class="docs-section">
              <h2>Changelog</h2>
              <p>
                The changelog should focus on source changes users need to copy forward: component
                anatomy, behavior contracts, dependencies, and migration notes.
              </p>
            </section>

            <section id="roadmap" class="docs-section border-b-0 pb-4">
              <h2>Roadmap</h2>
              <p>
                The 0.1 spine prioritizes durable primitive depth, registry correctness, and a small
                set of data-dense UI examples over catalog breadth.
              </p>
            </section>
          </div>
        </article>

        <aside class="hidden border-l border-border/80 xl:block">
          <div class="sticky top-[57px] h-[calc(100svh-57px)] overflow-y-auto px-6 py-8">
            <div class="mb-3 text-sm font-semibold">On This Page</div>
            <nav aria-label="On this page">
              <For each={tocItems}>
                {(item) => (
                  <a class="toc-link" href={item.href}>
                    {item.label}
                  </a>
                )}
              </For>
            </nav>
          </div>
        </aside>
      </div>
    </main>
  );
}

function DocsSidebar() {
  return (
    <nav aria-label="Documentation">
      <For each={navGroups}>
        {(group) => (
          <div class="mb-8">
            <h2 class="mb-2 text-sm font-semibold tracking-normal text-foreground">
              {group.title}
            </h2>
            <div class="grid gap-0.5">
              <For each={group.items}>
                {(item) => (
                  <a class="sidebar-link" href={item.href}>
                    <span class="truncate">{item.label}</span>
                    {item.badge ? <span class="new-badge">{item.badge}</span> : null}
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

function MobileNavigation() {
  return (
    <div class="mb-8 rounded-lg border border-border bg-card p-3 lg:hidden">
      <div class="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Search size={15} />
        Docs Navigation
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <For each={navGroups[0].items.concat(navGroups[1].items.slice(0, 8))}>
          {(item) => (
            <a class="mobile-pill" href={item.href}>
              {item.label}
            </a>
          )}
        </For>
      </div>
    </div>
  );
}

function InfoPanel(props: Readonly<{ title: string; value: string }>) {
  return (
    <div class="rounded-lg border border-border bg-card p-4">
      <div class="mb-3 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted">
        <Command size={16} />
      </div>
      <h3 class="text-base font-semibold">{props.title}</h3>
      <p class="mb-0 mt-1 text-sm text-muted-foreground">{props.value}</p>
    </div>
  );
}
