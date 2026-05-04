import { Dialog } from "@keystone-ui/keystone/dialog";
import { Select } from "@keystone-ui/keystone/select";
import { createFileRoute } from "@tanstack/solid-router";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Code2,
  FileJson2,
  Layers,
  PackageCheck,
  ShieldCheck,
  RouteIcon,
  Sparkles,
} from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/")({
  component: App,
});

const entryPoints = [
  {
    icon: <Layers size={19} />,
    title: "Use Keystone",
    body: "Start with unstyled Solid primitives. Learn anatomy, behavior, accessibility, data attributes, CSS variables, and SSR constraints.",
    href: "/docs/keystone/contracts",
    action: "Read primitive contracts",
  },
  {
    icon: <FileJson2 size={19} />,
    title: "Use Mason",
    body: "Install editable source for app UI. Inspect generated files, registry dependencies, target paths, caveats, and parity notes.",
    href: "/docs/mason/registry",
    action: "Browse registry contracts",
  },
  {
    icon: <ShieldCheck size={19} />,
    title: "Review the 0.1 preview",
    body: "Private preview posture, codename limits, package posture, frozen breadth, release checks, and the first reading path.",
    href: "/docs/preview",
    action: "Open preview posture",
  },
  {
    icon: <BookOpen size={19} />,
    title: "Read a primitive page",
    body: "Dialog is the model page for Keystone docs: import, anatomy, controlled state, focus, dismissal, styling, and deeper references.",
    href: "/docs/keystone/dialog",
    action: "Open Dialog docs",
  },
];

const keystoneDocs = [
  {
    title: "Primitive contracts",
    body: "Metadata-backed parts, ARIA notes, keyboard behavior, data attributes, CSS variables, SSR notes, and examples.",
    href: "/docs/keystone/contracts",
  },
  {
    title: "Dialog",
    body: "Modal overlay behavior: focus entry, trap, restore, outside interaction, escape dismissal, ARIA relationships, and styling hooks.",
    href: "/docs/keystone/dialog",
  },
  {
    title: "Overlay vertical",
    body: "Popover, Tooltip, and Sheet share the Keystone overlay layer model, geometry contracts, and modal/non-modal boundaries.",
    href: "/docs/overlay/popover-tooltip-sheet",
  },
];

const masonDocs = [
  {
    title: "Registry contracts",
    body: "Install commands, file trees, dependencies, generated-output caveats, customization notes, and parity references.",
    href: "/docs/mason/registry",
  },
  {
    title: "TanStack Form field",
    body: "TextField shows how Mason owns app form integration while Keystone keeps form-control behavior generic.",
    href: "/docs/mason/text-field",
  },
  {
    title: "TanStack DataTable",
    body: "DataTable documents the editable source layer around TanStack Table: toolbar, filters, pagination, row actions, and router state.",
    href: "/docs/mason/data-table",
  },
];

const primitiveTemplate = [
  "Import",
  "When to use",
  "Anatomy",
  "Basic example",
  "Behavior",
  "Accessibility",
  "Styling contract",
  "SSR notes",
  "API reference",
];

const registryTemplate = [
  "Install",
  "What gets added",
  "Usage",
  "Generated source contract",
  "Customization",
  "Parity notes",
  "Limitations",
];

const statusNotes = [
  {
    label: "Keystone",
    value: "behavior first",
    body: "Depth comes before catalog breadth. Dialog, Select, overlay, collection, and form-control contracts lead the docs.",
  },
  {
    label: "Mason",
    value: "source owned",
    body: "Generated files are readable Solid source. Mason should explain writes, dependencies, and escape hatches before showing volume.",
  },
  {
    label: "Reference",
    value: "metadata backed",
    body: "Contract pages can stay generated, but they should sit behind learning pages instead of replacing them.",
  },
];

function App() {
  return (
    <main>
      <section class="hero-section">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Keystone UI docs</p>
            <h1>Solid primitives and editable app source.</h1>
            <p class="hero-lede">
              Keystone documents accessible, unstyled primitive behavior. Mason documents the source
              registry that installs styled Solid components, blocks, and app integrations into user
              projects.
            </p>
            <div class="hero-actions">
              <a class="command-button primary" href="#start">
                <RouteIcon size={18} />
                Start here
              </a>
              <a class="command-button secondary" href="#shape">
                <BookOpen size={18} />
                Docs shape
              </a>
            </div>
          </div>

          <div class="status-console" aria-label="Documentation model">
            <div class="console-topline">
              <span>docs/model</span>
              <span>two tracks</span>
            </div>
            <For each={statusNotes}>
              {(item) => (
                <div class="console-row doc-model-row">
                  <PackageCheck size={17} />
                  <span>
                    <strong>{item.label}</strong>
                    <small>
                      {item.value}. {item.body}
                    </small>
                  </span>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      <section id="start" class="surface-band">
        <div class="section-heading">
          <p class="eyebrow">Start here</p>
          <h2>Choose the layer you are working in.</h2>
          <p>
            The first decision in these docs should be whether you need primitive behavior or
            editable application source. That split keeps Keystone independent and Mason practical.
          </p>
        </div>

        <div class="entry-grid">
          <For each={entryPoints}>
            {(item) => (
              <a class="entry-card" href={item.href}>
                <div class="entry-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span>
                  {item.action}
                  <ArrowRight size={16} />
                </span>
              </a>
            )}
          </For>
        </div>
      </section>

      <section id="keystone" class="surface-band">
        <div class="section-heading">
          <p class="eyebrow">Keystone</p>
          <h2>Primitive pages should teach behavior before props.</h2>
          <p>
            Base UI is the runtime-depth reference and Kobalte is the Solid-shape reference.
            Keystone docs should explain when to use a primitive, how its parts compose, and what
            behavior it guarantees.
          </p>
        </div>

        <div class="docs-track-grid">
          <div class="doc-lanes">
            <For each={keystoneDocs}>
              {(item) => (
                <DocLane
                  icon={<BookOpen size={20} />}
                  title={item.title}
                  body={item.body}
                  href={item.href}
                />
              )}
            </For>
          </div>

          <div class="live-lab">
            <div class="lab-header">
              <Code2 size={18} />
              <span>Primitive proof</span>
            </div>
            <DialogDemo />
            <SelectDemo />
          </div>
        </div>
      </section>

      <section id="mason" class="mason-section">
        <div class="section-heading narrow">
          <p class="eyebrow">Mason</p>
          <h2>Registry pages should explain the write plan.</h2>
          <p>
            Mason is closer to shadcn than to a runtime component package. The docs should show the
            command, the files, the dependencies, the owned source contract, and the limits.
          </p>
        </div>

        <div class="docs-track-grid">
          <div class="mason-flow" aria-label="Mason install flow">
            <FlowStep index="01" title="Detect app" />
            <FlowStep index="02" title="Resolve registry dependencies" />
            <FlowStep index="03" title="Plan target writes" />
            <FlowStep index="04" title="Dry-run or apply source" />
            <FlowStep index="05" title="Verify generated output" />
          </div>

          <div class="doc-lanes">
            <For each={masonDocs}>
              {(item) => (
                <DocLane
                  icon={<FileJson2 size={20} />}
                  title={item.title}
                  body={item.body}
                  href={item.href}
                />
              )}
            </For>
          </div>
        </div>
      </section>

      <section id="shape" class="docs-band">
        <div class="docs-grid">
          <div>
            <p class="eyebrow">Docs shape</p>
            <h2>The map each page should follow.</h2>
            <p class="section-note">
              The content system should be predictable enough that maintainers, users, and agents
              know where a detail belongs.
            </p>
          </div>
          <div class="template-grid">
            <TemplateList
              icon={<Layers size={20} />}
              title="Keystone primitive page"
              items={primitiveTemplate}
            />
            <TemplateList
              icon={<Boxes size={20} />}
              title="Mason registry item page"
              items={registryTemplate}
            />
          </div>
        </div>
      </section>

      <section id="reference" class="release-section">
        <div class="release-panel">
          <div class="release-title">
            <p class="eyebrow">Reference</p>
            <h2>Generated contracts stay useful, but move behind the learning path.</h2>
          </div>
          <div class="release-issues">
            <a class="issue-link issue-green" href="/docs/keystone/contracts">
              <span>Keystone</span>
              <strong>Primitive metadata reference</strong>
              <ArrowRight size={17} />
            </a>
            <a class="issue-link issue-red" href="/docs/preview">
              <span>Preview</span>
              <strong>Private 0.1 release posture</strong>
              <ArrowRight size={17} />
            </a>
            <a class="issue-link issue-blue" href="/docs/mason/registry">
              <span>Mason</span>
              <strong>Registry metadata reference</strong>
              <ArrowRight size={17} />
            </a>
            <a class="issue-link issue-amber" href="/docs/overlay/popover-tooltip-sheet">
              <span>Overlay</span>
              <strong>Shared overlay vertical</strong>
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FlowStep(props: { index: string; title: string }) {
  return (
    <div class="flow-step">
      <span>{props.index}</span>
      <p>{props.title}</p>
    </div>
  );
}

function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger class="demo-trigger">
        <Sparkles size={16} />
        Open Dialog primitive
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop class="dialog-backdrop" />
        <Dialog.Positioner class="dialog-positioner">
          <Dialog.Content class="dialog-content">
            <Dialog.Title class="dialog-title">Project behavior lives in Keystone.</Dialog.Title>
            <Dialog.Description class="dialog-description">
              This modal is rendered by the local `@keystone-ui/keystone/dialog` package.
            </Dialog.Description>
            <div class="dialog-actions">
              <Dialog.Close class="command-button secondary">Close</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SelectDemo() {
  return (
    <Select.Root defaultValue="dialog" name="primitive" placeholder="Dialog">
      <Select.Trigger class="select-trigger">
        <Select.Value placeholder="Dialog" />
        <span aria-hidden="true">v</span>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner class="select-positioner">
          <Select.Content class="select-content">
            <Select.Listbox class="select-listbox">
              <Select.Item class="select-item" value="dialog">
                Dialog
              </Select.Item>
              <Select.Item class="select-item" value="select">
                Select
              </Select.Item>
              <Select.Item class="select-item" value="form-control">
                Form control
              </Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function DocLane(props: { icon: Element; title: string; body: string; href: string }) {
  return (
    <a class="doc-lane" href={props.href}>
      <div class="doc-icon">{props.icon}</div>
      <div>
        <h3>{props.title}</h3>
        <p>{props.body}</p>
      </div>
    </a>
  );
}

function TemplateList(props: { icon: Element; title: string; items: readonly string[] }) {
  return (
    <article class="template-list">
      <div class="doc-section-title">
        {props.icon}
        <h3>{props.title}</h3>
      </div>
      <ol>
        <For each={props.items}>{(item) => <li>{item}</li>}</For>
      </ol>
    </article>
  );
}
