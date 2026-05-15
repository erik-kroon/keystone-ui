import { Link, createFileRoute, useNavigate } from "@tanstack/solid-router";
import { ArrowRight } from "lucide-solid";
import { onCleanup, onMount } from "solid-js";

import { KeystoneLogo } from "@/components/header";
import { landingFileTreeItems } from "@/lib/landing-file-tree.gen";
import { buttonClass } from "@keystone-ui/ui/button";

import { seo } from "@/lib/utils";

export const Route = createFileRoute("/")({
  ssr: true,
  component: HomeRoute,
  head: () => ({
    meta: [
      ...seo({
        title: "Keystone UI",
        description:
          "Headless Solid primitives and source-owned UI components for precise product interfaces.",
      }),
    ],
  }),
});

const landingFileTreeMediaQuery = "(min-width: 1024px)";
const treePaths = landingFileTreeItems.map((item) => item.path);
const solidTsxFileIconSpriteSheet = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0" style="position: absolute; width: 0; height: 0; overflow: hidden">
  <symbol id="keystone-file-icon-solid" viewBox="0 0 166 155.3">
    <defs>
      <linearGradient id="keystone-file-icon-solid-a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5">
        <stop offset=".1" stop-color="#76b3e1" />
        <stop offset=".3" stop-color="#dcf2fd" />
        <stop offset="1" stop-color="#76b3e1" />
      </linearGradient>
      <linearGradient id="keystone-file-icon-solid-b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2">
        <stop offset="0" stop-color="#76b3e1" />
        <stop offset=".5" stop-color="#4377bb" />
        <stop offset="1" stop-color="#1f3b77" />
      </linearGradient>
      <linearGradient id="keystone-file-icon-solid-c" gradientUnits="userSpaceOnUse" x1="18.4" y1="64.2" x2="144.3" y2="149.8">
        <stop offset="0" stop-color="#315aa9" />
        <stop offset=".5" stop-color="#518ac8" />
        <stop offset="1" stop-color="#315aa9" />
      </linearGradient>
      <linearGradient id="keystone-file-icon-solid-d" gradientUnits="userSpaceOnUse" x1="75.2" y1="74.5" x2="24.4" y2="260.8">
        <stop offset="0" stop-color="#4377bb" />
        <stop offset=".5" stop-color="#1a336b" />
        <stop offset="1" stop-color="#1a336b" />
      </linearGradient>
    </defs>
    <path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" fill="#76b3e1" />
    <path d="M163 35S110-4 69 5l-3 1c-6 2-11 5-14 9l-2 3-15 26 26 5c11 7 25 10 38 7l46 9 18-30z" opacity=".3" fill="url(#keystone-file-icon-solid-a)" />
    <path d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" fill="#518ac8" />
    <path d="M52 35l-4 1c-17 5-22 21-13 35 10 13 31 20 48 15l62-21S92 26 52 35z" opacity=".3" fill="url(#keystone-file-icon-solid-b)" />
    <path d="M134 80a45 45 0 00-48-15L24 85 4 120l112 19 20-36c4-7 3-15-2-23z" fill="url(#keystone-file-icon-solid-c)" />
    <path d="M114 115a45 45 0 00-48-15L4 120s53 40 94 30l3-1c17-5 23-21 13-34z" fill="url(#keystone-file-icon-solid-d)" />
  </symbol>
</svg>`;

const componentDocPathByTreePath = new Map(
  landingFileTreeItems.map((item) => [item.path, item.href] as const),
);

function HomeRoute() {
  return (
    <main class="relative flex flex-1 flex-col">
      <LandingHeader />
      <section class="relative flex min-h-[calc(100svh-var(--header-height))] items-start">
        <div class="mx-auto grid w-full max-w-[1350px] gap-2 px-4 pt-12 pb-10 md:pr-8 md:pl-12 md:pt-16 md:pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(14.5rem,17.5rem)] lg:items-start lg:gap-12 lg:pr-16 lg:pl-24 lg:pt-20 lg:pb-16 xl:pr-24 xl:pl-36 xl:pt-24">
          <div class="flex max-w-3xl flex-col items-start justify-center gap-6">
            <div class="flex flex-col gap-3">
              <p class="m-0 mt-1 font-mono text-xs leading-5 text-muted-foreground">
                unstyled, accessible primitives / beautiful, performant
                components
              </p>
              <h1 class="m-0 max-w-3xl font-heading text-4xl leading-[1.05] font-semibold text-foreground tracking-normal sm:text-5xl lg:text-6xl">
                Minimal interface system for Solid applications
              </h1>
            </div>

            <p class="m-0 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 [text-wrap:pretty]">
              Keystone pairs headless accessible primitives with a quiet,
              copy-paste component layer for production-grade, data-dense
              product-work.
            </p>

            <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link
                to="/docs/introduction"
                class={buttonClass({
                  size: "lg",
                  class: "w-full sm:w-auto",
                })}
              >
                Read the docs
                <ArrowRight />
              </Link>
              <Link
                to="/docs/components"
                class={buttonClass({
                  variant: "outline",
                  size: "lg",
                  class: "w-full sm:w-auto",
                })}
              >
                Browse components
              </Link>
            </div>
          </div>

          <div class="relative hidden min-w-0 items-start lg:flex lg:justify-end">
            <div class="relative w-full max-w-[17.5rem]">
              <KeystoneFileTree />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LandingHeader() {
  return (
    <header class="relative z-40 w-full">
      <div class="mx-auto flex h-(--header-height) w-full max-w-[1350px] items-center justify-between px-4 md:pr-8 md:pl-12 lg:pr-16 lg:pl-24 xl:pr-24 xl:pl-36">
        <Link
          to="/"
          class="flex mt-8 items-center justify-center"
          aria-label="Keystone UI home"
        >
          <KeystoneLogo class="size-7.5" size="xl" />
        </Link>
      </div>
    </header>
  );
}

function KeystoneFileTree() {
  const navigate = useNavigate();
  let host: HTMLDivElement | undefined;

  onMount(() => {
    if (!host) return;

    let tree: { cleanUp: () => void } | undefined;
    let isImporting = false;
    let isDisposed = false;
    const mediaQuery = window.matchMedia(landingFileTreeMediaQuery);

    const cleanUpTree = () => {
      tree?.cleanUp();
      tree = undefined;
    };

    const renderTree = async () => {
      if (
        isImporting ||
        isDisposed ||
        tree != null ||
        !host ||
        !mediaQuery.matches
      )
        return;

      isImporting = true;
      const { FileTree } = await import("@pierre/trees").finally(() => {
        isImporting = false;
      });

      if (isDisposed || tree != null || !host || !mediaQuery.matches) return;

      tree = new FileTree({
        density: "compact",
        flattenEmptyDirectories: true,
        icons: {
          byFileExtension: {
            tsx: {
              height: 13,
              name: "keystone-file-icon-solid",
              viewBox: "0 0 166 155.3",
              width: 14,
            },
          },
          colored: false,
          set: "minimal",
          spriteSheet: solidTsxFileIconSpriteSheet,
        },
        initialExpandedPaths: ["packages/", "packages/ui/src/components/"],
        onSelectionChange: (selectedPaths) => {
          const selectedPath = selectedPaths.at(-1);
          if (selectedPath == null) return;

          const to = componentDocPathByTreePath.get(selectedPath);
          if (to == null) return;

          void navigate({ to });
        },
        paths: treePaths,
        unsafeCSS: `
          :host {
            --trees-bg-override: var(--sidebar);
            --trees-bg-muted-override: var(--muted);
            --trees-border-color-override: transparent;
            --trees-fg-override: var(--foreground);
            --trees-fg-muted-override: var(--muted-foreground);
            --trees-file-icon-color: var(--muted-foreground);
            --trees-indent-guide-bg-override: var(--border);
            --trees-scrollbar-thumb-override: var(--scrollbar-thumb);
            --trees-selected-bg-override: var(--accent);
            --trees-selected-fg-override: var(--accent-foreground);
            background: var(--trees-bg-override);
            color: var(--trees-fg-override);
            color-scheme: light dark;
            font-family:
              "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", monospace;
            font-size: 0.75rem;
          }

          [data-file-tree-virtualized-root='true'],
          [data-file-tree-virtualized-scroll='true'],
          [data-file-tree-virtualized-list='true'] {
            background: var(--trees-bg-override);
          }

          [data-file-tree-virtualized-scroll='true'] {
            scrollbar-width: none;
          }

          [data-file-tree-virtualized-scroll='true']::-webkit-scrollbar {
            display: none;
          }

          button[data-type='item'] {
            border-radius: 0.375rem;
          }

          svg:has(use[href='#keystone-file-icon-solid']) {
            opacity: 0.82;
            filter: saturate(0.58);
          }
        `,
      });

      tree.render({ fileTreeContainer: host });
    };

    const syncTreeWithViewport = () => {
      if (mediaQuery.matches) {
        void renderTree();
        return;
      }

      cleanUpTree();
    };

    syncTreeWithViewport();
    mediaQuery.addEventListener("change", syncTreeWithViewport);

    onCleanup(() => {
      isDisposed = true;
      mediaQuery.removeEventListener("change", syncTreeWithViewport);
      cleanUpTree();
    });
  });

  return (
    <div
      ref={(element) => {
        host = element;
      }}
      aria-label="Keystone UI package file tree"
      class="h-[36rem] w-full overflow-hidden [--trees-bg-muted-override:var(--muted)] [--trees-bg-override:var(--sidebar)] [--trees-border-color-override:transparent] [--trees-fg-muted-override:var(--muted-foreground)] [--trees-fg-override:var(--foreground)] [--trees-file-icon-color:var(--muted-foreground)] [--trees-indent-guide-bg-override:var(--border)] [--trees-scrollbar-thumb-override:var(--scrollbar-thumb)] [--trees-selected-bg-override:var(--accent)] [--trees-selected-fg-override:var(--accent-foreground)]"
    />
  );
}
