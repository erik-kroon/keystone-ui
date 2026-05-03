# DatePicker And Calendar Vertical

## Scope

This vertical applies the primitive delivery standard to DatePicker and Calendar:

- Compare current Keystone and Mason state against Kobalte and Base UI.
- Ship the thin Keystone calendar/date picker vertical over shared date selection state.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Keystone Contract

- `Calendar.Root` supports controlled and uncontrolled `value`, `month`, `defaultValue`, `defaultMonth`, `minValue`, `maxValue`, `disabled`, `locale`, `weekStartsOn`, `onValueChange`, and `onMonthChange`.
- `Calendar.Grid` renders a `role="grid"` month table with column headers, rows, grid cells, and day buttons.
- Day buttons expose selected, outside-month, today, disabled, and value data attributes.
- Calendar keyboard support covers arrow movement, Home/End, PageUp/PageDown, Enter, and Space.
- `DatePicker.Root` adds controlled and uncontrolled `open` state around the same calendar state.
- `DatePicker.Trigger` exposes `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, placeholder state, and selected value text.
- User click and keydown handlers run first; internal behavior skips when the event is default-prevented.

## Mason Surface

- `registry/default/ui/date-picker.tsx` wraps Keystone Calendar and DatePicker with `mason-calendar-*` and `mason-date-picker-*` styling hooks.
- Registry metadata records dependencies, parts, install command, source files, customization notes, and Kobalte/Base UI parity gaps.

## Parity Notes

Kobalte and Base UI go deeper on date fields, segment editing, validation and form semantics, richer unavailable date policies, multi-month and range calendars, cursor/touch behavior, nested overlay coordination, focus restoration, and edge-case accessibility tests. The next parity pass should deepen those areas without moving TanStack app-layer form concerns into Keystone.
