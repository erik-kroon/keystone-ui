# Keystone Pattern Backlog

## Purpose

This backlog classifies useful component-gallery and workspace ideas into Keystone-owned product surfaces. It is a planning document for future agents, not an instruction to broaden the active milestone immediately.

Boundary sources: [CONTEXT.md](../../CONTEXT.md), [ADR 0001](../adr/0001-keystone-core-ui-boundary.md), [ADR 0003](../adr/0003-ui-tanstack-app-layer.md), [ADR 0004](../adr/0004-core-kernel-api-boundary.md), [End-state primitive/component inventory](./end-state-primitive-component-inventory.md), and [Data-dense workspace verticals](./data-dense-workspace-verticals.md).

## Inventory Audit

The reviewed component-gallery app exposes 30 category pages with light/dark thumbnail coverage for most categories. Category breadth observed:

| Category                 | Variants |
| ------------------------ | -------: |
| Accordion                |       20 |
| Alert                    |       12 |
| Avatar                   |       23 |
| Badge                    |       13 |
| Banner                   |       12 |
| Breadcrumb               |        8 |
| Button                   |       54 |
| Calendar and date picker |       28 |
| Checkbox                 |       20 |
| Image cropper            |       11 |
| Dialog                   |       21 |
| Dropdown                 |       15 |
| File upload              |       14 |
| Event calendar           |        1 |
| Input                    |       59 |
| Navbar                   |       20 |
| Notification             |       22 |
| Pagination               |       12 |
| Popover                  |        9 |
| Radio                    |       20 |
| Select                   |       51 |
| Slider                   |       27 |
| Stepper                  |       17 |
| Switch                   |       17 |
| Table                    |       20 |
| Tabs                     |       20 |
| Textarea                 |       19 |
| Timeline                 |       12 |
| Tooltip                  |       12 |
| Tree                     |       15 |

Notable registry-shaped items observed for Keystone backlog consideration: native select, multiselect, image cropper, stepper, timeline, tree, checkbox tree, toast/notification patterns, event calendar, file upload, pagination, breadcrumb, scroll area, progress, toggle group, and table.

## Core Primitive Candidates

These ideas reduce to general accessible behavior and should be considered only when they fit the Core sequencing and kernel-boundary rules.

| Surface               | Classification                             | Notes                                                                                                                                                            |
| --------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native select support | Core plus UI                               | Native form semantics already belong near Field/FormControl. Core may only need native-control ARIA/data contracts; styled source belongs in UI.                 |
| Multiselect           | Core primitive candidate                   | Builds on collection, typeahead, multiple selection, popup field glue, chips, and hidden inputs. Avoid exposing private collection kernels.                      |
| Tree                  | Core primitive candidate                   | Needs roving focus, keyboard expansion, selection, disabled items, typeahead, ARIA tree roles, and possible virtualized rendering guidance.                      |
| Checkbox tree         | Core primitive candidate plus UI component | Tree behavior belongs in Core if generalized; checkbox presentation and parent/child selection policies should be explicitly scoped.                             |
| Resizable panels      | Core primitive candidate                   | General pointer/keyboard resizing, orientation, constraints, persistence hooks, and accessible handles can justify a primitive. Workspace layout remains UI.     |
| Stepper               | Mostly UI, possible Core later             | If it becomes a wizard/progress primitive with keyboard and ARIA semantics, consider Core later. Initial step indicators and form flow source should live in UI. |
| File field            | Core already listed                        | Core owns native field semantics and hidden input behavior; UI owns dropzones, previews, validation copy, and upload app state.                                  |
| Scroll area           | Core or UI utility                         | Only promote if custom scrollbars need accessible behavior. Otherwise keep as styled UI source over native scrolling.                                            |
| Progress and meter    | Core primitive candidates                  | General status/value semantics belong in Core; styled progress bars and loading compositions belong in UI.                                                       |

## UI Component Candidates

These should start as source-owned UI components that compose existing or future Core behavior.

| Surface        | Priority                        | Notes                                                                                                                                                          |
| -------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Banner         | Near-term UI                    | Extends Alert with page-level placement, actions, dismiss behavior, and status tone conventions. Core behavior only needed if dismissal/focus becomes general. |
| Notification   | Near-term UI                    | Keep toast behavior aligned with existing `toast`; persistent notification list and inbox patterns are UI blocks.                                              |
| NativeSelect   | Near-term UI                    | Useful low-risk form coverage while custom Select/Combobox deepen. Works with Field and TanStack Form adapters.                                                |
| Multiselect    | Mid-term UI after Core behavior | UI should provide selected-token presentation, empty state, create-new affordance, and item metadata.                                                          |
| Timeline       | Near-term UI                    | Source-owned display component for event feeds, audit trails, and activity streams. Core should not own event semantics.                                       |
| Stepper        | Near-term UI                    | Step indicator, vertical/horizontal variants, validation state, and optional TanStack Form integration.                                                        |
| Image cropper  | Later UI                        | Use a proven crop/gesture engine. UI owns shell, controls, preview, and form integration.                                                                      |
| Pagination     | Near-term UI                    | Component source around table/list state; may pair with TanStack Table.                                                                                        |
| Breadcrumb     | Near-term UI                    | Navigation display source; route integration should remain generated app code.                                                                                 |
| Table          | Existing UI                     | Continue deepening TanStack Table source instead of inventing a table engine.                                                                                  |
| File upload    | Mid-term UI                     | Dropzone and preview source should use Field/TanStack Form and avoid embedding storage provider assumptions.                                                   |
| Event calendar | Later UI                        | Needs date/time library decision and likely app-level scheduling semantics; do not rush into Core.                                                             |

## UI Block Candidates

These are app-layer patterns for Mason multi-file registry items.

| Block                       | Composition                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Resizable workspace shell   | Sidebar/store, resizable panels, main work surface, inspector panel, mobile header/footer, command trigger, settings entry.    |
| Saved-view filter bar       | Search input, add-filter menu, filter chips, date range editor, saved-view combobox, clear action, TanStack Table integration. |
| Command workspace surface   | Command menu, command store, shortcut display, route/app command registry, async states, optional help mode.                   |
| Settings shell              | Section sidebar, mobile drawer, repeated Field/TanStack Form rows, copyable fields, destructive-action dialogs.                |
| Activity timeline feed      | Timeline UI, filters, notification badges, relative time formatting, empty/loading/error states.                               |
| Tree explorer               | Tree primitive/UI, toolbar, search/typeahead, context menu, details panel, optional drag/reorder later.                        |
| Upload and crop flow        | File field, dropzone, image cropper, preview, validation, submit action.                                                       |
| Notification center         | Toast, persistent notification rows, filters, read/unread actions, keyboard navigation.                                        |
| Data-table operations shell | TanStack Table, toolbar filters, pagination, column visibility, saved views, row action menus.                                 |

## Template Candidates

Templates should wait until Mason install/update semantics and UI blocks are reliable enough to make generated applications useful.

| Template                   | Notes                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Operations dashboard       | Data table, filters, timeline feed, command surface, settings shell, and responsive app shell.                    |
| Admin console              | Tree explorer, detail forms, audit timeline, notification center, and role-aware navigation source.               |
| Scheduling workspace       | Calendar/date picker, saved filters, event list, command actions, settings flow. Keep domain language user-owned. |
| Media management workspace | Upload/crop flow, asset table, preview inspector, metadata forms.                                                 |

## Later Backlog

- Kanban, drag-and-drop builders, advanced chart inspection, rich text/editor surfaces, and calendar scheduling engines need separate dependency decisions before first-party UI work.
- Virtualized large trees and command lists should use a proven virtualizer rather than a custom engine.
- Date/time heavy blocks should wait for a clear date library and i18n boundary.
- Cropper and upload blocks should avoid storage, CDN, and server action assumptions in first-party source.

## Backlog Rules

- Core receives only general accessible primitive behavior with stable parts, data attributes, controlled/uncontrolled state, SSR/hydration coverage, and tests.
- UI components receive styled copy-paste source and may depend on Core primitives.
- UI blocks receive multi-file app-layer composition and may depend on TanStack Form, Table, Store, Router, and Hotkeys.
- Templates combine proven blocks into starter applications after Mason can install, diff, update, and verify them.
- Every first-party registry item needs `meta.parity` notes, but those notes should describe Keystone-relevant behavior and gaps without copying source branding into public-facing copy.
