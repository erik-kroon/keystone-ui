import {
  Accordion as KeystoneAccordion,
  type AccordionContentProps as KeystoneAccordionContentProps,
  type AccordionHeaderProps as KeystoneAccordionHeaderProps,
  type AccordionItemProps as KeystoneAccordionItemProps,
  type AccordionRootProps as KeystoneAccordionRootProps,
  type AccordionTriggerProps as KeystoneAccordionTriggerProps,
} from "@keystone-ui/keystone/accordion";
import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type AccordionProps = KeystoneAccordionRootProps;
export type AccordionItemProps = KeystoneAccordionItemProps;
export type AccordionHeaderProps = KeystoneAccordionHeaderProps;
export type AccordionTriggerProps = KeystoneAccordionTriggerProps & {
  indicator?: JSX.Element;
};
export type AccordionContentProps = KeystoneAccordionContentProps;

export function Accordion(props: AccordionProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneAccordion.Root {...rest} class={cn("mason-accordion", local.class)} />;
}

export function AccordionItem(props: AccordionItemProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneAccordion.Item {...rest} class={cn("mason-accordion-item", local.class)} />;
}

export function AccordionHeader(props: AccordionHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneAccordion.Header {...rest} class={cn("mason-accordion-header", local.class)} />;
}

export function AccordionTrigger(props: AccordionTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class", "indicator"]);

  return (
    <AccordionHeader>
      <KeystoneAccordion.Trigger {...rest} class={cn("mason-accordion-trigger", local.class)}>
        <span data-scope="mason-accordion" data-part="trigger-label">
          {local.children}
        </span>
        <span class="mason-accordion-indicator" data-scope="mason-accordion" data-part="indicator">
          {local.indicator ?? "v"}
        </span>
      </KeystoneAccordion.Trigger>
    </AccordionHeader>
  );
}

export function AccordionContent(props: AccordionContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <KeystoneAccordion.Content {...rest} class={cn("mason-accordion-content", local.class)}>
      <div data-scope="mason-accordion" data-part="content-inner">
        {local.children}
      </div>
    </KeystoneAccordion.Content>
  );
}
