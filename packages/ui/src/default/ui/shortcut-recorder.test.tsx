import { render } from "solid-js/web";
import { describe, expect, test, vi } from "vitest";
import { ShortcutRecorder } from "./shortcut-recorder";

describe("ShortcutRecorder", () => {
  test("renders a native button with stable state attributes", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => <ShortcutRecorder value="Mod+K">Open command menu</ShortcutRecorder>,
      host,
    );
    const button = host.querySelector("button");

    expect(button?.getAttribute("type")).toBe("button");
    expect(button?.getAttribute("data-scope")).toBe("ui-shortcut-recorder");
    expect(button?.getAttribute("data-part")).toBe("trigger");
    expect(host.innerHTML).toContain('data-part="value"');

    dispose();
  });

  test("records and clears a single shortcut", async () => {
    const onValueChange = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => <ShortcutRecorder onValueChange={onValueChange}>Save</ShortcutRecorder>,
      host,
    );
    const button = host.querySelector("button");

    button?.click();
    await tick();
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        ctrlKey: true,
        key: "s",
      }),
    );
    button?.click();
    await tick();
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Backspace",
      }),
    );

    expect(onValueChange).toHaveBeenNthCalledWith(1, "Mod+S");
    expect(onValueChange).toHaveBeenNthCalledWith(2, undefined);

    dispose();
    host.remove();
  });
});

function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
