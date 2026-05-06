import { registryDocItems, type RegistryDocItem } from "@/lib/registry-docs.gen";

export type NavItem = {
  badge?: string;
  href: string;
  label: string;
};

export type NavGroup = {
  items: readonly NavItem[];
  title: string;
};

export type TocItem = {
  href: string;
  label: string;
};

export type DocsPage = {
  description: string;
  href: string;
  label: string;
  title: string;
  toc: readonly TocItem[];
};

const typeOrder: Record<string, number> = {
  "registry:ui": 0,
  "registry:block": 1,
  "registry:component": 2,
  "registry:hook": 3,
  "registry:lib": 4,
  "registry:store": 5,
  "registry:template": 6,
};

function compareItems(a: RegistryDocItem, b: RegistryDocItem) {
  const typeDelta = (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
  if (typeDelta !== 0) return typeDelta;
  return a.title.localeCompare(b.title);
}

export const docsItems = [...registryDocItems].sort(compareItems);
export const navigableDocs = docsItems.filter(
  (item) => item.type !== "registry:block" && item.type !== "registry:template",
);

export const componentDocs = navigableDocs.filter((item) => item.type === "registry:ui");
export const hookDocs = navigableDocs.filter((item) =>
  ["registry:component", "registry:hook", "registry:lib", "registry:store"].includes(item.type),
);

export const overviewPage: DocsPage = {
  description:
    "Solid primitives, source-owned UI components, Mason install metadata, and app-layer registry guidance.",
  href: "/docs",
  label: "Introduction",
  title: "Documentation",
  toc: [
    { label: "Get Started", href: "#get-started" },
    { label: "Components", href: "#components" },
  ],
};

export const navGroups: readonly NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Get Started", href: "/docs#get-started" },
      { label: "Install Model", href: "/docs#install-model" },
      { label: "MDX Surface", href: "/docs#mdx-surface", badge: "New" },
    ],
  },
  {
    title: "Components",
    items: componentDocs.map((item) => ({
      href: componentHref(item.name),
      label: item.title,
    })),
  },
  {
    title: "Hooks",
    items: hookDocs.map((item) => ({
      href: componentHref(item.name),
      label: item.title,
    })),
  },
];

export function componentHref(name: string) {
  return `/docs/components/${name}`;
}

export function findDocItem(name: string) {
  return docsItems.find((item) => item.name === name);
}

export function registryTypeLabel(type: string) {
  switch (type) {
    case "registry:block":
      return "Block";
    case "registry:component":
      return "Component";
    case "registry:hook":
      return "Hook";
    case "registry:lib":
      return "Library";
    case "registry:store":
      return "Store";
    case "registry:template":
      return "Template";
    case "registry:ui":
      return "UI";
    default:
      return type.replace("registry:", "");
  }
}

export function itemToc(item: RegistryDocItem): readonly TocItem[] {
  const hasUsage = item.type === "registry:ui";
  const hasExamples = item.type === "registry:ui";
  const hasAccessibility = Boolean(item.accessibility);
  const apiText = metadataText(item.api);
  const hasData =
    Boolean(item.dataAttributes) || apiText.includes("data-") || anatomyParts(item).length;

  return [
    { label: "Installation", href: "#installation" },
    { label: "Preview", href: "#preview" },
    ...(hasUsage ? [{ label: "Usage", href: "#usage" }] : []),
    ...(hasExamples ? [{ label: "Examples", href: "#examples" }] : []),
    ...(item.api ? [{ label: "API Reference", href: "#api-reference" }] : []),
    ...(hasAccessibility ? [{ label: "Accessibility", href: "#accessibility-keyboard" }] : []),
    ...(hasData ? [{ label: "Data attributes", href: "#data-attributes" }] : []),
    ...(anatomyParts(item).length ? [{ label: "Anatomy", href: "#anatomy" }] : []),
    ...(item.dependencies.length || item.registryDependencies.length || item.sourceFiles.length
      ? [{ label: "Source and registry details", href: "#source-registry-details" }]
      : []),
    ...(Object.keys(item.parity).length ? [{ label: "Parity notes", href: "#parity-notes" }] : []),
  ];
}

export function anatomyParts(item: RegistryDocItem): readonly string[] {
  if (Array.isArray(item.anatomy)) return item.anatomy;
  if (typeof item.anatomy === "string")
    return item.anatomy
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  return Object.entries(item.anatomy).flatMap(([group, parts]) =>
    (parts as readonly string[]).map((part) => `${group}.${part}`),
  );
}

function metadataText(value: RegistryDocItem["api"]) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(" ");
  if (typeof value === "string") return value;
  return Object.values(value).flat().join(" ");
}

export function itemPage(item: RegistryDocItem): DocsPage {
  return {
    description: item.description,
    href: componentHref(item.name),
    label: item.title,
    title: item.title,
    toc: itemToc(item),
  };
}
