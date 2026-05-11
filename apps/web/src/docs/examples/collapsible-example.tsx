import { ChevronDown } from "lucide-solid";
import { createSignal } from "solid-js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const tripDetails = [
  ["Departure", "Mar 18, 8:45 AM"],
  ["Gate", "B12"],
  ["Seat", "14A"],
];

export function Component() {
  const [open, setOpen] = createSignal(true);

  return (
    <Collapsible
      class="w-full max-w-sm rounded-lg border bg-card text-card-foreground shadow-xs/5"
      onOpenChange={setOpen}
      open={open()}
    >
      <div class="flex items-center justify-between gap-4 px-4 py-3">
        <div class="min-w-0">
          <h3 class="m-0 font-medium text-sm leading-5">Flight details</h3>
        </div>
        <CollapsibleTrigger
          aria-label="Toggle flight details"
          class="inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-2.5 text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 data-panel-open:[&>svg]:rotate-180"
          type="button"
        >
          Details
          <ChevronDown class="size-4 opacity-72 transition-transform duration-200" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <dl class="grid gap-2 px-4 pb-4">
          {tripDetails.map(([label, value]) => (
            <div class="flex items-center justify-between gap-4 rounded-md border bg-muted/32 px-3 py-2">
              <dt class="text-muted-foreground text-xs leading-5">{label}</dt>
              <dd class="m-0 text-right font-mono text-foreground text-xs leading-5">{value}</dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  );
}
