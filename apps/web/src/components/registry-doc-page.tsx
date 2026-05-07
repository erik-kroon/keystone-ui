import { Clipboard, Copy, ExternalLink, Puzzle, Terminal } from "lucide-solid";
import { For, Show, createSignal, type JSX } from "solid-js";

import { ComponentPreview } from "@/components/component-preview";
import {
  ActionLink,
  Badge,
  CodeBlock,
  CopyPageButton,
  DocsPageFrame,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  secondaryButtonClass,
} from "@/components/docs-shell";
import { MdxContent, MdxH2, MdxH3, MdxList, MdxP, MdxTable } from "@/components/mdx-components";
import {
  anatomyParts,
  componentMaturity,
  findDocItem,
  itemToc,
  type DocsPage,
} from "@/lib/docs-data";
import type { RegistryDocItem } from "@/lib/registry-docs.gen";
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

const pageHeaderActionClass =
  "!h-7 !min-h-7 gap-1 rounded-md px-2 text-sm shadow-none sm:!h-6 sm:!min-h-6 sm:text-xs [&>svg]:size-4 [&>svg]:opacity-80 sm:[&>svg]:size-3.5";

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
        title: "Single accordion",
        variant: "centered",
      },
      {
        code: multipleAccordionCode,
        description: "Open more than one item at a time.",
        id: "multiple",
        preview: () => <MultipleAccordionExample />,
        title: "Multiple accordion",
        variant: "centered",
      },
      {
        code: controlledAccordionCode,
        description: "Drive open items from parent state.",
        id: "controlled",
        preview: () => <ControlledAccordionExample />,
        title: "Controlled accordion",
        variant: "centered",
      },
      {
        code: disabledAccordionCode,
        description: "Disable specific items while keeping keyboard navigation.",
        id: "disabled",
        preview: () => <DisabledItemAccordionExample />,
        title: "Disabled item",
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
        title: "Project card",
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
        title: "Controlled checkbox",
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
        title: "Basic dialog",
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
        title: "Basic popover",
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
        title: "Basic select",
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
        title: "Basic tabs",
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
        title: "Basic toast",
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
        title: "Basic tooltip",
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
  const anatomy = () => anatomyParts(props.item);
  const blueprintDataAttributes = () => props.docsBlueprint.dataAttributes ?? [];
  const blueprintCssVariables = () => props.docsBlueprint.cssVariables ?? [];
  const apiItems = () =>
    props.docsBlueprint.apiItems?.length
      ? props.docsBlueprint.apiItems
      : props.item.api
        ? [{ name: props.item.title, description: readableMetadata(props.item.api) }]
        : [];
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

        <section id="preview" class="mt-8 scroll-mt-24">
          <HeroPreviewSection item={props.item} docsBlueprint={props.docsBlueprint} />
        </section>

        <DocSection id="installation" title="Installation">
          <InstallationSection install={props.item.install} item={props.item} />
        </DocSection>

        <DocSection
          id="usage"
          title="Usage"
          description="Import the generated source and compose it in application code."
        >
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
          <DocSection id="examples" title="Examples">
            <div class="grid gap-10">
              <For each={props.docsBlueprint.examples}>
                {(example) => (
                  <article class="scroll-mt-24" id={example.id}>
                    <div class="mb-6">
                      <MdxH3 class="mt-0">{example.title}</MdxH3>
                      <MdxP>{example.description}</MdxP>
                    </div>
                    <PreviewCodeTabs
                      preview={example.preview}
                      code={example.code}
                      align={example.align ?? props.docsBlueprint.previewAlign}
                      variant={example.variant ?? props.docsBlueprint.heroVariant ?? "centered"}
                    />
                  </article>
                )}
              </For>
            </div>
          </DocSection>
        </Show>

        <Show
          when={props.docsBlueprint.accessibility || props.item.accessibility || props.item.state}
        >
          <DocSection id="accessibility-keyboard" title="Accessibility / Keyboard Interactions">
            <Show when={props.docsBlueprint.accessibility?.length}>
              <div class="mt-4">
                <MdxH3>Accessibility</MdxH3>
                <MdxList>
                  <For each={props.docsBlueprint.accessibility}>{(item) => <li>{item}</li>}</For>
                </MdxList>
              </div>
            </Show>
            <Show when={props.docsBlueprint.keyboardInteractions?.length}>
              <div class="mt-5">
                <MdxH3>Keyboard</MdxH3>
                <MdxList>
                  <For each={props.docsBlueprint.keyboardInteractions}>
                    {(item) => <li>{item}</li>}
                  </For>
                </MdxList>
              </div>
            </Show>
            <Show
              when={
                !props.docsBlueprint.accessibility?.length ? props.item.accessibility : undefined
              }
            >
              {(accessibility) => <MdxP>{readableMetadata(accessibility())}</MdxP>}
            </Show>
            <Show when={props.item.state}>
              <MdxP>State metadata: {props.item.state}</MdxP>
            </Show>
          </DocSection>
        </Show>

        <Show
          when={
            blueprintDataAttributes().length ||
            props.item.dataAttributes ||
            blueprintCssVariables().length
          }
        >
          <DocSection id="data-attributes" title="Data Attributes / CSS Variables">
            <Show when={props.docsBlueprint.dataAttributeDescription}>
              <MdxP>{props.docsBlueprint.dataAttributeDescription}</MdxP>
            </Show>
            <Show when={blueprintDataAttributes().length}>
              <MdxTable
                columns={["Attribute", "Description"]}
                rows={blueprintDataAttributes().map(([key, value]) => [key, value])}
              />
            </Show>
            <Show when={props.item.dataAttributes}>
              {(dataAttributes) => (
                <p class="mt-4 text-muted-foreground text-sm leading-7">
                  Source metadata mentions: {readableMetadata(dataAttributes())}
                </p>
              )}
            </Show>
            <Show when={blueprintCssVariables().length}>
              <div class="mt-4">
                <MdxH3>CSS Variables</MdxH3>
                <MdxTable
                  columns={["Variable", "Description"]}
                  rows={blueprintCssVariables().map(([key, value]) => [key, value])}
                />
              </div>
            </Show>
          </DocSection>
        </Show>

        <Show when={anatomy().length}>
          <DocSection
            id="anatomy"
            title="Anatomy"
            description="Stable parts help with component-specific styling and predictable behavior hooks."
          >
            <div class="mt-4 flex flex-wrap gap-2">
              <For each={anatomy()}>
                {(part) => (
                  <span class="rounded-md border border-border bg-muted px-2 py-1 font-mono text-foreground text-xs">
                    {part}
                  </span>
                )}
              </For>
            </div>
          </DocSection>
        </Show>

        <DocSection id="source-registry-details" title="Source and registry details">
          <details class="group rounded-lg border border-border bg-card">
            <summary class="cursor-pointer list-none px-4 py-3 font-medium text-sm">
              Source and registry details
            </summary>
            <div class="px-4 pb-4">
              <Show when={props.item.dependencies.length || props.item.registryDependencies.length}>
                <MdxH3>Dependencies</MdxH3>
                <MdxTable
                  columns={["Kind", "Values"]}
                  rows={[
                    [
                      "Registry",
                      props.item.registryDependencies.length
                        ? props.item.registryDependencies.join(", ")
                        : "None",
                    ],
                    [
                      "Runtime",
                      props.item.dependencies.length ? props.item.dependencies.join(", ") : "None",
                    ],
                  ]}
                />
              </Show>

              <Show when={props.item.sourceFiles.length}>
                <div class="mt-6">
                  <MdxH3>Source files</MdxH3>
                  <div class="mt-3 space-y-2">
                    <For each={props.item.sourceFiles}>
                      {(file) => (
                        <p class="m-0 rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs">
                          {file}
                        </p>
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={Object.keys(props.item.parity).length}>
                <div class="mt-6">
                  <MdxH3>Parity notes</MdxH3>
                  <Show when={Boolean(Object.keys(props.item.compatibility).length)}>
                    <MdxList>
                      <For each={Object.entries(props.item.compatibility)}>
                        {([label, version]) => <li>{`${label}: ${version}`}</li>}
                      </For>
                    </MdxList>
                  </Show>
                  <Show when={Object.values(props.item.parity).length}>
                    <MdxList class="mt-4">
                      <For each={Object.entries(props.item.parity)}>
                        {([label, value]) => <li>{`${readableKey(label)}: ${value}`}</li>}
                      </For>
                    </MdxList>
                  </Show>
                </div>
              </Show>
            </div>
          </details>
        </DocSection>
      </MdxContent>
    </DocsPageFrame>
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
      "# Copy source files from the registry default UI source path.",
      ...props.item.sourceFiles.map((file) => `cp ${file} ./src/components/ui/`),
      "# Install runtime dependencies in your app.",
      `bun add ${props.item.dependencies.filter((dep) => dep !== "cn").join(" ") || "<deps>"}`,
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
    <div class="group relative mt-4 mb-12 flex flex-col gap-2">
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
            class="flex h-[450px] w-full justify-center overflow-y-auto p-10 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center max-sm:px-6"
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
          class="absolute inset-0 hidden overflow-hidden data-[active=true]:block **:[figure]:m-0! **:[pre]:h-[450px]"
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
    description?: string;
    id: string;
    title: string;
  }>,
) {
  return (
    <section id={props.id} class="mt-18 scroll-mt-24">
      <div class={props.description ? "mb-6" : "mb-5"}>
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
    <p class="m-0 mt-6 max-w-3xl text-muted-foreground text-base leading-relaxed">
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
  const toc = itemToc(item);
  const hasApi = Boolean(blueprint.apiItems?.length || item.api);
  const hasUsage = Boolean(blueprint.usageCode || item.title);
  const hasExamples = Boolean(blueprint.examples?.length);
  const hasAccessibility = Boolean(
    blueprint.accessibility?.length ||
    blueprint.keyboardInteractions?.length ||
    item.accessibility ||
    item.state,
  );
  const hasDataAttributes =
    Boolean(blueprint.dataAttributes?.length) ||
    Boolean(blueprint.cssVariables?.length) ||
    Boolean(item.dataAttributes);

  return {
    description: blueprint.description ?? item.description,
    href: `/docs/components/${item.name}`,
    label: item.title,
    title: item.title,
    toc: [
      ...(toc.some((item) => item.href === "#preview")
        ? [{ label: "Preview", href: "#preview" }]
        : []),
      ...(toc.some((item) => item.href === "#installation")
        ? [{ label: "Installation", href: "#installation" }]
        : []),
      ...(hasUsage ? [{ label: "Usage", href: "#usage" }] : []),
      ...(hasApi ? [{ label: "API Reference", href: "#api-reference" }] : []),
      ...(hasExamples ? [{ label: "Examples", href: "#examples" }] : []),
      ...(hasAccessibility
        ? [{ label: "Accessibility / Keyboard", href: "#accessibility-keyboard" }]
        : []),
      ...(hasDataAttributes ? [{ label: "Data attributes", href: "#data-attributes" }] : []),
      ...(anatomyParts(item).length ? [{ label: "Anatomy", href: "#anatomy" }] : []),
      { label: "Source and registry details", href: "#source-registry-details" },
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
  const sections = [
    `# ${item.title}`,
    blueprint.description ?? item.description,
    `## Installation\n\n\`\`\`shell\n${item.install}\n\`\`\``,
    `## Usage\n\n${blueprint.usageCode}`,
    blueprint.apiItems?.length
      ? `## API Reference\n\n${blueprint.apiItems.map((api) => `- ${api.name}: ${api.description}`).join("\n")}`
      : item.api
        ? `## API Reference\n\n${readableMetadata(item.api)}`
        : "",
    anatomyParts(item).length
      ? `## Anatomy\n\n${anatomyParts(item)
          .map((part) => `- ${part}`)
          .join("\n")}`
      : "",
    `## Source and registry details\n\n${item.sourceFiles.map((file) => `- ${file}`).join("\n")}`,
  ];

  return sections.filter(Boolean).join("\n\n");
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
