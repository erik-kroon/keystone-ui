import { ArrowRight, Boxes, FileCode2, Layers, PackageCheck } from "lucide-solid";
import { For, type JSX } from "solid-js";

import {
  ActionLink,
  Badge,
  CodeBlock,
  DocsPageFrame,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/docs-shell";
import { MdxContent, MdxH2, MdxP, MdxTable } from "@/components/mdx-components";
import {
  blockDocs,
  componentDocs,
  componentHref,
  overviewPage,
  utilityDocs,
} from "@/lib/docs-data";

export function DocsOverview() {
  return (
    <DocsPageFrame page={overviewPage}>
      <MdxContent id="top">
        <PageHeader class="flex flex-col gap-8">
          <div class="flex flex-col gap-2">
            <Badge class="self-start">Keystone UI documentation</Badge>
            <PageHeaderHeading>Solid primitives and source-owned UI.</PageHeaderHeading>
            <PageHeaderDescription>
              A Coss-inspired docs shell for the current Keystone registry: generated component
              pages, Mason install instructions, registry metadata, source files, and right-side
              page navigation.
            </PageHeaderDescription>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <ActionLink class={primaryButtonClass} href="/docs/components/button">
              Browse Components
              <ArrowRight size={16} />
            </ActionLink>
            <ActionLink class={secondaryButtonClass} href="#get-started">
              Get Started
            </ActionLink>
          </div>
        </PageHeader>

        <section id="get-started" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Get Started</MdxH2>
          <MdxP>
            Install source through Mason when you want editable UI in the target project. Import
            Core directly only when the app needs headless primitive behavior without the styled
            registry layer.
          </MdxP>
          <CodeBlock
            code={`bunx mason add button dialog select-field
bun add @keystone-ui/core`}
            language="shell"
            title="Install Core and registry source"
          />
        </section>

        <section id="core-ui-layers" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Core and UI Layers</MdxH2>
          <div class="mt-5 grid gap-3 md:grid-cols-3">
            <FeatureCard
              description="Headless behavior, ARIA relationships, keyboard navigation, controlled/uncontrolled state, and stable data attributes."
              icon={<Layers size={18} />}
              title="Core"
            />
            <FeatureCard
              description="Copy-paste Solid source, Tailwind token styling, app-layer TanStack integrations, blocks, templates, and user-owned files."
              icon={<FileCode2 size={18} />}
              title="UI"
            />
            <FeatureCard
              description="Registry metadata, install commands, dependency graphs, source paths, and parity notes for each installable item."
              icon={<PackageCheck size={18} />}
              title="Mason"
            />
          </div>
        </section>

        <section id="components" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Components</MdxH2>
          <MdxP>
            Component pages are generated from `registry/default/items/*.json`, so every current and
            future registry item gets a consistent page with install, dependencies, source files,
            API notes, and parity sections.
          </MdxP>
          <div class="mt-5 grid gap-3 md:grid-cols-2">
            <For each={componentDocs.slice(0, 12)}>
              {(item) => (
                <a
                  class="grid min-h-42 content-start gap-3 rounded-lg border border-border bg-card p-4 shadow-xs outline-none hover:border-primary/40 focus-visible:border-primary/40"
                  href={componentHref(item.name)}
                >
                  <span class="inline-flex size-8 items-center justify-center rounded-md border border-border bg-muted text-primary">
                    <Boxes size={16} />
                  </span>
                  <strong class="font-semibold text-base text-foreground">{item.title}</strong>
                  <span class="text-muted-foreground text-sm leading-6">{item.description}</span>
                </a>
              )}
            </For>
          </div>
        </section>

        <section id="install-model" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Install Model</MdxH2>
          <MdxTable
            columns={["Layer", "Source", "Ownership"]}
            rows={[
              ["Core", "@keystone-ui/core", "Headless runtime primitives"],
              ["UI", "packages/ui/src/default", "Copied source owned by the app"],
              ["Registry", "registry/default/items", "Mason install contract and docs metadata"],
              ["Docs", "apps/web/src/lib/registry-docs.gen.ts", "Generated page data"],
            ]}
          />
        </section>

        <section id="mdx-surface" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>MDX Surface</MdxH2>
          <MdxP>
            The docs app now has Solid MDX-style render components for headings, paragraphs, lists,
            tables, and code blocks. The current pages render registry data directly, but the same
            component surface can back authored MDX once content files are introduced.
          </MdxP>
        </section>

        <section id="roadmap" class="mt-12 scroll-mt-24 lg:mt-16">
          <MdxH2>Roadmap</MdxH2>
          <MdxP>
            Current docs inventory includes {componentDocs.length} UI items, {blockDocs.length}{" "}
            blocks, and {utilityDocs.length} utilities. The layout is ready for deeper authored
            pages without changing the navigation frame.
          </MdxP>
        </section>
      </MdxContent>
    </DocsPageFrame>
  );
}

function FeatureCard(props: { description: string; icon: JSX.Element; title: string }) {
  return (
    <div class="min-h-44 rounded-lg border border-border bg-card p-4 shadow-xs">
      <span class="inline-flex size-8 items-center justify-center rounded-md border border-border bg-muted text-primary">
        {props.icon}
      </span>
      <h3 class="mt-3 font-semibold text-base text-foreground">{props.title}</h3>
      <p class="mt-2 text-muted-foreground text-sm leading-6">{props.description}</p>
    </div>
  );
}
