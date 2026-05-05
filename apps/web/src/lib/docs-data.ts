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

export const componentDocs = docsItems.filter((item) => item.type === "registry:ui");
export const blockDocs = docsItems.filter((item) => item.type === "registry:block");
export const utilityDocs = docsItems.filter((item) =>
  ["registry:component", "registry:hook", "registry:lib", "registry:store"].includes(item.type),
);
export const templateDocs = docsItems.filter((item) => item.type === "registry:template");

export const overviewPage: DocsPage = {
  description:
    "Solid primitives, source-owned UI components, Mason install metadata, and app-layer registry guidance.",
  href: "/docs",
  label: "Introduction",
  title: "Documentation",
  toc: [
    { label: "Get Started", href: "#get-started" },
    { label: "Components", href: "#components" },
    { label: "Install Model", href: "#install-model" },
    { label: "MDX Surface", href: "#mdx-surface" },
    { label: "Roadmap", href: "#roadmap" },
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
    title: "Blocks",
    items: blockDocs.map((item) => ({
      href: componentHref(item.name),
      label: item.title.replace(/Block$/, ""),
    })),
  },
  {
    title: "Utilities",
    items: utilityDocs.map((item) => ({
      href: componentHref(item.name),
      label: item.title,
    })),
  },
  {
    title: "Templates",
    items: templateDocs.map((item) => ({
      href: componentHref(item.name),
      label: item.title.replace(/Template$/, ""),
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
  return [
    { label: "Installation", href: "#installation" },
    { label: "Preview", href: "#preview" },
    ...(item.api || item.dataShape || item.state
      ? [{ label: "API Notes", href: "#api-notes" }]
      : []),
    ...(item.anatomy.length ? [{ label: "Anatomy", href: "#anatomy" }] : []),
    ...(item.dependencies.length || item.registryDependencies.length
      ? [{ label: "Dependencies", href: "#dependencies" }]
      : []),
    { label: "Source Files", href: "#source-files" },
    ...(Object.keys(item.parity).length ? [{ label: "Parity Notes", href: "#parity-notes" }] : []),
  ];
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
