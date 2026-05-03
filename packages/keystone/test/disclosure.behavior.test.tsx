import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Accordion } from "../src/accordion/index";
import { Collapsible, createCollapsible } from "../src/collapsible/index";
import { click, getByPart, keyDown, queryByPart, render, settled } from "./harness";

describe("Collapsible behavior", () => {
  test("toggles open state and exposes the core ARIA and part contract", async () => {
    const changes: string[] = [];

    render(() => (
      <Collapsible.Root onOpenChange={(_open, detail) => changes.push(detail.reason)}>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Content>Expandable content</Collapsible.Content>
      </Collapsible.Root>
    ));

    const trigger = getByPart("collapsible", "trigger");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(queryByPart("collapsible", "content")).toBeNull();

    click(trigger);
    await settled();

    const content = getByPart("collapsible", "content");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
    expect(content.getAttribute("data-state")).toBe("open");
    expect(changes).toEqual(["trigger"]);
  });

  test("supports controlled state and respects prevented user events", () => {
    createRoot((dispose) => {
      const [open, setOpen] = createSignal(false);
      const changes: boolean[] = [];
      const collapsible = createCollapsible({
        open,
        onOpenChange: (nextOpen) => changes.push(nextOpen),
      });
      const prevented = collapsible.getTriggerProps({
        onClick: (event) => event.preventDefault(),
      });
      const trigger = collapsible.getTriggerProps({});

      (prevented.onClick as (event: MouseEvent) => void)(
        new MouseEvent("click", { cancelable: true }),
      );
      expect(changes).toEqual([]);
      expect(collapsible.open()).toBe(false);

      (trigger.onClick as (event: MouseEvent) => void)(
        new MouseEvent("click", { cancelable: true }),
      );
      expect(changes).toEqual([true]);
      expect(collapsible.open()).toBe(false);

      setOpen(true);
      expect(collapsible.open()).toBe(true);
      dispose();
    });
  });
});

describe("Accordion behavior", () => {
  test("coordinates single-item disclosure state and ARIA relationships", async () => {
    const values: string[][] = [];

    render(() => (
      <Accordion.Root onValueChange={(value) => values.push(value)}>
        <Accordion.Item value="account">
          <Accordion.Header>
            <Accordion.Trigger>Account</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Account settings</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="billing">
          <Accordion.Header>
            <Accordion.Trigger>Billing</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Billing settings</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    ));

    const triggers = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '[data-scope="accordion"][data-part="trigger"]',
      ),
    );

    click(triggers[0]);
    await settled();
    expect(values).toEqual([["account"]]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(getByPart("accordion", "content").getAttribute("aria-labelledby")).toBe(triggers[0].id);

    click(triggers[1]);
    await settled();
    expect(values).toEqual([["account"], ["billing"]]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  test("supports multiple open items and trigger keyboard navigation", async () => {
    render(() => (
      <Accordion.Root multiple defaultValue={["first"]}>
        <Accordion.Item value="first">
          <Accordion.Header>
            <Accordion.Trigger>First</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>First content</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="second" disabled>
          <Accordion.Header>
            <Accordion.Trigger>Second</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Second content</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="third">
          <Accordion.Header>
            <Accordion.Trigger>Third</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Third content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    ));

    const triggers = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '[data-scope="accordion"][data-part="trigger"]',
      ),
    );

    triggers[0].focus();
    keyDown(triggers[0], "ArrowDown");
    expect(document.activeElement).toBe(triggers[2]);

    click(triggers[2]);
    await settled();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[2].getAttribute("aria-expanded")).toBe("true");
  });
});
