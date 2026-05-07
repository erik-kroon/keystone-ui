import * as examples from "./registry-doc-examples";
import type { ComponentDocsBlueprint, HookDocsBlueprint } from "./registry-doc-types";

export const componentDocsOverrides = {
  accordion: {
    description: "A set of collapsible panels with headings and content.",
    maturity: "Stable",
    previewAlign: "start",
    usageCode: examples.accordionUsageCode,
    apiItems: [
      {
        name: "Accordion",
        description: "Root container for a controlled or uncontrolled disclosure set.",
      },
      {
        name: "AccordionItem",
        description: "A single item wrapper with an optional disabled state.",
      },
      {
        name: "AccordionTrigger",
        description: "Accessible trigger for opening and closing one item.",
      },
      {
        name: "AccordionContent",
        description: "Panel region rendered under a trigger with keyboard and state support.",
      },
    ],
    examples: [
      {
        code: examples.singleAccordionCode,
        description: "A single-open accordion that starts closed.",
        id: "single",
        preview: () => <examples.SingleAccordionExample />,
        title: "Single Accordion",
        variant: "centered",
      },
      {
        code: examples.multipleAccordionCode,
        description: "Open more than one item at a time.",
        id: "multiple",
        preview: () => <examples.MultipleAccordionExample />,
        title: "Multiple Accordion",
        variant: "centered",
      },
      {
        code: examples.controlledAccordionCode,
        description: "Drive open items from parent state.",
        id: "controlled",
        preview: () => <examples.ControlledAccordionExample />,
        title: "Controlled Accordion",
        variant: "centered",
      },
      {
        code: examples.disabledAccordionCode,
        description: "Disable specific items while keeping keyboard navigation.",
        id: "disabled",
        preview: () => <examples.DisabledItemAccordionExample />,
        title: "Disabled Item",
        variant: "centered",
      },
    ],
  },
  alert: {
    description: "A status or callout surface for contextual feedback.",
    maturity: "Stable",
    usageCode: examples.alertUsageCode,
    apiItems: [
      {
        name: "Alert",
        description:
          "Root callout surface with Keystone UI variants, status/error live-region defaults, and stable data attributes.",
      },
      {
        name: "AlertIcon",
        description: "Optional icon slot aligned with the title and description content.",
      },
      { name: "AlertTitle", description: "Primary alert heading used as the readable summary." },
      { name: "AlertDescription", description: "Supporting body copy for the alert message." },
      {
        name: "AlertAction",
        description: "Optional action slot for native buttons or links supplied by the app.",
      },
    ],
    examples: [
      {
        code: examples.alertWarningExampleCode,
        description: "Warning alert for important guidance that needs attention.",
        id: "warning-alert",
        preview: () => <examples.WarningAlertExample />,
        title: "Warning Alert",
        variant: "inline",
      },
      {
        code: examples.alertErrorExampleCode,
        description: "Error alert for failed or blocked states.",
        id: "error-alert",
        preview: () => <examples.ErrorAlertExample />,
        title: "Error Alert",
        variant: "inline",
      },
      {
        code: examples.alertActionExampleCode,
        description: "Alert composition with an icon and app-owned action buttons.",
        id: "with-icon-and-action-buttons",
        preview: () => <examples.AlertActionExample />,
        title: "With Icon and Action Buttons",
        variant: "inline",
      },
      {
        code: examples.alertInfoExampleCode,
        description: "Informational alert for neutral contextual feedback.",
        id: "info-alert",
        preview: () => <examples.AlertExample />,
        title: "Info Alert",
        variant: "inline",
      },
    ],
  },
  badge: {
    description: "A compact label for statuses, counts, and inline metadata.",
    maturity: "Stable",
    usageCode: examples.badgeUsageCode,
    apiItems: [
      {
        name: "Badge",
        description:
          "Presentational span with Keystone UI variants, sizes, icon normalization, and stable data attributes.",
      },
      {
        name: "badgeClass",
        description:
          "Class helper for composing badge variants and sizes onto compatible custom elements.",
      },
    ],
    examples: [
      {
        code: examples.badgeExampleCode,
        description: "Common badge variants rendered from the installable UI source.",
        id: "variants",
        preview: () => <examples.BadgeExample />,
        title: "Variants",
        variant: "inline",
      },
      {
        code: examples.badgeSizeExampleCode,
        description: "Badge sizes for compact labels and slightly larger metadata chips.",
        id: "sizes",
        preview: () => <examples.BadgeSizeExample />,
        title: "Sizes",
        variant: "inline",
      },
    ],
  },
  button: {
    description: "A styled button for actions, forms, and compact controls.",
    maturity: "Stable",
    usageCode: examples.buttonUsageCode,
    apiItems: [
      {
        name: "Button",
        description:
          "Native button wrapper with Keystone UI variants, sizes, focus rings, and disabled states.",
      },
    ],
    examples: [
      {
        code: examples.buttonExampleCode,
        description: "Common button variants rendered from the installable UI source.",
        id: "variants",
        preview: () => <examples.ButtonExample />,
        title: "Variants",
        variant: "inline",
      },
    ],
  },
  card: {
    description: "A content container for grouping related information and actions.",
    heroVariant: "centered",
    maturity: "Stable",
    usageCode: examples.cardUsageCode,
    apiItems: [
      {
        name: "Card",
        description: "Root container with border, surface, and card foreground tokens.",
      },
      {
        name: "CardHeader",
        description: "Top region for title, description, and optional action.",
      },
      { name: "CardTitle", description: "Primary heading inside the card header." },
      {
        name: "CardDescription",
        description: "Supporting description text inside the card header.",
      },
      { name: "CardPanel", description: "Main content region with default card padding." },
      { name: "CardFooter", description: "Bottom region for actions or secondary information." },
    ],
    examples: [
      {
        code: examples.cardExampleCode,
        description: "A project creation card with inputs, select, and footer action.",
        id: "project-card",
        preview: () => <examples.CardExample />,
        title: "Project Card",
        variant: "centered",
      },
    ],
  },
  checkbox: {
    description: "A control that toggles checked, unchecked, and indeterminate states.",
    maturity: "Stable",
    usageCode: examples.checkboxUsageCode,
    apiItems: [
      {
        name: "Checkbox",
        description: "Root checkbox component that renders a Core-backed control and hidden input.",
      },
      {
        name: "CheckboxControl",
        description: "Styled visual control for custom checkbox composition.",
      },
      {
        name: "CheckboxIndicator",
        description: "Indicator region for checked and indeterminate icons.",
      },
      {
        name: "CheckboxHiddenInput",
        description: "Hidden input used for native form participation.",
      },
    ],
    examples: [
      {
        code: examples.checkboxExampleCode,
        description: "Controlled checkbox with a visible label.",
        id: "controlled",
        preview: () => <examples.CheckboxExample />,
        title: "Controlled Checkbox",
        variant: "inline",
      },
    ],
  },
  dialog: {
    description: "A modal surface that interrupts the page for focused decisions or forms.",
    maturity: "Stable",
    usageCode: examples.dialogUsageCode,
    apiItems: [
      { name: "Dialog", description: "Root owner for modal state, dismissal, and focus behavior." },
      { name: "DialogTrigger", description: "Button-like trigger that opens the dialog." },
      {
        name: "DialogContent",
        description:
          "Portaled overlay content with backdrop, positioner, panel, and close affordance.",
      },
      { name: "DialogTitle", description: "Accessible title associated with the dialog content." },
      {
        name: "DialogDescription",
        description: "Accessible description associated with the dialog content.",
      },
    ],
    examples: [
      {
        code: examples.dialogExampleCode,
        description: "A modal dialog with title, description, body, and footer action.",
        id: "basic",
        preview: () => <examples.DialogExample />,
        title: "Basic Dialog",
        variant: "centered",
      },
    ],
  },
  popover: {
    description: "A non-modal floating panel for contextual controls or supplemental content.",
    maturity: "Stable",
    usageCode: examples.popoverUsageCode,
    apiItems: [
      {
        name: "Popover",
        description: "Root owner for non-modal floating panel state and positioning.",
      },
      { name: "PopoverTrigger", description: "Trigger that opens and anchors the popover." },
      {
        name: "PopoverContent",
        description:
          "Portaled floating content with viewport sizing and collision-aware positioning.",
      },
      {
        name: "PopoverHeader / PopoverFooter",
        description: "Optional UI helpers for structured popover content.",
      },
    ],
    examples: [
      {
        code: examples.popoverExampleCode,
        description: "Contextual panel with title, description, content, and footer action.",
        id: "basic",
        preview: () => <examples.PopoverExample />,
        title: "Basic Popover",
        variant: "centered",
      },
    ],
  },
  select: {
    description: "A listbox-backed control for choosing one value from a set of options.",
    maturity: "Stable",
    usageCode: examples.selectUsageCode,
    apiItems: [
      {
        name: "Select",
        description: "Root owner for selected value, popup state, and listbox coordination.",
      },
      {
        name: "SelectTrigger",
        description: "Button trigger that displays the current value and opens the listbox.",
      },
      { name: "SelectValue", description: "Current selected item text or placeholder." },
      { name: "SelectContent", description: "Portaled popup surface containing the listbox." },
      { name: "SelectItem", description: "Selectable option with indicator and text parts." },
    ],
    examples: [
      {
        code: examples.selectExampleCode,
        description: "Single value select with three options.",
        id: "basic",
        preview: () => <examples.SelectExample />,
        title: "Basic Select",
        variant: "centered",
      },
    ],
  },
  tabs: {
    description: "A set of layered sections where one panel is visible at a time.",
    maturity: "Stable",
    usageCode: examples.tabsUsageCode,
    apiItems: [
      { name: "Tabs", description: "Root owner for selected tab value and activation mode." },
      {
        name: "TabsList",
        description: "Tablist wrapper that renders triggers and the active indicator.",
      },
      {
        name: "TabsTrigger",
        description: "Focusable tab control associated with a content panel.",
      },
      { name: "TabsContent", description: "Panel rendered for a matching tab value." },
    ],
    examples: [
      {
        code: examples.tabsExampleCode,
        description: "Horizontal tabs with three panels.",
        id: "basic",
        preview: () => <examples.TabsExample />,
        title: "Basic Tabs",
        variant: "centered",
      },
    ],
  },
  toast: {
    description: "A transient message system for confirmations, warnings, and async feedback.",
    maturity: "Preview",
    usageCode: examples.toastUsageCode,
    apiItems: [
      {
        name: "Toaster",
        description: "Provider and viewport composition that renders active toast records.",
      },
      {
        name: "toaster",
        description: "Imperative manager used to add, update, dismiss, and clear toasts.",
      },
      { name: "Toast", description: "Root toast item rendered by the default toaster." },
      {
        name: "ToastTitle / ToastDescription",
        description: "Readable text regions for toast content.",
      },
      { name: "ToastAction / ToastClose", description: "Optional action and dismissal controls." },
    ],
    examples: [
      {
        code: examples.toastExampleCode,
        description: "Trigger a success toast from an application action.",
        id: "basic",
        preview: () => <examples.ToastExample />,
        title: "Basic Toast",
        variant: "centered",
      },
    ],
  },
  tooltip: {
    description: "A small floating label that appears on hover or focus.",
    maturity: "Stable",
    usageCode: examples.tooltipUsageCode,
    apiItems: [
      {
        name: "TooltipProvider",
        description: "Shared timing configuration for a group of tooltips.",
      },
      { name: "Tooltip", description: "Root owner for tooltip state and floating behavior." },
      { name: "TooltipTrigger", description: "Trigger that opens the tooltip on hover or focus." },
      {
        name: "TooltipContent",
        description: "Portaled floating content with viewport sizing and transitions.",
      },
    ],
    examples: [
      {
        code: examples.tooltipExampleCode,
        description: "Tooltip attached to a focusable trigger.",
        id: "basic",
        preview: () => <examples.TooltipExample />,
        title: "Basic Tooltip",
        variant: "inline",
      },
    ],
  },
} satisfies Record<string, ComponentDocsBlueprint>;

export const hookDocsOverrides = {} satisfies Record<string, HookDocsBlueprint>;
