import { createSignal } from "solid-js";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Component() {
  const [checked, setChecked] = createSignal(false);

  return (
    <Label class="gap-3">
      <Switch checked={checked()} onCheckedChange={setChecked} name="notifications" />
      Enable notifications
    </Label>
  );
}
