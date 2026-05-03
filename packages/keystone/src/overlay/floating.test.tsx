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

  test("positions floating content from an anchor and exposes geometry variables", () => {
    createRoot((dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
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

      floating.update();

      expect(floating.side()).toBe("bottom");
      expect(floating.align()).toBe("start");
      expect(floatingElement.style.left).toBe("20px");
      expect(floatingElement.style.top).toBe("78px");
      expect(floatingElement.style.getPropertyValue("--keystone-anchor-width")).toBe("120px");
      expect(floatingElement.style.getPropertyValue("--keystone-available-height")).toBe("686px");
      expect(floatingElement.style.getPropertyValue("--keystone-arrow-x")).toBe("60px");
      expect(floatingElement.style.getPropertyValue("--keystone-arrow-y")).toBe("0px");
      expect(floatingElement.style.getPropertyValue("--keystone-transform-origin")).toBe(
        "start top",
      );
      expect(floating.getFloatingProps()["data-side"]).toBe("bottom");
      dispose();
    });
  });

  test("flips placement when the requested side collides with the viewport", () => {
    createRoot((dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");

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

      floating.update();

      expect(floating.side()).toBe("top");
      expect(floating.align()).toBe("center");
      expect(floatingElement.style.top).toBe("110px");
      expect(floatingElement.style.getPropertyValue("--keystone-available-height")).toBe("186px");
      expect(floating.getFloatingProps()["data-side"]).toBe("top");
      dispose();
    });
  });

  test("shifts cross-axis coordinates to keep content inside the viewport", () => {
    createRoot((dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");

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

      floating.update();

      expect(floating.side()).toBe("bottom");
      expect(floating.align()).toBe("end");
      expect(floatingElement.style.left).toBe("196px");
      expect(floatingElement.style.getPropertyValue("--keystone-arrow-x")).toBe("102px");
      dispose();
    });
  });

  test("uses scroll offsets for absolute strategy and viewport coordinates for fixed strategy", () => {
    createRoot((dispose) => {
      const anchor = document.createElement("button");
      const absoluteElement = document.createElement("div");
      const fixedElement = document.createElement("div");

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

      absolute.update();
      fixed.update();

      expect(absoluteElement.style.left).toBe("50px");
      expect(absoluteElement.style.top).toBe("124px");
      expect(fixedElement.style.left).toBe("20px");
      expect(fixedElement.style.top).toBe("74px");
      expect(fixed.getFloatingProps().style).toMatchObject({ position: "fixed" });
      dispose();
    });
  });

  test("updates geometry from window resize and scroll triggers", async () => {
    await new Promise<void>((resolve) => {
      createRoot((dispose) => {
        const anchor = document.createElement("button");
        const floatingElement = document.createElement("div");
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

        createFloatingAdapter({
          anchor: () => anchor,
          floating: () => floatingElement,
          placement: () => "bottom-start",
        });

        queueMicrotask(() => {
          expect(floatingElement.style.left).toBe("20px");
          left = 44;
          window.dispatchEvent(new Event("resize"));
          expect(floatingElement.style.left).toBe("44px");
          left = 68;
          window.dispatchEvent(new Event("scroll"));
          expect(floatingElement.style.left).toBe("68px");
          dispose();
          resolve();
        });
      });
    });
  });
});
