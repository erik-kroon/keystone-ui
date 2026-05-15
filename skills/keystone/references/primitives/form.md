# Form

Use this guide for Keystone field wiring, TanStack Form adapters, validation display, and source-owned app form shells.

## Source

- Core-backed field source: `packages/ui/src/ui/field.tsx`
- TanStack form shell: `packages/ui/src/ui/tanstack-form.tsx`
- TanStack field adapter: `packages/ui/src/ui/tanstack-field.tsx`
- Common controls: `packages/ui/src/ui/text-field.tsx`, `select-field.tsx`, `combobox-field.tsx`
- Core primitive: `@keystone-ui/core/form`
- Registry items: `field`, `tanstack-form`, `tanstack-field`, `text-field`, `select-field`, `combobox-field`

## Boundary

Keystone Core owns field-control semantics: generated IDs, label/control relationships, descriptions, error messages, invalid/required/disabled/read-only metadata, and stable data attributes.

Keystone UI owns styled fields and concrete adapters. TanStack Form owns application form state, validation lifecycle, touched/dirty/blurred metadata, submitting state, and field values.

Do not move TanStack Form into Core. Core must stay independent from app-state libraries.

## Composition

```tsx
import { createForm } from "@tanstack/solid-form";
import { TanStackForm, TanStackFormSubmit } from "@/components/ui/tanstack-form";
import { TextField } from "@/components/ui/text-field";

export function ProjectForm() {
  const form = createForm({
    defaultValues: { name: "" },
    onSubmit: ({ value }) => saveProject(value),
  });

  return (
    <TanStackForm form={form}>
      <TextField
        form={form}
        name="name"
        label="Project name"
        description="Shown in the workspace switcher."
        required
      />
      <TanStackFormSubmit form={form}>Save</TanStackFormSubmit>
    </TanStackForm>
  );
}
```

Use concrete field wrappers first. Reach for `TanStackField` directly only when a control needs custom rendering.

## Accessibility

- Every user-editable field needs a programmatic label.
- Descriptions and errors must connect to the control through Core field props or the field wrapper.
- Error text should render with `role="alert"` only when invalid and visible.
- Preserve `required`, `disabled`, `readOnly`, `formId`, `name`, and native submit/reset behavior.
- `TanStackForm` runs user `onSubmit` first and stops when `event.defaultPrevented`; keep that order.

## Pitfalls

- Do not duplicate label IDs or hard-code generated field relationship IDs.
- Do not call `field.handleBlur` before user blur handlers have a chance to prevent default when using custom controls.
- Do not show validation before the field is touched unless the product explicitly requires immediate validation.
- Do not hide TanStack Form behind a new generic Keystone form runtime.

## Verification

- Run `bun run check-types` after form or field source changes.
- Keyboard check: labels focus controls, Tab order is logical, submit works from Enter where appropriate.
- Form check: submit, reset, disabled, required, and external `form` owner behavior work.
- Accessibility check: invalid controls expose `aria-invalid`, error messages are announced, and descriptions remain associated.
