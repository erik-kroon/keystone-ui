import { Badge } from "@/components/ui/badge";

export function Component() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-2.5 p-1">
      <Badge size="sm" variant="outline">
        Small
      </Badge>
      <Badge variant="outline">Default</Badge>
      <Badge size="lg" variant="outline">
        Large
      </Badge>
    </div>
  );
}
