---
name: keystone
description: Helps implement Keystone UI components correctly. Use when building UIs with Keystone primitives and registry source such as buttons, dialogs, selects, forms, menus, tabs, inputs, toasts, data tables, command menus, and app shells; migrating from shadcn/Radix-style snippets to Keystone Core/Solid; composing trigger-based overlays; or troubleshooting Keystone component behavior. Covers imports, accessibility, Tailwind styling, Mason registry metadata, and common pitfalls.
---

# Keystone UI

Keystone UI is a Solid-native component and primitive system with two layers:

- Core: headless, accessible, styling-agnostic primitives.
- UI: copy-paste styled source, blocks, templates, stores, and app-layer components installed by Mason.

Use this skill to produce first-class Keystone UI code that follows the Keystone design system and current repo boundaries.

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
2. Preserve the Keystone design system: tokens, radius, shadows, framed surfaces, compact controls, and dark mode.
3. Keep Core styling-agnostic. Put styling in UI source, blocks, templates, or app docs.
4. Prefer Solid-native APIs: `class`, signals, accessors, `splitProps`, `Show`, `For`, and Keystone Core compound parts.
5. Keep UI source readable and user-owned. Avoid opaque helpers unless they remove real repetition.
6. Use TanStack only in the UI/app layer for forms, tables, stores, router, and hotkeys.
7. Keep Mason registry metadata accurate, including source files, dependencies, install commands, and `meta.parity`.

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

Rule references, read on demand:

- `references/rules/styling.md` for Tailwind tokens, icon conventions, and visual parity.
- `references/rules/forms.md` for field composition, validation, and TanStack Form boundaries.
- `references/rules/composition.md` for overlay, trigger, popup, and grouped-control structure.
- `references/rules/migration.md` for shadcn/Radix/React-to-Keystone translation.
- `references/portal-props.md` for portal prop conventions in Keystone UI wrappers.

## Workflow

1. Identify user intent: base component, form flow, overlay flow, feedback flow, app shell, block, or template.
2. Read `references/component-registry.md` to find candidate UI items and source paths.
3. Inspect the actual local source files before coding.
4. Use `docs/design-system.md` for visual details.
5. Implement the smallest Keystone-owned change in Solid.
6. Update registry metadata when adding or materially changing installable UI source.
7. Verify with the narrowest useful command, usually `bun run check-types`, package tests, or docs app visual checks.

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

## High-Risk Areas

Read source and relevant rules first for:

- Dialog, Sheet, Popover, HoverCard, Menu, Menubar, ContextMenu, Tooltip, and Toast.
- Select, Combobox, Autocomplete, and DatePicker.
- Field, TextField, SelectField, CheckboxField, SwitchField, RadioGroupField, TanStackField, and TanStackForm.
- DataTable, CommandMenu, keyboard shortcuts, stores, and app shell/sidebar patterns.

## Output Checklist

Before returning code:

- Imports match current Keystone files.
- Solid syntax is valid.
- Composition structure is valid for the selected primitive.
- Accessibility semantics are preserved.
- Styling matches `docs/design-system.md`.
- Core/UI dependency boundaries are respected.
- Registry metadata is accurate if installable source changed.
- Verification command was run or the reason it was not run is stated.

