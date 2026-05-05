# UI TanStack Field Components Vertical

## Issues

- GitHub: #202 ComboboxField
- GitHub: #206 SliderField
- GitHub: #207 FileField
- GitHub: #208 DatePickerField

## Audit

Existing reusable pieces were `TanStackField`, base UI `Combobox`, `Slider`, `DatePicker`, `Input`,
the proven Text/Select/Checkbox/Radio/Switch field adapter patterns, and Mason registry metadata.
The missing pieces were source-owned field adapters, registry items, and user-visible tests for the
field relationships and form-state wiring.

## End-State Contract

- `ComboboxField` is a string field adapter over Keystone Combobox with grouped options, disabled
  options, `textValue`, empty state, and prop/class escape hatches for root, input, content, listbox,
  group, and item parts.
- `SliderField` is a readonly number array adapter over Keystone Slider with one thumb and hidden
  input per value so multi-thumb Core behavior stays available.
- `FileField` is a readonly `File[]` adapter over native `input type="file"` and intentionally keeps
  the file input uncontrolled because browsers block programmatic file value setting.
- `DatePickerField` is an ISO date string adapter over Keystone DatePicker with trigger/content/
  calendar escape hatches and a hidden input for browser form value participation.
- All four compose `TanStackField` for label, description, error, touched/dirty/blurred/validating,
  generated IDs, invalid state, validators pass-through, and alert messaging.

## Verification

- `packages/ui/src/default/ui/tanstack-field-components.test.tsx` covers render anatomy, field
  relationships, hidden form value surfaces, and FileField input-to-field state mapping.
- Registry metadata for all four items records API, anatomy, accessibility, state, limitations, and
  parity notes.

## Known Limits

Object value adapters, async option loading/filtering, marks/output labels, upload transport,
drag-and-drop file zones, DateField segment editing, and range date field composition remain
app-owned or future item work.
