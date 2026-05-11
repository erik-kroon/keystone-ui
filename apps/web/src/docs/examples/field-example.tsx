import { Field, FieldControl, FieldDescription, FieldLabel } from "@/components/ui/field";

export function Component() {
  return (
    <Field class="w-full max-w-sm" required>
      <FieldLabel>Email</FieldLabel>
      <FieldControl placeholder="name@example.com" type="email" />
      <FieldDescription>Used for registry review notifications.</FieldDescription>
    </Field>
  );
}
