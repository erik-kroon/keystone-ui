import { afterEach, describe, expect, test, vi } from "vitest";
import { Tooltip } from "./index";
import { getByPart, queryByPart, render, settled } from "../../test/harness";

function pointerEnter(element: HTMLElement, init: PointerEventInit = {}) {
  element.dispatchEvent(
    new PointerEvent("pointerenter", {
      bubbles: true,
      cancelable: true,
      pointerType: "mouse",
      ...init,
    }),
  );
}

function pointerLeave(element: HTMLElement, init: PointerEventInit = {}) {
  element.dispatchEvent(
    new PointerEvent("pointerleave", {
      bubbles: true,
      cancelable: true,
      pointerType: "mouse",
      ...init,
    }),
  );
}

function pointerMove(init: PointerEventInit = {}) {
  document.dispatchEvent(
    new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      pointerType: "mouse",
      ...init,
    }),
  );
}

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("tooltip interaction policy", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("uses provider open delay and skips it after a recent close", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    render(() => (
      <Tooltip.Provider delayDuration={100} hoverableContent={false} skipDelayDuration={500}>
        <Tooltip.Root>
          <Tooltip.Trigger>More info</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Content>Helpful details</Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    ));

    const trigger = getByPart("tooltip", "trigger");

    pointerEnter(trigger);
    await flushMicrotasks();
    expect(queryByPart("tooltip", "content")).toBeNull();

    await vi.advanceTimersByTimeAsync(100);
    await flushMicrotasks();
    expect(queryByPart("tooltip", "content")).not.toBeNull();

    pointerLeave(trigger);
    await vi.advanceTimersByTimeAsync(20);
    await flushMicrotasks();
    expect(queryByPart("tooltip", "content")?.getAttribute("data-state") ?? "closed").toBe(
      "closed",
    );

    pointerEnter(trigger);
    await flushMicrotasks();
    expect(getByPart("tooltip", "content").getAttribute("data-state")).toBe("open");
  });

  test("keeps hoverable content open while pointer travels through the grace polygon", async () => {
    vi.useFakeTimers();

    render(() => (
      <Tooltip.Root delayDuration={0} pointerGraceArea={20}>
        <Tooltip.Trigger>More info</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Content>Helpful details</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    ));

    const trigger = getByPart("tooltip", "trigger");
    trigger.getBoundingClientRect = () =>
      ({ bottom: 20, height: 20, left: 0, right: 100, top: 0, width: 100 }) as DOMRect;

    pointerEnter(trigger, { clientX: 50, clientY: 10 });
    await flushMicrotasks();

    const content = getByPart("tooltip", "content");
    content.getBoundingClientRect = () =>
      ({ bottom: 90, height: 60, left: 0, right: 120, top: 30, width: 120 }) as DOMRect;

    pointerLeave(trigger, { clientX: 50, clientY: 20 });
    pointerMove({ clientX: 52, clientY: 45 });
    await flushMicrotasks();
    expect(queryByPart("tooltip", "content")).not.toBeNull();

    pointerEnter(content, { clientX: 52, clientY: 45 });
    await flushMicrotasks();
    expect(queryByPart("tooltip", "content")).not.toBeNull();

    pointerLeave(content, { clientX: 160, clientY: 120 });
    await vi.advanceTimersByTimeAsync(20);
    await flushMicrotasks();
    expect(queryByPart("tooltip", "content")).toBeNull();
  });

  test("closes from Escape on the trigger", async () => {
    render(() => (
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>More info</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Content>Helpful details</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    ));

    const trigger = getByPart("tooltip", "trigger");
    pointerEnter(trigger);
    await settled();
    expect(queryByPart("tooltip", "content")).not.toBeNull();

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Escape" }),
    );
    await settled();
    expect(queryByPart("tooltip", "content")).toBeNull();
  });
});
