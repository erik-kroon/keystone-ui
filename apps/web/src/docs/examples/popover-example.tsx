import { createSignal } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export function Component() {
  const [open, setOpen] = createSignal(false);

  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger
        class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-3 text-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
        type="button"
      >
        Open Popover
      </PopoverTrigger>
      <PopoverContent class="w-[18rem] sm:w-[20rem]">
        <PopoverHeader>
          <PopoverTitle>Send us feedback</PopoverTitle>
          <PopoverDescription>Let us know how we can improve.</PopoverDescription>
        </PopoverHeader>
        <Textarea
          aria-label="Feedback"
          class="min-h-20 resize-none"
          placeholder="How can we improve?"
          size="lg"
        />
        <PopoverFooter>
          <Button class="w-full" onClick={() => setOpen(false)} type="button">
            Send feedback
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
