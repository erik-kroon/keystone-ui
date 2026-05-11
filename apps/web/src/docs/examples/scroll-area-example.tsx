import { ScrollArea } from "@/components/ui/scroll-area";

const items = [
  "Index registry metadata",
  "Validate source targets",
  "Render docs preview",
  "Check keyboard states",
  "Inspect dark mode tokens",
  "Confirm install command",
  "Run type checks",
  "Queue manual QA",
];

export function Component() {
  return (
    <ScrollArea class="h-56 w-full max-w-md rounded-lg border bg-background">
      <div class="grid gap-2 p-4">
        {items.map((item, index) => (
          <div class="rounded-md border bg-card px-3 py-2 text-sm">
            <span class="font-mono text-muted-foreground text-xs">{index + 1}.</span>{" "}
            <span class="text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
