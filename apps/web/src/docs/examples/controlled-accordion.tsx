import { createSignal } from "solid-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function Component() {
  const [value, setValue] = createSignal<string[]>([]);
  const items = [
    {
      content:
        "Keystone UI is a source-owned Solid component system for design systems and web apps.",
      id: "item-1",
      title: "What is Keystone UI?",
    },
    {
      content:
        "Install components with the shadcn CLI, then own the generated source in your application.",
      id: "item-2",
      title: "How do I get started?",
    },
    {
      content: "Yes. Components are copy-paste source backed by Keystone Core.",
      id: "item-3",
      title: "Can I use it for my project?",
    },
  ];

  return (
    <div class="flex w-full flex-col gap-4">
      <Accordion value={value()} class="w-full" onValueChange={setValue}>
        {items.map((item) => (
          <AccordionItem value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div class="flex flex-col items-start gap-4">
        <Button onClick={() => setValue(["item-1", "item-2"])} type="button" variant="outline">
          Open first two
        </Button>
        <p class="m-0 text-muted-foreground text-sm">
          Open items: {value().length > 0 ? value().join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}
