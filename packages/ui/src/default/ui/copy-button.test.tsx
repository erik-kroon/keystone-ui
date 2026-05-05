import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
  test("copies the provided value and updates accessible state", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const values: string[] = [];
    const originalClipboard = globalThis.navigator.clipboard;
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (value: string) => values.push(value) },
    });

    const dispose = render(
      () => <CopyButton copiedDuration={1000} label="Copy install command" value="bun add" />,
      host,
    );
    const button = host.querySelector<HTMLButtonElement>("[data-slot='copy-button']");

    button?.click();
    await Promise.resolve();

    expect(values).toEqual(["bun add"]);
    expect(button?.getAttribute("aria-label")).toBe("Copied");
    expect(button?.hasAttribute("data-copied")).toBe(true);

    dispose();
    host.remove();
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
  });

  test("runs user click handlers before copying", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const values: string[] = [];
    const originalClipboard = globalThis.navigator.clipboard;
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (value: string) => values.push(value) },
    });

    const dispose = render(
      () => (
        <CopyButton
          value="blocked"
          onClick={(event) => {
            event.preventDefault();
          }}
        />
      ),
      host,
    );

    host.querySelector<HTMLButtonElement>("[data-slot='copy-button']")?.click();
    await Promise.resolve();

    expect(values).toEqual([]);

    dispose();
    host.remove();
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
  });
});
