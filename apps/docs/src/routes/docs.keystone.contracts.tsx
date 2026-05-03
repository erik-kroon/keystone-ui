import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, BookOpen, Code2, Keyboard, ShieldCheck } from "lucide-solid";
import { For, createSignal } from "solid-js";

import { getPrimitiveDocs, primitiveScopes } from "@/lib/primitive-contracts";

export const Route = createFileRoute("/docs/keystone/contracts")({
  component: KeystoneContractsDocs,
});

const initialScope = "dialog";

function KeystoneContractsDocs() {
  const [selectedScope, setSelectedScope] = createSignal(initialScope);
  const selected = () => getPrimitiveDocs(selectedScope() as (typeof primitiveScopes)[number]);

  return (
    <main class="doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">Keystone contracts</p>
            <h1>Primitive metadata</h1>
            <p class="doc-lede">
              Public primitive contracts are rendered from Keystone part metadata plus docs notes
              for roles, keyboard behavior, ARIA, SSR, and examples. This page is the broad contract
              index; individual deep pages can build on the same source.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="Primitive metadata facts">
            <span>Primitive scopes</span>
            <strong>{primitiveScopes.length}</strong>
            <span>Contract source</span>
            <strong>@keystone-ui/keystone metadata</strong>
            <span>Coverage check</span>
            <strong>docs contract test</strong>
          </div>
        </section>

        <section class="contract-layout">
          <nav class="contract-nav" aria-label="Primitive contracts">
            <For each={primitiveScopes}>
              {(scope) => {
                const docs = getPrimitiveDocs(scope);
                return (
                  <button
                    class="contract-nav-item"
                    classList={{ "is-active": selectedScope() === scope }}
                    type="button"
                    onClick={() => setSelectedScope(scope)}
                  >
                    <span>{docs.contract.title}</span>
                    <small>{docs.metadata.parts.length} parts</small>
                  </button>
                );
              }}
            </For>
          </nav>

          <article class="contract-detail">
            <div class="contract-detail-header">
              <div>
                <p class="eyebrow">{selected().metadata.scope}</p>
                <h2>{selected().contract.title}</h2>
              </div>
              <code>{selected().contract.importPath}</code>
            </div>

            <section class="doc-panel-grid compact">
              <ContractNote icon={<ShieldCheck size={18} />} title="Roles">
                <For each={selected().contract.roleNotes}>{(note) => <li>{note}</li>}</For>
              </ContractNote>
              <ContractNote icon={<Keyboard size={18} />} title="Keyboard">
                <For each={selected().contract.keyboardNotes}>{(note) => <li>{note}</li>}</For>
              </ContractNote>
              <ContractNote icon={<BookOpen size={18} />} title="ARIA">
                <For each={selected().contract.ariaNotes}>{(note) => <li>{note}</li>}</For>
              </ContractNote>
              <ContractNote icon={<Code2 size={18} />} title="SSR">
                <For each={selected().contract.ssrNotes}>{(note) => <li>{note}</li>}</For>
              </ContractNote>
            </section>

            <section class="doc-panel">
              <h2>Parts</h2>
              <div class="metadata-table" role="table" aria-label="Primitive parts">
                <div class="metadata-row metadata-head" role="row">
                  <span role="columnheader">Selector</span>
                  <span role="columnheader">Data attributes</span>
                  <span role="columnheader">CSS variables</span>
                </div>
                <For each={selected().metadata.parts}>
                  {(part) => (
                    <div class="metadata-row" role="row">
                      <code role="cell">{part.selector}</code>
                      <span role="cell">
                        {part.dataAttributes
                          .map((attribute) =>
                            attribute.values
                              ? `${attribute.name}=${attribute.values.join("|")}`
                              : attribute.name,
                          )
                          .join(", ")}
                      </span>
                      <span role="cell">
                        {part.cssVars.length > 0
                          ? part.cssVars.map((cssVar) => cssVar.name).join(", ")
                          : "None"}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            </section>

            <section class="doc-section">
              <div class="doc-section-title">
                <Code2 size={19} />
                <h2>Example</h2>
              </div>
              <pre>
                <code>{selected().contract.example}</code>
              </pre>
            </section>
          </article>
        </section>
      </div>
    </main>
  );
}

function ContractNote(props: { icon: Element; title: string; children: Element }) {
  return (
    <article class="doc-panel">
      <div class="doc-section-title">
        {props.icon}
        <h2>{props.title}</h2>
      </div>
      <ul class="doc-list">{props.children}</ul>
    </article>
  );
}
