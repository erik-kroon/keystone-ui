import { describe, expect, test } from "vitest";
import { Popover } from "./index";
import {
  click,
  getByPart,
  keyDown,
  pointerDown,
  queryByPart,
  render,
  settled,
} from "../../test/harness";

describe("popover arrow", () => {
  test("renders as a decorative positioned part", async () => {
    render(() => (
      <Popover.Root defaultOpen placement="bottom-start">
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Arrow class="arrow" />
            <Popover.Content>Details</Popover.Content>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    ));

    const trigger = getByPart("popover", "trigger");
    const positioner = getByPart("popover", "positioner");
    const arrow = getByPart("popover", "arrow");

    trigger.getBoundingClientRect = () =>
      ({ bottom: 70, height: 40, left: 20, right: 140, top: 30, width: 120 }) as DOMRect;
    positioner.getBoundingClientRect = () =>
      ({ bottom: 0, height: 80, left: 0, right: 0, top: 0, width: 200 }) as DOMRect;
    arrow.getBoundingClientRect = () =>
      ({ bottom: 0, height: 10, left: 0, right: 0, top: 0, width: 10 }) as DOMRect;

    await settled();

    expect(arrow.className).toBe("arrow");
    expect(arrow.getAttribute("aria-hidden")).toBe("true");
    expect(arrow.getAttribute("data-state")).toBe("open");
    expect(arrow.getAttribute("data-side")).toBe("bottom");
    expect(arrow.getAttribute("data-align")).toBe("start");
    expect(arrow.style.position).toBe("absolute");
  });
});

describe("popover interaction policy", () => {
  test("opens from the trigger, moves focus into content, and restores focus after Escape", async () => {
    render(() => (
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Content>
              <button data-testid="popover-action">Action</button>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    ));

    const trigger = getByPart("popover", "trigger");
    trigger.focus();
    click(trigger);
    await settled();

    const content = getByPart("popover", "content");
    expect(trigger.getAttribute("aria-controls")).toBe(content.id);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(content.getAttribute("role")).toBe("dialog");
    expect(document.activeElement).toBe(document.querySelector("[data-testid='popover-action']"));

    keyDown(content, "Escape");
    await settled();

    expect(queryByPart("popover", "content")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("supports preventable Escape and outside dismissal", async () => {
    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <Popover.Root>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Content
                onEscapeKeyDown={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
              >
                Details
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </>
    ));

    click(getByPart("popover", "trigger"));
    await settled();

    const content = getByPart("popover", "content");
    keyDown(content, "Escape");
    await settled();
    expect(queryByPart("popover", "content")).not.toBeNull();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();
    expect(queryByPart("popover", "content")).not.toBeNull();
  });

  test("keeps force-mounted portal content in the requested mount while closed", async () => {
    const mount = document.createElement("div");
    mount.setAttribute("data-testid", "portal-host");
    document.body.append(mount);

    render(() => (
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal forceMount mount={mount}>
          <Popover.Positioner>
            <Popover.Content>Details</Popover.Content>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    ));

    const content = getByPart("popover", "content", mount);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("data-state")).toBe("closed");

    click(getByPart("popover", "trigger"));
    await settled();
    expect(content.hidden).toBe(false);
    expect(content.getAttribute("data-state")).toBe("open");

    click(getByPart("popover", "trigger"));
    await settled();
    expect(getByPart("popover", "content", mount)).toBe(content);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("data-state")).toBe("closed");
  });
});
