---
name: keystone
description: Helps implement Keystone UI components correctly. Use when building UIs with Keystone primitives and registry source such as buttons, dialogs, selects, forms, menus, tabs, inputs, toasts, data tables, command menus, and app shells; migrating from shadcn/Radix-style snippets to Keystone Core/Solid; composing trigger-based overlays; or troubleshooting Keystone component behavior. Covers imports, accessibility, Tailwind styling, Mason registry metadata, and common pitfalls.
---

# Keystone UI

Keystone UI is a Solid-native component and primitive system with two layers:

- Core: headless, accessible, styling-agnostic primitives.
- UI: copy-paste styled source, blocks, templates, stores, and app-layer components installed by Mason.

Use this skill to produce first-class Keystone UI code that follows the Keystone design system, registry styling contract, and current repo boundaries.

## What This Skill Is For

Use this skill to:

- Pick the right Keystone UI source item or Core primitive for a UI task.
- Write correct Keystone usage code with Solid imports, composition, props, and accessibility.
- Avoid common migration mistakes from shadcn, Radix, React, and headless component assumptions.
- Preserve Tailwind v4 styling, registry metadata, and Mason install behavior.
- Reference registry examples and docs previews to produce practical, production-like patterns.

## Source Of Truth

- Design system: `docs/design-system.md`
- Product boundaries: `CONTEXT.md`
- Current repo map: `CONTEXT-MAP.md`
- Current UI source: `packages/ui/src/default/`
- Current registry metadata: `registry/default/items/`
- Core primitive source: `packages/core/src/`
- Component registry index: `references/component-registry.md`

## Principles

1. Use existing Keystone Core primitives and UI registry source before inventing custom behavior.
2. Preserve the Keystone design system and registry visual contract: semantic tokens, radius, shadows, framed surfaces, compact controls, hover/focus/disabled states, popup surfaces, `data-slot` hooks, and dark mode.
3. Keep Core styling-agnostic. Put styling in UI source, blocks, templates, or app docs.
4. Prefer Solid-native APIs: `class`, signals, accessors, `splitProps`, `Show`, `For`, and Keystone Core compound parts.
5. Keep UI source readable and user-owned. Avoid opaque helpers unless they remove real repetition.
6. Use TanStack only in the UI/app layer for forms, tables, stores, router, and hotkeys.
7. Keep Mason registry metadata accurate, including source files, dependencies, install commands, and `meta.parity`.
8. Preserve the documented visible styling when translating external patterns into Solid and Keystone Core composition.

## Out Of Scope

- Moving styling into Core primitives.
- Maintaining unrelated monorepo internals or build pipelines.
- Rewriting registry metadata, docs structure, or Mason behavior unless the task touches installable source.
- Inventing new component APIs without first inspecting local source and accepted repo docs.

## Critical Rules

Always apply these before returning Keystone UI code:

- Do not invent Keystone APIs. Inspect the local component source or Core primitive exports first.
- For trigger-based primitives, preserve the documented root/trigger/portal/positioner/content or popup structure.
- For overlays, account for focus, dismissal, portal behavior, scroll, SSR, hydration, and accessible labels.
- For forms, preserve label, description, error, invalid, required, disabled, and reset semantics.
- Prefer existing UI wrappers first; use direct Core parts only when the wrapper cannot express the needed composition.
- Use `class`, not React `className`, in Solid component usage unless a local helper explicitly expects another prop.
- Use `lucide-solid` for icons when an icon dependency is needed.
- Use semantic Tailwind tokens instead of raw palette styling.
- Do not regress registry classes while making behavior changes. Preserve compact heights, `shadow-xs/5`/`shadow-lg/5`, pseudo-element inset highlights, dark overlays, status token colors, pointer-coarse hit expansion, and stable `data-slot` names.
- If an external pattern uses React render props or component APIs, translate it into Solid-native wrappers or Keystone Core compound parts while preserving Keystone's class contract.

Rule references, read on demand:

- `references/rules/styling.md` for Tailwind tokens, icon conventions, and visual parity.
- `references/rules/forms.md` for field composition, validation, and TanStack Form boundaries.
- `references/rules/composition.md` for overlay, trigger, popup, and grouped-control structure.
- `references/rules/migration.md` for shadcn/Radix/React-to-Keystone translation.
- `references/portal-props.md` for portal prop conventions in Keystone UI wrappers.

## Component Discovery

Use `references/component-registry.md` to choose the right Keystone UI source item and inspect its source files before implementing. If the item is not listed there, inspect `registry/default/items/` before adding or changing registry source.

Focused primitive references, read when working on these high-risk items:

- `references/primitives/dialog.md` for modal dialog composition, focus, dismissal, and portal behavior.
- `references/primitives/menu.md` for trigger menus, item selection, roving focus, and typeahead.
- `references/primitives/select.md` for select/listbox composition and form value behavior.
- `references/primitives/form.md` for Keystone Field, TanStack Form, and field adapter boundaries.
- `references/primitives/input-group.md` for grouped input adornments and current source limitations.
- `references/primitives/toast.md` for toaster placement, live-region behavior, and manager usage.
- `references/primitives/combobox.md` for autocomplete, listbox input, and field wiring.
- `references/primitives/data-table.md` for TanStack Table source kits and dense table workflows.

## Workflow

1. Identify user intent: base component, form flow, overlay flow, feedback flow, app shell, block, or template.
2. Read `references/component-registry.md` to find candidate UI items and source paths.
3. Inspect the actual local source files before coding.
4. Use `docs/design-system.md` for visual details, especially `Component Contracts`.
5. Implement the smallest Keystone-owned change in Solid.
6. Update registry metadata when adding or materially changing installable UI source.
7. Compare changed UI source to the documented registry visual contract before returning. Keep Keystone compatibility aliases only when they map to the same visual contract.
8. Verify with the narrowest useful command, usually `bun run check-types`, package tests, or docs app visual checks.

## Installation Reference

Mason is the Keystone registry/CLI layer.

```bash
mason add button
mason add dialog
mason add select-field
```

If Mason is not available in the target project yet, give manual setup guidance:

- Copy every local source file referenced by the registry item.
- Copy transitive local imports such as `cn`, stores, hooks, and child components.
- Install external package dependencies from the registry item.
- Preserve the target app's import alias conventions.
- Include theme tokens from `docs/design-system.md` when the component relies on them.

## Styling Checklist

Apply this checklist whenever editing `packages/ui/src/default/ui/*`, docs previews, or registry examples:

- Does the component still use the semantic Keystone tokens from `docs/design-system.md`?
- Are light and dark mode classes both present where the documented component contract uses overlays or inset highlights?
- Are control dimensions compact and responsive, for example mobile `base` text with `sm:text-sm` where documented?
- Are focus-visible rings, disabled opacity, invalid states, hover/highlighted states, and pressed/open states preserved?
- Are SVG normalization classes present: default opacity, size, pointer-events none, and shrink behavior where appropriate?
- Are popup/content surfaces using the reference rounded border, `bg-popover`, shadow, viewport/list padding, and available-size variables?
- Are `data-slot` names stable for downstream overrides and docs previews?
- Did the change keep behavior in Core and styling in UI source?

## High-Risk Areas

Read source and relevant rules first for:

- Dialog, Menu, Select, Combobox, Toast, Form, Input Group, and DataTable using the focused primitive references above.
- Sheet, Popover, HoverCard, Menubar, ContextMenu, Tooltip, Autocomplete, and DatePicker using source plus the composition rules.
- Field, TextField, SelectField, CheckboxField, SwitchField, RadioGroupField, TanStackField, and TanStackForm using `references/rules/forms.md`.
- CommandMenu, keyboard shortcuts, stores, and app shell/sidebar patterns using source and registry metadata.

## Output Checklist

Before returning code:

- Imports match current Keystone files.
- Solid syntax is valid.
- Composition structure is valid for the selected primitive.
- Accessibility semantics are preserved.
- Styling matches `docs/design-system.md`, including the registry styling contract.
- Core/UI dependency boundaries are respected.
- Registry metadata is accurate if installable source changed.
- Verification command was run or the reason it was not run is stated.
