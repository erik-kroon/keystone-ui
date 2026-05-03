# Agent Notes

## Context Sources

Start with:

- [AGENTS.md](../../AGENTS.md)
- [CONTEXT.md](../../CONTEXT.md)
- [CONTEXT-MAP.md](../../CONTEXT-MAP.md)
- [ADR 0001](../adr/0001-keystone-mason-product-boundary.md)
- [ADR 0002](../adr/0002-scope-names-license-governance.md)
- [Keystone API RFC](../rfcs/keystone-api.md)
- [Mason Registry RFC](../rfcs/mason-registry.md)
- [Keystone internals inspiration map](./keystone-internals-inspiration-map.md)
- [Keystone internal kernel guidance](./keystone-internal-kernel-guidance.md)

The current strategic PRD is stored in `.context/attachments/pasted_text_2026-05-03_14-26-48.txt`.

Local inspiration repos are stored under gitignored `inspo/`:

- `inspo/base-ui`: primary architecture/runtime-depth reference.
- `inspo/kobalte`: primary Solid-native API/composition reference.
- `inspo/radix-primitives`: secondary React precedent.
- `inspo/shadcn-ui`: primary Mason copy-paste UI, CLI, docs, and registry platform reference.
- `inspo/shadcn-registry-template`: focused Mason registry structure reference.
- `inspo/coss`: later Mason UI component inspiration.

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
- Base UI and Kobalte precedent for the specific internal system or primitive.
- Accessibility spec and tests.
- Controlled/uncontrolled behavior.
- Stable `data-scope` and `data-part` attributes.
- SSR and hydration behavior.
- No Mason dependency.

For Mason work, check:

- Generated source remains readable and user-owned.
- Keystone behavior is imported instead of reimplemented.
- shadcn UI and shadcn registry template precedent for registry and CLI behavior.
- coss UI precedent when designing Mason UI component styling later.
- Registry paths are validated and deterministic.
- CLI writes are diffable, dry-run friendly, and path traversal safe.
