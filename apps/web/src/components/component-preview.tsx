import { CircleAlert } from "lucide-solid";
import { Match, Switch } from "solid-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@keystone-ui/ui/accordion";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@keystone-ui/ui/alert";
import { Badge as KeystoneBadge } from "@keystone-ui/ui/badge";
import { Button } from "@keystone-ui/ui/button";
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from "@keystone-ui/ui/card";
import { Input } from "@keystone-ui/ui/input";
import { Label } from "@keystone-ui/ui/label";
import { Switch as KeystoneSwitch } from "@keystone-ui/ui/switch";

import { Badge } from "@/components/docs-shell";
import { docsItemTitle } from "@/lib/docs-data";
import type { RegistryDocItem } from "@/lib/registry-docs.gen";

const accordionItems = [
  {
    content: "Keystone UI is source-owned Solid component source backed by Core behavior.",
    id: "item-1",
    title: "What is Keystone UI?",
  },
  {
    content: "Install components with the shadcn CLI, then edit the generated source in your app.",
    id: "item-2",
    title: "How do I get started?",
  },
  {
    content: "Yes. The wrappers keep behavior in Core and styling in the UI layer.",
    id: "item-3",
    title: "Can I use it for my project?",
  },
];

export function ComponentPreview(props: Readonly<{ item: RegistryDocItem }>) {
  const title = () => docsItemTitle(props.item);

  return (
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <div class="flex min-h-11 items-center justify-between gap-3 border-border border-b px-4 py-2 text-muted-foreground text-sm">
        <span>{title()}</span>
        <Badge>{props.item.type.replace("registry:", "")}</Badge>
      </div>
      <div class="flex min-h-52 items-center justify-center bg-background/60 p-6">
        <div class="flex w-full max-w-md justify-center">
          <Switch fallback={<GenericPreview item={props.item} />}>
            <Match when={props.item.name === "accordion"}>
              <Accordion class="w-full max-w-md">
                {accordionItems.map((item) => (
                  <AccordionItem value={item.id}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Match>
            <Match when={props.item.name === "button"}>
              <div class="flex flex-wrap items-center gap-3">
                <Button>Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
            </Match>
            <Match when={props.item.name === "badge"}>
              <div class="flex flex-wrap items-center gap-2">
                <KeystoneBadge>Default</KeystoneBadge>
                <KeystoneBadge variant="success">Success</KeystoneBadge>
                <KeystoneBadge variant="warning">Warning</KeystoneBadge>
                <KeystoneBadge variant="outline">Outline</KeystoneBadge>
              </div>
            </Match>
            <Match when={props.item.name === "card"}>
              <Card class="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Registry Card</CardTitle>
                  <CardDescription>
                    Keystone card source rendered in the docs preview.
                  </CardDescription>
                </CardHeader>
                <CardPanel class="text-muted-foreground text-sm">
                  Component previews use the installable UI source where the web app can import it.
                </CardPanel>
              </Card>
            </Match>
            <Match when={props.item.name === "input"}>
              <div class="grid w-full max-w-64 gap-2">
                <Label for="component-preview-search">Search</Label>
                <Input
                  id="component-preview-search"
                  placeholder="Search components..."
                  type="search"
                />
              </div>
            </Match>
            <Match when={props.item.name === "label"}>
              <div class="grid w-full max-w-64 gap-2">
                <Label for="component-preview-email">Email</Label>
                <Input id="component-preview-email" placeholder="name@example.com" type="email" />
              </div>
            </Match>
            <Match when={props.item.name === "switch"}>
              <Label class="gap-3">
                <KeystoneSwitch name="component-preview-notifications" />
                Enable notifications
              </Label>
            </Match>
            <Match when={props.item.name === "alert"}>
              <Alert class="w-full max-w-md" variant="info">
                <AlertIcon>
                  <CircleAlert />
                </AlertIcon>
                <AlertTitle>Source preview</AlertTitle>
                <AlertDescription>
                  This alert is rendered from the Keystone UI registry source.
                </AlertDescription>
              </Alert>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}

function GenericPreview(props: Readonly<{ item: RegistryDocItem }>) {
  const title = () => docsItemTitle(props.item);

  return (
    <div class="grid max-w-md justify-items-center gap-3 text-center">
      <span class="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-primary">
        {title().slice(0, 1)}
      </span>
      <div>
        <h3 class="m-0 font-semibold text-base text-foreground">{title()}</h3>
        <p class="mt-1 text-muted-foreground text-sm leading-6">{props.item.description}</p>
      </div>
    </div>
  );
}
