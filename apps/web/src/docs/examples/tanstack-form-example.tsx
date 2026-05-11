import { createSignal } from "solid-js";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import {
  TanStackForm,
  TanStackFormErrors,
  TanStackFormSubmit,
} from "@/components/ui/tanstack-form";

function createPreviewForm() {
  const [submitted, setSubmitted] = createSignal(false);

  return {
    handleSubmit: () => setSubmitted(true),
    state: {
      canSubmit: true,
      get isSubmitted() {
        return submitted();
      },
    },
  };
}

export function Component() {
  const form = createPreviewForm();

  return (
    <TanStackForm form={form} class="w-full max-w-sm rounded-lg border bg-background p-4">
      <Field>
        <FieldLabel>Workspace name</FieldLabel>
        <FieldControl value="Keystone UI" />
      </Field>
      <TanStackFormErrors form={form} />
      <TanStackFormSubmit
        form={form}
        class="inline-flex h-8.5 items-center justify-center rounded-lg bg-primary px-3 font-medium text-primary-foreground text-sm shadow-xs/5"
      >
        Save workspace
      </TanStackFormSubmit>
    </TanStackForm>
  );
}
