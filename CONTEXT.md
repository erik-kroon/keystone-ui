# Context

## Product Thesis

Keystone UI aims to give Solid a serious UI ecosystem with two distinct layers:

- `Keystone`: headless, accessible, unstyled primitives for Solid.
- `Mason`: copy-paste styled components, blocks, templates, registry, and CLI for Solid.

The strategic model is similar to a primitive layer plus a shadcn-style registry layer, but the implementation should be Solid-native rather than a React API port.

## Domain Terms

- `Keystone`: primitive runtime and APIs. Handles behavior, accessibility, focus, keyboard interaction, positioning, forms, SSR, and composition.
- `Mason`: source registry and CLI. Installs styled component/block/template source into user apps.
- `primitive`: unstyled behavior component or low-level creator such as `Dialog.Root` or `createDialog`.
- `kernel`: reusable internal systems shared by primitives, such as controllable state, presence, focus scope, dismissable layer, floating, collections, typeahead, and form control.
- `part`: named DOM/component piece in a primitive, exposed through `data-part`.
- `scope`: primitive namespace exposed through `data-scope`, for example `dialog` or `select`.
- `registry item`: Mason-distributed component, block, hook, utility, theme, page, template, config, rule, or asset.
- `block`: production-shaped Mason UI composed from components, such as `dashboard-01`, `auth-01`, or `settings-01`.
- `template`: starter project installed by Mason, such as `vite-solid-basic` or `solidstart-basic`.

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
- Inspiration priority:
  - Base UI is the primary architecture and runtime-depth reference.
  - Kobalte is the primary Solid-native API, polymorphism, and composition reference.
  - Radix Primitives is secondary React precedent and should not override Solid-native design.
  - shadcn UI is the primary copy-paste UI, CLI, registry, and docs-product reference for Mason.
  - shadcn registry template is the focused registry-structure reference for Mason.
  - coss UI is later Mason UI component inspiration.

## Current State

- `apps/web`: Solid + TanStack Router + Tailwind app.
- `packages/env`: shared environment helpers.
- `packages/config`: shared TypeScript config.
- `packages/infra`: Cloudflare deployment through Alchemy.
- `packages/keystone`: early primitive tracer package with Dialog, Form, Overlay, Select, and Utils exports.
- `packages/mason-cli`: early Mason CLI tracer with init/add planning and tests.
- `packages/mason-registry`: registry schema, validation, dependency resolution, path safety, and tests.
- `docs/`: ADRs, RFCs, accessibility plan, PRDs, and agent notes.
- `inspo/`: gitignored local clones of Base UI, Kobalte, Radix Primitives, shadcn UI, shadcn registry template, and coss for reference.

The project is beyond a pure scaffold but still far from a mature primitive library. Mason registry and CLI tracer quality is ahead of Keystone runtime depth. Keystone needs a real internal kernel before broad primitive work.

## Near-Term Milestone

The active planning baseline:

- Keep Keystone and Mason as codenames until clearance.
- Use `@keystone-ui` as the provisional package scope.
- Use MIT as the intended license and lightweight ADR/RFC-based maintainer governance.
- Use the Keystone API RFC as the baseline for compound components, low-level creators, controlled state, polymorphism, event composition, data attributes, CSS variables, SSR, and first API-proving primitives.
- Use the Mason registry RFC as the baseline for registry schema, CLI install semantics, path safety, Solid project detection, and first proving items.
- Write accessibility testing plan.
- Preserve the strict Keystone/Mason product boundary.
- Prioritize Keystone internals parity before adding more primitive surface area.
