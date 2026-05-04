import { createFileRoute, Link } from "@tanstack/solid-router";
import {
  ArrowLeft,
  Boxes,
  CheckCircle2,
  FileJson2,
  Layers,
  ShieldCheck,
  TriangleAlert,
} from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/docs/preview")({
  component: PreviewDocs,
});

const posture = [
  {
    label: "Audience",
    value: "Private preview",
    body: "Share with selected reviewers while release expectations, names, and publication posture stay explicit.",
  },
  {
    label: "Names",
    value: "Codenames retained",
    body: "Keystone and Mason remain working product names until package, trademark, domain, and handle clearance are done.",
  },
  {
    label: "Packages",
    value: "Private 0.0.0",
    body: "The provisional @keystone-ui scope remains internal; package manifests should not imply npm publication readiness.",
  },
];

const noBreadth = [
  "No new Keystone primitive surface area for 0.1.",
  "No public kernel exports beyond deliberate primitive and utility APIs.",
  "No hosted Mason registry promise until lifecycle behavior is ready.",
  "No data-dense workspace buildout until after the 0.1 hardening spine.",
];

const nextChecks = [
  {
    title: "Surface Existing Docs",
    body: "Keep boundary, maturity, styling contract, accessibility, and Mason lifecycle docs reachable from the docs app.",
  },
  {
    title: "Manual Accessibility Evidence",
    body: "Record assistive-technology evidence before calling any stable candidate truly stable.",
  },
  {
    title: "Release Verification",
    body: "Run the release gate and record the dated result in the preview notes before sharing.",
  },
];

const docsLinks = [
  {
    icon: <Layers size={18} />,
    title: "Keystone Contracts",
    body: "Maturity labels, parts, data attributes, roles, keyboard behavior, ARIA notes, SSR notes, and examples.",
    href: "/docs/keystone/contracts",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Dialog Spec",
    body: "The model stable-candidate primitive page for focus, dismissal, layering, and accessibility documentation.",
    href: "/docs/keystone/dialog",
  },
  {
    icon: <FileJson2 size={18} />,
    title: "Mason Registry",
    body: "Generated source files, dependency plans, customization notes, caveats, and parity metadata.",
    href: "/docs/mason/registry",
  },
  {
    icon: <Boxes size={18} />,
    title: "Overlay Vertical",
    body: "Popover, Tooltip, and Sheet documentation around shared overlay contracts and limits.",
    href: "/docs/overlay/popover-tooltip-sheet",
  },
];

function PreviewDocs() {
  return (
    <main class="doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">0.1 preview</p>
            <h1>Private preview posture</h1>
            <p class="doc-lede">
              The next Keystone UI milestone is a private 0.1 preview: freeze breadth, keep
              codenames, expose current limits, and harden the primitives, registry, docs, and
              verification flow already in the repo.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="Preview release facts">
            <span>Release channel</span>
            <strong>Private preview</strong>
            <span>Package posture</span>
            <strong>Private 0.0.0</strong>
            <span>Naming posture</span>
            <strong>Keystone / Mason codenames</strong>
          </div>
        </section>

        <section class="doc-panel-grid">
          <For each={posture}>
            {(item) => (
              <article class="doc-panel">
                <div class="doc-section-title">
                  <CheckCircle2 size={18} />
                  <h2>{item.label}</h2>
                </div>
                <p>
                  <strong>{item.value}.</strong> {item.body}
                </p>
              </article>
            )}
          </For>
        </section>

        <section class="doc-two-column">
          <article class="doc-section">
            <div class="doc-section-title">
              <TriangleAlert size={19} />
              <h2>Do Not Expand</h2>
            </div>
            <ul class="doc-list">
              <For each={noBreadth}>{(item) => <li>{item}</li>}</For>
            </ul>
          </article>

          <article class="doc-section">
            <div class="doc-section-title">
              <CheckCircle2 size={19} />
              <h2>Next Checks</h2>
            </div>
            <ul class="doc-list">
              <For each={nextChecks}>
                {(item) => (
                  <li>
                    <strong>{item.title}</strong>: {item.body}
                  </li>
                )}
              </For>
            </ul>
          </article>
        </section>

        <section class="doc-section">
          <div class="doc-section-title">
            <FileJson2 size={19} />
            <h2>Preview Reading Path</h2>
          </div>
          <div class="preview-link-grid">
            <For each={docsLinks}>
              {(item) => (
                <a class="preview-link" href={item.href}>
                  <span>{item.icon}</span>
                  <strong>{item.title}</strong>
                  <small>{item.body}</small>
                </a>
              )}
            </For>
          </div>
        </section>
      </div>
    </main>
  );
}
