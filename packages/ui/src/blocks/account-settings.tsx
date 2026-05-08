import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export type AccountSettingsBlockProps = {
  email?: string;
  name?: string;
  plan?: string;
};

export function AccountSettingsBlock(props: AccountSettingsBlockProps) {
  const name = () => props.name ?? "Charlotte UI";
  const email = () => props.email ?? "charlotte@example.com";
  const plan = () => props.plan ?? "Preview";

  return (
    <section data-scope="ui-block" data-part="account-settings" class="ui-block-account-settings">
      <Card>
        <CardHeader>
          <div class="ui-block-account-settings-heading">
            <div>
              <CardTitle>Account settings</CardTitle>
              <CardDescription>Profile details used across your workspace.</CardDescription>
            </div>
            <Badge variant="muted">{plan()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="ui-block-account-settings-grid">
            <Field>
              <FieldLabel for="account-settings-name">Name</FieldLabel>
              <Input id="account-settings-name" value={name()} autocomplete="name" />
              <FieldDescription>Shown on shared project activity.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel for="account-settings-email">Email</FieldLabel>
              <Input
                id="account-settings-email"
                type="email"
                value={email()}
                autocomplete="email"
              />
              <FieldDescription>Used for invites and product updates.</FieldDescription>
            </Field>
          </div>
          <Separator />
          <div class="ui-block-account-settings-row">
            <div>
              <p class="ui-block-account-settings-label">Two-step verification</p>
              <p class="ui-block-account-settings-copy">Require a second factor for new devices.</p>
            </div>
            <Badge variant="outline">Recommended</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button">Save changes</Button>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
