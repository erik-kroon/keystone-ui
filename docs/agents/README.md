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

The current strategic PRD is stored in `.context/attachments/pasted_text_2026-05-03_14-26-48.txt`.

## Work Tracking

No issue tracker convention is recorded in this repository yet. Until one is chosen:

- Keep planning notes in docs when they are durable.
- Keep scratch notes under `.context/` when they are workspace-local.
- Do not invent labels, issue states, or external tracker workflow.

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
