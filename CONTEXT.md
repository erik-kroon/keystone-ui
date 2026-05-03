# Context

## Product Thesis

Keystone UI aims to give Solid a serious UI ecosystem with two distinct layers:

- `Keystone`: headless, accessible, unstyled primitives for Solid.
- `Mason`: copy-paste styled components, blocks, templates, registry, and CLI for Solid.

The strategic model combines a primitive layer with a source-first registry layer, implemented with Solid-native APIs rather than React-shaped translations.

## Domain Terms

- `Keystone`: primitive runtime and APIs. Handles behavior, accessibility, focus, keyboard interaction, positioning, forms, SSR, and composition.
- `Mason`: source registry and CLI. Installs styled component/block/template source into user apps.
- `primitive`: unstyled behavior component or low-level creator such as `Dialog.Root` or `createDialog`.
- `kernel`: reusable internal systems shared by primitives, such as controllable state, presence, focus scope, dismissable layer, floating, collections, typeahead, and form control.
- `part`: named DOM/component piece in a primitive, exposed through `data-part`.
- `scope`: primitive namespace exposed through `data-scope`, for example `dialog` or `select`.
- `registry item`: Mason-distributed component, block, hook, utility, theme, page, template, config, rule, or asset.
- `install transaction`: Mason's planned install unit, including target files, content hashes, existing target state, dependency changes, installed metadata, and conflicts before any writes occur.
- `block`: production-shaped Mason UI composed from components, such as `dashboard-01`, `auth-01`, or `settings-01`.
- `template`: starter project installed by Mason, such as `vite-solid-basic` or `solidstart-basic`.
- `TanStack app layer`: Mason's preferred app-behavior layer for serious forms, data tables, shared app state, and keyboard shortcuts.

## Product Boundaries

Keystone owns:

- Accessibility behavior and specs.
- Primitive state machines and DOM contracts.
- Focus, keyboard, dismissal, layering, portals, positioning, and form semantics.
- Low-level `create*` APIs and compound component APIs.
- Stable data attributes and CSS variables needed by wrappers.

Mason owns:

- CLI project detection, install, diff, update, doctor, and registry workflows.
- Styled source files installed into user apps.
- Blocks, templates, themes, registry schema, and registry validation.
- Generated component conventions and visual system.
- TanStack-backed app integrations in generated source, especially Form, Table, Store, and Hotkeys.

Forbidden dependency direction:

```txt
Keystone -> Mason
```

Allowed dependency direction:

```txt
Keystone internals -> Keystone primitives -> Mason components -> Mason blocks -> Mason templates
```

## Key Conventions

- Keystone should publish as one public package with subpath exports, for example `@scope/keystone/dialog`.
- Mason should have its own CLI/registry packages, for example `@scope/mason-cli` and `@scope/mason-registry`.
- `@keystone-ui` is the provisional npm scope for internal package names and planning examples.
- `Keystone` and `Mason` are working product names until package, trademark, domain, and handle clearance are complete.
- MIT is the intended open-source license, pending a root `LICENSE` file before public release or package publication.
- JSX component state should use Solid reactive props, for example `<Dialog.Root open={open()} onOpenChange={setOpen} />`.
- Low-level creators should accept accessors, for example `createDialog({ open: () => props.open })`.
- Polymorphism should use a Solid-native `as` API, with callback-style advanced usage.
- Every primitive part should expose stable `data-scope` and `data-part` attributes.
- Floating/measured parts should expose documented CSS variables for geometry and transform origin.
- Accessibility specs are product scope and should precede primitive implementation.
- First-party Mason registry items should carry `meta.parity` notes. Base UI is the default runtime-depth reference, Kobalte is the default Solid-native primitive reference, and exceptions should use the fitting first-class reference such as TanStack, Sonner, Mason utility, or shadcn-style registry conventions.
- Mason first-party app components should prefer TanStack libraries for app-grade behavior: `@tanstack/solid-form`, `@tanstack/solid-table`, TanStack Store, and `@tanstack/solid-hotkeys`.
- Keystone must not depend on TanStack app libraries. Keystone owns intrinsic primitive behavior; Mason owns app-level form/table/store/hotkey integration.
- Use [ADR 0003](docs/adr/0003-mason-tanstack-app-layer.md) and [End-State Primitive And Component Inventory](docs/agents/end-state-primitive-component-inventory.md) when deciding whether a new surface belongs in Keystone or Mason.
- The active design source of truth is the accepted ADRs, RFCs, PRDs, agent guidance, and end-state inventory in `docs/`.

## Current State

- `apps/docs`: Solid + TanStack Router + Tailwind docs/product app.
- `packages/keystone`: early primitive package with overlay, disclosure, menu, select/combobox, field, selection-control, tabs, toolbar, slider, date-picker, toast, metadata, and utility surfaces. It has more breadth than the original tracer, but the shared kernel is still the main quality target.
- `packages/mason-cli`: early Mason CLI tracer with init/add planning and tests.
- `packages/mason-registry`: registry schema, validation, dependency resolution, path safety, and tests.
- `docs/`: ADRs, RFCs, accessibility plan, PRDs, and agent notes.
- `registry/`: Mason registry source for first-party UI components, TanStack-backed app components, utilities, and early blocks.

The project is beyond a pure scaffold but still far from a mature primitive library. Mason registry and CLI tracer quality is ahead of Keystone runtime depth. Keystone needs a deeper internal kernel before broad catalog work.

## Near-Term Milestone

The active planning baseline:

- Keep Keystone and Mason as codenames until clearance.
- Use `@keystone-ui` as the provisional package scope.
- Use MIT as the intended license and lightweight ADR/RFC-based maintainer governance.
- Use the Keystone API RFC as the baseline for compound components, low-level creators, controlled state, polymorphism, event composition, data attributes, CSS variables, SSR, and first API-proving primitives.
- Use the Mason registry RFC as the baseline for registry schema, CLI install semantics, path safety, Solid project detection, and first proving items.
- Use the end-state primitive/component inventory as the baseline for Keystone/Mason surface classification and sequencing.
- Write accessibility testing plan.
- Preserve the strict Keystone/Mason product boundary.
- Prioritize Keystone internals parity before adding more primitive surface area.
