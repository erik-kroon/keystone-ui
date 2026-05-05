import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { CodeBlock } from "./code-block";

describe("CodeBlock", () => {
  test("renders figure, caption, language metadata, code text, and copy action", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <CodeBlock
          code="const value = 1;"
          description="Install source"
          language="tsx"
          title="Example"
        />
      ),
      host,
    );

    const figure = host.querySelector("[data-slot='code-block']");
    const code = host.querySelector("[data-slot='code-block-code']");

    expect(figure?.tagName).toBe("FIGURE");
    expect(figure?.getAttribute("data-language")).toBe("tsx");
    expect(host.querySelector("[data-slot='code-block-header']")?.tagName).toBe("FIGCAPTION");
    expect(host.querySelector("[data-slot='code-block-title']")?.textContent).toBe("Example");
    expect(host.querySelector("[data-slot='code-block-description']")?.textContent).toBe(
      "Install source",
    );
    expect(code?.textContent).toBe("const value = 1;");
    expect(host.querySelector("[data-slot='copy-button']")).not.toBeNull();

    dispose();
  });

  test("can render a plain code surface without copy controls", () => {
    const host = document.createElement("div");
    const dispose = render(() => <CodeBlock code="plain" copy={false} />, host);

    expect(host.querySelector("[data-slot='code-block-header']")).toBeNull();
    expect(host.querySelector("[data-slot='copy-button']")).toBeNull();
    expect(host.querySelector("[data-slot='code-block-code']")?.textContent).toBe("plain");

    dispose();
  });
});
