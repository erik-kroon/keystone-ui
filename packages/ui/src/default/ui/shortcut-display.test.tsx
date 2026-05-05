import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { ShortcutDisplay } from "./shortcut-display";

describe("ShortcutDisplay", () => {
  test("renders platform-aware key parts with stable data attributes", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => <ShortcutDisplay hotkey="Mod+Shift+K" formatOptions={{ platform: "windows" }} />,
      host,
    );

    expect(host.innerHTML).toContain('data-scope="ui-shortcut-display"');
    expect(host.innerHTML).toContain('data-part="root"');
    expect(host.innerHTML).toContain('data-part="key"');
    expect(host.innerHTML).toContain('data-key="Ctrl"');
    expect(host.innerHTML).toContain('data-key="Shift"');
    expect(host.innerHTML).toContain('data-key="K"');
    expect(host.innerHTML).toContain('data-part="separator"');

    dispose();
  });

  test("renders multi-step shortcut sequences", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => <ShortcutDisplay sequence={["G", "G"]} sequenceSeparator="then" />,
      host,
    );

    expect(host.innerHTML).toContain('data-part="sequence-separator"');
    expect(host.textContent).toContain("then");
    expect(host.querySelectorAll('[data-part="step"]')).toHaveLength(2);

    dispose();
  });
});
