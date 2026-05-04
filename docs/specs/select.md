# Select Accessibility Spec

## Status

Beta accessibility spec for the 0.1 preview.

## Scope

This spec covers Keystone Select and Mason SelectField items that delegate selection behavior to Keystone. It applies to `Select.Root`, `Select.Trigger`, `Select.Value`, `Select.Positioner`, `Select.Content`, `Select.Listbox`, `Select.Group`, `Select.GroupLabel`, `Select.Item`, `Select.ItemText`, `Select.ItemIndicator`, and hidden form participation.

## Anatomy

- `Root`: owns value, open state, item collection, form state, and disabled/readonly state.
- `Trigger`: opens, closes, and labels the current value.
- `Value`: renders selected value or placeholder.
- `Positioner`: positions popup content.
- `Content`: popup container.
- `Listbox`: owns option semantics.
- `Group` and `GroupLabel`: group related options.
- `Item`: selectable option.
- `ItemText`: display text used for value rendering and typeahead.
- `ItemIndicator`: visual selected marker.

## Roles And ARIA

- `Trigger` exposes combobox-style popup state for a select-like listbox.
- `Trigger` uses `aria-expanded` and controls the popup when the listbox ID is available.
- `Listbox` uses `role="listbox"`.
- `Item` uses `role="option"`.
- Selected items expose `aria-selected`.
- Disabled items expose disabled state and are skipped by keyboard movement and typeahead.
- Required, invalid, readonly, disabled, and placeholder state are reflected through ARIA where applicable and through data attributes for styling.

## Keyboard

| Key                 | Closed trigger                             | Open listbox                            |
| ------------------- | ------------------------------------------ | --------------------------------------- |
| `Enter` / `Space`   | Opens popup                                | Selects highlighted item                |
| `ArrowDown`         | Opens and highlights next enabled item     | Moves to next enabled item              |
| `ArrowUp`           | Opens and highlights previous enabled item | Moves to previous enabled item          |
| `Home`              | Opens or targets first enabled item        | Moves to first enabled item             |
| `End`               | Opens or targets last enabled item         | Moves to last enabled item              |
| Printable character | Opens or typeahead-searches items          | Typeahead-searches items                |
| `Escape`            | No value change                            | Closes without changing committed value |
| `Tab`               | Leaves control                             | Closes and follows normal tab order     |

Navigation must skip disabled and hidden items. Typeahead must use the shared collection/typeahead kernel and respect current item order.

## Focus

- Focus remains on the trigger for the active-descendant select model.
- Highlighted item state is reflected through `data-highlighted`.
- Closing returns focus to the trigger unless normal tab navigation intentionally moves focus onward.
- Portal and popup rendering must not create unreachable focusable content.

## Form Behavior

- Select serializes the selected value through native form participation.
- Required, invalid, readonly, disabled, and name state must affect submission consistently with the form-control kernel.
- Form reset restores the default value.
- Controlled value changes report reason details through the shared Keystone change-detail path.

## State And Data Attributes

All public parts expose `data-scope="select"` and `data-part`.

Important public states include:

- `data-state="open|closed"`
- `data-disabled`
- `data-highlighted`
- `data-invalid`
- `data-placeholder`
- `data-readonly`
- `data-required`
- `data-selected`
- `data-side`
- `data-align`

Floating parts expose Keystone geometry CSS variables.

## SSR And Hydration

- Collection registration is DOM-backed after mount and must not require browser globals during server render.
- Initial value, placeholder state, hidden input output, and part attributes must be deterministic.
- Floating measurement and portal behavior are client effects.

## Automated Coverage

| Requirement                         | Harness interface                               |
| ----------------------------------- | ----------------------------------------------- |
| Trigger/listbox relationships       | `expectAriaRelationship`, `expectRole`          |
| Keyboard open, move, select, cancel | `runKeyboardTable`                              |
| Item state attributes               | `expectStablePartAttributes`, `expectAriaState` |
| Form value and reset                | `expectFormValues`, `expectFormReset`           |
| SSR and hydration safety            | `expectSsrSmoke`, `expectHydrationSmoke`        |

## Known Gaps Before Stable

- Manual screen-reader evidence for the trigger/listbox pattern must be recorded.
- Large collection and virtualization guidance is not stable.
- Async item loading and filtering belong to Combobox or Mason app composition until separately specified.
