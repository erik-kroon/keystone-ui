import { Breadcrumb, BreadcrumbEllipsis } from "@/components/ui/breadcrumb";

export function Component() {
  return (
    <Breadcrumb label="Project location">
      <ol class="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
        <li>
          <a class="transition-colors hover:text-foreground" href="/workspace">
            Workspace
          </a>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <BreadcrumbEllipsis />
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page" class="text-foreground">
            Registry QA
          </span>
        </li>
      </ol>
    </Breadcrumb>
  );
}
