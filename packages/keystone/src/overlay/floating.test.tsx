import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { createFloatingAdapter } from "./floating";

describe("Keystone floating adapter", () => {
  test("positions floating content from an anchor and exposes geometry variables", () => {
    createRoot((dispose) => {
      const anchor = document.createElement("button");
      const floatingElement = document.createElement("div");
      const [enabled] = createSignal(true);

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
      expect(floating.getFloatingProps()["data-side"]).toBe("bottom");
      dispose();
    });
  });
});
