import { Search } from "lucide-solid";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

import type { DocsCommandSearchDialog } from "@/components/docs-command-search-dialog";

type DocsCommandSearchDialogComponent = typeof DocsCommandSearchDialog;

let commandDialogPromise: Promise<DocsCommandSearchDialogComponent> | undefined;

export function DocsCommandSearch() {
  const [open, setOpen] = createSignal(false);
  const [DialogComponent, setDialogComponent] = createSignal<DocsCommandSearchDialogComponent>();

  const ensureDialog = () => {
    const current = DialogComponent();
    if (current) return;

    commandDialogPromise ??= import("@/components/docs-command-search-dialog").then(
      (module) => module.DocsCommandSearchDialog,
    );
    void commandDialogPromise.then((component) => setDialogComponent(() => component));
  };

  const openDialog = () => {
    setOpen(true);
    ensureDialog();
  };

  onMount(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open()) {
          setOpen(false);
        } else {
          openDialog();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));

    const preloadId = window.setTimeout(() => {
      ensureDialog();
    }, 0);
    onCleanup(() => window.clearTimeout(preloadId));
  });

  return (
    <>
      <button
        class="relative hidden h-9 w-fit min-w-52 cursor-text items-center justify-center rounded-full border border-border/80 bg-background px-3.5 text-foreground text-sm outline-none transition-[background-color,border-color,box-shadow] hover:border-border hover:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:h-8 md:inline-flex lg:min-w-72 dark:border-border/80 dark:bg-background/80 dark:hover:bg-background"
        aria-haspopup="dialog"
        aria-label="Search documentation"
        onFocus={ensureDialog}
        onPointerEnter={ensureDialog}
        onClick={openDialog}
        type="button"
      >
        <span class="flex min-w-0 grow items-center gap-2">
          <Search class="-ms-1 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span class="min-w-0 grow truncate text-left font-normal text-muted-foreground/70">
            Quick search...
          </span>
        </span>
        <span
          class="pointer-events-none ml-3 inline-flex shrink-0 items-center justify-center font-medium text-muted-foreground text-xs"
          aria-hidden="true"
        >
          <span class="opacity-70">⌘</span>K
        </span>
      </button>
      <Show when={open() ? DialogComponent() : undefined}>
        {(Dialog) => {
          const LoadedDialog = Dialog();
          return <LoadedDialog open={open()} onOpenChange={setOpen} />;
        }}
      </Show>
    </>
  );
}
