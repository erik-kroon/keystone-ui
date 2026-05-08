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
        class="relative hidden h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-foreground/5 px-[calc(--spacing(3)-1px)] text-foreground text-sm shadow-xs/5 outline-none transition-colors before:pointer-events-none before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-popover before:shadow-[0_1px_--theme(--color-black/4%)] before:transition-colors hover:bg-foreground/16 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background dark:before:bg-popover dark:before:shadow-[0_-1px_--theme(--color-white/6%)] sm:h-8 md:inline-flex [&>*]:relative [&>*]:z-10"
        aria-haspopup="dialog"
        aria-label="Search documentation"
        onFocus={ensureDialog}
        onPointerEnter={ensureDialog}
        onClick={openDialog}
        type="button"
      >
        <Search class="size-4.5 text-foreground/80 sm:size-4" aria-hidden="true" strokeWidth={2} />
        <span class="pointer-events-none inline-flex items-center gap-1" aria-hidden="true">
          <span class="inline-flex h-5 min-w-5 select-none items-center justify-center rounded bg-muted px-1 font-medium font-sans text-muted-foreground text-xs">
            ⌘
          </span>
          <span class="inline-flex h-5 min-w-5 select-none items-center justify-center rounded bg-muted px-1 font-medium font-sans text-muted-foreground text-xs">
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
