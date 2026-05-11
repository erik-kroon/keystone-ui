import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Component() {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger
          class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-3 text-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
          type="button"
        >
          Hover or focus
        </TooltipTrigger>
        <TooltipContent>Tooltip content follows the trigger.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
