import { Button } from "@/components/ui/button";

export function Component() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-3">
      <Button>Save changes</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="secondary">Cancel</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
