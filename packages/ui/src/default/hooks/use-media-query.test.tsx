import { render } from "solid-js/web";
import { afterEach, describe, expect, test, vi } from "vitest";
import { createBreakpointQuery, normalizeMediaQuery, useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("keeps the default value until mounted", () => {
    const matches = useMediaQuery("(min-width: 768px)", { defaultValue: true });

    expect(matches()).toBe(true);
  });

  test("reads matchMedia after mount and cleans up listeners", async () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const matchMedia = vi.fn(() => ({
      matches: true,
      media: "(min-width: 768px)",
      addEventListener,
      removeEventListener,
    }));
    const host = document.createElement("div");
    let matches = () => false;

    document.body.append(host);
    const dispose = render(() => {
      matches = useMediaQuery("(min-width: 768px)", {
        window: { matchMedia } as unknown as Window,
      });
      return null;
    }, host);

    await tick();

    expect(matchMedia).toHaveBeenCalledWith("(min-width: 768px)");
    expect(matches()).toBe(true);
    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));

    dispose();
    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    host.remove();
  });

  test("normalizes breakpoint and feature helpers", () => {
    expect(createBreakpointQuery("md")).toBe("(min-width: 800px)");
    expect(createBreakpointQuery("md", "down")).toBe("(max-width: 799.98px)");
    expect(normalizeMediaQuery("md")).toBe("(min-width: 800px)");
    expect(normalizeMediaQuery("max-md")).toBe("(max-width: 799.98px)");
    expect(normalizeMediaQuery("md:max-lg")).toBe("(min-width: 800px) and (max-width: 1023.98px)");
    expect(
      normalizeMediaQuery({
        min: "md",
        max: "48rem",
        orientation: "portrait",
        pointer: "coarse",
        preference: "reduced-motion",
      }),
    ).toBe(
      "(min-width: 800px) and (max-width: 48rem) and (orientation: portrait) and (pointer: coarse) and (prefers-reduced-motion: reduce)",
    );
  });
});

function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
