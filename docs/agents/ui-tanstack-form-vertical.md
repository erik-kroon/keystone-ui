# UI TanStack Form Vertical

## Scope

Issues #197, #198, #199, #200, #201, #203, #204, #205, and #211 cover the
UI-layer TanStackForm, TanStackField, TextField, TextareaField, SelectField,
CheckboxField, RadioGroupField, SwitchField, and FormSubmit generated source items.

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
- The end-state API supports flat or grouped string options, disabled groups/options,
  `textValue` for JSX labels, an empty listbox state, `selectProps`, and per-part class/prop
  escape hatches for trigger, content, listbox, group, group label, and item source.
- SelectField forwards disabled, readonly, required, and form ownership to Core Select,
  treats the empty string as the no-selection value for placeholder display, and wires
  trigger `aria-labelledby`/`aria-describedby` to TanStackField label, description, and
  error IDs.

TextField and TextareaField:

- `TextField` and `TextareaField` compose `TanStackField` with the generated `Input` and
  `Textarea` items instead of duplicating field-control state.
- Both pass validators through `form.Field`, bind string values from TanStack field state,
  call `field.handleChange()` on input, call `field.handleBlur()` on blur, and mirror focus
  into the shared field shell.
- The actual input/textarea receives the Core form-control ID, label, description, error,
  invalid, required, disabled, read-only, touched, dirty, focused, and validating props.

CheckboxField, RadioGroupField, and SwitchField:

- `CheckboxField` and `SwitchField` compose `TanStackField` with the generated Keystone-backed
  selection controls and map checked state to boolean TanStack field values.
- Their focusable controls receive the shared Core form-control relationship props while
  Keystone Core keeps role, keyboard interaction, hidden input, reset, disabled/read-only,
  and validation metadata behavior.
- `RadioGroupField` composes `TanStackField` with the generated `RadioGroup`, maps selected
  values to string TanStack field values, supports disabled options and custom indicators,
  and leaves rich item descriptions/object adapters to app-owned composition.

FormSubmit:

- `FormSubmit` is a stable named submit item for the TanStack Form vertical. It preserves
  native `button type="submit"` behavior, reads submitting/can-submit state from `form`,
  supports external native form ownership through `formId`, disables while submitting or when
  `canSubmit` is false by default, and exposes a dedicated `ui-form-submit` data contract.

## Registry Status

- `tanstack-form`, `tanstack-field`, `text-field`, `textarea-field`, `select-field`,
  `checkbox-field`, `radio-group-field`, `switch-field`, and `form-submit` carry
  `meta.api`, `meta.accessibility`, `meta.anatomy`, `meta.state`, `meta.limitations`,
  and `meta.parity` notes where relevant to the item.
- `select-field` depends on `select` and `tanstack-field`, so installed source reuses the
  same UI Select and TanStack field contracts.
- The first TanStack Form field vertical is implemented: #199 TextField, #200 TextareaField,
  #203 CheckboxField, #204 RadioGroupField, #205 SwitchField, and #211 FormSubmit.
- Issue #201 final status: implemented as the string-first, single-select TanStack adapter.
  Known limitations are intentional: empty string means no selection, and multi-select,
  object adapters, async loading, filtering, virtualization, and schema-specific validation
  helpers remain app-owned composition.

## Verification

Focused coverage lives in `packages/mason-registry/src/registry-validation.test.ts`,
which validates item metadata and generated source contracts. UI generated source typechecks
through `bun --filter @keystone-ui/ui check-types`; example app verification installs these
app-layer items and typechecks them in a Solid Vite fixture.
