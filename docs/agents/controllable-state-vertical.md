# Controllable State Vertical

## Audit

- Existing reusable surface: `createControllableSignal`, `createControllableBooleanSignal`, `KeystoneChangeDetail`, and focused kernel tests in `packages/core/src/utils/kernel.test.tsx`.
- Existing consumers: disclosure, accordion, selection controls, radio group, tabs, slider, combobox, listbox selection, menu checkbox/radio items, and date picker state.
- Missing before this pass: explicit controlled presence for valid `undefined` values, and a shared detail-aware setter contract that lets primitives pass reason/event metadata without side-channel `pendingDetail` state.

## End-State Contract

- The getter returns the controlled accessor value when controlled, otherwise internal state initialized from `defaultValue`.
- A signal is controlled when `isControlled?.()` is true, or when no explicit presence accessor is supplied and `value?.()` is not `undefined`.
- Setters accept a value or updater function plus optional typed detail. They return the requested next value.
- Setters skip local updates and `onChange` when `Object.is(previous, next)`.
- Controlled setters never mutate internal fallback state; they only request change through `onChange`.
- `defaultDetail` supplies programmatic metadata when the caller omits detail.
- Core primitives continue to expose user-visible roles, ARIA, keyboard, pointer, form, and data attribute behavior through their own public tests; controllable state remains a private kernel helper with focused proof.

## Final Status

Controllable state is `proven` for the Core kernel. Keep adding richer wrappers only when a primitive needs them, such as set-valued state or a disclosure-specific helper.
