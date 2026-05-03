import { createFileRoute } from "@tanstack/solid-router";
import { Dialog } from "@keystone-ui/keystone/dialog";
import { Select } from "@keystone-ui/keystone/select";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  FileJson2,
  Layers,
  PackageCheck,
  Sparkles,
  Terminal,
} from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/")({
  component: App,
});

const releaseChecks = [
  "Keystone kernel tests",
  "Dialog and Select behavior tests",
  "Mason CLI generated app build",
  "Registry validation and path safety",
  "Web SSR build",
];

const primitives = [
  {
    name: "Dialog",
    status: "Dogfooded",
    copy: "Focus entry, focus trap, restore, top-layer dismissal, preventable outside interaction.",
  },
  {
    name: "Select",
    status: "Dogfooded",
    copy: "Collection registration, typeahead, list navigation, form reset, floating geometry.",
  },
  {
    name: "Form control",
    status: "Kernel",
    copy: "ARIA relationships, state attributes, hidden input props, reset hooks.",
  },
  {
    name: "Overlay",
    status: "Kernel",
    copy: "Dismissable layer, focus scope, layer stack, pointer-event isolation.",
  },
];

const masonFlow = [
  "Detect Solid app shape",
  "Resolve registry dependencies",
  "Plan target writes",
  "Dry-run or apply source files",
  "Typecheck and build generated output",
];

const nextWork = [
  { issue: "#14", title: "Example app verification tracer", tone: "amber" },
  { issue: "#13", title: "Docs product tracer", tone: "blue" },
  { issue: "#12", title: "First Mason block tracer", tone: "green" },
];

function App() {
  return (
    <main>
      <section class="hero-section">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">0.1.0 preparation surface</p>
            <h1>Accessible Solid primitives. Editable app source.</h1>
            <p class="hero-lede">
              Keystone is the behavior layer. Mason is the source registry that installs UI into the
              user project. This web app is now the docs product surface and uses the local Keystone
              package directly.
            </p>
            <div class="hero-actions">
              <a class="command-button primary" href="#keystone">
                <Layers size={18} />
                Inspect primitives
              </a>
              <a class="command-button secondary" href="#release">
                <PackageCheck size={18} />
                Release gate
              </a>
            </div>
          </div>

          <div class="status-console" aria-label="Current verification state">
            <div class="console-topline">
              <span>release/readiness</span>
              <span>passing</span>
            </div>
            <For each={releaseChecks}>
              {(item) => (
                <div class="console-row">
                  <CheckCircle2 size={17} />
                  <span>{item}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      <section id="keystone" class="surface-band">
        <div class="section-heading">
          <p class="eyebrow">Keystone</p>
          <h2>Primitive behavior is the product.</h2>
          <p>
            The first kernel pass is centered on Dialog and Select because overlays and item
            collections prove most of the hard behavior.
          </p>
        </div>

        <div class="primitive-layout">
          <div class="primitive-list">
            <For each={primitives}>
              {(primitive) => (
                <article class="primitive-item">
                  <div>
                    <h3>{primitive.name}</h3>
                    <p>{primitive.copy}</p>
                  </div>
                  <span>{primitive.status}</span>
                </article>
              )}
            </For>
          </div>

          <div class="live-lab">
            <div class="lab-header">
              <Code2 size={18} />
              <span>Live Keystone parts</span>
            </div>
            <DialogDemo />
            <SelectDemo />
          </div>
        </div>
      </section>

      <section id="mason" class="mason-section">
        <div class="section-heading narrow">
          <p class="eyebrow">Mason</p>
          <h2>The registry installs source, not mystery runtime.</h2>
          <p>
            Mason maps shadcn-style registry concepts onto Solid and Keystone. Generated files are
            ordinary source files owned by the app.
          </p>
        </div>

        <div class="mason-flow" aria-label="Mason install flow">
          <For each={masonFlow}>
            {(step, index) => (
              <div class="flow-step">
                <span>{String(index() + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </div>
            )}
          </For>
        </div>
      </section>

      <section id="docs" class="docs-band">
        <div class="docs-grid">
          <div>
            <p class="eyebrow">Docs map</p>
            <h2>What this app should grow into next.</h2>
          </div>
          <div class="doc-lanes">
            <DocLane
              icon={<BookOpen size={20} />}
              title="Primitive docs"
              body="Anatomy, keyboard behavior, ARIA, data attributes, examples, known limits."
            />
            <DocLane
              icon={<FileJson2 size={20} />}
              title="Registry docs"
              body="Item schema, dependency resolution, path safety, source ownership, install plans."
            />
            <DocLane
              icon={<Terminal size={20} />}
              title="CLI docs"
              body="Init, add, dry-run, generated-output verification, and framework detection."
            />
          </div>
        </div>
      </section>

      <section id="release" class="release-section">
        <div class="release-panel">
          <div class="release-title">
            <p class="eyebrow">Remaining before 0.1.0</p>
            <h2>Keep the release small and legible.</h2>
          </div>
          <div class="release-issues">
            <For each={nextWork}>
              {(item) => (
                <a
                  class={`issue-link issue-${item.tone}`}
                  href={`https://github.com/erik-kroon/keystone-ui/issues/${item.issue.slice(1)}`}
                >
                  <span>{item.issue}</span>
                  <strong>{item.title}</strong>
                  <ArrowRight size={17} />
                </a>
              )}
            </For>
          </div>
        </div>
      </section>
    </main>
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

function DocLane(props: { icon: Element; title: string; body: string }) {
  return (
    <article class="doc-lane">
      <div class="doc-icon">{props.icon}</div>
      <div>
        <h3>{props.title}</h3>
        <p>{props.body}</p>
      </div>
    </article>
  );
}
