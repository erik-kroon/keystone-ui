# Context Map

## Area

Early Keystone UI monorepo bootstrap for a Solid primitive library and Mason registry ecosystem.

## Domain Terms

- `Keystone`: Solid-native primitive layer.
- `Mason`: copy-paste registry, CLI, blocks, templates, and styled source layer.
- `kernel`: shared primitive internals that should be built before visible components.
- `registry`: Mason distribution model for components, blocks, templates, themes, and related files.
- `docs`: product documentation and API guidance, currently via Fumadocs.

## Module Map

- `apps/web`
  - Solid + TanStack Router web app.
  - Current route is the active app surface; docs/playground responsibilities are still unsettled.
- `packages/env`
  - Shared env helper package.
- `packages/config`
  - Shared TypeScript config package.
- `packages/infra`
  - Alchemy/Cloudflare deployment wrapper for the web app.
- `packages/keystone`
  - Early primitive tracer package with Dialog, Form, Overlay, Select, and Utils exports.
  - Needs deeper internals before more component breadth.
- `packages/mason-cli`
  - Early CLI tracer for init/add planning and writes.
- `packages/mason-registry`
  - Registry schema, validation, dependency resolution, path safety, and tests.
- `inspo`
  - Gitignored local reference clones:
    - Base UI, Kobalte, and Radix Primitives for Keystone primitive work.
    - shadcn UI, shadcn registry template, and coss for Mason registry/UI work.
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
- `apps/docs` or expanded `apps/fumadocs`: public docs, API references, examples, and registry previews.

## Call/Data Flow

Current executable flow:

```txt
root package.json
  -> turbo tasks
    -> apps/web Vite Solid app
    -> apps/fumadocs Vite/TanStack/Fumadocs app
    -> packages/infra Alchemy deploy task
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
- [bts.jsonc](bts.jsonc): Better-T-Stack scaffold provenance.
- [apps/web/package.json](apps/web/package.json): Solid app dependencies.
- [apps/fumadocs/package.json](apps/fumadocs/package.json): docs app dependencies.
- [packages/infra/alchemy.run.ts](packages/infra/alchemy.run.ts): Cloudflare deployment.
- [docs/adr/0001-keystone-mason-product-boundary.md](docs/adr/0001-keystone-mason-product-boundary.md): Keystone/Mason dependency and product boundary.
- [docs/adr/0002-scope-names-license-governance.md](docs/adr/0002-scope-names-license-governance.md): provisional names, package scope, license intent, and governance.
- [docs/rfcs/keystone-api.md](docs/rfcs/keystone-api.md): Keystone compound API, low-level creators, state, polymorphism, styling contracts, SSR, and first primitives.
- [docs/rfcs/mason-registry.md](docs/rfcs/mason-registry.md): Mason registry schema, CLI semantics, path safety, project detection, and first proving item.
- [docs/research/mason-shadcn-coss-registry-map.md](docs/research/mason-shadcn-coss-registry-map.md): shadcn UI, shadcn registry template, and coss pattern map for Mason registry, CLI, docs, UI, and Solid-specific adaptations.
- [docs/accessibility/testing-plan.md](docs/accessibility/testing-plan.md): accessibility release gates, automated/manual testing matrix, and first primitive coverage.
- [.context/attachments/pasted_text_2026-05-03_14-26-48.txt](.context/attachments/pasted_text_2026-05-03_14-26-48.txt): strategic PRD source.

## What To Ignore For Now

- Broad component inventory before kernel decisions.
- Mason blocks/templates before Keystone overlay and form primitives are proven.
- Final branding until naming/package/trademark clearance is complete.
- Tool-specific issue workflow until an issue tracker convention is chosen.
- Radix-specific React API shapes when they conflict with Solid-native APIs.
- coss component styling until Mason UI component work starts.

## Next Inspection

- Compare Base UI and Kobalte internals before editing Keystone Dialog, Overlay, Form, Select, or Utils.
- Compare shadcn UI and the registry template before editing Mason registry/CLI flows.
- Deepen Keystone kernel modules before adding new primitives.
- Decide where docs/playground/registry preview surfaces should live after the current app cleanup settles.
