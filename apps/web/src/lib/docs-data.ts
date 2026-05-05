export type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: Array<NavItem>;
};

export const navGroups: Array<NavGroup> = [
  {
    title: "Overview",
    items: [
      { label: "Introduction", href: "#introduction" },
      { label: "Get Started", href: "#get-started" },
      { label: "Styling", href: "#styling" },
      { label: "Migrating from Radix", href: "#migrating" },
      { label: "Skills", href: "#skills", badge: "New" },
      { label: "Changelog", href: "#changelog", badge: "New" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "#accordion" },
      { label: "Alert", href: "#components" },
      { label: "Alert Dialog", href: "#components" },
      { label: "Autocomplete", href: "#components" },
      { label: "Avatar", href: "#components" },
      { label: "Badge", href: "#components" },
      { label: "Breadcrumb", href: "#components" },
      { label: "Button", href: "#components" },
      { label: "Calendar", href: "#components" },
      { label: "Card", href: "#components" },
      { label: "Checkbox", href: "#components" },
      { label: "Collapsible", href: "#components" },
      { label: "Combobox", href: "#components" },
      { label: "Dialog", href: "#components" },
      { label: "Field", href: "#components" },
      { label: "Form", href: "#components" },
      { label: "Input", href: "#components" },
      { label: "Menu", href: "#components" },
      { label: "Popover", href: "#components" },
      { label: "Select", href: "#components" },
      { label: "Sheet", href: "#components" },
      { label: "Tabs", href: "#components" },
      { label: "Toast", href: "#components" },
      { label: "Tooltip", href: "#components" },
    ],
  },
  {
    title: "Hooks",
    items: [
      { label: "useControllableState", href: "#hooks" },
      { label: "useCopyToClipboard", href: "#hooks" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Registry contract", href: "#registry" },
      { label: "Primitive contracts", href: "#contracts" },
    ],
  },
];

export const tocItems = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Core and UI Layers", href: "#core-ui-layers" },
  { label: "Styling Model", href: "#styling" },
  { label: "Component Inventory", href: "#components" },
  { label: "Registry Ownership", href: "#registry" },
  { label: "Roadmap", href: "#roadmap" },
];

export const componentRows = [
  ["Accordion", "Available", "Core primitive plus editable UI source."],
  ["Dialog", "Available", "Focus, dismissal, portals, and overlay layering."],
  ["Select", "In progress", "Collection, popup field, keyboard navigation, and typeahead."],
  ["Data Table", "UI layer", "TanStack Table source for dense app workspaces."],
  ["TanStack Form Field", "UI layer", "Solid form integration without leaking into Core."],
];
