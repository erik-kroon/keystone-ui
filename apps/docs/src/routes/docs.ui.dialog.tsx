import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, BookOpen, FileJson2, Paintbrush } from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/docs/ui/dialog")({
  component: UiDialogDocs,
});

const dependencyNotes = [
  "@keystone-ui/core provides the dialog behavior runtime.",
  "solid-js is the peer Solid runtime expected by generated source.",
  "cn is a registry dependency used for app-owned styling hooks.",
];

const customizationNotes = [
  "The installed file is ordinary app source, so teams can edit classes, markup, and local composition.",
  "UI must import Core behavior instead of copying focus, dismissal, or ARIA internals.",
  "Generated source should remain readable and diffable for future update workflows.",
];

function UiDialogDocs() {
  return (
    <main class="doc-page ui-doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">UI item</p>
            <h1>Dialog</h1>
            <p class="doc-lede">
              A copy-paste Solid component entry that belongs to the user project after install. UI
              owns the registry metadata, dependency plan, and styled source conventions.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="UI dialog registry facts">
            <span>Registry type</span>
            <strong>registry:ui</strong>
            <span>Target</span>
            <strong>src/components/ui/dialog.tsx</strong>
            <span>Current status</span>
            <strong>Tracer fixture</strong>
          </div>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<FileJson2 size={19} />} title="Install">
            <p>
              The first CLI slice resolves registry dependencies, validates paths, updates package
              dependencies, and writes source files into the detected Solid project.
            </p>
            <pre>
              <code>{`bunx mason add dialog
bunx mason add dialog --dry-run`}</code>
            </pre>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="Usage">
            <pre>
              <code>{`import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function Example() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Configure the workspace before it is created.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}`}</code>
            </pre>
          </DocSection>
        </section>

        <section class="doc-panel-grid">
          <article class="doc-panel">
            <h2>Source And Dependencies</h2>
            <ul class="doc-list">
              <For each={dependencyNotes}>{(note) => <li>{note}</li>}</For>
            </ul>
          </article>

          <article class="doc-panel">
            <h2>Registry Item</h2>
            <pre>
              <code>{`{
  "name": "dialog",
  "type": "registry:ui",
  "dependencies": [
    "@keystone-ui/core@^0.0.0"
  ],
  "registryDependencies": ["cn"],
  "files": [{
    "target": "src/components/ui/dialog.tsx"
  }]
}`}</code>
            </pre>
          </article>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<Paintbrush size={19} />} title="Customization">
            <ul class="doc-list">
              <For each={customizationNotes}>{(note) => <li>{note}</li>}</For>
            </ul>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="Deeper Context">
            <div class="doc-link-list">
              <a href="https://github.com/erik-kroon/core-ui/blob/main/docs/rfcs/mason-registry.md">
                Mason Registry RFC
              </a>
              <a href="https://github.com/erik-kroon/core-ui/blob/main/docs/rfcs/core-api.md">
                Core API RFC
              </a>
              <a href="https://github.com/erik-kroon/core-ui/blob/main/docs/adr/0001-keystone-core-ui-boundary.md">
                ADR 0001: Product Boundary
              </a>
            </div>
          </DocSection>
        </section>
      </div>
    </main>
  );
}

function DocSection(props: { icon: Element; title: string; children: Element }) {
  return (
    <article class="doc-section">
      <div class="doc-section-title">
        {props.icon}
        <h2>{props.title}</h2>
      </div>
      {props.children}
    </article>
  );
}
