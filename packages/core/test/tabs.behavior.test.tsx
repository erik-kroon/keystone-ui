import { For, createRoot, createSignal } from "solid-js";
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

  test("measures the active trigger for indicator CSS variables", async () => {
    render(() => (
      <Tabs.Root defaultValue="alpha">
        <Tabs.List>
          <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
          <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
        <Tabs.Content value="beta">Beta panel</Tabs.Content>
      </Tabs.Root>
    ));

    const list = getList();
    const triggers = getTriggers();
    const indicator = document.body.querySelector<HTMLElement>(
      '[data-scope="tabs"][data-part="indicator"]',
    );
    if (!indicator) throw new Error("Unable to find tabs indicator");

    setRect(list, { height: 40, left: 10, top: 20, width: 240 });
    setRect(triggers[1], { height: 32, left: 90, top: 24, width: 72 });

    click(triggers[1]);
    await settled();

    expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-x")).toBe("80px");
    expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-y")).toBe("4px");
    expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-width")).toBe("72px");
    expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-height")).toBe("32px");
    expect(indicator.style.getPropertyValue("--active-tab-left")).toBe("80px");
    expect(indicator.style.getPropertyValue("--active-tab-top")).toBe("4px");
    expect(indicator.style.getPropertyValue("--active-tab-width")).toBe("72px");
    expect(indicator.style.getPropertyValue("--active-tab-height")).toBe("32px");
    expect(indicator.style.getPropertyValue("--active-tab-bottom")).toBe("-4px");
    expect(indicator.getAttribute("data-state")).toBe("measured");
  });

  test("measures the default active trigger before the first settled turn", () => {
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
      const element = this as HTMLElement;

      if (element.getAttribute("data-part") === "list") {
        return domRect({ height: 40, left: 10, top: 20, width: 240 });
      }

      if (element.textContent === "Alpha") {
        return domRect({ height: 32, left: 18, top: 24, width: 64 });
      }

      return originalGetBoundingClientRect.call(this);
    };

    try {
      render(() => (
        <Tabs.Root defaultValue="alpha">
          <Tabs.List>
            <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
            <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="alpha">Alpha panel</Tabs.Content>
          <Tabs.Content value="beta">Beta panel</Tabs.Content>
        </Tabs.Root>
      ));

      const indicator = document.body.querySelector<HTMLElement>(
        '[data-scope="tabs"][data-part="indicator"]',
      );
      if (!indicator) throw new Error("Unable to find tabs indicator");

      expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-x")).toBe("8px");
      expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-y")).toBe("4px");
      expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-width")).toBe("64px");
      expect(indicator.style.getPropertyValue("--keystone-tabs-indicator-height")).toBe("32px");
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    }
  });

  test("moves selection and focus when the active trigger is removed", async () => {
    const [items, setItems] = createSignal([
      { label: "One", value: "one" },
      { label: "Two", value: "two" },
      { label: "Three", value: "three" },
    ]);
    const changes: Array<{ reason: string; value: string }> = [];

    render(() => (
      <Tabs.Root
        defaultValue="two"
        onValueChange={(value, detail) => changes.push({ reason: detail.reason, value })}
      >
        <Tabs.List>
          <For each={items()}>
            {(item) => <Tabs.Trigger value={item.value}>{item.label}</Tabs.Trigger>}
          </For>
        </Tabs.List>
        <For each={items()}>
          {(item) => <Tabs.Content value={item.value}>{item.label} panel</Tabs.Content>}
        </For>
      </Tabs.Root>
    ));

    getTriggers()[1].focus();
    setItems((current) => current.filter((item) => item.value !== "two"));
    await settled();

    const triggers = getTriggers();
    expect(document.activeElement).toBe(triggers[1]);
    expect(triggers[1].getAttribute("aria-selected")).toBe("true");
    expect(getPanel("three").textContent).toBe("Three panel");
    expect(changes).toContainEqual({ reason: "dynamic-removal", value: "three" });
  });

  test("omits panel tabIndex when the active panel has focusable content", async () => {
    render(() => (
      <Tabs.Root defaultValue="plain">
        <Tabs.List>
          <Tabs.Trigger value="plain">Plain</Tabs.Trigger>
          <Tabs.Trigger value="interactive">Interactive</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="plain">Plain panel</Tabs.Content>
        <Tabs.Content value="interactive">
          Interactive panel
          <button type="button">Focusable action</button>
        </Tabs.Content>
      </Tabs.Root>
    ));

    expect(getPanel("plain").getAttribute("tabindex")).toBe("0");

    click(getTriggers()[1]);
    await settled();

    expect(getPanel("interactive").hasAttribute("tabindex")).toBe(false);
  });
});

function setRect(element: HTMLElement, rect: Pick<DOMRect, "height" | "left" | "top" | "width">) {
  element.getBoundingClientRect = () => domRect(rect);
}

function domRect(rect: Pick<DOMRect, "height" | "left" | "top" | "width">) {
  return {
    bottom: rect.top + rect.height,
    height: rect.height,
    left: rect.left,
    right: rect.left + rect.width,
    top: rect.top,
    width: rect.width,
    x: rect.left,
    y: rect.top,
    toJSON: () => ({}),
  } as DOMRect;
}

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
