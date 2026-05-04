# UI Input Vertical

## Issue

- GitHub: #183
- Inventory item: Styled Form Components / Input
- Reference: reference UI Input source in `inspo/apps/ui/registry/default/ui/input.tsx`

## Audit

Existing Keystone Input rendered a single native input with `invalid`, `data-scope="ui-input"`,
`data-part="root"`, and a `ui-input` class. It had native form participation and prop passthrough,
but lacked the reference wrapper/control anatomy, size API, search/file styling, wrapper invalid/focus
selectors, `data-slot` hooks, and docs-ready metadata.

Reusable pieces were the native input baseline, Solid prop passthrough, invalid state, and `cn`
dependency.

## End-State Contract

- Anatomy: `root` wrapper and inner `input`.
- API: `size` accepts `sm`, `default`, `lg`, or a number for the native `size` attribute;
  `invalid` mirrors `aria-invalid` and `data-invalid`; `unstyled` removes the wrapper surface
  classes; `nativeInput` is accepted as a compatibility no-op because Solid always renders a native
  input here.
- Behavior: type/name/value/disabled/required/autocomplete/placeholder/ARIA/events pass to the
  native input.
- Accessibility: the wrapper is presentational; the inner native input owns form participation and
  accessibility. Label/description/error relationships are caller-owned unless using `FieldControl`.
- Styling: reference-inspired wrapper and input classes, search cancel reset, file input styling, size
  classes, `data-size`, `data-invalid`, `data-disabled`, and `data-slot` hooks.
- State contract: Input owns no controlled or uncontrolled state.
- SSR/hydration: no effects, IDs, portals, or browser-only APIs; markup is determined by props.

## Intentional Limits

Standalone `Input` does not register with Core Field context. Use UI `FieldControl` when automatic
label, description, error, validation, reset, and state wiring are required.
