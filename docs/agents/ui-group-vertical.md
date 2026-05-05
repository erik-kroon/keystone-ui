# UI Group Vertical

## Status

Proven for the 0.2 UI app-layer backlog through `group` registry source.

## Scope

`Group` is a UI-only styled source component for compact groups of related controls or content. It covers:

- root, item, label, and description anatomy
- horizontal and vertical orientation
- default, attached, and inset variants
- small/default/large density hooks
- root data-state pass-through for disabled, invalid, and selected styling
- attached styling for child `button`, `input-control`, and `group-item` slots

## Boundary

Use `Group` for small dense clusters such as attached action buttons, input-adjacent controls, status chips, and compact grouped metadata.

Do not use `Group` as:

- `FieldGroup`: form labelling, descriptions, errors, validation, required/disabled/read-only propagation, and field-control wiring belong to Field/FieldGroup surfaces.
- `Toolbar`: roving focus, toolbar roles, keyboard navigation, pressed toolbar buttons, and separator semantics belong to Toolbar.
- `Card`: larger content regions with header/content/footer anatomy, surface depth, table clipping, and content hierarchy belong to Card.

## Accessibility Contract

`Group` is presentational by default. Consumers may add `role="group"` and `aria-label` or `aria-labelledby` when the group itself needs an accessible name. `GroupLabel` and `GroupDescription` are visual composition parts unless the caller wires them with native ARIA attributes.

The `disabled`, `invalid`, and `selected` props only project `data-disabled`, `data-invalid`, and `data-selected` to the root. They do not disable nested controls, set form validity, select children, or change ARIA attributes. Nested Button, Input, Field, Toolbar, and custom controls own behavior.

## Registry Evidence

- Source: `packages/ui/src/default/ui/group.tsx`
- Registry item: `registry/default/items/group.json`
- Root registry entry: `registry/default/registry.json`
- Validation coverage: `packages/mason-registry/src/registry-validation.test.ts`
