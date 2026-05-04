# Slider Vertical

## Scope

This vertical applies the primitive delivery standard to Slider and records closure for GitHub issue #54:

- Compare current Keystone and Mason state against Kobalte, Base UI, and TanStack Ranger.
- Ship the thin Keystone primitive over a shared range controller.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record intentional parity choices and deferred gaps.

## Current Keystone Contract

- `Slider.Root` supports `value`, `defaultValue`, `min`, `max`, `step`, `minStepsBetweenThumbs`, `orientation`, `dir`, `disabled`, `readOnly`, `invalid`, `required`, `name`, `form`, `onValueChange`, and `onValueCommit`.
- `Slider.Track` owns pointer track selection and drag movement.
- `Slider.Range` exposes range CSS variables for generated Mason styling.
- `Slider.Thumb` exposes `role="slider"`, value ARIA, orientation ARIA, `data-scope`, `data-part`, `data-index`, `data-active`, `data-disabled`, and keyboard stepping.
- Horizontal slider keyboard and pointer math is RTL-aware through explicit `dir` or the Keystone direction provider.
- Multi-thumb sliders preserve the configured minimum step distance between thumbs.
- `Slider.HiddenInput` serializes single and multi-thumb slider values for native forms, supports external form ownership, syncs input events back to slider state, and resets to `defaultValue`.
- User keyboard and pointer handlers run first; internal behavior skips when the event is default-prevented.
- Pointer dragging uses pointer capture when the host implements it, keeps document-level move/up listeners as a fallback, exposes the active thumb lifecycle through `data-active`, and commits once on pointer release.

## Mason Surface

- `registry/default/ui/slider.tsx` wraps Keystone Slider with `mason-slider-*` styling hooks and exposes the hidden input part.
- Registry metadata records dependencies, parts, CSS variables, install command, source files, customization notes, and parity gaps.

## Parity Notes

Kobalte and Base UI go deeper on field integration and validation semantics. TanStack Ranger goes deeper on range-engine ergonomics, tick helpers, interpolation, and helper APIs. Keystone intentionally defers origin and tooltip helpers for this milestone: Mason can compose visual labels/tooltips from public thumb value ARIA, range CSS variables, and `data-active` without adding slider-owned presentation primitives.

Native constraint validation for hidden slider inputs is intentionally deferred because hidden inputs do not participate in browser validation UI. Field-level validity should live in Keystone Form or Mason/TanStack Form composition. Cursor/touch feedback beyond pointer capture and preventable pointer handlers, nested composite coordination, and focus restoration policy remain future deepening areas.
