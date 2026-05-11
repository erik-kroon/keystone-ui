import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="email">Email</Label>
      <Input id="email" defaultValue="not-an-email" invalid type="email" />
      <p class="m-0 text-destructive text-sm">Enter a valid email address.</p>
    </div>
  );
}
