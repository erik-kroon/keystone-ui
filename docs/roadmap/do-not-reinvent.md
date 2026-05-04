# Do Not Reinvent Engines

## Purpose

Keystone Core/UI should focus on primitive behavior, source-owned composition, and data-dense application patterns. It should not spend product energy rebuilding mature engines.

## Core Boundary

Core may depend on focused primitive infrastructure such as Floating UI. Core must not depend on TanStack app-layer libraries.

Core owns:

- Focus.
- Dismissal.
- Overlays.
- Collections.
- Typeahead.
- Roving focus and active descendant behavior.
- Form-control semantics.
- Controlled and uncontrolled primitive state.
- Data attribute and CSS variable contracts.

Core does not own:

- Table engines.
- Virtualization engines.
- App-grade form state.
- Query/cache engines.
- Chart engines.
- Routing.
- Schema validation.
- Domain workflows.

## UI Boundary

UI may use app engines directly in generated source. The installed code should stay readable and user-owned.

Use:

- `@tanstack/solid-table` for tables.
- TanStack Virtual for virtualization.
- `@tanstack/solid-form` for app-grade form state.
- TanStack Query for server cache examples and templates.
- TanStack Store where shared app state is useful.
- TanStack Hotkeys for app-level shortcut patterns, with preview caveats while the API is unstable.
- Floating UI through Core primitive behavior, not local UI positioning code.
- A selected charting engine for production chart work.
- Zod, Valibot, or another validation library in app examples.

Do not build:

- A custom generic table row/column/sort/filter engine.
- A custom virtualizer.
- A custom app form engine.
- A custom query/cache engine.
- A full chart renderer.
- A generic schema validation library.

## Product Value

Keystone Core/UI value should be:

- Solid-native primitive contracts.
- Accessible interaction behavior.
- Source-owned UI composition.
- Data-dense UI patterns that integrate proven engines.
- Keyboard-first workspace flows.
- Stable styling hooks and metadata.
