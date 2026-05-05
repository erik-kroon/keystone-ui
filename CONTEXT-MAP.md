# Context Map

## Area

Early Keystone UI monorepo bootstrap for a Solid primitive library and Mason registry ecosystem.

## Domain Terms

- `Keystone`: Solid-native primitive layer.
- `UI`: copy-paste registry, CLI, blocks, templates, and styled source layer.
- `kernel`: shared primitive internals that should be built before visible components.
- `registry`: UI distribution model for components, blocks, templates, themes, and related files.
- `docs`: product documentation and API guidance, served through `apps/web`.
- `TanStack app layer`: Mason's preferred app-behavior layer for forms, tables, shared state, and app-level shortcuts.

## Module Map

- `apps/web`
  - Solid + TanStack Router docs/product app.
  - Current route is the active docs, examples, and registry preview surface.
- `packages/core`
  - Early primitive package with overlay, disclosure, menu, select/combobox, field, selection-control, tabs, toolbar, slider, date-picker, toast, metadata, and utility surfaces.
  - Current breadth is useful for proving UI wrappers, but the next quality bar is deeper shared internals.
- `packages/mason`
  - Early CLI tracer for init/add planning and writes, plus registry schema, validation, dependency resolution, path safety, and tests.
- `registry`
  - UI first-party UI component, TanStack-backed app component, utility, and block source.
  - Registry item metadata should include parity notes against the most relevant references.
- `docs/adr`
  - Durable architecture decisions for product/package boundaries, scope, names, license, and governance.
- `docs/rfcs`
  - Product/API proposals that should guide implementation before broad package work.

## Intended Growth Map

The PRD's end-state structure points toward these future areas:

- `packages/core`: primitive package with kernel systems and subpath exports.
- `packages/core-labs`: experimental primitives.
- `packages/mason`: CLI commands, project detection, transforms, prompts, diff handling, schema, validation, build, and resolution logic.
- `registry/default`: UI UI, blocks, themes, and templates.
- `examples`: install and compatibility targets.
- `apps/web`: public docs/product surface, API references, examples, and registry previews.

## Call/Data Flow

Current executable flow:

```txt
root package.json
  -> turbo tasks
    -> apps/web Vite Solid app
    -> packages/core primitive tests
    -> packages/mason tests
    -> local example-app verification
```

Intended product flow:

```txt
Core kernel
  -> Core primitives
    -> Mason registry components
      -> UI blocks
        -> UI templates and user apps
```

## Important Files

- [package.json](package.json): workspace packages, Bun version, root scripts.
- [turbo.json](turbo.json): task graph.
- [AGENTS.md](AGENTS.md): repo-local operating guidance for agents.
- [bts.jsonc](bts.jsonc): Better-T-Stack scaffold provenance.
- [apps/web/package.json](apps/web/package.json): Solid docs app dependencies.
- [docs/adr/0001-keystone-core-ui-boundary.md](docs/adr/0001-keystone-core-ui-boundary.md): Keystone Core/UI dependency and product boundary.
- [docs/adr/0002-scope-names-license-governance.md](docs/adr/0002-scope-names-license-governance.md): provisional names, package scope, license intent, and governance.
- [docs/adr/0004-core-kernel-api-boundary.md](docs/adr/0004-core-kernel-api-boundary.md): public/private Core kernel API boundary.
- [docs/rfcs/core-api.md](docs/rfcs/core-api.md): Core compound API, low-level creators, state, polymorphism, styling contracts, SSR, and first primitives.
- [docs/rfcs/mason-registry.md](docs/rfcs/mason-registry.md): Mason registry schema, CLI semantics, path safety, project detection, and first proving item.
- [docs/adr/0003-ui-tanstack-app-layer.md](docs/adr/0003-ui-tanstack-app-layer.md): Mason's TanStack app-layer decision.
- [docs/accessibility/testing-plan.md](docs/accessibility/testing-plan.md): accessibility release gates, automated/manual testing matrix, and first primitive coverage.
- [registry/default](registry/default): first-party Mason registry source and item metadata.

## What To Ignore For Now

- Broad component inventory before kernel decisions.
- UI blocks/templates before Core overlay and form primitives are proven.
- Final branding until naming/package/trademark clearance is complete.
- Tool-specific issue workflow until an issue tracker convention is chosen.

## Next Inspection

- Deepen Core kernel modules before adding new primitives.
- Use the accepted ADRs, RFCs, and roadmap docs before adding new Keystone or UI surfaces.
- Keep docs/playground/registry preview work centered in `apps/web`.
- Keep GitHub issue triage aligned to the revised milestones: `0.3 Later Core`, `0.4 Later UI`, and `0.5 Data-Dense Workspace`.
