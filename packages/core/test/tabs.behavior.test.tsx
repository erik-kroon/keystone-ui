import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Tabs, createTabs } from "../src/tabs/index";
import { click, keyDown, render, settled } from "./harness";

describe("Tabs behavior", () => {
  test("exposes the tablist, trigger, and panel ARIA contract", async () => {
    const values: string[] = [];

    render(() => (
      <Tabs.Root defaultValue="overview" onValueChange={(value) => values.push(value)}>
        <Tabs.List aria-label="Project sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="overview">Overview panel</Tabs.Content>
        <Tabs.Content value="activity">Activity panel</Tabs.Content>
      </Tabs.Root>
    ));

    const triggers = getTriggers();
    const panel = getPanel("overview");

    expect(getList().getAttribute("role")).toBe("tablist");
    expect(triggers[0].getAttribute("role")).toBe("tab");
    expect(triggers[0].getAttribute("aria-selected")).toBe("true");
    expect(triggers[0].getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("role")).toBe("tabpanel");
    expect(panel.getAttribute("aria-labelledby")).toBe(triggers[0].id);

    click(triggers[1]);
    await settled();

    expect(values).toEqual(["activity"]);
    expect(triggers[0].getAttribute("aria-selected")).toBe("false");
    expect(triggers[1].getAttribute("aria-selected")).toBe("true");
    expect(getPanel("activity").textContent).toBe("Activity panel");
  });

  test("roves focus across enabled triggers and supports manual activation", async () => {
    const values: string[] = [];

    render(() => (
      <Tabs.Root
        activationMode="manual"
        defaultValue="one"
        onValueChange={(value) => values.push(value)}
      >
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled>
            Two
          </Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">One panel</Tabs.Content>
        <Tabs.Content value="two">Two panel</Tabs.Content>
        <Tabs.Content value="three">Three panel</Tabs.Content>
      </Tabs.Root>
    ));

    const triggers = getTriggers();

    triggers[0].focus();
    keyDown(triggers[0], "ArrowRight");
    expect(document.activeElement).toBe(triggers[2]);
    expect(triggers[0].getAttribute("aria-selected")).toBe("true");

    keyDown(triggers[2], "Enter");
    await settled();

    expect(values).toEqual(["three"]);
    expect(triggers[2].getAttribute("aria-selected")).toBe("true");
  });

  test("uses RTL-aware horizontal arrow navigation", () => {
    render(() => (
      <Tabs.Root defaultValue="one" dir="rtl">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">One panel</Tabs.Content>
        <Tabs.Content value="two">Two panel</Tabs.Content>
        <Tabs.Content value="three">Three panel</Tabs.Content>
      </Tabs.Root>
    ));

    const triggers = getTriggers();

    triggers[0].focus();
    keyDown(triggers[0], "ArrowLeft");
    expect(document.activeElement).toBe(triggers[1]);

    keyDown(triggers[1], "ArrowRight");
    expect(document.activeElement).toBe(triggers[0]);
  });

  test("supports controlled state and respects prevented user events", () => {
    createRoot((dispose) => {
      const [value, setValue] = createSignal("alpha");
      const changes: string[] = [];
      const tabs = createTabs({
        value,
        onValueChange: (nextValue) => changes.push(nextValue),
      });

      tabs.selectValue("beta", { reason: "trigger" });
      expect(changes).toEqual(["beta"]);
      expect(tabs.selectedValue()).toBe("alpha");

      setValue("beta");
      expect(tabs.selectedValue()).toBe("beta");
      dispose();
    });

    render(() => (
      <Tabs.Root defaultValue="alpha">
        <Tabs.List>
          <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
          <Tabs.Trigger value="beta" onClick={(event) => event.preventDefault()}>
            Beta
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
        <Tabs.Content value="beta">Beta panel</Tabs.Content>
      </Tabs.Root>
    ));

    const triggers = getTriggers();
    click(triggers[1]);

    expect(triggers[0].getAttribute("aria-selected")).toBe("true");
    expect(triggers[1].getAttribute("aria-selected")).toBe("false");
  });
});

function getList() {
  const list = document.body.querySelector<HTMLElement>('[data-scope="tabs"][data-part="list"]');
  if (!list) throw new Error("Unable to find tabs list");
  return list;
}

function getTriggers() {
  return Array.from(
    document.body.querySelectorAll<HTMLButtonElement>('[data-scope="tabs"][data-part="trigger"]'),
  );
}

function getPanel(value: string) {
  const panels = Array.from(
    document.body.querySelectorAll<HTMLElement>('[data-scope="tabs"][data-part="content"]'),
  );
  const panel = panels.find((candidate) => candidate.textContent?.toLowerCase().includes(value));
  if (!panel) throw new Error(`Unable to find ${value} tab panel`);
  return panel;
}
