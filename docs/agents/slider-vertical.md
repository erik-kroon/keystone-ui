# Slider Vertical

## Scope

This vertical applies the primitive delivery standard to Slider:

- Compare current Keystone and Mason state against Kobalte, Base UI, and TanStack Ranger.
- Ship the thin Keystone primitive over a shared range controller.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Keystone Contract

- `Slider.Root` supports `value`, `defaultValue`, `min`, `max`, `step`, `minStepsBetweenThumbs`, `orientation`, `dir`, `disabled`, `readOnly`, `invalid`, `required`, `name`, `form`, `onValueChange`, and `onValueCommit`.
- `Slider.Track` owns pointer track selection and drag movement.
- `Slider.Range` exposes range CSS variables for generated Mason styling.
- `Slider.Thumb` exposes `role="slider"`, value ARIA, orientation ARIA, `data-scope`, `data-part`, `data-index`, `data-disabled`, and keyboard stepping.
- Horizontal slider keyboard and pointer math is RTL-aware through explicit `dir` or the Keystone direction provider.
- Multi-thumb sliders preserve the configured minimum step distance between thumbs.
- `Slider.HiddenInput` serializes slider values for native forms, supports external form ownership, syncs input events back to slider state, and resets to `defaultValue`.
- User keyboard and pointer handlers run first; internal behavior skips when the event is default-prevented.

## Mason Surface

- `registry/default/ui/slider.tsx` wraps Keystone Slider with `mason-slider-*` styling hooks and exposes the hidden input part.
- Registry metadata records dependencies, parts, CSS variables, install command, source files, customization notes, and parity gaps.

## Parity Notes

Kobalte and Base UI go deeper on field integration, validation semantics, and advanced pointer behavior. TanStack Ranger goes deeper on range-engine ergonomics, active handle lifecycle, tick helpers, interpolation, and commit timing. The next parity pass should add cursor/touch behavior, nested coordination, focus restoration, metadata docs examples, and edge-case tests.
