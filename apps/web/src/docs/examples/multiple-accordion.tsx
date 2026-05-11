import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Component() {
  const items = [
    {
      content:
        "Keystone UI is a source-owned Solid component system for design systems and web apps.",
      id: "item-1",
      title: "What is Keystone UI?",
    },
    {
      content:
        "Keystone is not released yet. The registry and install flow are still being shaped in this repo.",
      id: "item-2",
      title: "How do I get started?",
    },
    {
      content:
        "Not yet. Keystone is early and the component source is still changing before a public release.",
      id: "item-3",
      title: "Can I use it for my project?",
    },
  ];

  return (
    <Accordion defaultValue={["item-1", "item-2"]} class="w-full" multiple>
      {items.map((item) => (
        <AccordionItem value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
