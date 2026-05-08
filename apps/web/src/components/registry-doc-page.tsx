import { Clipboard, Copy, ExternalLink, Puzzle, Terminal } from "lucide-solid";
import { For, Show, createSignal, type JSX } from "solid-js";

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
import { componentDocsOverrides, hookDocsOverrides } from "../docs/registry-doc-blueprints";
import { InlineCode } from "../docs/hook-doc-widgets";
import type {
  ApiReferenceItem,
  CodeExample,
  ComponentDocsBlueprint,
  HookDocsBlueprint,
  HookSection,
  HookSubsection,
  HookTable,
  PreviewAlign,
  PreviewVariant,
} from "../docs/registry-doc-types";
import {
  componentMaturity,
  docsItemTitle,
  findDocItem,
  itemToc,
  type DocsPage,
} from "@/lib/docs-data";
import type { RegistryDocItem } from "@/lib/registry-docs.gen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@keystone-ui/ui/tabs";

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
  const displayTitle = () => docsItemTitle(props.item);
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
              <PageHeaderHeading>{displayTitle()}</PageHeaderHeading>
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

function InstallationSection(props: Readonly<{ install: string; item: RegistryDocItem }>) {
  const [mode, setMode] = createSignal<"cli" | "manual">("cli");
  const [manager, setManager] = createSignal<"bun" | "npm" | "pnpm" | "yarn">("bun");
  const registryRef = () =>
    props.install.replace(/^(?:mason|shadcn) add\s+/, "") ||
    `https://keystone-ui.dev/r/${props.item.name}.json`;

  const cliCommands = () => {
    const ref = registryRef();
    return {
      bun: `bunx shadcn@latest add ${ref}`,
      npm: `npx shadcn@latest add ${ref}`,
      pnpm: `pnpm dlx shadcn@latest add ${ref}`,
      yarn: `yarn dlx shadcn@latest add ${ref}`,
    };
  };

  const manualInstructions = () =>
    [
      "# Copy source files from the registry source path to the shadcn target path.",
      ...props.item.files.map(
        (file) => `cp ${file.path} ${file.target ?? manualTargetRoot(props.item)}`,
      ),
      "# Install runtime dependencies in your app.",
      runtimeDependencyCommand(props.item),
      "",
      "# If your app uses local registry mode, build the registry and add the generated item.",
      props.item.registryDependencies.length
        ? `pnpm dlx shadcn@latest add <path-to-keystone>/apps/web/public/r/${props.item.name}.json`
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
      <div class="rounded-xl border not-dark:bg-card" data-tab={tab()}>
        <div class="hidden data-[active=true]:block" data-active={tab() === "preview"}>
          <div
            class="flex min-h-[430px] w-full justify-center overflow-visible bg-sidebar/24 p-8 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center sm:p-10 max-sm:min-h-[380px] max-sm:px-5"
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
          class="hidden overflow-hidden data-[active=true]:block **:[figure]:m-0! **:[pre]:h-[430px]"
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
    label: docsItemTitle(item),
    title: docsItemTitle(item),
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
