import { createRoot } from "solid-js";
import { describe, expect, test, vi } from "vitest";
import { getByPart, render, settled } from "../../test/harness";
import { Popper, createPopper } from "./index";

describe("Popper", () => {
  const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: height,
    });
  };

  const withRoot = async (run: (dispose: () => void) => Promise<void>) => {
    await new Promise<void>((resolve, reject) => {
      createRoot((dispose) => {
        void run(dispose).then(resolve, reject);
      });
    });
  };

  test("positions a public anchor, positioner, and arrow with Keystone geometry contracts", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const positioner = document.createElement("div");
      const arrow = document.createElement("div");
      document.body.append(anchor, positioner);
      positioner.append(arrow);

      setViewport(800, 600);
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 64,
          height: 40,
          left: 32,
          right: 152,
          top: 24,
          width: 120,
        }) as DOMRect;
      positioner.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 80,
          left: 0,
          right: 0,
          top: 0,
          width: 180,
        }) as DOMRect;
      arrow.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 10,
          left: 0,
          right: 0,
          top: 0,
          width: 10,
        }) as DOMRect;

      const popper = createPopper({
        fitViewport: () => true,
        gutter: () => 12,
        placement: () => "bottom-start",
        sameWidth: () => true,
      });

      const anchorProps = popper.getAnchorProps({ ref: undefined });
      const positionerProps = popper.getPositionerProps({ ref: undefined });
      (anchorProps.ref as (element: HTMLElement) => void)(anchor);
      (positionerProps.ref as (element: HTMLElement) => void)(positioner);
      (popper.getArrowProps({ ref: undefined }).ref as (element: HTMLElement) => void)(arrow);

      await popper.update();

      expect(anchorProps["data-scope"]).toBe("popper");
      expect(anchorProps["data-part"]).toBe("anchor");
      expect(positionerProps["data-scope"]).toBe("popper");
      expect(positionerProps["data-part"]).toBe("positioner");
      expect(positioner.getAttribute("data-side")).toBe("bottom");
      expect(positioner.getAttribute("data-align")).toBe("start");
      expect(positioner.style.left).toBe("32px");
      expect(positioner.style.top).toBe("76px");
      expect(positioner.style.width).toBe("120px");
      expect(positioner.style.maxHeight).toBe("520px");
      expect(positioner.style.getPropertyValue("--keystone-anchor-width")).toBe("120px");
      expect(positioner.style.getPropertyValue("--keystone-anchor-height")).toBe("40px");
      expect(positioner.style.getPropertyValue("--keystone-available-height")).toBe("520px");
      expect(positioner.style.getPropertyValue("--keystone-arrow-x")).toBe("55px");
      expect(positioner.style.getPropertyValue("--keystone-transform-origin")).toBe("55px top");
      expect(popper.side()).toBe("bottom");
      expect(popper.align()).toBe("start");

      const arrowProps = popper.getArrowProps();
      expect(arrowProps["data-scope"]).toBe("popper");
      expect(arrowProps["data-part"]).toBe("arrow");
      expect(arrowProps["data-side"]).toBe("bottom");
      expect(arrowProps["data-align"]).toBe("start");

      anchor.remove();
      positioner.remove();
      dispose();
    });
  });

  test("renders compound parts and keeps creator props free of browser measurement", async () => {
    const previousDocument = globalThis.document;
    const previousWindow = globalThis.window;

    vi.stubGlobal("document", undefined);
    vi.stubGlobal("window", undefined);

    try {
      await withRoot(async (dispose) => {
        const popper = createPopper({ placement: () => "top" });
        const positionerProps = popper.getPositionerProps();
        const arrowProps = popper.getArrowProps();

        await popper.update();

        expect(positionerProps["data-scope"]).toBe("popper");
        expect(positionerProps["data-part"]).toBe("positioner");
        expect(arrowProps["data-scope"]).toBe("popper");
        expect(arrowProps["data-part"]).toBe("arrow");
        dispose();
      });
    } finally {
      vi.stubGlobal("document", previousDocument);
      vi.stubGlobal("window", previousWindow);
    }

    render(() => (
      <Popper.Root placement="right">
        <Popper.Anchor>Anchor</Popper.Anchor>
        <Popper.Positioner>
          <Popper.Arrow />
          Content
        </Popper.Positioner>
      </Popper.Root>
    ));
    await settled();

    expect(getByPart("popper", "anchor").textContent).toBe("Anchor");
    expect(getByPart("popper", "positioner").textContent).toContain("Content");
    expect(getByPart("popper", "arrow")).toBeInstanceOf(HTMLElement);
  });
});
