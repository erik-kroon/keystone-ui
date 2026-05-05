# Keystone Form Rules

Use this for fields, validation, and form-heavy UI.

## Boundaries

- Core owns intrinsic field semantics, ARIA relationships, native labels, required/invalid/disabled/readonly state, and form reset behavior.
- UI owns styled field wrappers and app-level form integrations.
- TanStack Form belongs in UI/app source, never Core.

## Default Composition

Prefer a field wrapper when a control has a label, description, error, or validation state.

```tsx
<Field>
  <Label for="email">Email</Label>
  <Input id="email" type="email" autocomplete="email" />
  <FieldDescription>Use your work email.</FieldDescription>
  <FieldError>Email is required.</FieldError>
</Field>
```

Adjust names to the actual local component exports after inspecting the source.

## Rules

- Keep native form controls where possible.
- Always associate labels and controls with `for`/`id` or Core-provided relationships.
- Preserve `aria-invalid`, `aria-describedby`, required, disabled, readonly, and error semantics.
- Make submit buttons explicit: `type="submit"` for submit, `type="button"` for everything else.
- Use `FormSubmit` or the existing submit wrapper when available.
- Do not build a custom validation engine in UI if TanStack Form or native validation covers the task.
- For arrays, repeated fields, or app-grade validation, use the existing TanStack-backed registry items.

## Common Pitfalls

- Putting error text on screen without connecting it to the control.
- Omitting `type="button"` on buttons inside forms and dialogs.
- Styling invalid state only visually while missing `aria-invalid`.
- Reimplementing field state in a block instead of using existing field wrappers.
- Moving TanStack form state into Core.
