import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Separator, separatorClass } from "./separator";

describe("Separator", () => {
  test("renders a decorative horizontal separator by default", () => {
    const host = document.createElement("div");
    const dispose = render(() => <Separator class="custom-separator" />, host);

    const separator = host.querySelector("[data-slot='separator']");

    expect(separator?.getAttribute("role")).toBe("presentation");
    expect(separator?.hasAttribute("aria-orientation")).toBe(false);
    expect(separator?.getAttribute("data-scope")).toBe("ui-separator");
    expect(separator?.getAttribute("data-part")).toBe("root");
    expect(separator?.getAttribute("data-orientation")).toBe("horizontal");
    expect(separator?.hasAttribute("data-decorative")).toBe(true);
    expect(separator?.className).toContain("h-px");
    expect(separator?.className).toContain("w-full");
    expect(separator?.className).toContain("bg-border");
    expect(separator?.className).toContain("custom-separator");

    dispose();
  });

  test("renders semantic vertical separators with separator role and orientation", () => {
    const host = document.createElement("div");
    const dispose = render(() => <Separator decorative={false} orientation="vertical" />, host);

    const separator = host.querySelector("[data-slot='separator']");

    expect(separator?.getAttribute("role")).toBe("separator");
    expect(separator?.getAttribute("aria-orientation")).toBe("vertical");
    expect(separator?.getAttribute("data-orientation")).toBe("vertical");
    expect(separator?.hasAttribute("data-decorative")).toBe(false);
    expect(separator?.className).toContain("h-full");
    expect(separator?.className).toContain("w-px");

    dispose();
  });

  test("exposes separatorClass for local styling composition", () => {
    expect(separatorClass({ orientation: "horizontal" })).toContain("h-px");
    expect(separatorClass({ orientation: "vertical", class: "bg-sidebar-border" })).toContain(
      "bg-sidebar-border",
    );
  });
});
