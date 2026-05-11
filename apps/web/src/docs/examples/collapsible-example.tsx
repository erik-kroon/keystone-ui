import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function Component() {
  return (
    <Collapsible defaultOpen class="w-full max-w-md rounded-lg border bg-card p-4 shadow-xs">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="m-0 font-medium text-foreground text-sm">Registry details</h3>
          <p class="mt-1 text-muted-foreground text-sm">Inspect source-owned install metadata.</p>
        </div>
        <CollapsibleTrigger class="inline-flex h-8 items-center rounded-md border px-3 text-sm shadow-xs transition-colors hover:bg-accent">
          Toggle
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="pt-2">
        <div class="rounded-md bg-muted/60 p-3 text-muted-foreground text-sm">
          Includes files, dependencies, parity notes, and Core-backed disclosure behavior.
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
