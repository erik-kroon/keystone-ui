# Selection Controls Vertical

## Scope

This vertical applies the current primitive delivery standard to Switch, Checkbox, and RadioGroup:

- Compare the current Keystone and Mason state against Kobalte and Base UI.
- Ship thin Keystone primitives over the shared selection-control controller first.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Keystone Contract

Switch:

- `Switch.Root` supports controlled and uncontrolled `checked`, `defaultChecked`, `disabled`, `readOnly`, `invalid`, `required`, `name`, `form`, `value`, and `onCheckedChange`.
- `Switch.Control` exposes `role="switch"`, `aria-checked`, state data attributes, keyboard Space toggling, and user-handler-first click behavior.
- `Switch.HiddenInput` mirrors checked state for form submission.
- `Switch.HiddenInput` participates in native form reset and can sync checked state from input change events.

Checkbox:

- `Checkbox.Root` supports controlled and uncontrolled `checked`, `defaultChecked`, indeterminate state, disabled/read-only/invalid/required flags, `name`, `form`, `value`, and `onCheckedChange`.
- `Checkbox.Control` exposes `role="checkbox"`, `aria-checked="mixed"` for indeterminate state, state data attributes, keyboard Space toggling, and preventable click behavior.
- `Checkbox.HiddenInput` mirrors checked and `indeterminate` input state.
- `Checkbox.HiddenInput` participates in native form reset and can sync checked state from input change events.

RadioGroup:

- `RadioGroup.Root` supports controlled and uncontrolled `value`, `defaultValue`, `disabled`, `readOnly`, `invalid`, `required`, `orientation`, `loopFocus`, `name`, `form`, and `onValueChange`.
- `RadioGroup.Root` accepts explicit `dir` and inherits the Keystone direction provider for RTL-aware horizontal keyboard navigation.
- `RadioGroup.Item` exposes `role="radio"`, roving `tabIndex`, checked data attributes, click selection, and arrow/Home/End keyboard selection.
- `RadioGroup.HiddenInput` mirrors item selection as native radio inputs.
- `RadioGroup.HiddenInput` participates in native form reset, including external form ownership through the root `form` prop.
- Checkbox, Switch, and RadioGroup hidden-input parts mirror stable checked, disabled, invalid, readonly, required, orientation, and direction data where applicable so generated source can style and test native form state without reaching into private controllers.

## Mason Surface

- `registry/default/ui/switch.tsx` wraps Keystone Switch with `mason-switch-*` styling hooks.
- `registry/default/ui/checkbox.tsx` wraps Keystone Checkbox with `mason-checkbox-*` styling hooks.
- `registry/default/ui/radio-group.tsx` wraps Keystone RadioGroup with `mason-radio-group-*` styling hooks.
- Registry metadata records dependencies, parts, install command, source files, customization notes, and Kobalte/Base UI parity gaps.

## Parity Notes

Kobalte and Base UI still go deeper than this first vertical. The next parity pass should add cursor/touch press behavior, richer label and description composition, nested or toolbar coordination decisions for radio groups, form validation edge cases, animation lifecycle data attributes, and broader SSR/hydration tests.
