import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { createFloatingAdapter } from "./floating";

describe("Keystone floating adapter", () => {
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
  const mountPair = (anchor: HTMLElement, floatingElement: HTMLElement) => {
    document.body.append(anchor, floatingElement);

    return () => {
      anchor.remove();
      floatingElement.remove();
    };
  };

  test("positions floating content from an anchor and exposes geometry variables", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
      const cleanupDom = mountPair(anchor, floatingElement);
      const [enabled] = createSignal(true);

      setViewport(1024, 768);
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 70,
          height: 40,
          left: 20,
          right: 140,
          top: 30,
          width: 120,
        }) as DOMRect;
      floatingElement.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 80,
          left: 0,
          right: 0,
          top: 0,
          width: 200,
        }) as DOMRect;

      const floating = createFloatingAdapter({
        anchor: () => anchor,
        enabled,
        floating: () => floatingElement,
        gutter: () => 8,
        placement: () => "bottom-start",
      });

      await floating.update();

      expect(floating.side()).toBe("bottom");
      expect(floating.align()).toBe("start");
      expect(floatingElement.style.left).toBe("20px");
      expect(floatingElement.style.top).toBe("78px");
      expect(floatingElement.style.getPropertyValue("--keystone-anchor-width")).toBe("120px");
      expect(floatingElement.style.getPropertyValue("--keystone-available-height")).toBe("686px");
      expect(floatingElement.style.getPropertyValue("--keystone-arrow-x")).toBe("60px");
      expect(floatingElement.style.getPropertyValue("--keystone-arrow-y")).toBe("0px");
      expect(floatingElement.style.getPropertyValue("--keystone-transform-origin")).toBe(
        "60px top",
      );
      expect(floating.getFloatingProps()["data-side"]).toBe("bottom");
      cleanupDom();
      dispose();
    });
  });

  test("positions an owned arrow element and preserves user props", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
      const arrowElement = document.createElement("span");
      const cleanupDom = mountPair(anchor, floatingElement);
      floatingElement.append(arrowElement);

      setViewport(1024, 768);
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 70,
          height: 40,
          left: 20,
          right: 140,
          top: 30,
          width: 120,
        }) as DOMRect;
      floatingElement.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 80,
          left: 0,
          right: 0,
          top: 0,
          width: 200,
        }) as DOMRect;
      arrowElement.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 10,
          left: 0,
          right: 0,
          top: 0,
          width: 10,
        }) as DOMRect;

      const floating = createFloatingAdapter({
        anchor: () => anchor,
        floating: () => floatingElement,
        gutter: () => 8,
        placement: () => "bottom-start",
      });
      const arrowProps = floating.getArrowProps<HTMLSpanElement>({
        class: "arrow",
        style: { width: "10px", height: "10px" },
      });

      arrowProps.ref(arrowElement);
      await floating.update();
      const resolvedArrowProps = floating.getArrowProps<HTMLSpanElement>({ class: "arrow" });

      expect(resolvedArrowProps.class).toBe("arrow");
      expect(resolvedArrowProps["data-side"]).toBe("bottom");
      expect(resolvedArrowProps["data-align"]).toBe("start");
      expect(arrowElement.style.position).toBe("absolute");
      expect(arrowElement.style.left).toBe("55px");
      expect(arrowElement.style.top).toBe("0px");
      cleanupDom();
      dispose();
    });
  });

  test("flips placement when the requested side collides with the viewport", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
      const cleanupDom = mountPair(anchor, floatingElement);

      setViewport(320, 240);
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 230,
          height: 32,
          left: 120,
          right: 200,
          top: 198,
          width: 80,
        }) as DOMRect;
      floatingElement.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 80,
          left: 0,
          right: 0,
          top: 0,
          width: 120,
        }) as DOMRect;

      const floating = createFloatingAdapter({
        anchor: () => anchor,
        floating: () => floatingElement,
        gutter: () => 8,
        placement: () => "bottom",
      });

      await floating.update();

      expect(floating.side()).toBe("top");
      expect(floating.align()).toBe("center");
      expect(floatingElement.style.top).toBe("110px");
      expect(floatingElement.style.getPropertyValue("--keystone-available-height")).toBe("186px");
      expect(floating.getFloatingProps()["data-side"]).toBe("top");
      cleanupDom();
      dispose();
    });
  });

  test("shifts cross-axis coordinates to keep content inside the viewport", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
      const cleanupDom = mountPair(anchor, floatingElement);

      setViewport(320, 240);
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 70,
          height: 32,
          left: 280,
          right: 316,
          top: 38,
          width: 36,
        }) as DOMRect;
      floatingElement.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 64,
          left: 0,
          right: 0,
          top: 0,
          width: 120,
        }) as DOMRect;

      const floating = createFloatingAdapter({
        anchor: () => anchor,
        floating: () => floatingElement,
        placement: () => "bottom-end",
      });

      await floating.update();

      expect(floating.side()).toBe("bottom");
      expect(floating.align()).toBe("end");
      expect(floatingElement.style.left).toBe("196px");
      expect(floatingElement.style.getPropertyValue("--keystone-arrow-x")).toBe("102px");
      cleanupDom();
      dispose();
    });
  });

  test("uses scroll offsets for absolute strategy and viewport coordinates for fixed strategy", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const absoluteElement = document.createElement("div");
      const fixedElement = document.createElement("div");
      document.body.append(anchor, absoluteElement, fixedElement);

      setViewport(800, 600);
      Object.defineProperty(window, "scrollX", {
        configurable: true,
        value: 30,
      });
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        value: 50,
      });
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 70,
          height: 40,
          left: 20,
          right: 140,
          top: 30,
          width: 120,
        }) as DOMRect;
      const floatingRect = () =>
        ({
          bottom: 0,
          height: 80,
          left: 0,
          right: 0,
          top: 0,
          width: 100,
        }) as DOMRect;
      absoluteElement.getBoundingClientRect = floatingRect;
      fixedElement.getBoundingClientRect = floatingRect;

      const absolute = createFloatingAdapter({
        anchor: () => anchor,
        floating: () => absoluteElement,
        placement: () => "bottom-start",
        strategy: () => "absolute",
      });
      const fixed = createFloatingAdapter({
        anchor: () => anchor,
        floating: () => fixedElement,
        placement: () => "bottom-start",
        strategy: () => "fixed",
      });

      await absolute.update();
      await fixed.update();

      expect(absoluteElement.style.left).toBe("50px");
      expect(absoluteElement.style.top).toBe("124px");
      expect(fixedElement.style.left).toBe("20px");
      expect(fixedElement.style.top).toBe("74px");
      expect(fixed.getFloatingProps().style).toMatchObject({ position: "fixed" });
      anchor.remove();
      absoluteElement.remove();
      fixedElement.remove();
      dispose();
    });
  });

  test("applies same-width and fit-viewport sizing styles from computed overflow", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
      const cleanupDom = mountPair(anchor, floatingElement);

      setViewport(320, 240);
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 70,
          height: 32,
          left: 20,
          right: 160,
          top: 38,
          width: 140,
        }) as DOMRect;
      floatingElement.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 100,
          left: 0,
          right: 0,
          top: 0,
          width: 200,
        }) as DOMRect;

      const floating = createFloatingAdapter({
        anchor: () => anchor,
        fitViewport: () => true,
        floating: () => floatingElement,
        placement: () => "bottom-start",
        sameWidth: () => true,
      });

      await floating.update();

      expect(floatingElement.style.width).toBe("140px");
      expect(floatingElement.style.maxHeight).toBe("162px");
      expect(floatingElement.style.maxWidth).toBe("312px");
      cleanupDom();
      dispose();
    });
  });

  test("respects collision boundary rects when resolving placement", async () => {
    await withRoot(async (dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
      const cleanupDom = mountPair(anchor, floatingElement);

      setViewport(800, 600);
      anchor.getBoundingClientRect = () =>
        ({
          bottom: 110,
          height: 24,
          left: 40,
          right: 140,
          top: 86,
          width: 100,
        }) as DOMRect;
      floatingElement.getBoundingClientRect = () =>
        ({
          bottom: 0,
          height: 48,
          left: 0,
          right: 0,
          top: 0,
          width: 120,
        }) as DOMRect;

      const floating = createFloatingAdapter({
        anchor: () => anchor,
        collisionBoundary: () => ({
          height: 120,
          width: 220,
          x: 0,
          y: 0,
        }),
        floating: () => floatingElement,
        placement: () => "bottom",
      });

      await floating.update();

      expect(floating.side()).toBe("top");
      cleanupDom();
      dispose();
    });
  });

  test("updates geometry from window resize and scroll triggers", async () => {
    await new Promise<void>((resolve, reject) => {
      createRoot((dispose) => {
        const anchor = document.createElement("button");
        const floatingElement = document.createElement("div");
        const cleanupDom = mountPair(anchor, floatingElement);
        let left = 20;

        setViewport(800, 600);
        Object.defineProperty(window, "scrollX", {
          configurable: true,
          value: 0,
        });
        Object.defineProperty(window, "scrollY", {
          configurable: true,
          value: 0,
        });
        anchor.getBoundingClientRect = () =>
          ({
            bottom: 70,
            height: 40,
            left,
            right: left + 120,
            top: 30,
            width: 120,
          }) as DOMRect;
        floatingElement.getBoundingClientRect = () =>
          ({
            bottom: 0,
            height: 80,
            left: 0,
            right: 0,
            top: 0,
            width: 100,
          }) as DOMRect;

        const floating = createFloatingAdapter({
          anchor: () => anchor,
          floating: () => floatingElement,
          placement: () => "bottom-start",
        });

        void (async () => {
          await floating.update();
          expect(floatingElement.style.left).toBe("20px");
          left = 44;
          window.dispatchEvent(new Event("resize"));
          await floating.update();
          expect(floatingElement.style.left).toBe("44px");
          left = 68;
          window.dispatchEvent(new Event("scroll"));
          await floating.update();
          expect(floatingElement.style.left).toBe("68px");
          cleanupDom();
          dispose();
          resolve();
        })().catch(reject);
      });
    });
  });
});
