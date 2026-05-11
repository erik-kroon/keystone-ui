import { Separator } from "@/components/ui/separator";

export function Component() {
  return (
    <div class="w-full max-w-[22rem]">
      <div class="space-y-1">
        <h4 class="font-medium text-foreground text-sm leading-none">Project Links</h4>
        <p class="text-muted-foreground text-sm">Related resources grouped in a compact row.</p>
      </div>
      <Separator class="my-4" />
      <div class="grid h-6 grid-cols-[1fr_auto_1fr_auto_1fr] items-center text-muted-foreground text-sm">
        <span class="text-center">Docs</span>
        <Separator orientation="vertical" />
        <span class="text-center">API</span>
        <Separator orientation="vertical" />
        <span class="text-center">Examples</span>
      </div>
    </div>
  );
}
