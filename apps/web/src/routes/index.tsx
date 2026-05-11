import { Link, createFileRoute, useNavigate } from "@tanstack/solid-router";
import { ArrowRight } from "lucide-solid";
import { onCleanup, onMount } from "solid-js";

import { KeystoneLogoMark } from "@/components/header";
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
                unstyled, accessible primitives / beautiful, performant components
              </p>
              <h1 class="m-0 max-w-3xl font-heading text-4xl leading-[1.05] font-semibold text-foreground tracking-normal sm:text-5xl lg:text-6xl">
                Minimal interface systems for Solid applications
              </h1>
            </div>

            <p class="m-0 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 [text-wrap:pretty]">
              Keystone pairs headless accessible primitives with a quiet, copy-paste component layer
              for production-grade, data-dense product-work.
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
        <Link to="/" class="flex mt-8 items-center justify-center" aria-label="Keystone UI home">
          <span class="flex size-7.5 shrink-0 items-center justify-center text-white">
            <KeystoneLogoMark size="xl" />
          </span>
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
      if (isImporting || isDisposed || tree != null || !host || !mediaQuery.matches) return;

      isImporting = true;
      const { FileTree } = await import("@pierre/trees").finally(() => {
        isImporting = false;
      });

      if (isDisposed || tree != null || !host || !mediaQuery.matches) return;

      tree = new FileTree({
        density: "compact",
        flattenEmptyDirectories: true,
        icons: {
          colored: false,
          set: "minimal",
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
            --trees-bg-override: #111111;
            --trees-bg-muted-override: #191919;
            --trees-border-color-override: transparent;
            --trees-fg-override: #f4f4f5;
            --trees-fg-muted-override: #a1a1aa;
            --trees-file-icon-color: #71717a;
            --trees-indent-guide-bg-override: #27272a;
            --trees-scrollbar-thumb-override: #52525b;
            --trees-selected-bg-override: #27272a;
            --trees-selected-fg-override: #fafafa;
            background: #111111;
            color: #f4f4f5;
            color-scheme: dark;
            font-family:
              "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", monospace;
            font-size: 0.75rem;
          }

          [data-file-tree-virtualized-root='true'],
          [data-file-tree-virtualized-scroll='true'],
          [data-file-tree-virtualized-list='true'] {
            background: #111111;
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
      class="h-[36rem] w-full overflow-hidden [--trees-bg-override:#111111] [--trees-border-color-override:transparent] [--trees-fg-override:#f4f4f5]"
    />
  );
}
