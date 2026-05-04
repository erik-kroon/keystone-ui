# Tabs Vertical

## Scope

This vertical applies the primitive delivery standard to Tabs:

- Compare current Keystone Core and UI state against Kobalte and Base UI.
- Ship a thin Core primitive over shared state/event utilities first.
- Add UI copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Core Contract

- `Tabs.Root` supports controlled and uncontrolled `value`, `defaultValue`, `disabled`, `orientation`, `activationMode`, `loopFocus`, and `onValueChange`.
- `Tabs.List` renders the `tablist` role and orientation attributes.
- `Tabs.Trigger` renders a button with `role="tab"`, `aria-selected`, `aria-controls`, roving `tabIndex`, disabled state, and stable `data-scope="tabs"` / `data-part="trigger"` hooks.
- `Tabs.Content` renders the active `tabpanel`, links back to its trigger with `aria-labelledby`, and supports `forceMount` for user-owned animation.
- `Tabs.Indicator` measures the active trigger relative to its list container and exposes `--keystone-tabs-indicator-x`, `--keystone-tabs-indicator-y`, `--keystone-tabs-indicator-width`, and `--keystone-tabs-indicator-height` for styled UI source.
- Dynamic trigger removal moves uncontrolled selection to the nearest enabled successor and restores focus when the removed selected trigger held focus.
- Panel focus follows the ARIA tabs pattern: panels receive `tabIndex=0` only when they do not already contain focusable content.
- User click, focus, and keydown handlers run before internal behavior; internal selection/focus work skips when the event is default-prevented.

## UI Surface

- `packages/ui/src/default/ui/tabs.tsx` wraps Keystone Tabs with `ui-tabs-*` styling hooks, default horizontal/vertical styling, focus rings, selected trigger state styling, and a measured indicator transform driven by Core CSS variables.
- `registry/default/items/tabs.json` records dependencies, anatomy, CSS variables, parts, install command, source files, customization notes, and parity status.
- `registry/default/registry.json` exposes `tabs` as a first-party Mason registry item.

## Kobalte And Base UI Comparison

- Kobalte Tabs documents the same anatomy: root, list, trigger, indicator, and content. It also calls out controlled/uncontrolled value, disabled tabs, horizontal/vertical orientation, automatic/manual activation, RTL keyboard navigation, focus management for panels, and `forceMount`.
- Base UI Tabs exposes root, list, tab, indicator, and panel, with controlled/uncontrolled value, orientation, disabled tabs, `keepMounted`, and measured indicator CSS variables.
- Core now covers the shared core contract: value state, orientation, disabled triggers, activation mode, roving focus, trigger/panel ARIA, measured indicator variables, dynamic removal selection/focus fallback, panel focus heuristics, `forceMount`, data parts, and UI metadata.
- The #51 parity pass adds explicit `dir="rtl"` handling for horizontal arrow keys so `ArrowLeft` moves forward and `ArrowRight` moves backward in RTL tablists.

References checked on 2026-05-03:

- https://kobalte.dev/docs/core/components/tabs/
- https://base-ui.com/react/components/tabs

## Final Status

Tabs is a stable-candidate UI item for 0.1. The remaining intentional gaps are delete/closable tab coordination, an explicit activation latency policy for heavy panels, and broader touch/cursor edge-case tests. These stay out of the default UI component because closable tabs require application-owned collection mutation and activation latency depends on panel workload.
