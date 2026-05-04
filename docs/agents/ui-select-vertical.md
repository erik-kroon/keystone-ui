# UI Select Vertical

Issue: #224

## Scope

- Add first-party `select` registry item backed by `@keystone-ui/core/select`.
- Provide styled source wrappers for trigger, value, popup, listbox, groups, group labels, labels, items, item text, item indicators, arrow, separator, and the Core namespace escape hatch.
- Preserve Core ownership of open/value state, hidden form inputs, keyboard navigation, typeahead, positioning, disabled state, invalid state, and form reset behavior.

## Implementation Notes

- `registry/default/ui/select.tsx` keeps styling as generated source with tokenized class composition and neutral `data-slot` hooks.
- `registry/default/items/select.json` records API, anatomy, accessibility, CSS variables, limitations, dependencies, and parity metadata.
- `registry/default/registry.json` includes `select` as a default UI registry item before the TanStack-backed `select-field` adapter.

## Verification

- Registry validation covers the item metadata, registry inventory, and source contract.
- Full verification should include Mason registry tests, docs registry tests, typecheck, and the repo check command.
