# DatePicker And Calendar Vertical

## Scope

This vertical applies the primitive delivery standard to DatePicker and Calendar:

- Compare current Keystone Core and UI state against Kobalte and Base UI.
- Ship the thin Keystone calendar/date picker vertical over shared date selection state.
- Add UI copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Core Contract

- `Calendar.Root` supports controlled and uncontrolled single-date `value`, range `rangeValue`, `month`, `defaultValue`, `defaultRangeValue`, `defaultMonth`, `selectionMode`, `minValue`, `maxValue`, `unavailable`, `disabled`, `locale`, `weekStartsOn`, `onValueChange`, `onRangeValueChange`, and `onMonthChange`.
- `Calendar.Grid` renders a `role="grid"` month table with column headers, rows, grid cells, and day buttons.
- Day buttons expose selected, range start/end/in-range, outside-month, today, unavailable, disabled, and value data attributes.
- Range selection normalizes reverse selection, keeps partial ranges open, and restarts instead of completing across unavailable dates.
- Calendar week starts infer from `Intl.Locale.weekInfo` when `weekStartsOn` is omitted, with an explicit `weekStartsOn` override and Sunday fallback.
- Calendar keyboard support covers arrow movement, Home/End, PageUp/PageDown, Enter, and Space.
- `DatePicker.Root` adds controlled and uncontrolled `open` state around the same calendar state.
- `DatePicker.Trigger` exposes `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, placeholder state, selection mode, selected single-date text, and range label text.
- User click and keydown handlers run first; internal behavior skips when the event is default-prevented.

## UI Surface

- `registry/default/ui/date-picker.tsx` wraps Keystone Calendar and DatePicker with `ui-calendar-*` and `ui-date-picker-*` styling hooks.
- Registry metadata records dependencies, parts, install command, source files, customization notes, and Kobalte/Base UI parity gaps.

## Parity Notes

Kobalte and Base UI still go deeper on date fields, segment editing, validation and form semantics, multi-month rendering, alternate calendar systems beyond localized `Intl` formatting and locale week starts, cursor/touch behavior, nested overlay coordination, focus restoration, and edge-case accessibility tests. The next parity pass should deepen those areas without moving TanStack app-layer form concerns into Keystone.
