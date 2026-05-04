# Agent Notes

## Context Sources

Start with:

- [AGENTS.md](../../AGENTS.md)
- [CONTEXT.md](../../CONTEXT.md)
- [CONTEXT-MAP.md](../../CONTEXT-MAP.md)
- [ADR 0001](../adr/0001-keystone-mason-product-boundary.md)
- [ADR 0002](../adr/0002-scope-names-license-governance.md)
- [ADR 0003](../adr/0003-mason-tanstack-app-layer.md)
- [Keystone API RFC](../rfcs/keystone-api.md)
- [Mason Registry RFC](../rfcs/mason-registry.md)
- [End-state primitive/component inventory](./end-state-primitive-component-inventory.md)
- [Keystone internal kernel guidance](./keystone-internal-kernel-guidance.md)
- [Controllable state vertical](./controllable-state-vertical.md)
- [Solid polymorphic `as` rendering](./solid-polymorphic-as-rendering.md)
- [Accordion and Collapsible vertical](./accordion-collapsible-vertical.md)
- [Selection controls vertical](./selection-controls-vertical.md)
- [Slider vertical](./slider-vertical.md)
- [DatePicker and Calendar vertical](./date-picker-calendar-vertical.md)
- [Tabs vertical](./tabs-vertical.md)
- [Toolbar vertical](./toolbar-vertical.md)
- [NavigationMenu vertical](./navigation-menu-vertical.md)

The current strategic PRD is stored in `.context/attachments/pasted_text_2026-05-03_14-26-48.txt`.

## Work Tracking

No issue tracker convention is recorded in this repository yet. Until one is chosen:

- Treat GitHub as available because `origin` points at `erik-kroon/keystone-ui`, but do not infer labels, states, milestones, or queue rules from that alone.
- Keep planning notes in docs when they are durable.
- Keep scratch notes under `.context/` when they are workspace-local.
- Do not invent labels, issue states, or external tracker workflow.

## Task Selection Hygiene

Attachments under `.context/attachments/` may be duplicated, stale, or already implemented.
Before treating an attachment as the next task:

- Compare it with existing repo docs and prior attachments when it looks like a PRD or issue brief.
- Check the local package/source surface for the requested files, tests, and behavior.
- Check the current GitHub issue state with `gh issue list` or `gh issue view` when an issue number is referenced.
- Prefer the oldest unblocked open issue whose acceptance criteria are visibly absent from the repo.
- Do not propose completed tracer work as next work only because its brief is present in `.context/attachments/`.

## Skill Usage

- Use `context-map` when entering an unfamiliar product or code area.
- Use `repo-context-bootstrap` when adding or repairing durable agent/repo context.
- Use implementation-specific skills only after the target area and product boundary are clear.

## Review Checklist

For Keystone work, check:

- Solid-native API shape.
- Accessibility spec and tests.
- Controlled/uncontrolled behavior.
- Stable `data-scope` and `data-part` attributes.
- SSR and hydration behavior.
- No Mason dependency.

For Mason work, check:

- Generated source remains readable and user-owned.
- Keystone behavior is imported instead of reimplemented.
- TanStack Form/Table/Store/Hotkeys are preferred for first-party app behavior where applicable.
- Registry paths are validated and deterministic.
- CLI writes are diffable, dry-run friendly, and path traversal safe.
- Registry item metadata includes `meta.parity` notes. Use Base UI and Kobalte for primitives by default, and use a more relevant first-class reference for exceptions such as TanStack-backed app components, Sonner-style toast behavior, Mason utilities, or shadcn-style source registry conventions.

## External README Hygiene

The root README is the public entry point for the current project state:

- Keep the opening concise: what Keystone is, what Mason is, and why the split exists.
- State preview instability plainly.
- Describe current package and registry surface, not the ideal end-state catalog.
- Keep roadmap, strategy, and internal sequencing in `CONTEXT.md`, `CONTEXT-MAP.md`, ADRs, RFCs, PRDs, and agent docs.
