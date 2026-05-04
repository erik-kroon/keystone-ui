# UI Combobox Vertical

Issue: #225

## Scope

- Promote the `combobox` registry item from a thin Core wrapper to a fuller styled source component.
- Provide wrappers for input group, optional start add-on, input, chips input, trigger, clear action, popup surface, listbox, groups, group labels, items, item text, item indicators, arrow, separator, empty state, status row, value display, and the Core namespace escape hatch.
- Preserve Core ownership of input value, selected value, open state, clear behavior, hidden form input, keyboard navigation, highlighted state, selected state, positioning, disabled state, invalid state, and form reset behavior.

## Implementation Notes

- `registry/default/ui/combobox.tsx` keeps styling as generated source with tokenized class composition and neutral `data-slot` hooks.
- `registry/default/items/combobox.json` now records API, anatomy, accessibility, CSS variables, limitations, dependencies, and parity metadata.
- App-level filtering, async loading, chips container composition, and object-value helpers remain composition decisions above the primitive wrapper.

## Verification

- Registry validation covers the item metadata and source contract.
- Full verification should include Mason registry tests, docs registry tests, typecheck, and the repo check command.
