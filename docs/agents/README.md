# Agent Notes

## Context Sources

Start with:

- [AGENTS.md](../../AGENTS.md)
- [CONTEXT.md](../../CONTEXT.md)
- [CONTEXT-MAP.md](../../CONTEXT-MAP.md)
- [ADR 0001](../adr/0001-keystone-core-ui-boundary.md)
- [ADR 0002](../adr/0002-scope-names-license-governance.md)
- [ADR 0003](../adr/0003-ui-tanstack-app-layer.md)
- [ADR 0004](../adr/0004-core-kernel-api-boundary.md)
- [Canonical Roadmap](../roadmap/canonical-roadmap.md)
- [Maturity Model](../roadmap/maturity-model.md)
- [Do Not Reinvent Engines](../roadmap/do-not-reinvent.md)
- [Core API RFC](../rfcs/core-api.md)
- [Mason Registry RFC](../rfcs/mason-registry.md)
- [End-state primitive/component inventory](./end-state-primitive-component-inventory.md)
- [Core internal kernel guidance](./core-internal-kernel-guidance.md)
- [Issue triage spine](./issue-triage-spine.md)
- [0.2 UI app-layer preview tracker](../reports/0.2-ui-app-layer-preview-tracker.md)
- [Data-dense workspace verticals](./data-dense-workspace-verticals.md)
- [Cal.com workspace pattern notes](./calcom-workspace-patterns.md)
- [UI DataTable vertical](./ui-data-table-vertical.md)
- [UI CommandMenu vertical](./ui-command-menu-vertical.md)
- [UI Store and Hotkeys vertical](./ui-store-hotkeys-vertical.md)
- [Core layer stack vertical](./layer-stack-vertical.md)
- [Controllable state vertical](./controllable-state-vertical.md)
- [Solid polymorphic `as` rendering](./solid-polymorphic-as-rendering.md)
- [Accordion and Collapsible vertical](./accordion-collapsible-vertical.md)
- [Selection controls vertical](./selection-controls-vertical.md)
- [Slider vertical](./slider-vertical.md)
- [DatePicker and Calendar vertical](./date-picker-calendar-vertical.md)
- [Tabs vertical](./tabs-vertical.md)
- [Toolbar vertical](./toolbar-vertical.md)
- [NavigationMenu vertical](./navigation-menu-vertical.md)
- [VisuallyHidden and AccessibleIcon vertical](./visually-hidden-accessible-icon-vertical.md)

The durable strategic PRDs are [Keystone Core And UI Foundation](../prd/keystone-foundation.md) and [Core Internals Inspiration Parity](../prd/core-internals-inspiration-parity.md). The [Canonical Roadmap](../roadmap/canonical-roadmap.md) is the active north-star sequencing document. Workspace-local pasted attachments may be useful source material, but durable product direction should be copied into repo docs before future agents treat it as authoritative.

## Work Tracking

GitHub issues are the issue tracker for this repository.

- Treat the long end-state issue list as a map, not a direct queue.
- Work from milestone parent issues first. Do not pick directly from the full open issue list unless a parent issue or maintainer direction points there.
- Use [#46](https://github.com/erik-kroon/core-ui/issues/46) as the active parent for 0.1 preview hardening.
- Use [#291](https://github.com/erik-kroon/keystone-ui/issues/291) as the active parent for the 0.2 UI app-layer preview.
- Use [#271](https://github.com/erik-kroon/core-ui/issues/271) as the post-0.1 data-dense workspace direction parent.
- Use [#28](https://github.com/erik-kroon/core-ui/issues/28) as the long-term end-state inventory/north star.
- Keep planning notes in docs when they are durable.
- Keep scratch notes under `.context/` when they are workspace-local.
- Keep the active board near 12-15 issues. Everything else should be supporting work or backlog.

### 0.1 Preview Spine

The active 0.1 spine is:

- [#46](https://github.com/erik-kroon/core-ui/issues/46): 0.1 preview hardening.
- [#63](https://github.com/erik-kroon/core-ui/issues/63): Core kernel API boundary.
- [#58](https://github.com/erik-kroon/core-ui/issues/58), [#59](https://github.com/erik-kroon/core-ui/issues/59), [#61](https://github.com/erik-kroon/core-ui/issues/61): overlay kernel path.
- [#60](https://github.com/erik-kroon/core-ui/issues/60), [#62](https://github.com/erik-kroon/core-ui/issues/62): collection/typeahead path.
- [#99](https://github.com/erik-kroon/core-ui/issues/99): FormControl.
- [#44](https://github.com/erik-kroon/core-ui/issues/44): docs metadata and primitive contracts.
- [#45](https://github.com/erik-kroon/core-ui/issues/45): accessibility verification harness.
- [#43](https://github.com/erik-kroon/core-ui/issues/43): Mason registry lifecycle.
- [#52](https://github.com/erik-kroon/core-ui/issues/52): registry parity metadata.
- [#233](https://github.com/erik-kroon/core-ui/issues/233): UI DataTable.
- [#246](https://github.com/erik-kroon/core-ui/issues/246): UI CommandMenu, good enough for 0.1 proof.
- [#197](https://github.com/erik-kroon/core-ui/issues/197) and [#198](https://github.com/erik-kroon/core-ui/issues/198): UI TanStack Form proof.

The 0.2 preview board is [#291](https://github.com/erik-kroon/keystone-ui/issues/291) plus the [0.2 UI app-layer preview tracker](../reports/0.2-ui-app-layer-preview-tracker.md). The app primitive queue after CommandMenu is [#242](https://github.com/erik-kroon/core-ui/issues/242), [#245](https://github.com/erik-kroon/core-ui/issues/245), [#247](https://github.com/erik-kroon/core-ui/issues/247), and [#248](https://github.com/erik-kroon/core-ui/issues/248), but those remain backlog until the 0.2 parent explicitly pulls them into active preview implementation. Use [UI Store and Hotkeys vertical](./ui-store-hotkeys-vertical.md) before expanding the broader Store/Hotkeys inventory.

Issue philosophy:

```txt
End-state issues = map
Milestone issues = plan
Current sprint issues = work
```

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

For Core work, check:

- Solid-native API shape.
- Primitive maturity status.
- Accessibility spec and tests.
- Controlled/uncontrolled behavior.
- Stable `data-scope` and `data-part` attributes.
- SSR and hydration behavior.
- No UI dependency.

For UI work, check:

- Generated source remains readable and user-owned.
- Multi-file registry items are treated as first-class install units when a component needs more than one file.
- Core behavior is imported instead of reimplemented.
- TanStack Form/Table/Store/Hotkeys are preferred for first-party app behavior where applicable.
- Data-dense, keyboard-first workspace patterns belong in UI as source-owned components, blocks, templates, and app integrations unless the behavior reduces to a general accessible primitive.
- Registry paths are validated and deterministic.
- CLI writes are diffable, dry-run friendly, and path traversal safe.
- Registry item metadata includes `meta.parity` notes. Use Base UI and Kobalte for primitives by default, and use a more relevant first-class reference for exceptions such as TanStack-backed app components, Sonner-style toast behavior, UI utilities, or shadcn-style source registry conventions.

## External README Hygiene

The root README is the public entry point for the current project state:

- Keep the opening concise: what Keystone is, what UI is, and why the split exists.
- State preview instability plainly.
- Describe current package and registry surface, not the ideal end-state catalog.
- Keep roadmap, strategy, and internal sequencing in `CONTEXT.md`, `CONTEXT-MAP.md`, ADRs, RFCs, PRDs, and agent docs.
