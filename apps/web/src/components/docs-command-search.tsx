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
        class="relative hidden h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-popover px-[calc(--spacing(3)-1px)] text-foreground text-sm shadow-xs/5 outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background dark:bg-input/32 dark:before:shadow-[0_-1px_--theme(--color-white/6%)] dark:hover:bg-input/64 sm:h-8 md:inline-flex"
        aria-haspopup="dialog"
        aria-label="Search documentation"
        onFocus={ensureDialog}
        onPointerEnter={ensureDialog}
        onClick={openDialog}
        type="button"
      >
        <Search class="size-4 text-muted-foreground/80" aria-hidden="true" />
        <span class="pointer-events-none inline-flex items-center gap-1" aria-hidden="true">
          <span class="inline-flex size-4 select-none items-center justify-center rounded bg-muted font-medium text-[0.6875rem] text-muted-foreground leading-none">
            ⌘
          </span>
          <span class="inline-flex size-4 select-none items-center justify-center rounded bg-muted font-medium text-[0.6875rem] text-muted-foreground leading-none">
            K
          </span>
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
