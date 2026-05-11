import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="search">Search</Label>
      <Input id="search" placeholder="Search components..." type="search" />
    </div>
  );
}
