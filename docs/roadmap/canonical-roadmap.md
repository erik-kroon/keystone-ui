# Canonical Roadmap

## Status

North-star roadmap, derived from the Keystone UI / UI end-state PRD.

This document is the durable product direction for sequencing work. It is intentionally more strategic than a sprint plan and should not be treated as a single implementation checklist.

## Product Direction

Keystone Core/UI should become the Solid-native primitive and source-owned component system for serious, data-dense, keyboard-first applications.

Target application classes:

- Fintech and financial workspaces.
- Analytics dashboards.
- Internal tools and admin systems.
- Developer tools and operations consoles.
- High-density SaaS control planes.

The product split stays strict:

```txt
Core = primitive behavior
UI    = source-owned components, registry items, app patterns, templates, and blocks
```

Core remains domain-agnostic. UI may include domain-shaped blocks and examples when they prove source-owned workspace patterns.

## Architecture Target

```txt
Core private kernels
  -> Keystone Solid-native primitive creators
    -> Core compound components with stable part contracts
      -> UI copy-paste styled components
        -> UI TanStack-backed application components
          -> UI workspace blocks and vertical templates
```

The differentiator is depth, composability, and serious application patterns. Broad component catalog parity is secondary.

## Current Posture

The repo has enough primitive breadth to prove wrappers, docs, and registry flows. The next quality bar is kernel depth and API discipline.

Near-term constraints:

- Freeze new primitive breadth unless a primitive directly proves overlay, collection, form, or state kernels.
- Keep private kernels private until several primitives prove their shape.
- Label primitive maturity honestly.
- Keep TanStack app-layer dependencies in UI.
- Keep data-dense workspace blocks aspirational until Core kernels and Mason registry/CLI are reliable enough to support them.

## Phase 0: Consolidate Direction

Goal: make the repo unambiguous about what it is and is not.

Tasks:

- Keep this canonical roadmap linked from active context docs.
- Add and use the primitive/component maturity model.
- Freeze primitive breadth.
- Clean public positioning so Keystone Core/UI is not described as a clone of Kobalte, Radix, Base UI, or shadcn.
- Add or maintain Keystone Core/UI boundary docs.
- Add or maintain do-not-reinvent guidance.
- Make UI multi-file registry items first-class in docs, tests, and metadata.
- Keep data-dense workspace work documented as an aspirational differentiator, not the next implementation default.

Avoid:

- Adding primitives for catalog coverage.
- Publishing private kernels as public APIs too early.
- Starting RealtimeTable, Watchlist, chart, or terminal blocks before the underlying kernels and registry lifecycle are credible.

## Phase 1: Kernel Hardening

Goal: make Core internals boringly reliable.

Tasks:

- Deepen the overlay kernel: layering, focus, dismissal, presence, Floating UI integration, inert/outside hiding, prevent scroll, nested overlays, SSR/hydration.
- Deepen the collection kernel: DOM-order registration, disabled skipping, groups, typeahead, active descendant, roving focus, single/multi selection, custom delegates, virtualization compatibility.
- Deepen the form-control kernel: labels, descriptions, errors, hidden inputs, form owners, reset, validity, disabled/readonly/required/invalid contracts.
- Split broad utility internals toward focused modules: controllable state, events, ids, data attributes, polymorphic rendering, DOM, refs.
- Add behavior specs, keyboard matrices, SSR smoke tests, and metadata contract tests.

Avoid:

- Adding app-layer dependencies to Keystone.
- Treating docs metadata as a substitute for behavior tests.

## Phase 2: Primitive API Discipline

Goal: make Core public APIs credible.

Tasks:

- Stabilize the strongest primitives first: Dialog, Select, Combobox, Menu, Tabs, Field/FormControl.
- Define creator APIs where the compound API has proven the behavior.
- Define event detail contracts and preventable event behavior.
- Define the Solid-native polymorphism contract.
- Document `data-scope`, `data-part`, state attributes, and CSS variables.
- Document known gaps and maturity status on every primitive page.

Avoid:

- Claiming all exported primitives are stable.
- Hiding accessibility gaps.

## Phase 3: Mason Registry Maturity

Goal: make UI feel like a serious source registry.

Tasks:

- Make multi-file registry items normal install units with deterministic targets.
- Improve default registry flow.
- Improve diff, update, remove, and doctor workflows.
- Strengthen installed metadata and conflict detection.
- Keep generated source readable and user-owned.
- Keep parity metadata required for first-party registry items.

Avoid:

- Turning UI into a hidden runtime framework.
- Reimplementing Core behavior in generated wrappers.

## Phase 4: UI App Engines

Goal: prove UI can compose serious app engines.

Tasks:

- Deepen DataTable on TanStack Table.
- Deepen CommandMenu on Core Combobox plus TanStack Store/Hotkeys.
- Build TanStack Form adapters for UI fields.
- Add Query/Router examples where they clarify source-owned app patterns.
- Document where app state, server cache, and routing belong.

Avoid:

- Custom table, form, query, or hotkey engines.

## Phase 5: Data-Dense Flagship

Goal: differentiate through workspace-grade source patterns.

Candidates:

- RealtimeTable.
- Watchlist.
- Metric components backed by the generic UI numeric formatting source kit.
- PriceInput and numeric input variants, with display formatting kept in UI and general numeric input behavior considered separately for Core only when it reduces to an accessible primitive.
- TerminalLayout.
- ChartTooltip and Crosshair adapters.
- ConditionBuilder.
- EventFeed.
- Financial workspace, developer console, and admin control plane examples.

These belong in UI items, blocks, templates, or examples. Core only receives work from this phase when a behavior reduces to a general accessible primitive.

## Phase 6: Public Preview

Goal: release a credible preview.

Tasks:

- Package naming and license readiness.
- Install docs.
- Contribution docs.
- Docs polish.
- Release notes.
- Example apps.
- Clear maturity labels and known gaps.

## Operating Rule

```txt
Kernel depth
API discipline
UI app-layer proof
Data-dense flagship components
```
