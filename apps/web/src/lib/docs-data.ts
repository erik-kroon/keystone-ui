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
  depth?: number;
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
const showFullDocsCatalog = import.meta.env?.DEV === true;
const sidebarComponentDocs = componentDocs.filter(
  (item) => !item.categories.includes("store") && !item.categories.includes("router"),
);
export const hookDocs = navigableDocs.filter((item) =>
  ["registry:component", "registry:hook", "registry:lib", "registry:store"].includes(item.type),
);

const componentMaturityByName: Readonly<Record<string, string>> = {
  accordion: "Stable",
  alert: "Stable",
  badge: "Stable",
  button: "Stable",
  card: "Stable",
  checkbox: "Stable",
  dialog: "Stable",
  popover: "Stable",
  select: "Stable",
  tabs: "Stable",
  toast: "Preview",
  tooltip: "Stable",
};

const maturityOrder: Readonly<Record<string, number>> = {
  preview: 0,
  beta: 1,
  experimental: 2,
  draft: 3,
  deprecated: 4,
};

export function componentMaturity(item: RegistryDocItem) {
  return componentMaturityByName[item.name] ?? "Draft";
}

function componentMaturityKey(item: RegistryDocItem) {
  return componentMaturity(item).toLowerCase();
}

function isPublicComponentDoc(item: RegistryDocItem) {
  const maturity = componentMaturityKey(item);
  return maturity === "stable" || maturity === "preview";
}

function maturityGroupTitle(maturity: string) {
  const normalized = maturity.trim().toLowerCase() || "draft";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function compareMaturityGroups(a: NavGroup, b: NavGroup) {
  const orderDelta =
    (maturityOrder[a.title.toLowerCase()] ?? 99) - (maturityOrder[b.title.toLowerCase()] ?? 99);
  if (orderDelta !== 0) return orderDelta;
  return a.title.localeCompare(b.title);
}

const stableSidebarComponentDocs = sidebarComponentDocs.filter(
  (item) => componentMaturityKey(item) === "stable",
);
const publicComponentDocs = componentDocs.filter(isPublicComponentDoc);
const sidebarMaturityGroups = Object.values(
  sidebarComponentDocs
    .filter((item) => componentMaturityKey(item) !== "stable")
    .reduce<Record<string, NavGroup>>((groups, item) => {
      const title = maturityGroupTitle(componentMaturity(item));
      return {
        ...groups,
        [title]: {
          title,
          items: [
            ...(groups[title]?.items ?? []),
            {
              href: componentHref(item.name),
              label: item.title,
            },
          ],
        },
      };
    }, {}),
).sort(compareMaturityGroups);
const visibleSidebarComponentDocs = stableSidebarComponentDocs;
const visibleSidebarMaturityGroups = sidebarMaturityGroups.filter((group) =>
  showFullDocsCatalog ? true : group.title.toLowerCase() === "preview",
);
const visibleHookDocs = showFullDocsCatalog ? hookDocs : [];
const routableDocs = showFullDocsCatalog ? docsItems : publicComponentDocs;

export const searchableComponentDocs = showFullDocsCatalog ? componentDocs : publicComponentDocs;
export const searchableHookDocs = visibleHookDocs;

export const overviewPage: DocsPage = {
  description:
    "Solid primitives, source-owned UI components, Mason install metadata, and app-layer registry guidance.",
  href: "/docs",
  label: "Introduction",
  title: "Introduction",
  toc: [
    { depth: 2, href: "#built-on-keystone-core", label: "Built on Keystone Core" },
    { depth: 2, href: "#layers", label: "Primitives, Components, and App Patterns" },
    { depth: 2, href: "#own-your-code", label: "Own Your Code" },
    { depth: 2, href: "#readable-source", label: "Readable Source by Default" },
    { depth: 2, href: "#open-development", label: "Built in the Open" },
    { depth: 2, href: "#get-involved", label: "Get Involved" },
  ],
};

export const navGroups: readonly NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Introduction", href: "/docs" }],
  },
  {
    title: "Components",
    items: visibleSidebarComponentDocs.map((item) => ({
      href: componentHref(item.name),
      label: item.title,
    })),
  },
  ...visibleSidebarMaturityGroups,
  ...(visibleHookDocs.length
    ? [
        {
          title: "Hooks",
          items: visibleHookDocs.map((item) => ({
            href: componentHref(item.name),
            label: item.title,
          })),
        },
      ]
    : []),
];

export function componentHref(name: string) {
  return `/docs/components/${name}`;
}

export function findDocItem(name: string) {
  return routableDocs.find((item) => item.name === name);
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
  const hasPreview = item.type === "registry:ui";
  const hasAccessibility = Boolean(item.accessibility);
  const apiText = metadataText(item.api);
  const hasData =
    Boolean(item.dataAttributes) || apiText.includes("data-") || anatomyParts(item).length;

  return [
    { label: "Installation", href: "#installation" },
    ...(hasPreview ? [{ label: "Preview", href: "#preview" }] : []),
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
