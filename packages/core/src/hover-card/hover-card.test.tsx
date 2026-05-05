import { afterEach, describe, expect, test, vi } from "vitest";
import { HoverCard } from "./index";
import { getByPart, pointerDown, queryByPart, render, settled } from "../../test/harness";

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

function focusIn(element: HTMLElement) {
  element.dispatchEvent(new FocusEvent("focus", { bubbles: true, cancelable: true }));
}

function blur(element: HTMLElement) {
  element.dispatchEvent(new FocusEvent("blur", { bubbles: true, cancelable: true }));
}

function keyDown(element: HTMLElement, key: string) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key }));
}

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("hover card contract", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("opens from pointer after delay with preview-only accessibility semantics", async () => {
    vi.useFakeTimers();
    const changes: string[] = [];

    render(() => (
      <HoverCard.Root
        closeDelay={50}
        openDelay={100}
        onOpenChange={(open, detail) => changes.push(`${open}:${detail.reason}`)}
      >
        <HoverCard.Trigger href="/teams">Team</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Positioner>
            <HoverCard.Content>Team preview</HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.Portal>
      </HoverCard.Root>
    ));

    const trigger = getByPart("hover-card", "trigger");
    expect(trigger.tagName).toBe("A");
    expect(trigger.getAttribute("type")).toBeNull();
    expect(trigger.getAttribute("aria-describedby")).toBeNull();

    pointerEnter(trigger);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).toBeNull();

    await vi.advanceTimersByTimeAsync(100);
    await flushMicrotasks();

    const content = getByPart("hover-card", "content");
    expect(content.getAttribute("aria-hidden")).toBe("true");
    expect(content.getAttribute("role")).toBeNull();
    expect(content.getAttribute("tabindex")).toBe("-1");
    expect(content.getAttribute("data-state")).toBe("open");

    pointerLeave(trigger);
    await vi.advanceTimersByTimeAsync(49);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).not.toBeNull();

    await vi.advanceTimersByTimeAsync(1);
    await vi.advanceTimersByTimeAsync(20);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).toBeNull();
    expect(changes).toEqual(["true:pointer", "false:pointer"]);
  });

  test("opens from focus and closes from Escape", async () => {
    vi.useFakeTimers();
    const changes: string[] = [];

    render(() => (
      <>
        <HoverCard.Root openDelay={0} onOpenChange={(_, detail) => changes.push(detail.reason)}>
          <HoverCard.Trigger href="/teams">Team</HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Positioner>
              <HoverCard.Content>Team preview</HoverCard.Content>
            </HoverCard.Positioner>
          </HoverCard.Portal>
        </HoverCard.Root>
      </>
    ));

    const trigger = getByPart("hover-card", "trigger");
    focusIn(trigger);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).not.toBeNull();

    keyDown(trigger, "Escape");
    await vi.advanceTimersByTimeAsync(20);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).toBeNull();

    expect(queryByPart("hover-card", "content")).toBeNull();
    expect(changes).toEqual(["focus", "escape"]);
  });

  test("dismisses from outside interaction", async () => {
    const changes: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <HoverCard.Root openDelay={0} onOpenChange={(_, detail) => changes.push(detail.reason)}>
          <HoverCard.Trigger href="/teams">Team</HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Positioner>
              <HoverCard.Content>Team preview</HoverCard.Content>
            </HoverCard.Positioner>
          </HoverCard.Portal>
        </HoverCard.Root>
      </>
    ));

    pointerEnter(getByPart("hover-card", "trigger"));
    await settled();
    expect(queryByPart("hover-card", "content")).not.toBeNull();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();

    expect(queryByPart("hover-card", "content")).toBeNull();
    expect(changes).toEqual(["pointer", "outside"]);
  });

  test("supports controlled state, force-mounted portals, and floating part metadata", async () => {
    vi.useFakeTimers();
    const changes: string[] = [];
    const mount = document.createElement("div");
    document.body.append(mount);

    render(() => (
      <HoverCard.Root
        open={false}
        openDelay={0}
        placement="bottom-start"
        onOpenChange={(open, detail) => changes.push(`${open}:${detail.reason}`)}
      >
        <HoverCard.Trigger href="/teams">Team</HoverCard.Trigger>
        <HoverCard.Portal forceMount mount={mount}>
          <HoverCard.Positioner>
            <HoverCard.Arrow class="arrow" />
            <HoverCard.Content>Team preview</HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.Portal>
      </HoverCard.Root>
    ));

    const trigger = getByPart("hover-card", "trigger");
    const positioner = getByPart("hover-card", "positioner", mount);
    const content = getByPart("hover-card", "content", mount);
    const arrow = getByPart("hover-card", "arrow", mount);

    trigger.getBoundingClientRect = () =>
      ({ bottom: 50, height: 30, left: 20, right: 140, top: 20, width: 120 }) as DOMRect;
    positioner.getBoundingClientRect = () =>
      ({ bottom: 0, height: 80, left: 0, right: 0, top: 0, width: 200 }) as DOMRect;
    arrow.getBoundingClientRect = () =>
      ({ bottom: 0, height: 10, left: 0, right: 0, top: 0, width: 10 }) as DOMRect;

    pointerEnter(trigger);
    await flushMicrotasks();

    expect(content.hidden).toBe(true);
    expect(content.getAttribute("data-state")).toBe("closed");
    expect(positioner.getAttribute("data-side")).toBe("bottom");
    expect(positioner.getAttribute("data-align")).toBe("start");
    expect(arrow.getAttribute("aria-hidden")).toBe("true");
    expect(arrow.className).toBe("arrow");
    expect(changes).toEqual(["true:pointer"]);
  });

  test("keeps hoverable content open while pointer moves through the grace area", async () => {
    vi.useFakeTimers();

    render(() => (
      <HoverCard.Root openDelay={0} pointerGraceArea={20}>
        <HoverCard.Trigger href="/teams">Team</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Positioner>
            <HoverCard.Content>Team preview</HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.Portal>
      </HoverCard.Root>
    ));

    const trigger = getByPart("hover-card", "trigger");
    trigger.getBoundingClientRect = () =>
      ({ bottom: 20, height: 20, left: 0, right: 100, top: 0, width: 100 }) as DOMRect;

    pointerEnter(trigger, { clientX: 50, clientY: 10 });
    await flushMicrotasks();

    const content = getByPart("hover-card", "content");
    content.getBoundingClientRect = () =>
      ({ bottom: 90, height: 60, left: 0, right: 120, top: 30, width: 120 }) as DOMRect;

    pointerLeave(trigger, { clientX: 50, clientY: 20 });
    pointerMove({ clientX: 52, clientY: 45 });
    await vi.advanceTimersByTimeAsync(20);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).not.toBeNull();

    pointerEnter(content, { clientX: 52, clientY: 45 });
    await flushMicrotasks();
    pointerLeave(content, { clientX: 160, clientY: 120 });
    await vi.advanceTimersByTimeAsync(20);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).toBeNull();
  });

  test("does not open from touch pointer hover emulation", async () => {
    vi.useFakeTimers();

    render(() => (
      <HoverCard.Root openDelay={0}>
        <HoverCard.Trigger href="/teams">Team</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Positioner>
            <HoverCard.Content>Team preview</HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.Portal>
      </HoverCard.Root>
    ));

    pointerEnter(getByPart("hover-card", "trigger"), { pointerType: "touch" });
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).toBeNull();

    focusIn(getByPart("hover-card", "trigger"));
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).not.toBeNull();

    blur(getByPart("hover-card", "trigger"));
    await vi.advanceTimersByTimeAsync(20);
    await flushMicrotasks();
    expect(queryByPart("hover-card", "content")).toBeNull();
  });
});
