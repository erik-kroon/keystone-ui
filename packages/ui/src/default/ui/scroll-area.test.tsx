import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "./scroll-area";

describe("ScrollArea", () => {
  test("renders a native scrolling viewport with stable anatomy hooks", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <ScrollArea class="h-32" viewportClass="p-2" orientation="both">
          <p>Scrollable content</p>
        </ScrollArea>
      ),
      host,
    );

    const root = host.querySelector("[data-slot='scroll-area']");
    const viewport = host.querySelector("[data-slot='scroll-area-viewport']");

    expect(root?.getAttribute("data-scope")).toBe("ui-scroll-area");
    expect(root?.getAttribute("data-part")).toBe("root");
    expect(viewport?.getAttribute("data-part")).toBe("viewport");
    expect(viewport?.getAttribute("data-orientation")).toBe("both");
    expect(viewport?.textContent).toContain("Scrollable content");

    dispose();
  });

  test("exports custom-scrollbar anatomy as non-interactive styling hooks", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <div>
          <ScrollAreaViewport orientation="horizontal">Wide content</ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="horizontal">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </div>
      ),
      host,
    );

    expect(
      host.querySelector("[data-slot='scroll-area-viewport']")?.getAttribute("data-orientation"),
    ).toBe("horizontal");
    expect(
      host.querySelector("[data-slot='scroll-area-scrollbar']")?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(host.querySelector("[data-slot='scroll-area-thumb']")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(
      host.querySelector("[data-slot='scroll-area-corner']")?.getAttribute("aria-hidden"),
    ).toBe("true");

    dispose();
  });
});
