import { describe, expect, test } from "vitest";
import { Popover } from "../src/popover/index";
import { Sheet } from "../src/sheet/index";
import { Tooltip } from "../src/tooltip/index";
import { click, getByPart, keyDown, pointerDown, queryByPart, render, settled } from "./harness";

function pointerEnter(element: HTMLElement) {
  element.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, cancelable: true }));
}

function pointerLeave(element: HTMLElement) {
  element.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true, cancelable: true }));
}

function focusIn(element: HTMLElement) {
  element.dispatchEvent(new FocusEvent("focus", { bubbles: true, cancelable: true }));
}

describe("Popover, Tooltip, and Sheet overlay vertical", () => {
  test("popover opens from trigger, exposes floating geometry, and dismisses outside", async () => {
    const changes: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Popover.Root
          placement="bottom-start"
          onOpenChange={(_open, detail) => changes.push(detail.reason)}
        >
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Content>Popover content</Popover.Content>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </>
    ));

    const trigger = getByPart("popover", "trigger");
    click(trigger);
    await settled();

    const positioner = getByPart("popover", "positioner");
    trigger.getBoundingClientRect = () =>
      ({ bottom: 48, height: 32, left: 12, right: 132, top: 16, width: 120 }) as DOMRect;
    positioner.getBoundingClientRect = () =>
      ({ bottom: 0, height: 64, left: 0, right: 0, top: 0, width: 180 }) as DOMRect;
    window.dispatchEvent(new Event("resize"));
    await settled();
    await settled();

    expect(positioner.getAttribute("data-side")).toBe("bottom");
    expect(positioner.style.getPropertyValue("--keystone-anchor-width")).toBe("120px");

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();

    expect(queryByPart("popover", "content")).toBeNull();
    expect(changes).toEqual(["trigger", "outside"]);
  });

  test("tooltip opens on pointer and focus, wires aria-describedby, and closes on Escape", async () => {
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
    expect(getByPart("tooltip", "content").getAttribute("role")).toBe("tooltip");
    expect(trigger.getAttribute("aria-describedby")).toBe(getByPart("tooltip", "content").id);

    pointerLeave(trigger);
    await settled();
    expect(queryByPart("tooltip", "content")).toBeNull();

    focusIn(trigger);
    await settled();
    expect(queryByPart("tooltip", "content")).not.toBeNull();

    keyDown(getByPart("tooltip", "content"), "Escape");
    await settled();
    expect(queryByPart("tooltip", "content")).toBeNull();
  });

  test("sheet uses modal overlay behavior and side data", async () => {
    render(() => (
      <Sheet.Root side="left">
        <Sheet.Trigger>Open sheet</Sheet.Trigger>
        <Sheet.Portal>
          <Sheet.Backdrop />
          <Sheet.Positioner>
            <Sheet.Content>
              <Sheet.Title>Filters</Sheet.Title>
              <Sheet.Description>Choose visible filters.</Sheet.Description>
              <button data-testid="field">Focusable</button>
              <Sheet.Close>Close</Sheet.Close>
            </Sheet.Content>
          </Sheet.Positioner>
        </Sheet.Portal>
      </Sheet.Root>
    ));

    const trigger = getByPart("sheet", "trigger");
    trigger.focus();
    click(trigger);
    await settled();

    const content = getByPart("sheet", "content");
    const title = getByPart("sheet", "title");
    const description = getByPart("sheet", "description");
    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-labelledby")).toBe(title.id);
    expect(content.getAttribute("aria-describedby")).toBe(description.id);
    expect(content.getAttribute("data-side")).toBe("left");
    expect(document.activeElement).toBe(document.querySelector("[data-testid='field']"));
    expect(document.body.style.pointerEvents).toBe("none");

    keyDown(content, "Escape");
    await settled();

    expect(queryByPart("sheet", "content")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.pointerEvents).toBe("");
  });

  test("sheet inherits preventable modal content dismissal", async () => {
    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Sheet.Root>
          <Sheet.Trigger>Open sheet</Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Content
              onEscapeKeyDown={(event) => event.preventDefault()}
              onInteractOutside={(event) => event.preventDefault()}
            >
              <Sheet.Title>Filters</Sheet.Title>
              <Sheet.Description>Choose visible filters.</Sheet.Description>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      </>
    ));

    click(getByPart("sheet", "trigger"));
    await settled();

    const content = getByPart("sheet", "content");
    keyDown(content, "Escape");
    await settled();
    expect(queryByPart("sheet", "content")).not.toBeNull();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();
    expect(queryByPart("sheet", "content")).not.toBeNull();
  });
});
