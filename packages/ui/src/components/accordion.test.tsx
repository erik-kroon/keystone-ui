import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

describe("Accordion", () => {
  test("renders Keystone-backed anatomy with stable styling hooks", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <Accordion defaultValue={["billing"]} class="custom-accordion">
          <AccordionItem value="billing" class="custom-item">
            <AccordionTrigger indicator={<span data-testid="custom-indicator">Open</span>}>
              Billing
            </AccordionTrigger>
            <AccordionContent class="custom-content">Billing content</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
      host,
    );

    const root = host.querySelector<HTMLElement>("[data-slot='accordion']");
    const item = host.querySelector<HTMLElement>("[data-slot='accordion-item']");
    const header = host.querySelector<HTMLElement>("[data-part='header']");
    const trigger = host.querySelector<HTMLButtonElement>("[data-slot='accordion-trigger']");
    const panel = host.querySelector<HTMLElement>("[data-slot='accordion-panel']");
    const inner = host.querySelector<HTMLElement>("[data-part='content-inner']");
    const indicator = host.querySelector<HTMLElement>("[data-slot='accordion-indicator']");

    expect(root?.getAttribute("data-scope")).toBe("accordion");
    expect(root?.getAttribute("data-part")).toBe("root");
    expect(root?.className).toContain("ui-accordion");
    expect(root?.className).toContain("custom-accordion");
    expect(item?.getAttribute("data-state")).toBe("open");
    expect(item?.className).toContain("ui-accordion-item");
    expect(item?.className).toContain("custom-item");
    expect(header?.tagName).toBe("H3");
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(trigger?.hasAttribute("data-panel-open")).toBe(true);
    expect(panel?.getAttribute("role")).toBe("region");
    expect(panel?.getAttribute("aria-labelledby")).toBe(trigger?.id);
    expect(panel?.className).toContain("ui-accordion-panel");
    expect(panel?.className).toContain("h-(--accordion-panel-height)");
    expect(inner?.className).toContain("custom-content");
    expect(indicator?.textContent).toBe("Open");

    dispose();
  });

  test("keeps Core keyboard navigation available through styled triggers", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <Accordion>
          <AccordionItem value="alpha">
            <AccordionTrigger>Alpha</AccordionTrigger>
            <AccordionContent>Alpha content</AccordionContent>
          </AccordionItem>
          <AccordionItem value="beta">
            <AccordionTrigger>Beta</AccordionTrigger>
            <AccordionContent>Beta content</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
      host,
    );

    const triggers = host.querySelectorAll<HTMLButtonElement>("[data-slot='accordion-trigger']");
    triggers[0]?.focus();
    triggers[0]?.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "ArrowDown" }),
    );

    expect(document.activeElement).toBe(triggers[1]);

    dispose();
    host.remove();
  });
});
