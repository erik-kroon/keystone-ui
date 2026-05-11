import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function Component() {
  return (
    <Field class="w-full max-w-sm" invalid required>
      <FieldLabel>Registry slug</FieldLabel>
      <FieldControl value="Command Menu" />
      <FieldDescription>Use a lowercase URL-safe component slug.</FieldDescription>
      <FieldError>Use command-menu instead.</FieldError>
    </Field>
  );
}
