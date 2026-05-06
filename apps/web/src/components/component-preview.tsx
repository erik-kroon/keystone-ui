import { CircleAlert } from "lucide-solid";
import { Match, Switch } from "solid-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@keystone-ui/ui/default/ui/accordion.tsx";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@keystone-ui/ui/default/ui/alert.tsx";
import { Badge as KeystoneBadge } from "@keystone-ui/ui/default/ui/badge.tsx";
import { Button } from "@keystone-ui/ui/default/ui/button.tsx";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@keystone-ui/ui/default/ui/card.tsx";
import { Input } from "@keystone-ui/ui/default/ui/input.tsx";

import { Badge } from "@/components/docs-shell";
import type { RegistryDocItem } from "@/lib/registry-docs.gen";

export function ComponentPreview(props: Readonly<{ item: RegistryDocItem }>) {
  return (
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <div class="flex min-h-11 items-center justify-between gap-3 border-border border-b px-4 py-2 text-muted-foreground text-sm">
        <span>{props.item.title}</span>
        <Badge>{props.item.type.replace("registry:", "")}</Badge>
      </div>
      <div class="flex min-h-52 items-center justify-center bg-background/60 p-6">
        <Switch fallback={<GenericPreview item={props.item} />}>
          <Match when={props.item.name === "accordion"}>
            <Accordion defaultValue={["item-3"]} class="w-full max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Keystone UI?</AccordionTrigger>
                <AccordionContent>
                  Keystone UI is source-owned Solid component source backed by Core behavior.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Install components with Mason, then edit the generated source in your app.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
                <AccordionContent>
                  Yes. The wrappers keep behavior in Core and styling in the UI layer.
                </AccordionContent>
              </AccordionItem>
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
            <div class="w-full max-w-sm">
              <Input placeholder="Search components..." />
            </div>
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
  );
}

function GenericPreview(props: Readonly<{ item: RegistryDocItem }>) {
  return (
    <div class="grid max-w-md justify-items-center gap-3 text-center">
      <span class="inline-flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-primary">
        {props.item.title.slice(0, 1)}
      </span>
      <div>
        <h3 class="m-0 font-semibold text-base text-foreground">{props.item.title}</h3>
        <p class="mt-1 text-muted-foreground text-sm leading-6">{props.item.description}</p>
      </div>
    </div>
  );
}
