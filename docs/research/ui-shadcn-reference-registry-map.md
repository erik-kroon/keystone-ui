# Mason Registry Inspiration Map

## Status

Draft

## Date

2026-05-03

## Related

- [Issue #26: Map shadcn and external UI reference registry patterns for UI](https://github.com/erik-kroon/core-ui/issues/26)
- [RFC: Mason Registry](../rfcs/mason-registry.md)
- [PRD: Keystone Core And UI Foundation](../prd/keystone-foundation.md)
- [ADR 0001: Keystone Core And UI Product Boundary](../adr/0001-keystone-core-ui-boundary.md)

## References Inspected

- `inspo/shadcn-ui/packages/shadcn/src/registry/schema.ts`
- `inspo/shadcn-ui/packages/shadcn/src/registry/builder.ts`
- `inspo/shadcn-ui/packages/shadcn/src/registry/resolver.ts`
- `inspo/shadcn-ui/packages/shadcn/src/registry/config.ts`
- `inspo/shadcn-ui/apps/v4/registry/config.ts`
- `inspo/shadcn-ui/apps/v4/components/component-preview.tsx`
- `inspo/shadcn-ui/apps/v4/components/block-viewer.tsx`
- `inspo/shadcn-ui/apps/v4/lib/components.ts`
- `inspo/shadcn-ui/apps/v4/lib/blocks.ts`
- `inspo/shadcn-registry-template/registry.json`
- `inspo/shadcn-registry-template/package.json`
- `inspo/shadcn-registry-template/README.md`
- `inspo/external UI reference/packages/ui/components.json`
- `inspo/external UI reference/packages/ui/src/styles/globals.css`
- `inspo/external UI reference/apps/ui/skills/external UI reference/references/component-registry.md`
- `inspo/external UI reference/apps/ui/skills/external UI reference/references/rules/styling.md`
- `inspo/external UI reference/apps/ui/lib/registry.ts`
- `inspo/external UI reference/apps/origin/registry/registry-tags.ts`

## Executive Map

UI should adopt the shadcn registry mental model: source-first registry items, project config, aliases, dependency metadata, registry dependencies, static JSON output, docs previews, and CLI install plans. UI should adapt those patterns for Solid project detection, Solid JSX, SolidStart and TanStack Router conventions, Core-backed behavior imports, and generated output typecheck/build gates.

UI should treat external UI reference as a later UI styling and component-inventory reference, not as a registry architecture authority. external UI reference is useful for token discipline, component grouping, dense primitive coverage, docs reference shape, and registry consumption patterns. It remains React/Base UI-oriented, so UI should not copy its runtime component code directly.

## shadcn UI Patterns

### Adopt

- Copy-paste source ownership. Registry items should install ordinary source files into the user project rather than opaque runtime packages.
- `components.json`-style project config with aliases, style selection, TS/JS mode, icon library, style entry, and registry namespaces.
- Registry namespace config where keys begin with `@` and map to URL templates containing `{name}`. Keep room for object values with `url`, `params`, and `headers`.
- Environment-variable expansion for private registry headers and params, with missing secrets omitted rather than logged.
- Registry item types for UI, blocks, hooks, libs, pages, files, themes/styles, fonts, and config/base items.
- Per-item metadata for dependencies, devDependencies, registryDependencies, files, CSS, CSS variables, environment variables, docs, categories, and arbitrary meta.
- Deterministic dependency tree resolution: requested items plus transitive registry dependencies become one install bundle.
- Target-path derivation by file type and project aliases, with explicit `target` as an override.
- Registry fetch support from local files, direct URLs, built-in registry paths, and namespaced registries.
- Docs product shape: install command, preview, source, dependency metadata, examples, blocks, and file tree.
- Static built registry output for distribution, where each item can be fetched as JSON by CLI and docs surfaces.

### Adapt For UI

- Replace React component output with Solid component source. Generated files should use Solid JSX, accessors where needed, `class` rather than React-only `className` defaults, and Solid event conventions.
- Replace Radix-backed behavior imports with Core imports. UI items should style and compose Core primitives, not reimplement behavior.
- Replace Next.js-first detection with Solid-first detection: Vite Solid, SolidStart, TanStack Router, TS config aliases, package manager, style entry, SSR/hydration shape.
- Keep the shadcn item vocabulary, but prefer UI names where clearer: `registry:ui`, `registry:block`, `registry:hook`, `registry:lib`, `registry:theme`, `registry:page`, `registry:template`, `registry:config`, `registry:rule`, `registry:asset`, and `registry:file`.
- Keep `registry:style` compatibility as an accepted alias or import format, but internally normalize to Mason's theme/style model.
- Support Tailwind v4 and plain CSS token files without assuming Tailwind is mandatory.
- Treat page items as framework-aware. A page target for SolidStart differs from TanStack Router file routes and must be detected or explicitly configured.
- Make generated output verification a first-class registry quality gate: install into tracer apps, typecheck, build, and later run browser smoke checks.
- Preserve shadcn-like registry URLs and namespaces, but do not depend on the shadcn CLI or official registry service.

### Avoid

- React Server UI flags such as `rsc` as a UI driver. UI may need SSR metadata, but it should describe Solid SSR/hydration support instead.
- Next.js App Router paths such as `app/**/page.tsx` as defaults.
- React `ref`, `forwardRef`, `Slot`, `children`, and synthetic event assumptions in generated component APIs.
- Tailwind-only setup assumptions. Tailwind can be a first supported style system, not the registry contract.
- Silent style fallbacks that hide project mismatch. UI should report unsupported style/router/project shapes clearly.
- Broad compatibility with every shadcn internal item type before UI proves core UI, lib, hook, theme, config, and file installs.

## shadcn Registry Template Patterns

### Adopt

- Simple authoring layout: a root `registry.json` plus source files under `registry/<style>/...`.
- Build command that emits static item JSON under a public directory, for example `public/r/<name>.json` and `public/r/registry.json`.
- Registry item JSON that inlines file contents at build time while preserving source paths and targets.
- Multi-file item support for blocks/components that include component files, hooks, libs, pages, and CSS files in one item.
- `registryDependencies` for shared primitives such as `button`, `input`, `label`, and `card`.
- Explicit target support for page/config/file items.
- A small website or preview app that can serve registry JSON and show examples.

### Adapt For UI

- Use a Solid/Vite or SolidStart registry template, not Next.js by default.
- Use Bun scripts in the monorepo, for example `components registry build` and `components registry validate`.
- Author styles under `registry/default/...` first. Add style variants only after the default style proves component quality.
- Prefer UI item types in source JSON. Accept shadcn item JSON as an import path if validation can normalize it safely.
- Build output should include schema version, Mason CLI compatibility, Solid compatibility, and optional Keystone compatibility.
- Validation must reject path traversal, missing files, duplicate targets, unsupported item types, invalid dependency specifiers, and dependency cycles before any built artifact is published.

### Avoid

- A Next.js-only registry template.
- v0 integration as a required registry concept. It can be an optional later docs/distribution feature.
- Assuming every registry author uses Tailwind v4.
- Publishing unvalidated static JSON because the docs app can render it.

## external UI reference Patterns

### Adopt Later For UI

- Component grouping by user task: overlays, selection/input, forms, toggles, layout/navigation, content/display, feedback/status, and actions.
- A reference index that lets contributors find the right component and its design rules quickly.
- Semantic token discipline over raw palette classes.
- CSS variable architecture for background, foreground, card, popover, primary, secondary, muted, accent, destructive, ring, chart, sidebar, code, radius, and fonts.
- Font variable contract: `--font-sans`, `--font-mono`, and `--font-heading`.
- Data-aware styling conventions that avoid unnecessary wrapper state.
- Icon conventions: decorative icons are `aria-hidden`, sizing is mostly class-driven, and icon opacity is owned by component styles.
- Registry tags for search and categorization. UI should maintain a typed tag set before community registry indexing.
- Docs references per primitive/component with usage rules, composition notes, and common pitfalls.
- Registry consumption helper that reads source files, derives targets, and can build file-tree metadata for docs.

### Adapt For UI

- Replace external UI reference React/Base UI components with Solid/Core-backed components.
- Use `data-scope` and `data-part` from Keystone as stable styling selectors. UI can add its own data attributes only when styling needs them.
- Token names can be similar, but UI should keep tokens small until the first components prove the system.
- external UI reference's large component inventory should become a prioritization reference, not immediate scope.
- Portal guidance should map to Core overlay internals and Solid app roots.
- Tags should include Solid-specific and Keystone-specific categories once Mason registry search exists.

### Avoid

- Copying external UI reference component source directly.
- Treating Base UI portal or React composition APIs as UI runtime constraints.
- Importing external UI reference token volume wholesale before UI has a real default style and docs surface.
- Building hundreds of component items before Core primitives are stable enough to support them.

## React And Next Assumptions That Must Not Drive UI

- `rsc` config and React Server Component split.
- `app/` route defaults, Next route handlers, `next/font`, and Next image assumptions.
- React `forwardRef`, `Slot`, `asChild`, and synthetic event patterns as public API defaults.
- `className` as the only class prop in generated source.
- Radix React primitive imports as the behavior layer.
- React Hook Form or React-only form patterns as default generated form architecture.
- v0 as the default preview/export integration.
- React-specific test and hydration warnings as the main generated-output gate.

## Solid-Specific UI Adaptations

- `mason init` detects `solid-js`, Vite Solid plugin, SolidStart, TanStack Router, TS/JS config, JSX settings, package manager, workspace root, style entry, and path aliases.
- Generated components use Solid JSX and Solid idioms: signal props are read as accessors where needed, control flow uses Solid primitives when dynamic, and events follow DOM/Solid conventions.
- UI import Core primitives for behavior and styling hooks via stable `data-scope`, `data-part`, and CSS variables.
- Page items require router-aware targets:
  - SolidStart file routes.
  - TanStack Router file routes and route tree generation concerns.
  - Plain Vite Solid apps where pages may be unsupported unless configured.
- Style items can patch plain CSS, Tailwind v4 CSS, or token files, but must not assume one global stylesheet path without detection.
- CLI writes should be followed by generated-app verification for first-party items: typecheck, build, and later browser smoke/a11y checks.
- Registry item compatibility should include Mason CLI, Solid, Keystone, framework, and style-system ranges.

## UI Modules To Change Next

1. `packages/mason-registry/src/schema.ts`
   - Add or confirm compatibility metadata for UI, Solid, Keystone, framework, and style system.
   - Add normalization strategy for shadcn-compatible `registry:style`, `registry:component`, `registry:base`, and `registry:font` payloads.
   - Add docs/preview/categories/tags metadata if missing from the current schema.

2. `packages/mason-registry/src/validate-files.ts`
   - Extend validation for duplicate targets, missing required targets by item type, CSS/theme file modes, and built payload content.

3. `packages/mason-registry/src/resolve-dependencies.ts`
   - Keep cycle-safe dependency resolution and prepare for namespaced and URL dependency references.

4. `packages/mason-cli/src/project/detect.ts`
   - Deepen Solid project detection for SolidStart, TanStack Router, Tailwind/plain CSS, TS/JS aliases, package manager, workspace root, and SSR/hydration signals.

5. `packages/mason-cli/src/install/plan.ts`
   - Add target resolution by item type and alias, explicit target override validation, duplicate target detection, and style/theme modes.

6. `packages/mason-cli/src/commands/add.ts`
   - Keep dry-run deterministic and include complete transitive plans, dependency commands, style/theme writes, and verification hints.

7. `packages/mason-cli/src/testing/fixtures`
   - Add tracer apps for Vite Solid, SolidStart, TanStack Router, Tailwind v4, and plain CSS as the registry grows.

8. Future `registry/default`
   - Start with `button`, `cn`, and theme tokens.
   - Next add `dialog` to prove Core-backed behavior, overlay styling, SSR/hydration, accessibility, and generated output checks.

9. Future docs app
   - Build component pages with install command, preview, source, registry JSON, dependencies, file tree, API notes, and customization guidance.

## Resulting Decisions

- Mason registry should stay shadcn-compatible in concepts and import paths, but Mason's source generation, detection, and verification must be Solid-native.
- shadcn UI is the primary registry/CLI/docs product reference.
- shadcn registry template is the primary authoring/build/serve reference for third-party registry workflows.
- external UI reference is a later UI style and component inventory reference, not a registry schema source of truth.
- Keystone remains the behavior layer. UI owns styled source, registry metadata, CLI workflows, and docs previews.
