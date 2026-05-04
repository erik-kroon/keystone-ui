# Agent Guidance

This repository is the early Keystone UI monorepo. Treat `Keystone` as the provisional umbrella product name until package, trademark, and domain clearance are done.

## Product Direction

- Core is the headless, accessible, unstyled primitive layer for Solid.
- UI components are the copy-paste styled component, block, template, and app-layer source for Solid.
- Mason is the registry and CLI layer that installs UI source.
- UI may depend on Core primitives; Core must not depend on UI.
- Build depth before breadth: kernel utilities, overlays, fields/forms, then select/combobox before broad styled component catalogs.
- UI first-party app components are TanStack-native where useful: Form for forms, Table for data tables, Store for shared app state, and Hotkeys for app-level shortcuts.
- Core must remain independent from TanStack app libraries; Core owns intrinsic primitive behavior and UI owns app integrations.
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
- [docs/adr/0003-ui-tanstack-app-layer.md](docs/adr/0003-ui-tanstack-app-layer.md): TanStack app-layer decision for UI.
- [docs/adr/0004-core-kernel-api-boundary.md](docs/adr/0004-core-kernel-api-boundary.md): public/private Core kernel API boundary.
- [docs/prd/keystone-foundation.md](docs/prd/keystone-foundation.md): foundation PRD and product flywheel.
- [docs/prd/core-internals-inspiration-parity.md](docs/prd/core-internals-inspiration-parity.md): Core kernel parity PRD.
- [docs/agents/issue-triage-spine.md](docs/agents/issue-triage-spine.md): GitHub issue milestones, labels, and 0.1 active spine.
- [docs/agents/end-state-primitive-component-inventory.md](docs/agents/end-state-primitive-component-inventory.md): optimal Core primitive and UI item inventory.
- [docs/agents/data-dense-workspace-verticals.md](docs/agents/data-dense-workspace-verticals.md): UI workspace-pattern issue breakdown.

## Implementation Guardrails

- Prefer Solid-native APIs over React-shaped translations.
- Core primitives must be styling-agnostic and expose stable `data-scope` and `data-part` attributes.
- Core kernels stay private by default; do not export generic `utils`, overlay, or collection internals without an ADR or accepted RFC.
- Stateful primitives should support controlled and uncontrolled usage.
- Event handlers should run user code first; internal handlers should skip when `event.defaultPrevented`.
- Overlay work must account for focus management, dismissal, layering, portals, SSR, hydration, and accessibility testing.
- UI generated code should be readable source owned by the user project and should not reimplement Core behavior.
- UI form, table, store, and hotkey work should prefer TanStack libraries instead of custom app-behavior systems.
- UI data-dense components should preserve clarity under frequent updates and should treat keyboard navigation/focus behavior as first-class product concerns.
- Every first-party UI primitive/component/block registry item should carry `meta.parity` notes. Prefer Base UI first for runtime depth and Kobalte second for Solid-native primitive shape; use the more fitting reference for exceptions such as TanStack app components, Sonner-style toast behavior, UI utilities, or shadcn-style source registry conventions.
- When updating the root `README.md`, keep it external-facing and grounded in current repo state. Do not turn it into an internal roadmap; link or defer durable planning detail to `CONTEXT.md`, `CONTEXT-MAP.md`, ADRs, RFCs, and `docs/agents/`.

## Tips

- Use the fff MCP tools for all file search operations instead of default tools.
- If given a number with a hashtag, for example #32, it is linked to a github issue and the github issue should be read and closed if/when implemented.
