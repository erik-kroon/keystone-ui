import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Component() {
  return (
    <div class="grid w-full max-w-md gap-3 rounded-lg border border-border bg-card p-4">
      <Label class="flex items-start justify-between gap-4">
        <div class="grid gap-1">
          <span class="leading-5">Background sync</span>
          <p class="m-0 text-muted-foreground text-sm">
            Keep workspace data fresh while the app is open.
          </p>
        </div>
        <Switch defaultChecked name="background-sync" />
      </Label>
    </div>
  );
}
