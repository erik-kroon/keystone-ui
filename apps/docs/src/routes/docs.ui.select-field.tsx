import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, BookOpen, FileJson2, Layers3 } from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/docs/ui/select-field")({
  component: UiSelectFieldDocs,
});

const boundaryNotes = [
  "TanStack Form owns field value, blur, validation, and submit integration.",
  "Core Select owns listbox roles, selection, keyboard navigation, typeahead, hidden input reset, and floating geometry.",
  "Mason installs readable source that teams can edit without copying Core behavior internals.",
];

function UiSelectFieldDocs() {
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
            <h1>SelectField</h1>
            <p class="doc-lede">
              A TanStack Form field adapter around Core Select. It proves the app-form vertical for
              listbox selection without moving TanStack dependencies into Keystone.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="UI SelectField registry facts">
            <span>Registry type</span>
            <strong>registry:ui</strong>
            <span>App behavior</span>
            <strong>@tanstack/solid-form</strong>
            <span>Select behavior</span>
            <strong>@keystone-ui/core/select</strong>
          </div>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<FileJson2 size={19} />} title="Install">
            <pre>
              <code>{`bunx mason add select-field
bunx mason add select-field --dry-run`}</code>
            </pre>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="Usage">
            <pre>
              <code>{`import { createForm } from "@tanstack/solid-form";
import { SelectField } from "~/components/ui/select-field";

const form = createForm(() => ({
  defaultValues: { plan: "team" },
  onSubmit: ({ value }) => console.log(value.plan),
}));

<SelectField
  form={form}
  name="plan"
  label="Plan"
  placeholder="Choose plan"
  options={[
    { value: "starter", label: "Starter" },
    { value: "team", label: "Team" },
    { value: "enterprise", label: "Enterprise" },
  ]}
/>;`}</code>
            </pre>
          </DocSection>
        </section>

        <section class="doc-panel-grid">
          <article class="doc-panel">
            <h2>Layer Boundary</h2>
            <ul class="doc-list">
              <For each={boundaryNotes}>{(note) => <li>{note}</li>}</For>
            </ul>
          </article>

          <article class="doc-panel">
            <h2>Registry Item</h2>
            <pre>
              <code>{`{
  "name": "select-field",
  "type": "registry:ui",
  "dependencies": [
    "@keystone-ui/core@^0.0.0",
    "@tanstack/solid-form@^1.29.1"
  ],
  "registryDependencies": ["cn"]
}`}</code>
            </pre>
          </article>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<Layers3 size={19} />} title="Performance Guard">
            <p>
              Core Select now has a focused harness for 10, 100, 500, and 1000 mounted items. It
              records registration, navigation, and typeahead timing before interaction changes.
            </p>
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
