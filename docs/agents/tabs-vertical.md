# Tabs Vertical

## Scope

This vertical applies the primitive delivery standard to Tabs:

- Compare current Keystone and Mason state against Kobalte and Base UI.
- Ship a thin Keystone primitive over shared state/event utilities first.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Keystone Contract

- `Tabs.Root` supports controlled and uncontrolled `value`, `defaultValue`, `disabled`, `orientation`, `activationMode`, `loopFocus`, and `onValueChange`.
- `Tabs.List` renders the `tablist` role and orientation attributes.
- `Tabs.Trigger` renders a button with `role="tab"`, `aria-selected`, `aria-controls`, roving `tabIndex`, disabled state, and stable `data-scope="tabs"` / `data-part="trigger"` hooks.
- `Tabs.Content` renders the active `tabpanel`, links back to its trigger with `aria-labelledby`, and supports `forceMount` for user-owned animation.
- User click, focus, and keydown handlers run before internal behavior; internal selection/focus work skips when the event is default-prevented.

## Mason Surface

- `registry/default/ui/tabs.tsx` wraps Keystone Tabs with `mason-tabs-*` styling hooks.
- `registry/default/items/tabs.json` records dependencies, parts, install command, source files, customization notes, and parity gaps.
- `registry/default/registry.json` exposes `tabs` as a first-party Mason registry item.

## Kobalte And Base UI Comparison

- Kobalte Tabs documents the same anatomy: root, list, trigger, indicator, and content. It also calls out controlled/uncontrolled value, disabled tabs, horizontal/vertical orientation, automatic/manual activation, RTL keyboard navigation, focus management for panels, and `forceMount`.
- Base UI Tabs exposes root, list, tab, indicator, and panel, with controlled/uncontrolled value, orientation, disabled tabs, `keepMounted`, and measured indicator CSS variables.
- Keystone now covers the shared core contract: value state, orientation, disabled triggers, activation mode, roving focus, trigger/panel ARIA, `forceMount`, data parts, and Mason metadata.
- The #51 parity pass adds explicit `dir="rtl"` handling for horizontal arrow keys so `ArrowLeft` moves forward and `ArrowRight` moves backward in RTL tablists.

References checked on 2026-05-03:

- https://kobalte.dev/docs/core/components/tabs/
- https://base-ui.com/react/components/tabs

## Parity Notes

The next Tabs parity pass should add measured indicator positioning and CSS variables, dynamic removal focus restoration, closable/deleteable tab coordination, activation latency policy, panel focus heuristics that omit `tabIndex` when content already has focusable children, and broader touch/cursor edge-case tests.
