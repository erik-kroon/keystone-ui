import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, FileJson2, PackageCheck, Paintbrush } from "lucide-solid";
import { For, createMemo, createSignal } from "solid-js";

import { getRegistryItemContract, registryItemContracts } from "@/lib/registry-contracts";

export const Route = createFileRoute("/docs/mason/registry")({
  component: MasonRegistryDocs,
});

const initialItem = "dialog";

function MasonRegistryDocs() {
  const [selectedName, setSelectedName] = createSignal(initialItem);
  const selected = createMemo(() => getRegistryItemContract(selectedName()));
  const blockItems = registryItemContracts.filter((item) => item.type === "registry:block");
  const templateItems = registryItemContracts.filter((item) => item.type === "registry:template");

  return (
    <main class="doc-page mason-doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">Mason registry</p>
            <h1>Item contracts</h1>
            <p class="doc-lede">
              Every first-party registry item exposes install, file, dependency, customization,
              caveat, and parity metadata. This page reads the same item JSON that the CLI
              validates.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="Registry metadata facts">
            <span>Registry items</span>
            <strong>{registryItemContracts.length}</strong>
            <span>First block</span>
            <strong>{blockItems[0]?.name ?? "Not shipped"}</strong>
            <span>Templates</span>
            <strong>{templateItems.length > 0 ? templateItems.length : "Not shipped yet"}</strong>
          </div>
        </section>

        <section class="contract-layout">
          <nav class="contract-nav" aria-label="Registry items">
            <For each={registryItemContracts}>
              {(item) => (
                <button
                  class="contract-nav-item"
                  classList={{ "is-active": selectedName() === item.name }}
                  type="button"
                  onClick={() => setSelectedName(item.name)}
                >
                  <span>{item.name}</span>
                  <small>{item.type}</small>
                </button>
              )}
            </For>
          </nav>

          <article class="contract-detail">
            <div class="contract-detail-header">
              <div>
                <p class="eyebrow">{selected().type}</p>
                <h2>{selected().title}</h2>
                <p>{selected().description}</p>
              </div>
              <code>{selected().install}</code>
            </div>

            <section class="doc-panel-grid compact">
              <article class="doc-panel">
                <div class="doc-section-title">
                  <PackageCheck size={18} />
                  <h2>Dependencies</h2>
                </div>
                <ul class="doc-list">
                  <li>
                    Packages:{" "}
                    {selected().dependencies.length > 0
                      ? selected().dependencies.join(", ")
                      : "None"}
                  </li>
                  <li>
                    Registry items:{" "}
                    {selected().registryDependencies.length > 0
                      ? selected().registryDependencies.join(", ")
                      : "None"}
                  </li>
                </ul>
              </article>

              <article class="doc-panel">
                <div class="doc-section-title">
                  <Paintbrush size={18} />
                  <h2>Customization</h2>
                </div>
                <p>{selected().customization}</p>
              </article>
            </section>

            <section class="doc-panel">
              <h2>File Tree</h2>
              <div class="metadata-table" role="table" aria-label="Registry files">
                <div class="metadata-row metadata-head" role="row">
                  <span role="columnheader">Source</span>
                  <span role="columnheader">Target</span>
                  <span role="columnheader">Type</span>
                </div>
                <For each={selected().files}>
                  {(file) => (
                    <div class="metadata-row" role="row">
                      <code role="cell">{file.path}</code>
                      <code role="cell">{file.target}</code>
                      <span role="cell">{file.type}</span>
                    </div>
                  )}
                </For>
              </div>
            </section>

            <section class="doc-section">
              <div class="doc-section-title">
                <FileJson2 size={18} />
                <h2>Source Preview</h2>
              </div>
              <pre>
                <code>{selected().sourcePreview}</code>
              </pre>
            </section>

            <section class="doc-panel-grid compact">
              <article class="doc-panel">
                <div class="doc-section-title">
                  <FileJson2 size={18} />
                  <h2>Parity Notes</h2>
                </div>
                <ul class="doc-list">
                  <For each={Object.entries(selected().parity)}>
                    {([reference, note]) => (
                      <li>
                        <strong>{reference}</strong>: {note}
                      </li>
                    )}
                  </For>
                </ul>
              </article>

              <article class="doc-panel">
                <h2>Generated Output Caveat</h2>
                <p>{selected().caveats}</p>
              </article>
            </section>
          </article>
        </section>
      </div>
    </main>
  );
}
