# Field And FormControl Accessibility Spec

## Status

Beta accessibility spec for the 0.1 preview.

## Scope

This spec covers Core `Field`, `Fieldset`, `FormControl`, and the standalone `Label`, `Description`, and `ErrorMessage` primitives. UI TextField and SelectField may compose these parts for styled source, but label, description, error, validation, hidden input, reset, and ARIA wiring belong to Keystone.

## Anatomy

- `Root`: provides field context and state.
- `Label`: labels the associated control.
- `Control`: renders or binds the native/input-like control.
- `Description`: provides supplemental help text.
- `ErrorMessage`: provides validation feedback when invalid.
- `HiddenInput`: serializes non-native primitive values.

Fieldset anatomy:

- `Root`: renders a native fieldset and provides grouped state.
- `Legend`: renders the fieldset legend and accessible group name.
- `Description`: provides grouped supplemental help text.
- `ErrorMessage`: provides grouped validation feedback when invalid.

Standalone anatomy:

- `Label.Root`: renders a native label.
- `Description.Root`: renders descriptive text.
- `ErrorMessage.Root`: renders validation feedback with alert semantics by default.

## Roles And ARIA

- `Label` is associated with `Control` through native `for`/`id` or equivalent control ownership.
- `Description` participates in `aria-describedby` when present.
- `ErrorMessage` participates in `aria-describedby` when invalid and rendered.
- `Fieldset.Legend` supplies the group name through native fieldset/legend semantics and an `aria-labelledby` fallback.
- `Fieldset.Description` participates in root `aria-describedby`.
- `Fieldset.ErrorMessage` participates in root `aria-describedby` when invalid and rendered.
- Invalid controls expose `aria-invalid`.
- Required controls expose native `required` where possible and ARIA required state where needed.
- Disabled controls are removed from interaction and submission where native semantics require it.
- Readonly controls prevent value mutation while remaining discoverable when native semantics allow it.

## Keyboard

Field and FormControl do not add custom keyboard interaction. Keyboard behavior remains native to the rendered control or to the Core primitive composed inside the control.

Required behavior:

- Label activation focuses or activates the associated control when native HTML supports it.
- Disabled controls do not receive keyboard interaction.
- Readonly controls do not mutate value through keyboard input.
- Error and description content must not introduce unexpected tab stops.

## Validation And State

Field/FormControl exposes public state for:

- `dirty`
- `touched`
- `filled`
- `focused`
- `invalid`
- `validating`
- `required`
- `readonly`
- `disabled`

Validation state must be observable through data attributes and through ARIA/native attributes where relevant. Validation reasons should distinguish input, blur, submit, reset, programmatic value changes, and native validity where the implementation supports them.

## Form Participation

- Native controls participate through normal browser submission.
- Core primitives that need hidden inputs use `HiddenInput`.
- Hidden inputs serialize the current value with the configured name.
- Disabled controls do not submit values.
- Form reset restores default value and default validity/touched/dirty state.
- Multiple value controls must serialize deterministically.

## State And Data Attributes

All public parts expose `data-scope` and their `data-part`. Form control surfaces use `field` or `form-control`; grouped fields use `fieldset`; standalone native helpers use `label`, `description`, or `error-message`.

Form state attributes include:

- `data-dirty`
- `data-disabled`
- `data-filled`
- `data-focused`
- `data-invalid`
- `data-readonly`
- `data-required`
- `data-touched`
- `data-validating`

UI fields should style these attributes directly instead of duplicating validation state.

Fieldset state attributes include:

- `data-disabled`
- `data-invalid`
- `data-readonly`
- `data-required`

## SSR And Hydration

- Generated IDs must be stable across server and client rendering.
- Description and error relationships must not change IDs during hydration.
- Hidden input output must be deterministic from name, value, disabled, and form state.
- Browser validation APIs should be read from lifecycle-safe effects or event paths, not during server render.

## Automated Coverage

| Requirement                                 | Harness interface                               |
| ------------------------------------------- | ----------------------------------------------- |
| Label, description, and error relationships | `expectAriaRelationship`                        |
| Required/invalid/disabled/readonly state    | `expectAriaState`, `expectStablePartAttributes` |
| Native submission                           | `expectFormValues`                              |
| Reset behavior                              | `expectFormReset`                               |
| SSR and hydration-safe IDs                  | `expectSsrSmoke`, `expectHydrationSmoke`        |

## Known Gaps Before Stable

- Browser and manual evidence is summarized in
  [Primitive Browser And Manual Accessibility Evidence](../accessibility/primitive-evidence.md).
- Manual screen-reader evidence for error announcement timing must still be recorded before a
  stable claim.
- Native constraint validation behavior needs broader browser matrix coverage; the 2026-05-05
  Chromium probe found a reset edge case where native email validity repopulated the error after
  reset.
- Multi-value hidden input conventions should be finalized before stable.
