import { createRoot } from "solid-js";
import { describe, expect, test, vi } from "vitest";
import { getByPart, render } from "../../test/harness";
import { getDocsMetadata } from "../metadata/index";
import { AccessibleIcon, createAccessibleIcon } from "./index";

describe("AccessibleIcon", () => {
  test("renders a named image with stable Keystone parts", () => {
    const { container } = render(() => (
      <AccessibleIcon.Root label="Close">
        <svg viewBox="0 0 16 16" focusable="false">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </AccessibleIcon.Root>
    ));

    const root = getByPart("accessible-icon", "root", container);
    const label = getByPart("accessible-icon", "label", container);

    expect(root.tagName).toBe("SPAN");
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("Close");
    expect(label.textContent).toBe("Close");
    expect(label.style.position).toBe("absolute");
    expect(label.style.width).toBe("1px");
    expect(label.style.clipPath).toBe("inset(50%)");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  test("supports Solid polymorphism without changing the accessibility contract", () => {
    const { container } = render(() => (
      <AccessibleIcon.Root as="i" label="Warning" class="icon">
        !
      </AccessibleIcon.Root>
    ));

    const root = getByPart("accessible-icon", "root", container);

    expect(root.tagName).toBe("I");
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("Warning");
    expect(root.className).toBe("icon");
  });

  test("exposes a createAccessibleIcon contract for wrappers", () => {
    createRoot((dispose) => {
      const icon = createAccessibleIcon({ label: () => "Search" });
      const root = icon.getRootProps({ id: "search-icon" });
      const label = icon.getLabelProps();

      expect(root).toMatchObject({
        id: "search-icon",
        "aria-label": "Search",
        "data-scope": "accessible-icon",
        "data-part": "root",
        role: "img",
      });
      expect(label["data-scope"]).toBe("accessible-icon");
      expect(label["data-part"]).toBe("label");

      dispose();
    });
  });

  test("keeps label hidden styles when caller styles are strings", () => {
    createRoot((dispose) => {
      const icon = createAccessibleIcon({ label: () => "Search" });
      const label = icon.getLabelProps({ style: "color:red;" });

      expect(label.style).toContain("position:absolute;");
      expect(label.style).toContain("clip-path:inset(50%);");
      expect(label.style).toContain("color:red;");

      dispose();
    });
  });

  test("creates deterministic props without browser globals", () => {
    const previousDocument = globalThis.document;
    const previousWindow = globalThis.window;

    vi.stubGlobal("document", undefined);
    vi.stubGlobal("window", undefined);

    try {
      createRoot((dispose) => {
        const icon = createAccessibleIcon({ label: () => "Settings" });

        expect(icon.getRootProps()).toMatchObject({
          "aria-label": "Settings",
          "data-scope": "accessible-icon",
          "data-part": "root",
          role: "img",
        });
        expect(icon.getLabelProps()).toMatchObject({
          "data-scope": "accessible-icon",
          "data-part": "label",
        });

        dispose();
      });
    } finally {
      vi.stubGlobal("document", previousDocument);
      vi.stubGlobal("window", previousWindow);
    }
  });

  test("publishes docs metadata for root and label parts", () => {
    const metadata = getDocsMetadata("accessible-icon");

    expect(metadata?.scope).toBe("accessible-icon");
    expect(metadata?.parts.map((part) => part.part)).toEqual(["root", "label"]);
  });
});
