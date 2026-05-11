import { Breadcrumb } from "@/components/ui/breadcrumb";

export function Component() {
  return (
    <Breadcrumb
      items={[
        { href: "/docs/introduction", label: "Docs" },
        { href: "/docs/components", label: "Components" },
        { label: "Breadcrumb", current: true },
      ]}
    />
  );
}
