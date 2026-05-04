import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, Layers, PackageCheck, ShieldCheck } from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/docs/overlay/popover-tooltip-sheet")({
  component: OverlayVerticalDocs,
});

const primitives = [
  {
    name: "Popover",
    importPath: "@keystone-ui/keystone/popover",
    mason: "mason add popover",
    notes:
      "Non-modal floating disclosure with trigger, positioner, content, outside dismissal, Escape dismissal, and floating geometry variables.",
  },
  {
    name: "HoverCard",
    importPath: "@keystone-ui/keystone/hover-card",
    mason: "mason add hover-card",
    notes:
      "Hover/focus preview surface with open and close delays, hoverable content, pointer grace area, outside dismissal, Escape dismissal, and floating geometry variables.",
  },
  {
    name: "Tooltip",
    importPath: "@keystone-ui/keystone/tooltip",
    mason: "mason add tooltip",
    notes:
      "Hover and focus tooltip with trigger/content ARIA wiring, floating geometry, and Escape dismissal through the overlay layer model.",
  },
  {
    name: "Sheet",
    importPath: "@keystone-ui/keystone/sheet",
    mason: "mason add sheet",
    notes:
      "Modal side panel with backdrop, focus trap, focus restore, pointer-event blocking, side data, and Dialog-grade accessibility semantics.",
  },
  {
    name: "Toast",
    importPath: "@keystone-ui/keystone/toast",
    mason: "mason add toast",
    notes:
      "Live notification system with manager shortcuts, viewport pause/resume behavior, action and close controls, priority roles, and stable type/status metadata.",
  },
];

function OverlayVerticalDocs() {
  return (
    <main class="doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">Overlay vertical</p>
            <h1>Popover, Tooltip, Sheet</h1>
            <p class="doc-lede">
              Keystone overlay surfaces reuse one layer model for modal behavior, dismissal, focus
              lifecycles, positioning, outside hiding, prevent scroll, and notification metadata.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="Overlay vertical facts">
            <span>Kernel</span>
            <strong>OverlayLayerStack</strong>
            <span>Keystone exports</span>
            <strong>popover / hover-card / tooltip / sheet / toast</strong>
            <span>Mason items</span>
            <strong>popover, hover-card, tooltip, sheet, toast</strong>
          </div>
        </section>

        <section class="doc-panel-grid">
          <article class="doc-panel">
            <h2>Shared Behavior</h2>
            <ul class="doc-list">
              <li>One overlay stack controls top-layer order and outside interaction.</li>
              <li>
                Floating surfaces expose side, align, anchor width, and transform-origin data.
              </li>
              <li>
                Modal surfaces opt into pointer blocking, outside hiding, prevent scroll, focus
                trap, and focus restore.
              </li>
              <li>Toast exposes live-region roles, type metadata, and pause/resume timing.</li>
            </ul>
          </article>

          <article class="doc-panel">
            <h2>Install</h2>
            <pre>
              <code>{`bun add @keystone-ui/keystone solid-js

bunx mason add popover
bunx mason add hover-card
bunx mason add tooltip
bunx mason add sheet
bunx mason add toast`}</code>
            </pre>
          </article>
        </section>

        <section class="doc-panel-grid">
          <For each={primitives}>
            {(primitive) => (
              <article class="doc-panel">
                <div class="doc-section-title">
                  <Layers size={19} />
                  <h2>{primitive.name}</h2>
                </div>
                <p>{primitive.notes}</p>
                <pre>
                  <code>{`import { ${primitive.name} } from "${primitive.importPath}";
// ${primitive.mason}`}</code>
                </pre>
              </article>
            )}
          </For>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<ShieldCheck size={19} />} title="Keystone Contract">
            <p>
              Primitive parts expose stable <code>data-scope</code>, <code>data-part</code>,{" "}
              <code>data-state</code>, and overlay geometry attributes for wrappers and tests.
            </p>
          </DocSection>

          <DocSection icon={<PackageCheck size={19} />} title="Mason Contract">
            <p>
              Mason generated source imports Keystone behavior and adds app-owned classes only. It
              does not copy overlay dismissal, focus, pointer blocking, or positioning logic.
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
