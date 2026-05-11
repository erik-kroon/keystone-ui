import { Kbd, KbdGroup, KbdSeparator } from "@/components/ui/kbd";

export function Component() {
  return (
    <div class="grid gap-4 text-sm">
      <div class="flex items-center justify-between gap-6 rounded-lg border bg-background px-4 py-3">
        <span class="font-medium text-foreground">Open command menu</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <KbdSeparator />
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div class="flex items-center justify-between gap-6 rounded-lg border bg-background px-4 py-3">
        <span class="font-medium text-foreground">Search current table</span>
        <KbdGroup>
          <Kbd variant="outline">Shift</Kbd>
          <KbdSeparator />
          <Kbd variant="outline">F</Kbd>
        </KbdGroup>
      </div>
    </div>
  );
}
