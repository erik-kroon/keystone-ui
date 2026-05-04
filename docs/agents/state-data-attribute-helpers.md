# State/Data Attribute Helpers

## Audit

- Existing reusable surface before this pass: `dataBoolean` and `partDataAttributes` in `packages/core/src/utils/index.ts`, plus primitive metadata in `packages/core/src/metadata/index.ts`.
- Existing consumers: overlay, disclosure, accordion, collapsible, selection controls, radio group, listbox, select, combobox, form, date picker, and docs metadata.
- Reusable proof before this pass: `kernel.test.tsx` for part contracts, Dialog/Select/Listbox behavior tests for user-facing attributes, and metadata-driven docs surfaces.
- Missing before this pass: named shared helpers for repeated public state values such as `open`/`closed`, `checked`/`unchecked`, and selection-control `indeterminate`.

## End-State Contract

- Every rendered primitive part continues to expose stable `data-scope` and `data-part` attributes through `partDataAttributes`.
- Boolean state attributes use presence semantics: `dataBoolean(true)` returns an empty string and falsey or absent values return `undefined`.
- Openable primitives use `getOpenClosedState(open)` for `data-state="open|closed"`.
- Binary checked parts use `getCheckedState(checked)` for `data-state="checked|unchecked"`.
- Tri-state selection controls use `getSelectionState(checked)` for `data-state="checked|unchecked|indeterminate"`.
- Helpers are pure, synchronous, DOM-free, and SSR/hydration safe. They do not allocate IDs, read browser globals, or depend on Solid owner state.
- Accessibility remains owned by each primitive. These helpers only standardize the public styling and test contract for attributes that mirror primitive state.
- CSS variables are not relevant to this helper layer; measured/floating primitives document their variables in primitive metadata.

## Final Status

State/data attribute helpers are `proven` for the Core kernel. The canonical helpers live in `packages/core/src/utils/index.ts`, are covered by focused kernel tests, and are consumed by overlay, disclosure, accordion, collapsible, select, combobox, date picker, selection-control, and radio-group state attributes.

Keep adding narrowly named helpers only when a state value becomes a repeated public contract across primitives. Primitive-specific attributes such as `data-side`, `data-align`, `data-value`, and `data-selection-mode` should remain owned by the primitive or metadata until duplication creates a real maintenance cost.
