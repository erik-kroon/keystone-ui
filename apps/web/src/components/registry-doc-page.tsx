import { Clipboard, Copy, ExternalLink, Puzzle, Terminal } from "lucide-solid";
import { For, Show, createSignal, type Accessor, type JSX } from "solid-js";

import { ComponentPreview } from "@/components/component-preview";
import {
  ActionLink,
  Badge,
  CodeBlock,
  CopyPageButton,
  DocsPageFrame,
  cn,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  secondaryButtonClass,
} from "@/components/docs-shell";
import { MdxContent, MdxH2, MdxH3, MdxP, MdxTable } from "@/components/mdx-components";
import { componentMaturity, findDocItem, itemToc, type DocsPage } from "@/lib/docs-data";
import type { RegistryDocItem } from "@/lib/registry-docs.gen";
import { useMediaQuery } from "@keystone-ui/ui/default/hooks/use-media-query.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@keystone-ui/ui/default/ui/tabs.tsx";

import {
  ControlledAccordionExample,
  DisabledItemAccordionExample,
  MultipleAccordionExample,
  SingleAccordionExample,
  ButtonExample,
  CardExample,
  CheckboxExample,
  DialogExample,
  PopoverExample,
  SelectExample,
  TabsExample,
  ToastExample,
  TooltipExample,
  accordionUsageCode,
  buttonExampleCode,
  buttonUsageCode,
  cardExampleCode,
  cardUsageCode,
  checkboxExampleCode,
  checkboxUsageCode,
  controlledAccordionCode,
  disabledAccordionCode,
  dialogExampleCode,
  dialogUsageCode,
  multipleAccordionCode,
  popoverExampleCode,
  popoverUsageCode,
  selectExampleCode,
  selectUsageCode,
  singleAccordionCode,
  tabsExampleCode,
  tabsUsageCode,
  toastExampleCode,
  toastUsageCode,
  tooltipExampleCode,
  tooltipUsageCode,
} from "@/docs/examples/accordion";

type CodeExample = {
  align?: PreviewAlign;
  code: string;
  description: string;
  id: string;
  preview: () => JSX.Element;
  title: string;
  variant?: PreviewVariant;
};

type ApiReferenceItem = {
  description: string;
  name: string;
};

type PreviewVariant = "centered" | "dense" | "full" | "inline";
type PreviewAlign = "center" | "end" | "start";

type ComponentDocsBlueprint = {
  apiItems?: readonly ApiReferenceItem[];
  accessibility?: readonly string[];
  dataAttributes?: readonly (readonly [string, string])[];
  dataAttributeDescription?: string;
  description?: string;
  examples?: readonly CodeExample[];
  heroVariant?: PreviewVariant;
  keyboardInteractions?: readonly string[];
  maturity?: string;
  previewAlign?: PreviewAlign;
  usageCode: string;
  cssVariables?: readonly (readonly [string, string])[];
};

type HookTable = {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
};

type HookSubsection = {
  body?: JSX.Element;
  code?: string;
  id: string;
  table?: HookTable;
  title: string;
};

type HookSection = HookSubsection & {
  children?: readonly HookSubsection[];
  demo?: () => JSX.Element;
};

type HookDocsBlueprint = {
  intro: JSX.Element;
  sections: readonly HookSection[];
};

const pageHeaderActionClass =
  "!h-7 !min-h-7 gap-1 rounded-md px-2 text-sm shadow-none sm:!h-6 sm:!min-h-6 sm:text-xs [&>svg]:size-4 [&>svg]:opacity-80 sm:[&>svg]:size-3.5";
const docsSectionClass = "mt-10 scroll-mt-24 lg:mt-12";
const previewSectionClass = "mt-6 scroll-mt-24";

const showInstallationSection = false;

function maturityBadgeClass(maturity: string) {
  switch (maturity.toLowerCase()) {
    case "stable":
      return "bg-success/8 text-success-foreground dark:bg-success/16";
    case "beta":
    case "preview":
      return "bg-warning/8 text-warning-foreground dark:bg-warning/16";
    case "experimental":
      return "bg-info/8 text-info-foreground dark:bg-info/16";
    case "deprecated":
      return "bg-destructive/8 text-destructive-foreground dark:bg-destructive/16";
    case "draft":
    default:
      return "bg-muted text-muted-foreground dark:bg-muted/64";
  }
}

function maturityLabel(maturity: string | undefined) {
  return (maturity ?? "Draft").toLowerCase();
}

const componentDocsOverrides: Record<string, ComponentDocsBlueprint> = {
  accordion: {
    description: "A set of collapsible panels with headings and content.",
    maturity: "Stable",
    previewAlign: "start",
    usageCode: accordionUsageCode,
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
        code: singleAccordionCode,
        description: "A single-open accordion that starts closed.",
        id: "single",
        preview: () => <SingleAccordionExample />,
        title: "Single Accordion",
        variant: "centered",
      },
      {
        code: multipleAccordionCode,
        description: "Open more than one item at a time.",
        id: "multiple",
        preview: () => <MultipleAccordionExample />,
        title: "Multiple Accordion",
        variant: "centered",
      },
      {
        code: controlledAccordionCode,
        description: "Drive open items from parent state.",
        id: "controlled",
        preview: () => <ControlledAccordionExample />,
        title: "Controlled Accordion",
        variant: "centered",
      },
      {
        code: disabledAccordionCode,
        description: "Disable specific items while keeping keyboard navigation.",
        id: "disabled",
        preview: () => <DisabledItemAccordionExample />,
        title: "Disabled Item",
        variant: "centered",
      },
    ],
    accessibility: [
      "Trigger renders as a native button.",
      "Enter and Space toggle the focused trigger.",
      "Arrow keys move through enabled triggers within a vertical accordion.",
    ],
    keyboardInteractions: [
      "Enter / Space: toggle focused trigger",
      "ArrowUp / ArrowDown: move focus between triggers",
      "Home / End: jump to first / last enabled trigger",
    ],
    dataAttributes: [
      ["data-scope", "Current component scope marker (for Core-level styling hooks)."],
      ["data-part", "Current part marker exposed on structural nodes."],
      ["data-state", "open / closed state."],
      ["data-disabled", "Disabled status for an item, trigger, and root when set."],
    ],
    dataAttributeDescription:
      "Use these attributes with selector hooks for scoped styling and behavior diagnostics.",
  },
  button: {
    description: "A styled button for actions, forms, and compact controls.",
    maturity: "Stable",
    usageCode: buttonUsageCode,
    apiItems: [
      {
        name: "Button",
        description:
          "Native button wrapper with Keystone UI variants, sizes, focus rings, and disabled states.",
      },
    ],
    examples: [
      {
        code: buttonExampleCode,
        description: "Common button variants rendered from the installable UI source.",
        id: "variants",
        preview: () => <ButtonExample />,
        title: "Variants",
        variant: "inline",
      },
    ],
    accessibility: [
      "Renders a native button by default.",
      "Use an explicit type in forms to avoid accidental submission behavior.",
      "Disabled buttons are removed from pointer interaction and keyboard activation.",
    ],
    dataAttributes: [
      ["data-slot", "Stable UI slot marker."],
      ["data-variant", "Visual variant, when emitted by the source component."],
      ["data-size", "Control size, when emitted by the source component."],
    ],
  },
  card: {
    description: "A content container for grouping related information and actions.",
    heroVariant: "centered",
    maturity: "Stable",
    usageCode: cardUsageCode,
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
        code: cardExampleCode,
        description: "A project creation card with inputs, select, and footer action.",
        id: "project-card",
        preview: () => <CardExample />,
        title: "Project Card",
        variant: "centered",
      },
    ],
    dataAttributes: [
      ["data-scope", "UI card scope marker."],
      ["data-part", "Card part marker such as root, header, panel, or footer."],
      ["data-slot", "Stable slot marker used by the generated UI source."],
    ],
  },
  checkbox: {
    description: "A control that toggles checked, unchecked, and indeterminate states.",
    maturity: "Stable",
    usageCode: checkboxUsageCode,
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
        code: checkboxExampleCode,
        description: "Controlled checkbox with a visible label.",
        id: "controlled",
        preview: () => <CheckboxExample />,
        title: "Controlled Checkbox",
        variant: "inline",
      },
    ],
    accessibility: [
      "Uses native checkbox semantics through Core and a hidden input.",
      "Space toggles the focused checkbox.",
      "Associate visible text with the checkbox using a label.",
    ],
    dataAttributes: [
      ["data-scope", "Current Core component scope."],
      ["data-part", "Current Core part marker."],
      ["data-state", "checked, unchecked, or indeterminate state."],
      ["data-disabled", "Disabled status when set."],
    ],
  },
  dialog: {
    description: "A modal surface that interrupts the page for focused decisions or forms.",
    maturity: "Stable",
    usageCode: dialogUsageCode,
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
        code: dialogExampleCode,
        description: "A modal dialog with title, description, body, and footer action.",
        id: "basic",
        preview: () => <DialogExample />,
        title: "Basic Dialog",
        variant: "centered",
      },
    ],
    accessibility: [
      "Focus moves into the dialog when opened and returns to the trigger when closed.",
      "Escape and outside interaction dismiss the dialog unless prevented.",
      "Title and description wire up the dialog's accessible name and description.",
    ],
    dataAttributes: [
      ["data-scope", "Current Core overlay scope."],
      ["data-part", "Dialog part marker such as trigger, content, backdrop, and title."],
      ["data-state", "Open or closed state."],
      ["data-transition-status", "Overlay enter/exit transition phase."],
    ],
  },
  popover: {
    description: "A non-modal floating panel for contextual controls or supplemental content.",
    maturity: "Stable",
    usageCode: popoverUsageCode,
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
        code: popoverExampleCode,
        description: "Contextual panel with title, description, content, and footer action.",
        id: "basic",
        preview: () => <PopoverExample />,
        title: "Basic Popover",
        variant: "centered",
      },
    ],
    accessibility: [
      "Use popovers for non-modal content; use Dialog for modal tasks.",
      "Escape closes the popover.",
      "Trigger remains the anchor for focus return and floating positioning.",
    ],
    dataAttributes: [
      ["data-scope", "Current Core overlay scope."],
      ["data-part", "Popover part marker."],
      ["data-side", "Resolved floating side."],
      ["data-align", "Resolved floating alignment."],
    ],
  },
  select: {
    description: "A listbox-backed control for choosing one value from a set of options.",
    maturity: "Stable",
    usageCode: selectUsageCode,
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
        code: selectExampleCode,
        description: "Single value select with three options.",
        id: "basic",
        preview: () => <SelectExample />,
        title: "Basic Select",
        variant: "centered",
      },
    ],
    accessibility: [
      "Trigger exposes button/listbox semantics through Core.",
      "Arrow keys move through options and Enter selects the highlighted option.",
      "Escape closes the popup and returns focus to the trigger.",
    ],
    dataAttributes: [
      ["data-scope", "Current Core select scope."],
      ["data-part", "Select part marker."],
      ["data-state", "Open or closed popup state."],
      ["data-highlighted", "Currently highlighted option."],
      ["data-disabled", "Disabled trigger or option state."],
    ],
  },
  tabs: {
    description: "A set of layered sections where one panel is visible at a time.",
    maturity: "Stable",
    usageCode: tabsUsageCode,
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
        code: tabsExampleCode,
        description: "Horizontal tabs with three panels.",
        id: "basic",
        preview: () => <TabsExample />,
        title: "Basic Tabs",
        variant: "centered",
      },
    ],
    accessibility: [
      "Triggers expose tab semantics and panels expose tabpanel semantics through Core.",
      "Arrow keys move focus through tabs.",
      "Home and End move focus to the first and last trigger.",
    ],
    dataAttributes: [
      ["data-scope", "Current Core tabs scope."],
      ["data-part", "Tabs part marker."],
      ["data-selected", "Selected trigger and active content state."],
      ["data-orientation", "Horizontal or vertical orientation."],
      ["data-disabled", "Disabled trigger state."],
    ],
  },
  toast: {
    description: "A transient message system for confirmations, warnings, and async feedback.",
    maturity: "Preview",
    usageCode: toastUsageCode,
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
        code: toastExampleCode,
        description: "Trigger a success toast from an application action.",
        id: "basic",
        preview: () => <ToastExample />,
        title: "Basic Toast",
        variant: "centered",
      },
    ],
    accessibility: [
      "Toast provider owns live-region announcement behavior in Core.",
      "Keep toast text concise and avoid putting critical blocking decisions only in a toast.",
      "Interactive actions should be reachable by keyboard when present.",
    ],
    dataAttributes: [
      ["data-slot", "Stable UI slot marker."],
      ["data-type", "Toast type such as success, warning, error, info, loading, or default."],
      ["data-status", "Toast lifecycle status."],
      ["data-position", "Viewport placement."],
    ],
  },
  tooltip: {
    description: "A small floating label that appears on hover or focus.",
    maturity: "Stable",
    usageCode: tooltipUsageCode,
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
        code: tooltipExampleCode,
        description: "Tooltip attached to a focusable trigger.",
        id: "basic",
        preview: () => <TooltipExample />,
        title: "Basic Tooltip",
        variant: "inline",
      },
    ],
    accessibility: [
      "Tooltips open from hover or keyboard focus.",
      "Escape closes the tooltip.",
      "Do not put required interactive controls inside tooltip content.",
    ],
    dataAttributes: [
      ["data-scope", "Current Core tooltip scope."],
      ["data-part", "Tooltip part marker."],
      ["data-side", "Resolved floating side."],
      ["data-align", "Resolved floating alignment."],
      ["data-transition-status", "Overlay enter/exit transition phase."],
    ],
  },
};

const copyToClipboardBasicCode = `import { createCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

function CopyButton(props: { text: string }) {
  const clipboard = createCopyToClipboard();

  return (
    <button onClick={() => void clipboard.copy(props.text)}>
      {clipboard.copied() ? "Copied!" : "Copy"}
    </button>
  );
}`;

const copyToClipboardTimeoutCode = `const clipboard = createCopyToClipboard({ copiedDuration: 3000 });`;

const copyToClipboardCallbackCode = `const clipboard = createCopyToClipboard({
  onCopy: (value) => console.log("Copied to clipboard", value),
});`;

const copyToClipboardIconSwapCode = `import { Check, Copy } from "lucide-solid";
import { createCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";

function CopyButton(props: { value: string }) {
  const clipboard = createCopyToClipboard();

  return (
    <Button
      aria-label="Copy to clipboard"
      onClick={() => void clipboard.copy(props.value)}
      size="icon"
      variant="outline"
    >
      {clipboard.copied() ? (
        <Check aria-hidden="true" />
      ) : (
        <Copy aria-hidden="true" />
      )}
    </Button>
  );
}`;

const copyToClipboardApiCode = `function createCopyToClipboard(options?: {
  copiedDuration?: number;
  onCopy?: (value: string) => void;
  onError?: (error: unknown, value: string) => void;
  window?: Window;
}): {
  copy: (value: string) => Promise<boolean>;
  copied: Accessor<boolean>;
  status: Accessor<"idle" | "copied" | "error">;
  error: Accessor<unknown>;
  isSupported: () => boolean;
  reset: () => void;
};`;

const mediaQueryBreakpointCode = `import { useMediaQuery } from "@/hooks/use-media-query";

// Min-width (breakpoint and above), like md:
const isDesktop = useMediaQuery("md");

// Max-width (below breakpoint), like max-md:
const isMobile = useMediaQuery("max-md");

// Range (between two breakpoints), like md:max-lg:
const isTablet = useMediaQuery("md:max-lg");`;

const mediaQueryObjectCode = `// Touch device detection
const isTouch = useMediaQuery({ pointer: "coarse" });

// Breakpoint + pointer combined
const isMobileTouch = useMediaQuery({ max: "md", pointer: "coarse" });

// Custom pixel values
const isNarrow = useMediaQuery({ max: 600 });`;

const mediaQueryRawCode = `const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");`;

const mediaQueryConditionalCode = `function Layout() {
  const isDesktop = useMediaQuery("lg");

  return isDesktop() ? <DesktopNav /> : <MobileNav />;
}`;

const mediaQueryApiCode = `function useMediaQuery(
  query: MediaQueryBreakpointQuery | MediaQueryInput | string,
  options?: UseMediaQueryOptions,
): Accessor<boolean>;`;

const useIsMobileCode = `import { useIsMobile } from "@/hooks/use-media-query";

const isMobile = useIsMobile(); // equivalent to useMediaQuery("max-md")`;

const hookDocsOverrides: Record<string, HookDocsBlueprint> = {
  "use-copy-to-clipboard": {
    intro: (
      <MdxP class="mt-8">
        A Solid clipboard helper that wraps the Clipboard API with a built-in timer for copied
        feedback. Use it for copy buttons that need brief confirmation, failure state, and SSR-safe
        capability checks.
      </MdxP>
    ),
    sections: [
      {
        id: "usage",
        title: "Usage",
        children: [
          {
            code: copyToClipboardBasicCode,
            id: "basic",
            title: "Basic",
          },
          {
            body: (
              <>
                <MdxP>
                  The copied state resets after 2 seconds by default. Pass{" "}
                  <InlineCode>copiedDuration</InlineCode> to change that window.
                </MdxP>
                <MdxP class="mt-3">
                  Set <InlineCode>copiedDuration</InlineCode> to <InlineCode>0</InlineCode> to keep
                  <InlineCode>copied()</InlineCode> as <InlineCode>true</InlineCode> until{" "}
                  <InlineCode>reset()</InlineCode> is called or the owner disposes.
                </MdxP>
              </>
            ),
            code: copyToClipboardTimeoutCode,
            id: "custom-timeout",
            title: "Custom timeout",
          },
          {
            body: <MdxP>Run a side effect when a copy succeeds.</MdxP>,
            code: copyToClipboardCallbackCode,
            id: "callback-on-copy",
            title: "Callback on copy",
          },
          {
            body: <MdxP>A common pattern: swap the icon briefly to confirm the copy.</MdxP>,
            code: copyToClipboardIconSwapCode,
            id: "with-icon-swap",
            title: "With icon swap",
          },
        ],
      },
      {
        code: copyToClipboardApiCode,
        id: "api-reference",
        title: "API",
        children: [
          {
            id: "options",
            table: {
              columns: ["Property", "Type", "Default", "Description"],
              rows: [
                [
                  "copiedDuration",
                  "number",
                  "2000",
                  "Milliseconds before copied state resets to false. Set to 0 to keep it true.",
                ],
                [
                  "onCopy",
                  "(value: string) => void",
                  "-",
                  "Callback fired after a successful copy.",
                ],
                [
                  "onError",
                  "(error: unknown, value: string) => void",
                  "-",
                  "Callback fired when the Clipboard API is unavailable or rejects.",
                ],
                [
                  "window",
                  "Window",
                  "globalThis",
                  "Window override for tests or embedded contexts.",
                ],
              ],
            },
            title: "Options",
          },
          {
            id: "return-value",
            table: {
              columns: ["Property", "Type", "Description"],
              rows: [
                ["copy", "(value: string) => Promise<boolean>", "Copy text and report success."],
                ["copied", "Accessor<boolean>", "True while copied feedback is active."],
                ["status", 'Accessor<"idle" | "copied" | "error">', "Current copy lifecycle."],
                ["error", "Accessor<unknown>", "Last clipboard error."],
                ["isSupported", "() => boolean", "Whether writeText is available."],
                ["reset", "() => void", "Clear copied and error state."],
              ],
            },
            title: "Return value",
          },
        ],
      },
    ],
  },
  "use-media-query": {
    intro: (
      <MdxP class="mt-8">
        A Solid media query hook that subscribes to CSS media queries and returns a reactive
        accessor. It supports Tailwind-like breakpoint shorthand, object queries, raw CSS media
        strings, and SSR-safe defaults.
      </MdxP>
    ),
    sections: [
      {
        id: "usage",
        title: "Usage",
        children: [
          {
            body: (
              <MdxP>
                Use Tailwind variant syntax to match breakpoints. TypeScript provides autocomplete
                for the built-in breakpoint names.
              </MdxP>
            ),
            code: mediaQueryBreakpointCode,
            id: "breakpoint-shorthand",
            title: "Breakpoint shorthand",
          },
          {
            body: (
              <MdxP>
                Use the object form when you need pointer detection, orientation, preference checks,
                or custom pixel values.
              </MdxP>
            ),
            code: mediaQueryObjectCode,
            id: "object-api",
            title: "Object API",
          },
          {
            body: <MdxP>Pass any valid CSS media query string as an escape hatch.</MdxP>,
            code: mediaQueryRawCode,
            id: "raw-media-query",
            title: "Raw media query",
          },
          {
            body: (
              <MdxP>
                The primary use case: mount one component instead of another based on viewport.
              </MdxP>
            ),
            code: mediaQueryConditionalCode,
            id: "conditional-rendering",
            title: "Conditional rendering",
          },
        ],
      },
      {
        body: (
          <MdxP>
            The hook includes a static breakpoint map that should match your Tailwind theme.
          </MdxP>
        ),
        id: "breakpoints",
        table: {
          columns: ["Name", "Value"],
          rows: [
            ["sm", "640px"],
            ["md", "800px"],
            ["lg", "1024px"],
            ["xl", "1280px"],
            ["2xl", "1536px"],
            ["3xl", "1600px"],
            ["4xl", "2000px"],
          ],
        },
        title: "Breakpoints",
      },
      {
        code: mediaQueryApiCode,
        id: "api-reference",
        title: "API",
        children: [
          {
            id: "string-queries",
            table: {
              columns: ["Pattern", "Example", "Matches"],
              rows: [
                ['"{bp}"', '"md"', "Viewport >= breakpoint"],
                ['"max-{bp}"', '"max-md"', "Viewport < breakpoint"],
                ['"{bp}:max-{bp}"', '"md:max-lg"', "Between two breakpoints"],
                ['"(...)"', '"(prefers-color-scheme: dark)"', "Raw CSS media query"],
              ],
            },
            title: "String queries",
          },
          {
            id: "object-queries",
            table: {
              columns: ["Property", "Type", "Description"],
              rows: [
                ["min", "Breakpoint | number | string", "Min-width breakpoint name or CSS value."],
                ["max", "Breakpoint | number | string", "Max-width breakpoint name or CSS value."],
                ["pointer", '"coarse" | "fine" | "none"', "Pointer type."],
                ["orientation", '"landscape" | "portrait"', "Viewport orientation."],
                [
                  "preference",
                  '"dark" | "light" | "motion" | "reduced-motion"',
                  "Color-scheme or reduced-motion preference.",
                ],
              ],
            },
            title: "Object queries",
          },
          {
            body: (
              <MdxP>
                Returns an <InlineCode>Accessor&lt;boolean&gt;</InlineCode>. The accessor returns{" "}
                <InlineCode>true</InlineCode> when the query matches, <InlineCode>false</InlineCode>{" "}
                otherwise, and starts from <InlineCode>defaultValue</InlineCode> during SSR.
              </MdxP>
            ),
            id: "return-value",
            title: "Return value",
          },
        ],
      },
      {
        body: <MdxP>Resize the viewport to see values update in real time.</MdxP>,
        demo: () => <MediaQueryDemo />,
        id: "examples",
        title: "Examples",
      },
      {
        body: (
          <MdxP>
            The hook also exports <InlineCode>useIsMobile</InlineCode> for the common{" "}
            <InlineCode>max-md</InlineCode> check.
          </MdxP>
        ),
        code: useIsMobileCode,
        id: "convenience-export",
        title: "Convenience export",
      },
    ],
  },
};

export function RegistryDocPage(props: Readonly<{ slug: string }>) {
  const item = () => findDocItem(props.slug);

  return (
    <Show when={item()} fallback={<MissingDocPage slug={props.slug} />}>
      {(docItem) => {
        const docsBlueprint = docsBlueprintForItem(docItem());

        return (
          <RegistryDocContent
            item={docItem()}
            page={itemPageWithBlueprint(docItem(), docsBlueprint)}
            docsBlueprint={docsBlueprint}
          />
        );
      }}
    </Show>
  );
}

function RegistryDocContent(
  props: Readonly<{
    docsBlueprint: ComponentDocsBlueprint;
    item: RegistryDocItem;
    page: DocsPage;
  }>,
) {
  const markdown = () => pageMarkdown(props.item, props.docsBlueprint);
  const usageCode = () => props.docsBlueprint.usageCode || genericUsageCode(props.item);
  const description = () => props.docsBlueprint.description ?? props.item.description;
  const apiItems = () =>
    props.docsBlueprint.apiItems?.length
      ? props.docsBlueprint.apiItems
      : props.item.api
        ? [{ name: props.item.title, description: readableMetadata(props.item.api) }]
        : [];
  const hasPreview = () => props.item.type === "registry:ui";
  const hookDocs = () => hookDocsOverrides[props.item.name];
  const maturity = () => maturityLabel(props.docsBlueprint.maturity);

  return (
    <DocsPageFrame page={props.page}>
      <MdxContent id="top" class="component-doc">
        <PageHeader class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <PageHeaderHeading>{props.item.title}</PageHeaderHeading>
              <Badge class={`translate-y-0.5 ${maturityBadgeClass(maturity())}`}>
                {maturity()}
              </Badge>
            </div>
            <PageHeaderDescription>{description()}</PageHeaderDescription>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Show when={apiItems().length}>
              <ActionLink
                class={`${secondaryButtonClass} ${pageHeaderActionClass}`}
                href="#api-reference"
              >
                <ExternalLink size={16} />
                API Reference
              </ActionLink>
            </Show>
            <CopyPageButton
              class={pageHeaderActionClass}
              icon={<Copy aria-hidden="true" size={16} />}
              markdown={markdown()}
            />
          </div>
        </PageHeader>

        <Show
          when={hookDocs()}
          fallback={
            <>
              <Show when={hasPreview()}>
                <section id="preview" class={previewSectionClass}>
                  <HeroPreviewSection item={props.item} docsBlueprint={props.docsBlueprint} />
                </section>
              </Show>

              <Show when={showInstallationSection}>
                <DocSection id="installation" title="Installation">
                  <InstallationSection install={props.item.install} item={props.item} />
                </DocSection>
              </Show>

              <DocSection id="usage" title="Usage">
                <CodeBlock code={usageCode()} language="tsx" title="Usage" />
              </DocSection>

              <DocSection id="api-reference" title="API Reference">
                <Show
                  when={apiItems().length > 0}
                  fallback={<MdxP>No API reference has been documented yet.</MdxP>}
                >
                  <ApiReference items={apiItems()} />
                </Show>
              </DocSection>

              <Show when={props.docsBlueprint.examples?.length}>
                <DocSection contentClass="mb-5!" id="examples" title="Examples">
                  <div class="grid gap-8">
                    <For each={props.docsBlueprint.examples}>
                      {(example) => (
                        <article class="scroll-mt-24" id={example.id}>
                          <div class="mb-3">
                            <MdxH3 class="mt-0!">{example.title}</MdxH3>
                          </div>
                          <PreviewCodeTabs
                            class="mt-0! mb-0!"
                            preview={example.preview}
                            code={example.code}
                            align={example.align ?? props.docsBlueprint.previewAlign}
                            variant={
                              example.variant ?? props.docsBlueprint.heroVariant ?? "centered"
                            }
                          />
                        </article>
                      )}
                    </For>
                  </div>
                </DocSection>
              </Show>
            </>
          }
        >
          {(docs) => <HookDocsContent docs={docs()} item={props.item} />}
        </Show>
      </MdxContent>
    </DocsPageFrame>
  );
}

function HookDocsContent(props: Readonly<{ docs: HookDocsBlueprint; item: RegistryDocItem }>) {
  return (
    <>
      {props.docs.intro}

      <DocSection id="installation" title="Installation">
        <InstallationSection install={props.item.install} item={props.item} />
      </DocSection>

      <For each={props.docs.sections}>{(section) => <HookDocSection section={section} />}</For>
    </>
  );
}

function HookDocSection(props: Readonly<{ section: HookSection }>) {
  return (
    <DocSection id={props.section.id} title={props.section.title}>
      <HookSectionBody section={props.section} />
      <Show when={props.section.children?.length}>
        <div class="mt-6 grid gap-8">
          <For each={props.section.children}>
            {(child) => (
              <article class="scroll-mt-24" id={child.id}>
                <MdxH3 class="mt-0!">{child.title}</MdxH3>
                <HookSectionBody section={child} />
              </article>
            )}
          </For>
        </div>
      </Show>
    </DocSection>
  );
}

function HookSectionBody(props: Readonly<{ section: HookSubsection | HookSection }>) {
  return (
    <>
      <Show when={props.section.body}>{(body) => <div class="mb-4">{body()}</div>}</Show>
      <Show when={props.section.code}>{(code) => <CodeBlock code={code()} language="tsx" />}</Show>
      <Show when={props.section.table}>
        {(table) => (
          <MdxTable
            columns={table().columns}
            rows={table().rows.map((row) =>
              row.map((cell, index) => (
                <TableCellText column={table().columns[index] ?? ""} value={cell} />
              )),
            )}
          />
        )}
      </Show>
      <Show when={"demo" in props.section ? props.section.demo : undefined}>
        {(demo) => <div class="mt-5">{demo()()}</div>}
      </Show>
    </>
  );
}

function TableCellText(props: Readonly<{ column: string; value: string }>) {
  if (props.value === "-") return <span aria-label="None">-</span>;
  if (isCodeColumn(props.column)) return <InlineCode>{props.value}</InlineCode>;
  return <span>{props.value}</span>;
}

function isCodeColumn(column: string) {
  return ["Default", "Example", "Pattern", "Property", "Type"].includes(column);
}

function InlineCode(props: Readonly<{ children: JSX.Element }>) {
  return (
    <code class="break-all rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8125rem] text-muted-foreground">
      {props.children}
    </code>
  );
}

type MediaQueryDemoRow = {
  description?: string;
  label: string;
  value: Accessor<boolean>;
};

function MediaQueryDemoSection(
  props: Readonly<{ rows: readonly MediaQueryDemoRow[]; title: string }>,
) {
  return (
    <div>
      <h3 class="mb-2 font-medium text-foreground text-sm">{props.title}</h3>
      <ul class="divide-y divide-border rounded-xl border border-border">
        <For each={props.rows}>
          {(row) => (
            <li class="flex items-center justify-between gap-2 px-3 py-2.5">
              <div class="min-w-0">
                <InlineCode>{row.label}</InlineCode>
              </div>
              <div class="flex items-center gap-2">
                <Show when={row.description}>
                  {(description) => (
                    <span class="ms-2 text-muted-foreground text-xs">{description()}</span>
                  )}
                </Show>
                <span
                  class={cn(
                    "inline-flex h-6 min-w-11 shrink-0 items-center justify-center rounded-full px-2 font-medium text-xs",
                    row.value()
                      ? "bg-success/12 text-success-foreground dark:bg-success/20"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {row.value() ? "true" : "false"}
                </span>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

function MediaQueryDemo() {
  const sm = useMediaQuery("sm");
  const md = useMediaQuery("md");
  const lg = useMediaQuery("lg");
  const xl = useMediaQuery("xl");
  const xxl = useMediaQuery("2xl");

  const maxSm = useMediaQuery("max-sm");
  const maxMd = useMediaQuery("max-md");
  const maxLg = useMediaQuery("max-lg");

  const smToMd = useMediaQuery("sm:max-md");
  const mdToLg = useMediaQuery("md:max-lg");
  const lgToXl = useMediaQuery("lg:max-xl");

  const pointerCoarse = useMediaQuery({ pointer: "coarse" });
  const pointerFine = useMediaQuery({ pointer: "fine" });
  const darkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div class="my-8 flex flex-col gap-6">
      <MediaQueryDemoSection
        rows={[
          { description: ">= 640px", label: `useMediaQuery("sm")`, value: sm },
          { description: ">= 800px", label: `useMediaQuery("md")`, value: md },
          { description: ">= 1024px", label: `useMediaQuery("lg")`, value: lg },
          { description: ">= 1280px", label: `useMediaQuery("xl")`, value: xl },
          { description: ">= 1536px", label: `useMediaQuery("2xl")`, value: xxl },
        ]}
        title="Min-width (breakpoint and above)"
      />
      <MediaQueryDemoSection
        rows={[
          { description: "< 640px", label: `useMediaQuery("max-sm")`, value: maxSm },
          { description: "< 800px", label: `useMediaQuery("max-md")`, value: maxMd },
          { description: "< 1024px", label: `useMediaQuery("max-lg")`, value: maxLg },
        ]}
        title="Max-width (below breakpoint)"
      />
      <MediaQueryDemoSection
        rows={[
          { description: "640 - 799px", label: `useMediaQuery("sm:max-md")`, value: smToMd },
          { description: "800 - 1023px", label: `useMediaQuery("md:max-lg")`, value: mdToLg },
          { description: "1024 - 1279px", label: `useMediaQuery("lg:max-xl")`, value: lgToXl },
        ]}
        title="Ranges"
      />
      <MediaQueryDemoSection
        rows={[
          {
            description: "touch",
            label: `useMediaQuery({ pointer: "coarse" })`,
            value: pointerCoarse,
          },
          {
            description: "mouse",
            label: `useMediaQuery({ pointer: "fine" })`,
            value: pointerFine,
          },
          {
            label: `useMediaQuery("(prefers-color-scheme: dark)")`,
            value: darkMode,
          },
          {
            label: `useMediaQuery("(prefers-reduced-motion: reduce)")`,
            value: reducedMotion,
          },
        ]}
        title="Device and preferences"
      />
    </div>
  );
}

function InstallationSection(props: Readonly<{ install: string; item: RegistryDocItem }>) {
  const [mode, setMode] = createSignal<"cli" | "manual">("cli");
  const [manager, setManager] = createSignal<"bun" | "npm" | "pnpm" | "yarn">("bun");
  const packageName = () => props.install.replace(/^mason add\s+/, "");

  const cliCommands = () => {
    const name = packageName();
    return {
      bun: `bunx mason add ${name}`,
      npm: `npx -y mason add ${name}`,
      pnpm: `pnpm dlx mason add ${name}`,
      yarn: `yarn dlx mason add ${name}`,
    };
  };

  const manualInstructions = () =>
    [
      "# Copy source files from the registry default source path.",
      ...props.item.sourceFiles.map((file) => `cp ${file} ${manualTargetRoot(props.item)}`),
      "# Install runtime dependencies in your app.",
      runtimeDependencyCommand(props.item),
      "",
      "# If your app uses local registry mode:",
      props.item.registryDependencies.length
        ? `mason add ${packageName()} --registry <path-to-keystone>/registry/default`
        : "No extra registry dependencies were declared.",
    ].join("\n");

  return (
    <Tabs
      class="gap-0.5"
      onValueChange={(value) => setMode(value === "manual" ? "manual" : "cli")}
      value={mode()}
    >
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli">
        <Show when={mode() === "cli"}>
          <div data-rehype-pretty-code-figure="" class="relative !mt-0">
            <div class="flex min-h-11 items-center gap-2 border-border/64 border-b px-4 py-1 font-mono">
              <Terminal class="size-4 text-code-foreground" aria-hidden="true" />
              <div class="flex items-center gap-0.5">
                {(["bun", "npm", "pnpm", "yarn"] as const).map((next) => (
                  <button
                    class={subTabButtonClass(manager() === next)}
                    onClick={() => setManager(next)}
                    type="button"
                  >
                    {next}
                  </button>
                ))}
              </div>
            </div>
            <CopyInstallButton command={cliCommands()[manager()]} />
            <div class="px-4 py-3.5">
              <pre class="scrollbar-none m-0 overflow-x-auto overflow-y-hidden font-mono text-[0.8125rem] leading-none">
                <code class="inline-flex min-w-max items-center gap-2">
                  <span
                    aria-hidden="true"
                    class="select-none font-semibold text-success-foreground"
                  >
                    $
                  </span>
                  <span>{cliCommands()[manager()]}</span>
                </code>
              </pre>
            </div>
          </div>
        </Show>
      </TabsContent>
      <TabsContent value="manual">
        <div class="[&_[data-rehype-pretty-code-figure]]:!mt-0 [&_[data-slot=copy-button]]:border-0">
          <CodeBlock code={manualInstructions()} language="shell" title="Manual install" />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function manualTargetRoot(item: RegistryDocItem) {
  switch (item.type) {
    case "registry:hook":
      return "./src/hooks/";
    case "registry:lib":
      return "./src/lib/";
    default:
      return "./src/components/ui/";
  }
}

function runtimeDependencyCommand(item: RegistryDocItem) {
  const dependencies = item.dependencies.filter((dep) => dep !== "cn");
  return dependencies.length
    ? `bun add ${dependencies.join(" ")}`
    : "No runtime dependencies declared.";
}

function CopyInstallButton(props: Readonly<{ command: string }>) {
  return (
    <button
      class="absolute top-1.5 right-1.5 z-10 inline-flex size-8 items-center justify-center rounded-md text-code-foreground/70 outline-none transition-colors hover:bg-code-highlight hover:text-code-foreground focus-visible:bg-code-highlight focus-visible:text-code-foreground focus-visible:ring-2 focus-visible:ring-ring"
      data-slot="copy-button"
      onClick={async () => navigator.clipboard?.writeText(props.command)}
      title="Copy command"
      type="button"
    >
      <span class="sr-only">Copy command</span>
      <Clipboard aria-hidden="true" size={15} />
    </button>
  );
}

function HeroPreviewSection(
  props: Readonly<{ item: RegistryDocItem; docsBlueprint: ComponentDocsBlueprint }>,
) {
  const heroExample = () =>
    props.docsBlueprint.examples?.[0] ??
    ({ preview: () => <ComponentPreview item={props.item} /> } as CodeExample);
  const firstCode = () =>
    props.docsBlueprint.examples?.[0]?.code ??
    `import { ${props.item.title.replace(/\s+/g, "")} } from "@/components/ui/${props.item.name}";`;

  return (
    <PreviewCodeTabs
      preview={() => heroExample().preview()}
      code={firstCode()}
      align={heroExample().align ?? props.docsBlueprint.previewAlign}
      variant={heroExample().variant ?? props.docsBlueprint.heroVariant ?? "centered"}
    />
  );
}

function PreviewCodeTabs(
  props: Readonly<{
    align?: PreviewAlign;
    class?: string;
    preview: () => JSX.Element;
    code: string;
    variant?: PreviewVariant;
  }>,
) {
  const [tab, setTab] = createSignal<"preview" | "code">("preview");
  const selectTab = (value: string) => {
    if (value === "preview" || value === "code") setTab(value);
  };
  const align = () => props.align ?? "center";

  return (
    <div class={cn("group relative mt-4 flex flex-col gap-2", props.class)}>
      <Tabs onValueChange={selectTab} value={tab()}>
        <div class="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      <div class="relative rounded-xl border not-dark:bg-card" data-tab={tab()}>
        <div class="invisible data-[active=true]:visible" data-active={tab() === "preview"}>
          <div
            class="flex min-h-[430px] w-full justify-center overflow-y-auto bg-sidebar/24 p-8 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center sm:p-10 max-sm:min-h-[380px] max-sm:px-5"
            data-align={align()}
          >
            <div
              class={previewFrameClass(props.variant ?? "centered", align())}
              data-slot="preview"
            >
              {props.preview()}
            </div>
          </div>
        </div>
        <div
          class="absolute inset-0 hidden overflow-hidden data-[active=true]:block **:[figure]:m-0! **:[pre]:h-[430px]"
          data-active={tab() === "code"}
          data-slot="code"
        >
          <CodeBlock code={props.code} language="tsx" />
        </div>
      </div>
    </div>
  );
}

function DocSection(
  props: Readonly<{
    children: JSX.Element;
    contentClass?: string;
    description?: string;
    id: string;
    title: string;
  }>,
) {
  return (
    <section id={props.id} class={docsSectionClass}>
      <div class={cn(props.description ? "mb-6" : "mb-5", props.contentClass)}>
        <MdxH2 class={props.description ? undefined : "mb-0"} id={`${props.id}-heading`}>
          {props.title}
        </MdxH2>
        <Show when={props.description}>{(description) => <MdxP>{description()}</MdxP>}</Show>
      </div>
      {props.children}
    </section>
  );
}

function ApiReference(props: Readonly<{ items: readonly ApiReferenceItem[] }>) {
  return (
    <div class="mt-3 grid gap-10">
      <For each={props.items}>
        {(item) => (
          <article class="scroll-mt-24">
            <h3
              class="m-0 scroll-mt-24 font-semibold text-foreground text-lg leading-tight"
              id={`api-${apiReferenceId(item.name)}`}
            >
              <a
                class="no-underline hover:underline hover:underline-offset-4"
                href={`#api-${apiReferenceId(item.name)}`}
              >
                {item.name}
              </a>
            </h3>
            <ApiReferenceDescription text={item.description} />
          </article>
        )}
      </For>
    </div>
  );
}

function ApiReferenceDescription(props: Readonly<{ text: string }>) {
  const parts = () => props.text.split(/(`[^`]+`)/g).filter(Boolean);

  return (
    <p class="m-0 mt-2 max-w-3xl text-muted-foreground text-base leading-relaxed">
      <For each={parts()}>
        {(part) =>
          part.startsWith("`") && part.endsWith("`") ? (
            <code class="rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8125rem] text-muted-foreground">
              {part.slice(1, -1)}
            </code>
          ) : (
            part
          )
        }
      </For>
    </p>
  );
}

function apiReferenceId(name: string) {
  return name
    .trim()
    .replace(/['?]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function previewFrameClass(variant: PreviewVariant, align: PreviewAlign) {
  const base = "flex min-h-full w-full justify-center";
  const aligned = `${base} ${previewFrameAlignClass(align)}`;
  switch (variant) {
    case "inline":
      return aligned;
    case "full":
      return `${base} items-stretch`;
    case "dense":
      return `${base} items-stretch`;
    case "centered":
      return aligned;
  }
}

function previewFrameAlignClass(align: PreviewAlign) {
  switch (align) {
    case "center":
      return "items-center";
    case "end":
      return "items-end";
    case "start":
      return "items-start";
  }
}

function docsBlueprintForItem(item: RegistryDocItem): ComponentDocsBlueprint {
  return {
    ...(componentDocsOverrides[item.name] ?? { usageCode: genericUsageCode(item) }),
    maturity: componentMaturity(item),
  };
}

function itemPageWithBlueprint(item: RegistryDocItem, blueprint: ComponentDocsBlueprint): DocsPage {
  const hookDocs = hookDocsOverrides[item.name];
  const toc = itemToc(item);
  const apiReferenceItems = blueprint.apiItems ?? [];
  const exampleItems = blueprint.examples ?? [];
  const hasApi = Boolean(apiReferenceItems.length || item.api);
  const hasUsage = Boolean(blueprint.usageCode || item.title);
  const hasExamples = Boolean(exampleItems.length);

  return {
    description: blueprint.description ?? item.description,
    href: `/docs/components/${item.name}`,
    label: item.title,
    title: item.title,
    toc: hookDocs
      ? [
          { label: "Installation", href: "#installation" },
          ...hookDocs.sections.flatMap((section) => [
            { label: section.title, href: `#${section.id}` },
            ...(section.children ?? []).map((child) => ({
              depth: 3,
              label: child.title,
              href: `#${child.id}`,
            })),
          ]),
        ]
      : [
          ...(toc.some((item) => item.href === "#preview")
            ? [{ label: "Preview", href: "#preview" }]
            : []),
          ...(showInstallationSection && toc.some((item) => item.href === "#installation")
            ? [{ label: "Installation", href: "#installation" }]
            : []),
          ...(hasUsage ? [{ label: "Usage", href: "#usage" }] : []),
          ...(hasApi
            ? [
                { label: "API Reference", href: "#api-reference" },
                ...apiReferenceItems.map((api) => ({
                  depth: 3,
                  label: api.name,
                  href: `#api-${apiReferenceId(api.name)}`,
                })),
              ]
            : []),
          ...(hasExamples
            ? [
                { label: "Examples", href: "#examples" },
                ...exampleItems.map((example) => ({
                  depth: 3,
                  label: example.title,
                  href: `#${example.id}`,
                })),
              ]
            : []),
        ],
  };
}

function genericUsageCode(item: RegistryDocItem) {
  const componentName = toPascalCase(item.title);
  return `import { ${componentName} } from "@/components/ui/${item.name}";

<${componentName} />`;
}

function toPascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function subTabButtonClass(active: boolean) {
  return active
    ? "relative inline-flex h-8 items-center rounded-lg bg-accent px-3 text-xs font-medium text-accent-foreground transition-colors"
    : "relative inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium text-code-foreground/70 transition-colors hover:bg-code-highlight hover:text-code-foreground";
}

function readableKey(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pageMarkdown(item: RegistryDocItem, blueprint: ComponentDocsBlueprint) {
  const hookDocs = hookDocsOverrides[item.name];
  if (hookDocs) return hookPageMarkdown(item, hookDocs);

  const sections = [
    `# ${item.title}`,
    blueprint.description ?? item.description,
    showInstallationSection ? `## Installation\n\n\`\`\`shell\n${item.install}\n\`\`\`` : "",
    `## Usage\n\n${blueprint.usageCode}`,
    blueprint.apiItems?.length
      ? `## API Reference\n\n${blueprint.apiItems.map((api) => `- ${api.name}: ${api.description}`).join("\n")}`
      : item.api
        ? `## API Reference\n\n${readableMetadata(item.api)}`
        : "",
    blueprint.examples?.length
      ? `## Examples\n\n${blueprint.examples.map((example) => `### ${example.title}\n\n\`\`\`tsx\n${example.code}\n\`\`\``).join("\n\n")}`
      : "",
  ];

  return sections.filter(Boolean).join("\n\n");
}

function hookPageMarkdown(item: RegistryDocItem, docs: HookDocsBlueprint) {
  return [
    `# ${item.title}`,
    item.description,
    `## Installation\n\n\`\`\`shell\n${item.install}\n\`\`\``,
    ...docs.sections.map(hookSectionMarkdown),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function hookSectionMarkdown(section: HookSection | HookSubsection) {
  return [
    `## ${section.title}`,
    section.code ? `\`\`\`tsx\n${section.code}\n\`\`\`` : "",
    section.table ? markdownTable(section.table) : "",
    "children" in section ? (section.children ?? []).map(hookSubsectionMarkdown).join("\n\n") : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function hookSubsectionMarkdown(section: HookSubsection) {
  return [
    `### ${section.title}`,
    section.code ? `\`\`\`tsx\n${section.code}\n\`\`\`` : "",
    section.table ? markdownTable(section.table) : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function markdownTable(table: HookTable) {
  const header = `| ${table.columns.join(" |")} |`;
  const divider = `| ${table.columns.map(() => "---").join(" | ")} |`;
  const rows = table.rows.map((row) => `| ${row.join(" | ")} |`);
  return [header, divider, ...rows].join("\n");
}

function readableMetadata(
  value: string | readonly string[] | Readonly<Record<string, readonly string[]>>,
) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return Object.entries(value)
    .map(([key, entries]) => `${readableKey(key)}: ${entries.join(", ")}`)
    .join("; ");
}

function MissingDocPage(props: Readonly<{ slug: string }>) {
  const page: DocsPage = {
    description: "No generated registry page exists for this item.",
    href: `/docs/components/${props.slug}`,
    label: "Missing",
    title: "Missing Page",
    toc: [{ label: "Missing Item", href: "#missing-item" }],
  };

  return (
    <DocsPageFrame page={page}>
      <MdxContent id="top">
        <PageHeader id="missing-item">
          <Badge>Missing</Badge>
          <PageHeaderHeading>No docs page found.</PageHeaderHeading>
          <PageHeaderDescription>
            The registry does not include an item named <code>{props.slug}</code>.
          </PageHeaderDescription>
          <ActionLink class={`${secondaryButtonClass} mt-6`} href="/docs">
            <Puzzle size={16} />
            Back to docs
          </ActionLink>
        </PageHeader>
      </MdxContent>
    </DocsPageFrame>
  );
}
