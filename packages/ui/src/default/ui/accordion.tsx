import {
  Accordion as CoreAccordion,
  type AccordionContentProps as CoreAccordionContentProps,
  type AccordionHeaderProps as CoreAccordionHeaderProps,
  type AccordionItemProps as CoreAccordionItemProps,
  type AccordionRootProps as CoreAccordionRootProps,
  type AccordionTriggerProps as CoreAccordionTriggerProps,
} from "@keystone-ui/core/accordion";
import { ChevronDown } from "lucide-solid";
import { Show, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type AccordionProps = CoreAccordionRootProps;
export type AccordionItemProps = CoreAccordionItemProps;
export type AccordionHeaderProps = CoreAccordionHeaderProps;
export type AccordionTriggerProps = CoreAccordionTriggerProps & {
  indicator?: JSX.Element;
};
export type AccordionContentProps = CoreAccordionContentProps;

export function Accordion(props: AccordionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreAccordion.Root {...rest} data-slot="accordion" class={cn("ui-accordion", local.class)} />
  );
}

export function AccordionItem(props: AccordionItemProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreAccordion.Item
      {...rest}
      data-slot="accordion-item"
      class={cn("ui-accordion-item border-b last:border-b-0", local.class)}
    />
  );
}

export function AccordionHeader(props: AccordionHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreAccordion.Header {...rest} class={cn("ui-accordion-header flex", local.class)} />;
}

export function AccordionTrigger(props: AccordionTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <AccordionHeader>
      <CoreAccordion.Trigger
        {...rest}
        data-slot="accordion-trigger"
        class={cn(
          "ui-accordion-trigger flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64 data-panel-open:*:data-[slot=accordion-indicator]:rotate-180",
          local.class,
        )}
      >
        <span data-scope="ui-accordion" data-part="trigger-label">
          {local.children}
        </span>
        <Show
          fallback={
            <ChevronDown
              class="ui-accordion-indicator pointer-events-none size-4 shrink-0 translate-y-0.5 opacity-80 transition-transform duration-200 ease-in-out"
              data-scope="ui-accordion"
              data-part="indicator"
              data-slot="accordion-indicator"
            />
          }
          when={local.indicator}
        >
          {(indicator) => (
            <span
              class="ui-accordion-indicator pointer-events-none size-4 shrink-0 translate-y-0.5 opacity-80 transition-transform duration-200 ease-in-out"
              data-scope="ui-accordion"
              data-part="indicator"
              data-slot="accordion-indicator"
            >
              {indicator()}
            </span>
          )}
        </Show>
      </CoreAccordion.Trigger>
    </AccordionHeader>
  );
}

export function AccordionPanel(props: AccordionContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreAccordion.Content
      {...rest}
      data-slot="accordion-panel"
      class="ui-accordion-panel h-(--accordion-panel-height) overflow-hidden text-muted-foreground text-sm transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0"
    >
      <div data-scope="ui-accordion" data-part="content-inner" class={cn("pt-0 pb-4", local.class)}>
        {local.children}
      </div>
    </CoreAccordion.Content>
  );
}

export { AccordionPanel as AccordionContent };
