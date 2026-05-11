import { Input } from "@/components/ui/input";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-3">
      <Input aria-label="Small input" placeholder="Small" size="sm" />
      <Input aria-label="Default input" placeholder="Default" />
      <Input aria-label="Large input" placeholder="Large" size="lg" />
    </div>
  );
}
