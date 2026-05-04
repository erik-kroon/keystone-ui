import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, BookOpen, Code2, ShieldCheck } from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/docs/core/dialog")({
  component: CoreDialogDocs,
});

const anatomy = [
  "Root",
  "Trigger",
  "Portal",
  "Backdrop",
  "Positioner",
  "Content",
  "Title",
  "Description",
  "Close",
];

const behaviorNotes = [
  "Supports controlled and uncontrolled open state through open, defaultOpen, and onOpenChange.",
  "Runs user event handlers first and skips internal behavior when the event is default-prevented.",
  "Creates a modal overlay layer with escape dismissal, outside interaction dismissal, focus trap, and focus restore.",
  "Exposes stable data-scope and data-part attributes for every rendered part.",
];

function CoreDialogDocs() {
  return (
    <main class="doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">Core primitive</p>
            <h1>Dialog</h1>
            <p class="doc-lede">
              An unstyled Solid primitive for modal and non-modal dialog behavior. Core owns focus,
              dismissal, layering, ARIA relationships, and the styling contract.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="Dialog implementation facts">
            <span>Package</span>
            <strong>@keystone-ui/core/dialog</strong>
            <span>Product layer</span>
            <strong>Headless primitive</strong>
            <span>Current status</span>
            <strong>Tracer implementation</strong>
          </div>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<Code2 size={19} />} title="Install">
            <p>
              Keystone is planned as one public primitive package with explicit subpath exports. The
              provisional package scope remains internal until naming clearance is complete.
            </p>
            <pre>
              <code>{`bun add @keystone-ui/core solid-js`}</code>
            </pre>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="Usage">
            <pre>
              <code>{`import { Dialog } from "@keystone-ui/core/dialog";

export function ProjectDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>New project</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>Create project</Dialog.Title>
            <Dialog.Description>
              Configure the workspace before it is created.
            </Dialog.Description>
            <Dialog.Close>Cancel</Dialog.Close>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`}</code>
            </pre>
          </DocSection>
        </section>

        <section class="doc-panel-grid">
          <article class="doc-panel">
            <h2>Anatomy</h2>
            <div class="part-grid">
              <For each={anatomy}>{(part) => <span>{part}</span>}</For>
            </div>
          </article>

          <article class="doc-panel">
            <h2>Behavior And Accessibility</h2>
            <ul class="doc-list">
              <For each={behaviorNotes}>{(note) => <li>{note}</li>}</For>
            </ul>
          </article>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<ShieldCheck size={19} />} title="Customization">
            <p>
              Keystone ships no visual styling. Wrap parts or pass classes directly, then target the
              public data contract such as <code>data-scope="dialog"</code>,{" "}
              <code>data-part="content"</code>, and <code>data-state="open"</code>.
            </p>
            <pre>
              <code>{`<Dialog.Content class="rounded-lg border bg-panel p-6 shadow-xl" />`}</code>
            </pre>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="Deeper Context">
            <div class="doc-link-list">
              <a href="https://github.com/erik-kroon/core-ui/blob/main/docs/rfcs/core-api.md">
                Core API RFC
              </a>
              <a href="https://github.com/erik-kroon/core-ui/blob/main/docs/adr/0001-keystone-core-ui-boundary.md">
                ADR 0001: Product Boundary
              </a>
              <a href="https://github.com/erik-kroon/core-ui/blob/main/docs/accessibility/testing-plan.md">
                Accessibility Testing Plan
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
