import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, BookOpen, FileJson2, Layers3, Paintbrush } from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/docs/mason/text-field")({
  component: MasonTextFieldDocs,
});

const dependencyNotes = [
  "@tanstack/solid-form owns app-grade field state, validation, blur, and submit flow.",
  "@keystone-ui/keystone/form provides generic form-control IDs, ARIA relationships, and state accessors.",
  "cn is the registry dependency used for app-owned Mason styling hooks.",
];

const boundaryNotes = [
  "Keystone does not import TanStack Form and remains usable with native forms or other app form libraries.",
  "Mason installs a readable Solid source adapter that teams own after copy-paste.",
  "Validation messages come from TanStack field meta while label, description, and error wiring stay generic.",
];

function MasonTextFieldDocs() {
  return (
    <main class="doc-page mason-doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">Mason component</p>
            <h1>TextField</h1>
            <p class="doc-lede">
              A TanStack Form-backed text field that proves Mason can own app form integration while
              Keystone form-control stays generic and library-agnostic.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="Mason TextField registry facts">
            <span>Registry type</span>
            <strong>registry:ui</strong>
            <span>App behavior</span>
            <strong>@tanstack/solid-form</strong>
            <span>Primitive helper</span>
            <strong>@keystone-ui/keystone/form</strong>
          </div>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<FileJson2 size={19} />} title="Install">
            <p>
              The registry item pulls TanStack Form into the app dependency plan and writes a
              source-owned adapter into the local UI directory.
            </p>
            <pre>
              <code>{`bunx mason add text-field
bunx mason add text-field --dry-run`}</code>
            </pre>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="Usage">
            <pre>
              <code>{`import { createForm } from "@tanstack/solid-form";
import { TextField } from "~/components/ui/text-field";

export function ProfileForm() {
  const form = createForm(() => ({
    defaultValues: { email: "" },
    onSubmit: ({ value }) => {
      console.log(value.email);
    },
  }));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <TextField
        form={form}
        name="email"
        label="Email"
        description="Used for product updates and team invitations."
        validators={{
          onChange: ({ value }) =>
            value.includes("@") ? undefined : "Enter a valid email address.",
        }}
      />
      <button type="submit">Save</button>
    </form>
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
  "name": "text-field",
  "type": "registry:ui",
  "dependencies": [
    "@keystone-ui/keystone@^0.0.0",
    "@tanstack/solid-form@^1.29.1"
  ],
  "registryDependencies": ["cn"],
  "files": [{ "path": "ui/text-field.tsx" }]
}`}</code>
            </pre>
          </article>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<Layers3 size={19} />} title="Layer Boundary">
            <ul class="doc-list">
              <For each={boundaryNotes}>{(note) => <li>{note}</li>}</For>
            </ul>
          </DocSection>

          <DocSection icon={<Paintbrush size={19} />} title="Customization">
            <p>
              Style installed source through <code>mason-text-field</code> classes and{" "}
              <code>data-part</code> values for root, label, input, description, and error.
            </p>
            <pre>
              <code>{`[data-scope="mason-text-field"][data-part="input"] {
  border: 1px solid var(--border);
}`}</code>
            </pre>
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
