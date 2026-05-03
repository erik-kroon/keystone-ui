# Slider Vertical

## Scope

This vertical applies the primitive delivery standard to Slider:

- Compare current Keystone and Mason state against Kobalte, Base UI, and TanStack Ranger.
- Ship the thin Keystone primitive over a shared range controller.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Keystone Contract

- `Slider.Root` supports `value`, `defaultValue`, `min`, `max`, `step`, `orientation`, `disabled`, `onValueChange`, and `onValueCommit`.
- `Slider.Track` owns pointer track selection and drag movement.
- `Slider.Range` exposes range CSS variables for generated Mason styling.
- `Slider.Thumb` exposes `role="slider"`, value ARIA, orientation ARIA, `data-scope`, `data-part`, `data-index`, `data-disabled`, and keyboard stepping.
- User keyboard and pointer handlers run first; internal behavior skips when the event is default-prevented.

## Mason Surface

- `registry/default/ui/slider.tsx` wraps Keystone Slider with `mason-slider-*` styling hooks.
- Registry metadata records dependencies, parts, CSS variables, install command, source files, customization notes, and parity gaps.

## Parity Notes

Kobalte and Base UI go deeper on field integration, disabled/read-only policy, validation semantics, and advanced pointer behavior. TanStack Ranger goes deeper on range-engine ergonomics, active handle lifecycle, tick helpers, interpolation, and commit timing. The next parity pass should add cursor/touch behavior, nested coordination, focus restoration, minimum thumb distance, form hidden inputs, metadata docs examples, and edge-case tests.
