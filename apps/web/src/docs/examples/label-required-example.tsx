import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="workspace">
        Workspace name
        <span class="text-destructive" aria-hidden="true">
          *
        </span>
      </Label>
      <Input id="workspace" placeholder="Acme Studio" required />
      <p class="m-0 text-muted-foreground text-sm">Shown in navigation and billing emails.</p>
    </div>
  );
}
