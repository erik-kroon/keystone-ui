# Context Map

## Area

Early Keystone UI monorepo bootstrap for a Solid primitive library and Mason registry ecosystem.

## Domain Terms

- `Keystone`: Solid-native primitive layer.
- `Mason`: copy-paste registry, CLI, blocks, templates, and styled source layer.
- `kernel`: shared primitive internals that should be built before visible components.
- `registry`: Mason distribution model for components, blocks, templates, themes, and related files.
- `docs`: product documentation and API guidance, served through `apps/docs`.
- `TanStack app layer`: Mason's preferred app-behavior layer for forms, tables, shared state, and app-level shortcuts.

## Module Map

- `apps/docs`
  - Solid + TanStack Router docs/product app.
  - Current route is the active docs, examples, and registry preview surface.
- `packages/keystone`
  - Early primitive package with overlay, disclosure, menu, select/combobox, field, selection-control, tabs, toolbar, slider, date-picker, toast, metadata, and utility surfaces.
  - Current breadth is useful for proving Mason wrappers, but the next quality bar is deeper shared internals.
- `packages/mason-cli`
  - Early CLI tracer for init/add planning and writes.
- `packages/mason-registry`
  - Registry schema, validation, dependency resolution, path safety, and tests.
- `registry`
  - Mason first-party UI component, TanStack-backed app component, utility, and block source.
  - Registry item metadata should include parity notes against the most relevant references.
- `docs/adr`
  - Durable architecture decisions for product/package boundaries, scope, names, license, and governance.
- `docs/rfcs`
  - Product/API proposals that should guide implementation before broad package work.
- `docs/agents`
  - Agent conventions and work tracking notes.

## Intended Growth Map

The PRD's end-state structure points toward these future areas:

- `packages/keystone`: primitive package with kernel systems and subpath exports.
- `packages/keystone-labs`: experimental primitives.
- `packages/mason-cli`: CLI commands, project detection, transforms, prompts, and diff handling.
- `packages/mason-registry`: schema, validation, build, and resolution logic.
- `registry/default`: Mason UI, blocks, themes, and templates.
- `examples`: install and compatibility targets.
- `apps/docs`: public docs/product surface, API references, examples, and registry previews.

## Call/Data Flow

Current executable flow:

```txt
root package.json
  -> turbo tasks
    -> apps/docs Vite Solid app
    -> packages/keystone primitive tests
    -> packages/mason-cli and packages/mason-registry tests
    -> local example-app verification
```

Intended product flow:

```txt
Keystone kernel
  -> Keystone primitives
    -> Mason registry components
      -> Mason blocks
        -> Mason templates and user apps
```

## Important Files

- [package.json](package.json): workspace packages, Bun version, root scripts.
- [turbo.json](turbo.json): task graph.
- [AGENTS.md](AGENTS.md): repo-local operating guidance for agents.
- [bts.jsonc](bts.jsonc): Better-T-Stack scaffold provenance.
- [apps/docs/package.json](apps/docs/package.json): Solid docs app dependencies.
- [docs/adr/0001-keystone-mason-product-boundary.md](docs/adr/0001-keystone-mason-product-boundary.md): Keystone/Mason dependency and product boundary.
- [docs/adr/0002-scope-names-license-governance.md](docs/adr/0002-scope-names-license-governance.md): provisional names, package scope, license intent, and governance.
- [docs/rfcs/keystone-api.md](docs/rfcs/keystone-api.md): Keystone compound API, low-level creators, state, polymorphism, styling contracts, SSR, and first primitives.
- [docs/rfcs/mason-registry.md](docs/rfcs/mason-registry.md): Mason registry schema, CLI semantics, path safety, project detection, and first proving item.
- [docs/adr/0003-mason-tanstack-app-layer.md](docs/adr/0003-mason-tanstack-app-layer.md): Mason's TanStack app-layer decision.
- [docs/agents/end-state-primitive-component-inventory.md](docs/agents/end-state-primitive-component-inventory.md): Keystone primitive and Mason component end-state inventory.
- [docs/agents/README.md](docs/agents/README.md): agent context sources, work tracking, review checks, and README hygiene.
- [docs/accessibility/testing-plan.md](docs/accessibility/testing-plan.md): accessibility release gates, automated/manual testing matrix, and first primitive coverage.
- [registry/default](registry/default): first-party Mason registry source and item metadata.
- [.context/attachments/pasted_text_2026-05-03_14-26-48.txt](.context/attachments/pasted_text_2026-05-03_14-26-48.txt): strategic PRD source.

## What To Ignore For Now

- Broad component inventory before kernel decisions.
- Mason blocks/templates before Keystone overlay and form primitives are proven.
- Final branding until naming/package/trademark clearance is complete.
- Tool-specific issue workflow until an issue tracker convention is chosen.

## Next Inspection

- Deepen Keystone kernel modules before adding new primitives.
- Use the accepted ADRs, RFCs, and end-state inventory before adding new Keystone or Mason surfaces.
- Keep docs/playground/registry preview work centered in `apps/docs`.
