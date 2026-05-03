# Agent Guidance

This repository is the early Keystone UI monorepo. Treat `Keystone` and `Mason` as product codenames until package, trademark, and domain clearance are done.

## Product Direction

- Keystone is the headless, accessible, unstyled primitive layer for Solid.
- Mason is the copy-paste styled component, block, template, registry, and CLI layer for Solid.
- Mason may depend on Keystone primitives; Keystone must not depend on Mason.
- Build depth before breadth: kernel utilities, overlays, fields/forms, then select/combobox before broad styled component catalogs.
- Use local inspiration repos under `inspo/` when designing primitives:
  - `inspo/base-ui`: first-priority architecture and runtime-depth reference.
  - `inspo/kobalte`: first-priority Solid-native API and composition reference.
  - `inspo/radix-primitives`: secondary React precedent; useful historically, but do not copy React-specific patterns.
- Use local inspiration repos under `inspo/` when designing Mason registry/UI:
  - `inspo/shadcn-ui`: primary copy-paste UI, CLI, docs, and registry platform reference.
  - `inspo/shadcn-registry-template`: focused registry structure/reference implementation.
  - `inspo/coss`: Mason UI component inspiration for later styled components.

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
- `.context/attachments/pasted_text_2026-05-03_14-26-48.txt`: source PRD for the current strategic direction.

## Implementation Guardrails

- Prefer Solid-native APIs over React-shaped translations.
- Study Base UI and Kobalte before changing Keystone primitive internals; Radix is secondary context.
- Keystone primitives must be styling-agnostic and expose stable `data-scope` and `data-part` attributes.
- Stateful primitives should support controlled and uncontrolled usage.
- Event handlers should run user code first; internal handlers should skip when `event.defaultPrevented`.
- Overlay work must account for focus management, dismissal, layering, portals, SSR, hydration, and accessibility testing.
- Mason generated code should be readable source owned by the user project and should not reimplement Keystone behavior.
- Study shadcn UI and the shadcn registry template before changing Mason registry or CLI flows.
- Treat coss UI as later Mason UI component inspiration, not as Keystone primitive architecture.
