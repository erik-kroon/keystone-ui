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
    examples: examples.accordionExamples,
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
    examples: examples.alertExamples,
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
    examples: examples.badgeExamples,
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
    examples: examples.buttonExamples,
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
    examples: examples.cardExamples,
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
    examples: examples.checkboxExamples,
  },
  collapsible: {
    description: "A disclosure region for showing and hiding a focused panel of content.",
    maturity: "Experimental",
    usageCode: examples.collapsibleUsageCode,
    apiItems: [
      {
        name: "Collapsible",
        description: "Root owner for controlled or uncontrolled open state.",
      },
      {
        name: "CollapsibleTrigger",
        description: "Button-like trigger with ARIA expansion and controls wiring.",
      },
      {
        name: "CollapsibleContent",
        description: "Panel content rendered when open, with state data attributes for animation.",
      },
    ],
    examples: examples.collapsibleExamples,
  },
  combobox: {
    description: "A searchable input and listbox popup for selecting an option.",
    maturity: "Experimental",
    usageCode: examples.comboboxUsageCode,
    apiItems: [
      {
        name: "Combobox",
        description: "Root owner for input value, selected value, open state, and form value.",
      },
      {
        name: "ComboboxInput",
        description: "Text input with optional trigger, clear action, and start add-on slots.",
      },
      {
        name: "ComboboxContent",
        description: "Portaled popup surface that contains the listbox and option groups.",
      },
      {
        name: "ComboboxListbox",
        description: "Listbox container for grouped and ungrouped selectable items.",
      },
      {
        name: "ComboboxItem",
        description: "Selectable option with highlighted, selected, and disabled state styling.",
      },
    ],
    examples: examples.comboboxExamples,
  },
  "date-picker": {
    description: "A trigger and calendar popup for selecting dates.",
    maturity: "Experimental",
    usageCode: examples.datePickerUsageCode,
    apiItems: [
      {
        name: "DatePicker",
        description: "Root owner for selected date, popup state, and calendar month state.",
      },
      {
        name: "DatePickerTrigger",
        description: "Button trigger that displays the selected date or placeholder.",
      },
      {
        name: "DatePickerContent",
        description: "Calendar popup content with grid navigation and selectable day cells.",
      },
      {
        name: "Calendar",
        description: "Standalone calendar root exported from the same registry source.",
      },
    ],
    examples: examples.datePickerExamples,
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
    examples: examples.dialogExamples,
  },
  input: {
    description: "A native text input with Keystone wrapper styling and form semantics.",
    maturity: "Stable",
    usageCode: examples.inputUsageCode,
    apiItems: [
      {
        name: "Input",
        description:
          "Native input rendered inside a styled control wrapper with size, invalid, disabled, search, file, and form prop passthrough.",
      },
      {
        name: "Input size",
        description:
          "Use sm, default, lg, or a numeric native size attribute while preserving the wrapper data-size hook.",
      },
      {
        name: "invalid",
        description:
          "Marks the native input aria-invalid and sets wrapper data-invalid for validation styling.",
      },
    ],
    examples: examples.inputExamples,
  },
  label: {
    description: "A native label with Keystone typography and stable styling hooks.",
    maturity: "Stable",
    usageCode: examples.labelUsageCode,
    apiItems: [
      {
        name: "Label",
        description:
          "Native label element for associating text with a form control by nesting or using the for/id relationship.",
      },
      {
        name: "data-slot",
        description:
          "Renders data-slot=label plus ui-label classes for downstream styling and composition.",
      },
    ],
    examples: examples.labelExamples,
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
    examples: examples.popoverExamples,
  },
  "radio-group": {
    description: "A roving-focus group for choosing one option from a small set.",
    maturity: "Experimental",
    usageCode: examples.radioGroupUsageCode,
    apiItems: [
      {
        name: "RadioGroup",
        description: "Root owner for selected value, orientation, disabled state, and form wiring.",
      },
      {
        name: "RadioGroupItem",
        description:
          "Focusable radio option with visual control, label slot, and hidden native input.",
      },
      {
        name: "RadioGroupHiddenInput",
        description: "Hidden native radio input used for form submission and reset behavior.",
      },
    ],
    examples: examples.radioGroupExamples,
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
    examples: examples.selectExamples,
  },
  switch: {
    description: "A Core-backed switch for toggling a boolean setting.",
    maturity: "Stable",
    usageCode: examples.switchUsageCode,
    apiItems: [
      {
        name: "Switch",
        description:
          "Root switch component that renders a styled control, animated thumb, and hidden native checkbox input by default.",
      },
      {
        name: "SwitchControl",
        description:
          "Styled button control with role=switch and checked, disabled, and focus state styling.",
      },
      {
        name: "SwitchThumb",
        description: "Animated visual thumb that follows checked state.",
      },
      {
        name: "SwitchHiddenInput",
        description: "Hidden checkbox used for native form submission and reset behavior.",
      },
    ],
    examples: examples.switchExamples,
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
    examples: examples.tabsExamples,
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
    examples: examples.tooltipExamples,
  },
} satisfies Record<string, ComponentDocsBlueprint>;

export const hookDocsOverrides = {} satisfies Record<string, HookDocsBlueprint>;
