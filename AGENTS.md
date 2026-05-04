# Agent Guidance

This repository is the early Keystone UI monorepo. Treat `Keystone` and `Mason` as product codenames until package, trademark, and domain clearance are done.

## Product Direction

- Keystone is the headless, accessible, unstyled primitive layer for Solid.
- Mason is the copy-paste styled component, block, template, registry, and CLI layer for Solid.
- Mason may depend on Keystone primitives; Keystone must not depend on Mason.
- Build depth before breadth: kernel utilities, overlays, fields/forms, then select/combobox before broad styled component catalogs.
- Mason first-party app components are TanStack-native where useful: Form for forms, Table for data tables, Store for shared app state, and Hotkeys for app-level shortcuts.
- Keystone must remain independent from TanStack app libraries; Keystone owns intrinsic primitive behavior and Mason owns app integrations.
- Durable product decisions, API shape, registry shape, component inventory, and sequencing now live in repo docs; use those docs as the active source of truth.

## Repo Workflow

- Package manager: Bun (`bun@1.3.9` in `package.json`).
- Monorepo runner: Turborepo.
- Main commands:
  - `bun install`
  - `bun run dev`
  - `bun run build`
  - `bun run check-types`
  - `bun run check`
- Target branch for workspaces is `origin/main`; use `git diff origin/main...` for branch diffs.

## Where To Look

- [CONTEXT.md](CONTEXT.md): domain glossary, product boundaries, and key conventions.
- [CONTEXT-MAP.md](CONTEXT-MAP.md): current repo map and intended growth areas.
- [docs/adr/](docs/adr/): durable decisions.
- [docs/agents/](docs/agents/): agent/work tracking conventions.
- [docs/adr/0003-mason-tanstack-app-layer.md](docs/adr/0003-mason-tanstack-app-layer.md): TanStack app-layer decision for Mason.
- [docs/prd/keystone-mason-foundation.md](docs/prd/keystone-mason-foundation.md): foundation PRD and product flywheel.
- [docs/prd/keystone-internals-inspiration-parity.md](docs/prd/keystone-internals-inspiration-parity.md): Keystone kernel parity PRD.
- [docs/agents/issue-triage-spine.md](docs/agents/issue-triage-spine.md): GitHub issue milestones, labels, and 0.1 active spine.
- [docs/agents/end-state-primitive-component-inventory.md](docs/agents/end-state-primitive-component-inventory.md): optimal Keystone primitive and Mason component inventory.
- [docs/agents/data-dense-workspace-verticals.md](docs/agents/data-dense-workspace-verticals.md): Mason workspace-pattern issue breakdown.

## Implementation Guardrails

- Prefer Solid-native APIs over React-shaped translations.
- Keystone primitives must be styling-agnostic and expose stable `data-scope` and `data-part` attributes.
- Stateful primitives should support controlled and uncontrolled usage.
- Event handlers should run user code first; internal handlers should skip when `event.defaultPrevented`.
- Overlay work must account for focus management, dismissal, layering, portals, SSR, hydration, and accessibility testing.
- Mason generated code should be readable source owned by the user project and should not reimplement Keystone behavior.
- Mason form, table, store, and hotkey work should prefer TanStack libraries instead of custom app-behavior systems.
- Mason data-dense components should preserve clarity under frequent updates and should treat keyboard navigation/focus behavior as first-class product concerns.
- Every first-party Mason primitive/component/block registry item should carry `meta.parity` notes. Prefer Base UI first for runtime depth and Kobalte second for Solid-native primitive shape; use the more fitting reference for exceptions such as TanStack app components, Sonner-style toast behavior, Mason utilities, or shadcn-style source registry conventions.
- When updating the root `README.md`, keep it external-facing and grounded in current repo state. Do not turn it into an internal roadmap; link or defer durable planning detail to `CONTEXT.md`, `CONTEXT-MAP.md`, ADRs, RFCs, and `docs/agents/`.

## Tips

- Use the fff MCP tools for all file search operations instead of default tools.
