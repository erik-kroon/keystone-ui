export type DocsRouteMeta = {
  description: string;
  title: string;
};

const componentRouteMeta: Readonly<Record<string, DocsRouteMeta>> = {
  accordion: {
    description: "Styled Solid accordion component backed by Keystone disclosure coordination.",
    title: "Accordion",
  },
  alert: {
    description: "Presentational Solid alert/callout surface with semantic status and error roles.",
    title: "Alert",
  },
  badge: {
    description:
      "Presentational Solid badge for inline labels, statuses, counts, and compact metadata.",
    title: "Badge",
  },
  button: {
    description:
      "Solid button component with reference-inspired UI styling, loading state, and native form semantics.",
    title: "Button",
  },
  card: {
    description: "Composable reference-inspired card and card-frame parts for grouped content.",
    title: "Card",
  },
  checkbox: {
    description: "Styled Solid checkbox component backed by Keystone selection-control behavior.",
    title: "Checkbox",
  },
  collapsible: {
    description: "Styled Solid collapsible component backed by Keystone disclosure behavior.",
    title: "Collapsible",
  },
  combobox: {
    description:
      "Styled Solid combobox backed by Keystone input, listbox, selection, and floating behavior.",
    title: "Combobox",
  },
  "date-picker": {
    description:
      "Styled Solid date picker and calendar components backed by Keystone date selection behavior.",
    title: "Date Picker",
  },
  dialog: {
    description: "Styled Solid dialog component backed by Keystone overlay behavior.",
    title: "Dialog",
  },
  input: {
    description:
      "Reference-inspired Solid input control with wrapper styling, sizes, invalid state, and native input semantics.",
    title: "Input",
  },
  label: {
    description: "Solid label component for form controls and field shells.",
    title: "Label",
  },
  popover: {
    description:
      "Styled Solid popover component backed by Keystone overlay positioning and dismissal.",
    title: "Popover",
  },
  "radio-group": {
    description: "Styled Solid radio group component backed by Keystone roving selection behavior.",
    title: "Radio Group",
  },
  select: {
    description:
      "Keystone-backed styled select with trigger, value, popup, listbox, group, item, and form-value behavior.",
    title: "Select",
  },
  switch: {
    description: "Styled Solid switch component backed by Keystone selection-control behavior.",
    title: "Switch",
  },
  tabs: {
    description:
      "Styled Solid tabs component backed by Keystone tablist, trigger, and panel behavior.",
    title: "Tabs",
  },
  toast: {
    description:
      "Styled Solid toast component backed by Keystone notification manager, viewport, timer, and live-region behavior.",
    title: "Toast",
  },
  tooltip: {
    description:
      "Styled Solid tooltip component backed by Keystone overlay positioning and Escape dismissal.",
    title: "Tooltip",
  },
};

export function findComponentRouteMeta(slug: string) {
  return componentRouteMeta[slug];
}
