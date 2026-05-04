# UI TanStack Form Vertical

## Scope

Issues #197, #198, and #201 cover the UI-layer TanStackForm, TanStackField, and
SelectField generated source items.

These are app-layer UI components. TanStack Form owns form state, validation, blur,
submit, touched, dirty, and validating metadata. Keystone Core owns intrinsic form-control
semantics and Select primitive behavior. UI owns source-owned adapters, styling hooks,
registry metadata, and examples.

## Current UI Contract

TanStackForm:

- `TanStackForm` wraps a native `form`, runs user `onSubmit` first, optionally prevents
  default and stops propagation, then calls `form.handleSubmit()`.
- It mirrors submitting, validating, invalid, and can-submit metadata through data
  attributes and `aria-busy`, and also exposes dirty, touched, submitted, and submission
  attempt state for source-owned styling and instrumentation.
- `TanStackFormSubmit` and `TanStackFormErrors` are small source-owned helpers for submit
  controls and root error display. Submit can bind to a form instance and disables while
  submitting or when `canSubmit` is false by default.

TanStackField:

- `TanStackField` renders `form.Field`, passes validators through, derives first error and
  touched invalid state from field meta, and creates a Keystone Core form-control contract.
- The child render function receives `control`, generated relationship IDs, `field`, `value`,
  `invalid`, `firstError`, `focused`, `setFocused`, `touched`, `dirty`, `blurred`, and
  `validating`, so concrete controls decide how to call `handleChange` and `handleBlur`.
- The adapter exposes label, description, and error parts with stable `data-slot` hooks and
  Core-backed ARIA relationships. TanStack touched, dirty, and validating metadata feeds the
  Core form-control state contract; blur metadata is exposed as `data-blurred`.

SelectField:

- `SelectField` composes `TanStackField` with the styled `Select` registry item.
- It maps Core Select value changes into `field.handleChange()` and popup close into
  `field.handleBlur()`.
- It preserves Core Select listbox behavior, hidden form value, typeahead, disabled options,
  and popup geometry instead of copying primitive internals.

## Registry Status

- `tanstack-form`, `tanstack-field`, and `select-field` carry `meta.api`,
  `meta.accessibility`, `meta.anatomy`, `meta.cssVariables`, `meta.limitations`, and
  `meta.parity` notes.
- `select-field` depends on `select` and `tanstack-field`, so installed source reuses the
  same UI Select and TanStack field contracts.

## Verification

Focused coverage lives in `packages/mason-registry/src/registry-validation.test.ts`,
which validates item metadata and generated source contracts. Example app verification
installs these app-layer items and typechecks them in a Solid Vite fixture.
