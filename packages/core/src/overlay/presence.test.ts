import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { getPartMetadata } from "../metadata/index";
import { settled } from "../../test/harness";
import { createOverlayPresence, type OverlayPresenceApi } from "./presence";

function animationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

describe("overlay presence", () => {
  test("keeps public metadata aligned with transition status values", () => {
    const metadata = getPartMetadata("dialog", "content");
    const transitionStatus = metadata?.dataAttributes.find(
      (attribute) => attribute.name === "data-transition-status",
    );

    expect(transitionStatus?.values).toEqual(["closed", "closing", "opening", "open"]);
    expect(metadata?.dataAttributes.some((attribute) => attribute.name === "data-starting-style"))
      .toBe(true);
    expect(metadata?.dataAttributes.some((attribute) => attribute.name === "data-ending-style")).toBe(
      true,
    );
  });

  test("retains mounted content until close transitions complete", async () => {
    let dispose!: () => void;
    let presence!: OverlayPresenceApi;
    let setOpen!: (open: boolean) => boolean;
    const complete: string[] = [];
    const element = document.createElement("div");
    element.style.transitionDuration = "100ms";

    createRoot((rootDispose) => {
      dispose = rootDispose;
      const [open, nextOpen] = createSignal(false);
      setOpen = nextOpen;
      presence = createOverlayPresence({
        open,
        onOpenChangeComplete: (open) => complete.push(open ? "open" : "closed"),
      });
      presence.setElement(element);
    });

    expect(presence.mounted()).toBe(false);
    expect(presence.shouldMount()).toBe(false);

    setOpen(true);
    await Promise.resolve();

    expect(presence.mounted()).toBe(true);
    expect(presence.transitionStatus()).toBe("opening");
    expect(presence.transitionStyle()).toBe("starting");

    await settled();
    await animationFrame();
    await settled();
    expect(presence.transitionStyle()).toBe(undefined);

    element.dispatchEvent(new Event("transitionend"));
    await settled();

    expect(presence.transitionStatus()).toBe("open");
    expect(complete).toEqual(["open"]);

    setOpen(false);
    await settled();

    expect(presence.mounted()).toBe(true);
    expect(presence.shouldMount()).toBe(true);
    expect(presence.hidden()).toBe(false);
    expect(presence.transitionStatus()).toBe("closing");
    expect(presence.transitionStyle()).toBe("ending");

    await animationFrame();
    element.dispatchEvent(new Event("transitionend"));
    await settled();

    expect(presence.mounted()).toBe(false);
    expect(presence.shouldMount()).toBe(false);
    expect(presence.hidden()).toBe(false);
    expect(presence.transitionStatus()).toBe("closed");
    expect(complete).toEqual(["open", "closed"]);

    dispose();
  });

  test("completes immediate open and close paths when no transition is present", async () => {
    let dispose!: () => void;
    let presence!: OverlayPresenceApi;
    let setOpen!: (open: boolean) => boolean;
    const complete: string[] = [];
    const element = document.createElement("div");

    createRoot((rootDispose) => {
      dispose = rootDispose;
      const [open, nextOpen] = createSignal(false);
      setOpen = nextOpen;
      presence = createOverlayPresence({
        open,
        onOpenChangeComplete: (open, detail) =>
          complete.push(`${open ? "open" : "closed"}:${detail.preventedUnmount}`),
      });
      presence.setElement(element);
    });

    setOpen(true);
    await animationFrame();
    await settled();

    expect(presence.mounted()).toBe(true);
    expect(presence.transitionStatus()).toBe("open");
    expect(complete).toEqual(["open:false"]);

    setOpen(false);
    await animationFrame();
    await settled();

    expect(presence.mounted()).toBe(false);
    expect(presence.shouldMount()).toBe(false);
    expect(presence.transitionStatus()).toBe("closed");
    expect(complete).toEqual(["open:false", "closed:false"]);

    dispose();
  });

  test("keeps force-mounted content present and hidden after close completion", async () => {
    let dispose!: () => void;
    let presence!: OverlayPresenceApi;
    let setOpen!: (open: boolean) => boolean;
    const complete: string[] = [];
    const element = document.createElement("div");
    element.style.transitionDuration = "100ms";

    createRoot((rootDispose) => {
      dispose = rootDispose;
      const [open, nextOpen] = createSignal(true);
      setOpen = nextOpen;
      presence = createOverlayPresence({
        open,
        forceMount: () => true,
        onOpenChangeComplete: (open, detail) =>
          complete.push(`${open ? "open" : "closed"}:${detail.preventedUnmount}`),
      });
      presence.setElement(element);
    });

    expect(presence.mounted()).toBe(true);
    expect(presence.shouldMount()).toBe(true);
    expect(presence.hidden()).toBe(false);
    expect(presence.transitionStatus()).toBe("open");

    setOpen(false);
    await settled();

    expect(presence.mounted()).toBe(true);
    expect(presence.hidden()).toBe(false);
    expect(presence.transitionStatus()).toBe("closing");
    expect(presence.transitionStyle()).toBe("ending");

    await animationFrame();
    element.dispatchEvent(new Event("transitionend"));
    await settled();

    expect(presence.mounted()).toBe(true);
    expect(presence.shouldMount()).toBe(true);
    expect(presence.hidden()).toBe(true);
    expect(presence.transitionStatus()).toBe("closed");
    expect(complete).toEqual(["closed:true"]);

    dispose();
  });
});
