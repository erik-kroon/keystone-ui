import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Component() {
  return (
    <Accordion defaultValue={["item-2"]} class="w-full">
      <AccordionItem value="item-1" disabled>
        <AccordionTrigger>Unavailable item</AccordionTrigger>
        <AccordionContent>
          Disabled items keep focus order and ignore activation until enabled.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Available item</AccordionTrigger>
        <AccordionContent>This item remains interactive.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
