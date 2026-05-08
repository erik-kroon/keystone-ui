import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Kbd, KbdGroup, KbdSeparator } from "./kbd";

describe("Kbd", () => {
  test("renders native kbd markup with stable styling hooks", () => {
    const host = document.createElement("div");
    const dispose = render(() => <Kbd>Esc</Kbd>, host);
    const kbd = host.querySelector("[data-slot='kbd']");

    expect(kbd?.tagName).toBe("KBD");
    expect(kbd?.getAttribute("data-scope")).toBe("ui-kbd");
    expect(kbd?.getAttribute("data-part")).toBe("root");
    expect(kbd?.getAttribute("data-size")).toBe("default");
    expect(kbd?.getAttribute("data-variant")).toBe("default");
    expect(kbd?.textContent).toBe("Esc");

    dispose();
  });

  test("supports source-owned size, variant, and group composition", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <KbdGroup aria-label="Open command menu">
          <Kbd size="sm" variant="muted">
            Ctrl
          </Kbd>
          <KbdSeparator />
          <Kbd size="sm" variant="muted">
            K
          </Kbd>
        </KbdGroup>
      ),
      host,
    );

    const group = host.querySelector("[data-slot='kbd-group']");
    const keys = host.querySelectorAll("[data-slot='kbd']");
    const separator = host.querySelector("[data-slot='kbd-separator']");

    expect(group?.getAttribute("aria-label")).toBe("Open command menu");
    expect(group?.getAttribute("data-part")).toBe("group");
    expect(keys).toHaveLength(2);
    expect(keys[0]?.getAttribute("data-size")).toBe("sm");
    expect(keys[0]?.getAttribute("data-variant")).toBe("muted");
    expect(separator?.getAttribute("aria-hidden")).toBe("true");
    expect(separator?.textContent).toBe("+");

    dispose();
  });
});
