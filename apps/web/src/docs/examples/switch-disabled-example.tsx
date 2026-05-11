import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Component() {
  return (
    <div class="grid gap-3">
      <Label class="gap-3">
        <Switch defaultChecked disabled name="email-digest" />
        Email digest
      </Label>
      <Label class="gap-3 text-muted-foreground">
        <Switch disabled name="desktop-alerts" />
        Desktop alerts
      </Label>
    </div>
  );
}
