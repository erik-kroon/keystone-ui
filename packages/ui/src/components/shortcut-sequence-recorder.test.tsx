import { render } from "solid-js/web";
import { describe, expect, test, vi } from "vitest";
import { ShortcutSequenceRecorder } from "./shortcut-sequence-recorder";

describe("ShortcutSequenceRecorder", () => {
  test("renders a native button with sequence display hooks", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => <ShortcutSequenceRecorder value={["G", "G"]}>Go top</ShortcutSequenceRecorder>,
      host,
    );
    const button = host.querySelector("button");

    expect(button?.getAttribute("type")).toBe("button");
    expect(button?.getAttribute("data-scope")).toBe("ui-shortcut-sequence-recorder");
    expect(button?.getAttribute("data-part")).toBe("trigger");
    expect(host.innerHTML).toContain('data-part="value"');
    expect(host.innerHTML).toContain('data-part="sequence-separator"');

    dispose();
  });

  test("records and clears a shortcut sequence", async () => {
    const onValueChange = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <ShortcutSequenceRecorder
          onValueChange={onValueChange}
          recorderOptions={{ commitOnEnter: true }}
        >
          Sequence
        </ShortcutSequenceRecorder>
      ),
      host,
    );
    const button = host.querySelector("button");

    button?.click();
    await tick();
    document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "g" }));
    document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "g" }));
    document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    button?.click();
    await tick();
    document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Backspace" }));

    expect(onValueChange).toHaveBeenNthCalledWith(1, ["G", "G"]);
    expect(onValueChange).toHaveBeenNthCalledWith(2, []);

    dispose();
    host.remove();
  });
});

function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
