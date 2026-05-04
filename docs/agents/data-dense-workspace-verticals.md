# Data-Dense Workspace Verticals

## Purpose

This note turns the updated Keystone Core/UI PRD direction into independently grabbable vertical slices. It is a planning artifact, not a tracker state. No GitHub issue convention is recorded for this repo yet, so create real issues only after the breakdown is accepted.

Parent PRD: [Keystone Core And UI Foundation](../prd/keystone-foundation.md)

## Proposed Issue Breakdown

1. **UI Workspace Direction Docs** ([#271](https://github.com/erik-kroon/core-ui/issues/271))
   - Type: AFK
   - Blocked by: None
   - User stories covered: 49, 50, 51, 52
   - Acceptance criteria:
     - The docs explain that Core stays domain-agnostic.
     - UI is documented as the home for data-dense, keyboard-first workspace patterns.
     - The end-state inventory classifies workspace components, blocks, and templates under UI.

2. **Realtime Data Table Pattern Tracer** ([#272](https://github.com/erik-kroon/core-ui/issues/272))
   - Type: AFK
   - Blocked by: [#271](https://github.com/erik-kroon/core-ui/issues/271)
   - User stories covered: 8, 10, 15, 49, 52
   - Acceptance criteria:
     - A Mason registry item demonstrates a TanStack-backed data table pattern for frequent row/cell updates.
     - Sorting, stable row identity, empty/loading states, and keyboard-reachable controls are covered.
     - Registry metadata includes `meta.parity` notes against TanStack Table and relevant data-dense UI references.
     - Generated example source typechecks and builds.

3. **Keyboard-First Command Surface** ([#273](https://github.com/erik-kroon/core-ui/issues/273))
   - Type: AFK
   - Blocked by: [#271](https://github.com/erik-kroon/core-ui/issues/271)
   - User stories covered: 15, 38, 49, 50
   - Acceptance criteria:
     - A UI command surface block composes Keystone Core/UI behavior without reimplementing primitive focus or dismissal.
     - Shortcut display and command grouping are keyboard and screen-reader inspectable.
     - The block can be installed from the local registry and verified in an example app.

4. **Resizable Workspace Shell** ([#274](https://github.com/erik-kroon/core-ui/issues/274))
   - Type: AFK
   - Blocked by: [#271](https://github.com/erik-kroon/core-ui/issues/271)
   - User stories covered: 8, 9, 15, 49, 50
   - Acceptance criteria:
     - A UI block provides a left rail, main work surface, and inspector panel with source-owned layout code.
     - Keyboard reachability and responsive constraints are documented.
     - The block avoids introducing Core behavior unless a general primitive need is identified separately.

5. **Numeric And Financial Formatting UI** ([#275](https://github.com/erik-kroon/core-ui/issues/275))
   - Type: HITL
   - Blocked by: [#271](https://github.com/erik-kroon/core-ui/issues/271)
   - User stories covered: 4, 15, 49, 51, 52
   - Acceptance criteria:
     - Maintainers decide whether these ship as generic numeric components, a finance-flavored pack, or example-only code.
     - Money, percent, compact volume, signed change, stale/fresh state, and update emphasis requirements are documented.
     - Formatting components remain UI-owned and do not pull domain semantics into Keystone.

6. **Watchlist And Quote Table Block** ([#276](https://github.com/erik-kroon/core-ui/issues/276))
   - Type: HITL
   - Blocked by: [#272](https://github.com/erik-kroon/core-ui/issues/272); [#275](https://github.com/erik-kroon/core-ui/issues/275)
   - User stories covered: 8, 15, 49, 51, 52
   - Acceptance criteria:
     - A UI block demonstrates symbol rows, value freshness, signed changes, and dense row scanning.
     - Domain language is isolated to the block/example layer.
     - The block remains source-owned and installable through Mason registry semantics.

7. **Chart Inspection Interaction Pattern** ([#277](https://github.com/erik-kroon/core-ui/issues/277))
   - Type: HITL
   - Blocked by: [#275](https://github.com/erik-kroon/core-ui/issues/275)
   - User stories covered: 15, 49, 51, 52
   - Acceptance criteria:
     - Maintainers choose the first chart reference/library boundary before implementation.
     - Crosshair, tooltip, reference line, session band, and annotation collision needs are captured.
     - Any reusable accessibility or keyboard behavior is classified separately before being proposed for Keystone.

8. **Condition Builder And Event Feed Patterns** ([#278](https://github.com/erik-kroon/core-ui/issues/278))
   - Type: AFK
   - Blocked by: [#271](https://github.com/erik-kroon/core-ui/issues/271); [#273](https://github.com/erik-kroon/core-ui/issues/273)
   - User stories covered: 8, 15, 38, 49, 50, 52
   - Acceptance criteria:
     - A UI pattern covers rule rows, filter/alert conditions, validation display, and event timeline scanning.
     - The implementation prefers TanStack/Form or Store where app behavior is needed.
     - Docs explain ownership boundaries and customization points.

## Distilled Rules

- Core owns general accessible primitive behavior; UI owns product-specific workspace composition.
- Data-dense UI items must preserve clarity under frequent updates.
- Keyboard navigation, focus behavior, and shortcut discoverability are first-class requirements for UI workspace blocks.
- Financial or analytics examples may guide UI, but they do not justify domain-specific Keystone core APIs.

## Open Questions

- Whether numeric/financial formatting belongs in the default Mason registry, a future optional pack, or examples first.
- Which charting dependency should be used for first-party chart interaction patterns.
- When the repo should start creating GitHub issues versus keeping planning slices in docs.
