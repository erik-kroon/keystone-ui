# Context

## Product Thesis

Keystone UI aims to give Solid a serious UI ecosystem with two distinct layers:

- `Core`: headless, accessible, unstyled primitives for Solid.
- `UI components`: copy-paste styled components, blocks, templates, and app-layer source for Solid.

The strategic model combines a primitive layer with a source-first registry layer, implemented with Solid-native APIs rather than React-shaped translations.

[Canonical Roadmap](docs/roadmap/canonical-roadmap.md) is the north-star direction for sequencing. Treat it as the durable source for Phase 0 direction, primitive breadth freeze, maturity labels, Mason registry maturity, and data-dense workspace timing.

The longer-term application direction is data-dense, keyboard-first Solid product UI: dashboards, internal tools, developer tools, analytics workspaces, financial workspaces, and similar operational surfaces. Core stays domain-agnostic; UI is where source-owned workspace patterns, domain packs, and app-level integrations should live.

## Domain Terms

- `Core`: primitive runtime and APIs. Handles behavior, accessibility, focus, keyboard interaction, positioning, forms, SSR, and composition.
- `UI component`: styled component/block/template source installed into user apps.
- `Mason`: registry and CLI layer that validates, plans, installs, diffs, updates, removes, and audits UI source.
- `primitive`: unstyled behavior component or low-level creator such as `Dialog.Root` or `createDialog`.
- `kernel`: reusable internal systems shared by primitives, such as controllable state, presence, focus scope, dismissable layer, floating, collections, typeahead, and form control.
- `part`: named DOM/component piece in a primitive, exposed through `data-part`.
- `scope`: primitive namespace exposed through `data-scope`, for example `dialog` or `select`.
- `registry item`: Mason-distributed component, block, hook, utility, theme, page, template, config, rule, or asset.
- `install transaction`: Mason's planned install unit, including target files, content hashes, existing target state, dependency changes, installed metadata, and conflicts before any writes occur.
- `block`: production-shaped UI composed from components, such as `dashboard-01`, `auth-01`, or `settings-01`.
- `template`: starter project installed by Mason, such as `vite-solid-basic` or `solidstart-basic`.
- `TanStack app layer`: preferred app-behavior layer for serious forms, data tables, shared app state, and keyboard shortcuts.
- `workspace pattern`: a UI-owned application pattern for dense product surfaces, such as command surfaces, resizable layouts, watchlists, inspection panels, data tables, chart interactions, event feeds, and rule builders.
- `maturity status`: a stability label for primitives and registry items: `internal`, `experimental`, `beta`, `stable`, or `deprecated`; see [Maturity Model](docs/roadmap/maturity-model.md).

## Product Boundaries

Core owns:

- Accessibility behavior and specs.
- Primitive state machines and DOM contracts.
- Focus, keyboard, dismissal, layering, portals, positioning, and form semantics.
- Low-level `create*` APIs and compound component APIs.
- Stable data attributes and CSS variables needed by wrappers.

Mason owns:

- CLI project detection, install, diff, update, doctor, and registry workflows.
- Registry schema, metadata, validation, dependency resolution, and path safety.

UI source owns:

- Styled source files installed into user apps.
- Blocks, templates, and themes.
- Generated component conventions and visual system.
- TanStack-backed app integrations in generated source, especially Form, Table, Store, and Hotkeys.

Forbidden dependency direction:

```txt
Core -> UI
```

Allowed dependency direction:

```txt
Core internals -> Core primitives -> UI items -> UI blocks -> UI templates
```

## Key Conventions

- Core should publish as one public package with subpath exports, for example `@scope/core/dialog`.
- Mason owns the CLI/registry packages, for example `@scope/mason-cli` and `@scope/mason-registry`.
- `@keystone-ui` is the provisional npm scope for internal package names and planning examples.
- `Keystone` is the working umbrella product name until package, trademark, domain, and handle clearance are complete.
- MIT is the intended open-source license, pending a root `LICENSE` file before public release or package publication.
- JSX component state should use Solid reactive props, for example `<Dialog.Root open={open()} onOpenChange={setOpen} />`.
- Low-level creators should accept accessors, for example `createDialog({ open: () => props.open })`.
- Polymorphism should use a Solid-native `as` API, with callback-style advanced usage.
- Every primitive part should expose stable `data-scope` and `data-part` attributes.
- Floating/measured parts should expose documented CSS variables for geometry and transform origin.
- Accessibility specs are product scope and should precede primitive implementation.
- First-party Mason registry items should carry `meta.parity` notes. Base UI is the default runtime-depth reference, Kobalte is the default Solid-native primitive reference, and exceptions should use the fitting first-class reference such as TanStack, Sonner, UI utility, or shadcn-style registry conventions.
- UI first-party app components should prefer TanStack libraries for app-grade behavior: `@tanstack/solid-form`, `@tanstack/solid-table`, TanStack Store, and `@tanstack/solid-hotkeys`.
- UI is the home for data-dense, keyboard-first workspace patterns. Keep domain-specific or finance-specific UI out of Keystone core unless it reduces to a general accessible primitive.
- Core must not depend on TanStack app libraries. Core owns intrinsic primitive behavior; UI owns app-level form/table/store/hotkey integration.
- Core kernels stay private by default. Public API is promoted through primitive subpaths, primitive-specific creators, explicitly public utility primitives such as Portal/Popper/Direction/Locale/LiveAnnouncer, form support APIs, and metadata support APIs; generic `utils`, overlay, and collection kernels stay private until an ADR or accepted RFC promotes them.
- Use [ADR 0003](docs/adr/0003-ui-tanstack-app-layer.md) and [End-State Primitive And Component Inventory](docs/agents/end-state-primitive-component-inventory.md) when deciding whether a new surface belongs in Keystone or UI.
- Use [ADR 0004](docs/adr/0004-core-kernel-api-boundary.md) before exporting a Core internal helper or letting UI depend on anything below a public primitive or utility subpath.
- Use [Do Not Reinvent Engines](docs/roadmap/do-not-reinvent.md) before adding table, virtualizer, form-state, query/cache, charting, validation, or date/i18n behavior.
- The active design source of truth is the accepted ADRs, RFCs, PRDs, agent guidance, and end-state inventory in `docs/`.

## Current State

- `apps/docs`: Solid + TanStack Router + Tailwind docs/product app.
- `packages/core`: early primitive package with overlay, disclosure, menu, select/combobox, field, selection-control, tabs, toolbar, slider, date-picker, toast, metadata, and utility surfaces. It has more breadth than the original tracer, but the shared kernel is still the main quality target.
- `packages/mason-cli`: early Mason CLI tracer with init/add planning and tests.
- `packages/mason-registry`: registry schema, validation, dependency resolution, path safety, and tests.
- `docs/`: ADRs, RFCs, accessibility plan, PRDs, and agent notes.
- `registry/`: Mason registry source for first-party UI components, TanStack-backed app components, utilities, and early blocks.
- Future UI workspace work should emphasize data tables, command surfaces, resizable app shells, watchlists, inspection panels, numeric/financial formatting, chart interaction patterns, condition builders, and event feeds while preserving source ownership.

The project is beyond a pure scaffold but still far from a mature primitive library. Mason registry and CLI tracer quality is ahead of Core runtime depth. Core needs a deeper internal kernel before broad catalog work.

Phase 0 posture: consolidate direction, freeze primitive breadth, label maturity, keep private kernels private, make UI multi-file registry items first-class, and defer data-dense workspace implementation until Core kernels and Mason registry/CLI are credible enough to carry it.

## Near-Term Milestone

The active planning baseline:

- Keep Keystone as the provisional umbrella name until clearance.
- Use `@keystone-ui` as the provisional package scope.
- Use MIT as the intended license and lightweight ADR/RFC-based maintainer governance.
- Use the Core API RFC as the baseline for compound components, low-level creators, controlled state, polymorphism, event composition, data attributes, CSS variables, SSR, and first API-proving primitives.
- Use the Mason registry RFC as the baseline for registry schema, CLI install semantics, path safety, Solid project detection, and first proving items.
- Use the end-state primitive/component inventory as the baseline for Keystone Core/UI surface classification and sequencing.
- Write accessibility testing plan.
- Preserve the strict Keystone Core/UI product boundary.
- Prioritize Core internals parity before adding more primitive surface area.
- Treat data-dense UI workspace patterns as a product differentiator after the primitive kernel and first app-layer components are sufficiently proven.
