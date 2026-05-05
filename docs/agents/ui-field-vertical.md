# UI Field Vertical

## Issue

- GitHub: #177
- Inventory item: Styled Form Components / Field
- Reference: reference UI Field source in `inspo/apps/ui/registry/default/ui/field.tsx`

## Audit

Existing Keystone Field was a styled div/label/paragraph shell with `Field`, `FieldLabel`,
`FieldDescription`, and `FieldError`. It used `cn`, a UI Label dependency, and `ui-field` classes.
It did not use the already-proven Core Field/FormControl behavior, so label/control relationships,
generated IDs, description/error registration, validation state, reset handling, and hidden-input
support were not available from the UI source.

Reusable pieces were the source-owned UI class naming, `cn` dependency, and the public registry item
shape.

## End-State Contract

- Anatomy: `root`, `label`, `item`, `control`, `description`, `error-message`, and
  `hidden-input`.
- API: `Field`, `FieldLabel`, `FieldItem`, `FieldControl`, `FieldDescription`, `FieldError`,
  `FieldHiddenInput`, and `FieldPrimitive`.
- Behavior: `Field`, `FieldLabel`, `FieldControl`, `FieldDescription`, `FieldError`, and
  `FieldHiddenInput` are backed by `@keystone-ui/core/form`.
- Accessibility: Core owns generated IDs, `for`/`id`, `aria-labelledby`, `aria-describedby`,
  invalid/required/readonly/disabled ARIA, error alert semantics, validation state, and native
  form reset hooks.
- Styling: UI adds reference-inspired compact field classes and `data-slot` hooks while preserving Core
  `data-scope="field"` / `data-part` and state attributes.
- State contract: Field accepts Core controlled/presentation props and validation props; UI adds no
  independent state.
- SSR/hydration: generated IDs and relationships are handled by Core Field; UI adds no effects,
  portals, or browser-only behavior.

## Intentional Limits

`FieldControl` is the fully wired control path. A standalone UI `Input` nested directly under
`Field` remains a native styled input, but it does not consume Core Field context until Keystone
publishes a public UI field-control context bridge.

## Verification

- `docs/accessibility/primitive-evidence.md` records the 2026-05-05 Field/FormControl browser probe
  and manual accessibility status for issue #303.
- Core Field semantics remain separate from TanStack Form app-state adapters; UI TanStack field
  wrappers may compose Field behavior, but Core must not depend on TanStack Form.
