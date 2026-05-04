# Selection Controls Vertical

## Scope

This vertical applies the current primitive delivery standard to Switch, Checkbox, and RadioGroup and records closure for GitHub issue #54:

- Compare the current Keystone and Mason state against Kobalte and Base UI.
- Ship thin Keystone primitives over the shared selection-control controller first.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record intentional parity choices and deferred gaps.

## Current Keystone Contract

Switch:

- `Switch.Root` supports controlled and uncontrolled `checked`, `defaultChecked`, `disabled`, `readOnly`, `invalid`, `required`, `name`, `form`, `value`, and `onCheckedChange`.
- `Switch.Control` exposes `role="switch"`, `aria-checked`, state data attributes, keyboard Space toggling, and user-handler-first click behavior.
- `Switch.HiddenInput` mirrors checked state for form submission.
- `Switch.HiddenInput` participates in native form reset and can sync checked state from input change events.
- `Switch.Control` preserves user-owned `aria-labelledby` and `aria-describedby` composition for labels and descriptions.
- Click and Space press semantics are preventable; disabled and read-only controls block internal toggles after user handlers run.

Checkbox:

- `Checkbox.Root` supports controlled and uncontrolled `checked`, `defaultChecked`, indeterminate state, disabled/read-only/invalid/required flags, `name`, `form`, `value`, and `onCheckedChange`.
- `Checkbox.Control` exposes `role="checkbox"`, `aria-checked="mixed"` for indeterminate state, state data attributes, keyboard Space toggling, and preventable click behavior.
- `Checkbox.HiddenInput` mirrors checked and `indeterminate` input state.
- `Checkbox.HiddenInput` participates in native form reset and can sync checked state from input change events.
- `Checkbox.HiddenInput` supports external form ownership and native required validation through the checkbox input.
- `Checkbox.Control` preserves user-owned `aria-labelledby` and `aria-describedby` composition.
- Control clicks, Space key presses, and hidden-input changes are preventable.

RadioGroup:

- `RadioGroup.Root` supports controlled and uncontrolled `value`, `defaultValue`, `disabled`, `readOnly`, `invalid`, `required`, `orientation`, `loopFocus`, `name`, `form`, and `onValueChange`.
- `RadioGroup.Root` accepts explicit `dir` and inherits the Keystone direction provider for RTL-aware horizontal keyboard navigation.
- `RadioGroup.Item` exposes `role="radio"`, roving `tabIndex`, checked data attributes, click selection, and arrow/Home/End keyboard selection.
- `RadioGroup.HiddenInput` mirrors item selection as native radio inputs.
- `RadioGroup.HiddenInput` participates in native form reset, including external form ownership through the root `form` prop.
- `RadioGroup.Root` preserves user-owned `aria-labelledby` and `aria-describedby` composition.
- Required radio validation delegates to the native radio inputs.
- Item clicks, keyboard navigation, and hidden-input changes are preventable where native events are cancelable.
- Checkbox, Switch, and RadioGroup hidden-input parts mirror stable checked, disabled, invalid, readonly, required, orientation, and direction data where applicable so generated source can style and test native form state without reaching into private controllers.
- Selection-control SSR output is deterministic for root/control/input state; mount-only reset listeners do not require browser globals during server render.

## Mason Surface

- `registry/default/ui/switch.tsx` wraps Keystone Switch with `mason-switch-*` styling hooks.
- `registry/default/ui/checkbox.tsx` wraps Keystone Checkbox with `mason-checkbox-*` styling hooks.
- `registry/default/ui/radio-group.tsx` wraps Keystone RadioGroup with `mason-radio-group-*` styling hooks.
- Registry metadata records dependencies, parts, install command, source files, customization notes, and Kobalte/Base UI parity gaps.

## Parity Notes

Kobalte and Base UI still go deeper on full field primitives, press abstraction details, and nested composite coordination. Keystone intentionally keeps label and description ownership in userland or the form field layer for this milestone rather than adding selection-control-specific Label/Description parts. Cursor and touch semantics are native button/input semantics plus preventable click, keyboard, and change handlers; a dedicated press-state abstraction can be added later if Mason needs richer touch feedback without changing selection state contracts.

Nested or toolbar coordination decisions for radio groups, animation lifecycle data attributes beyond current checked/unchecked state, and manual assistive-technology evidence remain deferred.
