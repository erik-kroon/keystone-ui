import {
  Accordion as CoreAccordion,
  type AccordionContentProps as CoreAccordionContentProps,
  type AccordionHeaderProps as CoreAccordionHeaderProps,
  type AccordionItemProps as CoreAccordionItemProps,
  type AccordionRootProps as CoreAccordionRootProps,
  type AccordionTriggerProps as CoreAccordionTriggerProps,
} from "@keystone-ui/core/accordion";
import { splitProps, type JSX } from "solid-js";
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

  return <CoreAccordion.Root {...rest} class={cn("ui-accordion", local.class)} />;
}

export function AccordionItem(props: AccordionItemProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreAccordion.Item {...rest} class={cn("ui-accordion-item", local.class)} />;
}

export function AccordionHeader(props: AccordionHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreAccordion.Header {...rest} class={cn("ui-accordion-header", local.class)} />;
}

export function AccordionTrigger(props: AccordionTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <AccordionHeader>
      <CoreAccordion.Trigger {...rest} class={cn("ui-accordion-trigger", local.class)}>
        <span data-scope="ui-accordion" data-part="trigger-label">
          {local.children}
        </span>
        <span class="ui-accordion-indicator" data-scope="ui-accordion" data-part="indicator">
          {local.indicator ?? "v"}
        </span>
      </CoreAccordion.Trigger>
    </AccordionHeader>
  );
}

export function AccordionContent(props: AccordionContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreAccordion.Content {...rest} class={cn("ui-accordion-content", local.class)}>
      <div data-scope="ui-accordion" data-part="content-inner">
        {local.children}
      </div>
    </CoreAccordion.Content>
  );
}
