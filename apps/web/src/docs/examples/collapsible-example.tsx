import { ChevronDown } from "lucide-solid";
import { createSignal } from "solid-js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const releaseChecks = [
  ["Source files", "packages/ui/src/components/collapsible.tsx"],
  ["Registry item", "registry/default/items/collapsible.json"],
  ["Parity notes", "Base UI and Kobalte coverage documented"],
];

export function Component() {
  const [open, setOpen] = createSignal(true);

  return (
    <Collapsible
      class="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-xs/5"
      onOpenChange={setOpen}
      open={open()}
    >
      <div class="flex items-start justify-between gap-4 border-b px-4 py-3">
        <div class="min-w-0">
          <h3 class="m-0 font-medium text-sm leading-5">Release checklist</h3>
          <p class="mt-0.5 text-muted-foreground text-sm leading-5">
            {open() ? `${releaseChecks.length} install details visible` : "Install details hidden"}
          </p>
        </div>
        <CollapsibleTrigger
          aria-label="Toggle release checklist"
          class="inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-2.5 text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 data-panel-open:[&>svg]:rotate-180"
          type="button"
        >
          Details
          <ChevronDown class="size-4 opacity-72 transition-transform duration-200" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <dl class="grid gap-2 px-4 py-3">
          {releaseChecks.map(([label, value]) => (
            <div class="grid gap-1 rounded-md border bg-muted/32 px-3 py-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-3">
              <dt class="text-muted-foreground text-xs leading-5">{label}</dt>
              <dd class="m-0 min-w-0 break-words font-mono text-foreground text-xs leading-5">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  );
}
