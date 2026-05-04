import { describe, expect, test } from "vitest";
import { Popover } from "./index";
import { getByPart, render, settled } from "../../test/harness";

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
