import { createSignal } from "solid-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function Component() {
  const [checked, setChecked] = createSignal(true);

  return (
    <Label class="gap-3">
      <Checkbox checked={checked()} onCheckedChange={setChecked} />
      Enable weekly digest
    </Label>
  );
}
