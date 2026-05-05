import { FileCode2, GitCompareArrows, Package, Puzzle, ScrollText } from "lucide-solid";
import { For, Show } from "solid-js";

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
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/docs-shell";
import { MdxContent, MdxH2, MdxP, MdxTable } from "@/components/mdx-components";
import { findDocItem, itemPage, registryTypeLabel, type DocsPage } from "@/lib/docs-data";
import type { RegistryDocItem } from "@/lib/registry-docs.gen";

export function RegistryDocPage(props: Readonly<{ slug: string }>) {
  const item = () => findDocItem(props.slug);

  return (
    <Show when={item()} fallback={<MissingDocPage slug={props.slug} />}>
      {(docItem) => <RegistryDocContent item={docItem()} page={itemPage(docItem())} />}
    </Show>
  );
}

function RegistryDocContent(props: Readonly<{ item: RegistryDocItem; page: DocsPage }>) {
  const markdown = () => pageMarkdown(props.item);

  return (
    <DocsPageFrame page={props.page}>
      <MdxContent id="top">
        <PageHeader class="flex flex-col gap-8">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <Badge>{registryTypeLabel(props.item.type)}</Badge>
              <Show when={props.item.version}>
                {(version) => (
                  <span class="font-mono text-muted-foreground text-xs">v{version()}</span>
                )}
              </Show>
            </div>
            <PageHeaderHeading>{props.item.title}</PageHeaderHeading>
            <PageHeaderDescription>{props.item.description}</PageHeaderDescription>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <ActionLink class={primaryButtonClass} href="#installation">
              <Package size={16} />
              Install
            </ActionLink>
            <CopyPageButton markdown={markdown()} />
          </div>
        </PageHeader>

        <section id="installation" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Installation</MdxH2>
          <MdxP>
            Add this registry item with Mason. The command installs the component source plus any
            Keystone registry dependencies listed below.
          </MdxP>
          <CodeBlock code={props.item.install} language="shell" title="Mason" />
        </section>

        <section id="preview" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Preview</MdxH2>
          <ComponentPreview item={props.item} />
        </section>

        <Show when={props.item.api || props.item.dataShape || props.item.state}>
          <section id="api-notes" class="mt-12 scroll-mt-24 lg:mt-16">
            <MdxH2>API Notes</MdxH2>
            <InfoStack
              items={[
                ["API", props.item.api],
                ["Data shape", props.item.dataShape],
                ["State", props.item.state],
                ["Columns", props.item.columns],
                ["Router adapter", props.item.routerAdapter],
              ]}
            />
          </section>
        </Show>

        <Show when={props.item.anatomy.length}>
          <section id="anatomy" class="mt-12 scroll-mt-24 lg:mt-16">
            <MdxH2>Anatomy</MdxH2>
            <MdxP>
              Generated source exposes stable parts for styling and documentation. Core-backed
              primitives keep behavior in Core while the UI layer owns class names and tokens.
            </MdxP>
            <div class="mt-4 flex flex-wrap gap-2">
              <For each={props.item.anatomy}>
                {(part) => (
                  <span class="rounded-md border border-border bg-muted px-2 py-1 font-mono text-foreground text-xs">
                    {part}
                  </span>
                )}
              </For>
            </div>
          </section>
        </Show>

        <Show when={props.item.dependencies.length || props.item.registryDependencies.length}>
          <section id="dependencies" class="mt-12 scroll-mt-24 lg:mt-16">
            <MdxH2>Dependencies</MdxH2>
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
          </section>
        </Show>

        <section id="source-files" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Source Files</MdxH2>
          <MdxP>
            Mason copies these paths into the target project according to the registry contract.
          </MdxP>
          <div class="mt-4 grid gap-2">
            <For each={props.item.sourceFiles}>
              {(file) => (
                <div class="flex min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-muted-foreground shadow-xs">
                  <FileCode2 size={15} />
                  <code class="min-w-0 bg-transparent p-0 [overflow-wrap:anywhere]">{file}</code>
                </div>
              )}
            </For>
          </div>
        </section>

        <Show when={Object.keys(props.item.parity).length}>
          <section id="parity-notes" class="mt-12 scroll-mt-24 lg:mt-16">
            <MdxH2>Parity Notes</MdxH2>
            <InfoStack
              icon="parity"
              items={Object.entries(props.item.parity).map(([label, value]) => [
                readableKey(label),
                value,
              ])}
            />
          </section>
        </Show>
      </MdxContent>
    </DocsPageFrame>
  );
}

function InfoStack(
  props: Readonly<{
    icon?: "notes" | "parity";
    items: readonly (readonly [string, string | undefined])[];
  }>,
) {
  const visibleItems = () => props.items.filter(([, value]) => value);

  return (
    <div class="mt-4 grid gap-3">
      <For each={visibleItems()}>
        {([label, value]) => (
          <section class="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-card p-4 shadow-xs">
            <span class="inline-flex size-8 items-center justify-center rounded-md border border-border bg-muted text-primary">
              {props.icon === "parity" ? <GitCompareArrows size={16} /> : <ScrollText size={16} />}
            </span>
            <div>
              <h3 class="m-0 font-semibold text-base text-foreground">{label}</h3>
              <p class="mt-2 text-muted-foreground text-sm leading-6">{value}</p>
            </div>
          </section>
        )}
      </For>
    </div>
  );
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

function readableKey(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pageMarkdown(item: RegistryDocItem) {
  const sections = [
    `# ${item.title}`,
    item.description,
    `## Installation\n\n\`\`\`shell\n${item.install}\n\`\`\``,
    item.api ? `## API\n\n${item.api}` : "",
    item.anatomy.length
      ? `## Anatomy\n\n${item.anatomy.map((part) => `- ${part}`).join("\n")}`
      : "",
    item.sourceFiles.length
      ? `## Source Files\n\n${item.sourceFiles.map((file) => `- ${file}`).join("\n")}`
      : "",
  ];

  return sections.filter(Boolean).join("\n\n");
}
