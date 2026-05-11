import { Badge } from "@/components/ui/badge";

export function Component() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-2.5 p-1">
      <Badge>Default</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  );
}
