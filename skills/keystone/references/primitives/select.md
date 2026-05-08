# Select

Use this guide for single-choice or multi-choice listbox selection where the user chooses from known options.

## Source

- UI source: `packages/ui/src/ui/select.tsx`
- Field wrapper: `packages/ui/src/ui/select-field.tsx`
- Core primitive: `@keystone-ui/core/select`
- Registry items: `registry/default/items/select.json`, `registry/default/items/select-field.json`
- Mason install: `mason add select` or `mason add select-field`

## Boundary

Keystone Core owns open state, selected value state, hidden form input serialization, listbox roles, highlighted and selected item state, disabled items and groups, keyboard navigation, typeahead, reset behavior, collection registration, popup positioning, and data attributes.

Keystone UI owns styled trigger/value/content/listbox/group/item wrappers and the TanStack Form field adapter.

## Composition

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatusSelect() {
  const [status, setStatus] = createSignal("active");

  return (
    <Select value={status()} onValueChange={(next) => setStatus(next ?? "")}>
      <SelectTrigger aria-label="Project status">
        <SelectValue placeholder="Choose status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="paused">Paused</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

For forms, prefer `SelectField` so label, description, error, invalid state, blur handling, and TanStack Form value updates stay consistent.

## Accessibility

- Provide a label through `SelectField` or an accessible trigger label.
- Use `SelectValue` for placeholder and selected text.
- Supply `textValue` when item labels are non-string JSX so typeahead and value text stay meaningful.
- Keep disabled options disabled at the item or group level.
- Preserve hidden input props such as `name`, `form`, `required`, and `disabled` when a select participates in native form submission.

## Pitfalls

- Do not use `SelectButton` as a replacement for `SelectTrigger`; it is a styled helper, not the Core trigger contract.
- Do not store object values directly in the primitive. Use string IDs and map to records in app state.
- Do not filter the list in select. Use combobox when users need search or autocomplete.
- Do not manually wire `aria-activedescendant`; Core owns it.

## Verification

- Run `bun run check-types` after select source, field source, or registry metadata changes.
- Keyboard check: trigger opens, arrows highlight options, typeahead works, Enter selects, Escape closes.
- Form check: selected value submits through the hidden input and resets with the native form reset path.
- Visual check: long selected labels truncate cleanly and popup width follows the trigger when expected.
