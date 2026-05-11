import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  test("applies class to the native textarea and rootClass to the wrapper", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => <Textarea class="resize-none" rootClass="textarea-shell" />,
      host,
    );

    const root = host.querySelector<HTMLElement>("[data-slot='textarea-control']");
    const textarea = host.querySelector<HTMLTextAreaElement>("[data-slot='textarea']");

    expect(root?.className).toContain("textarea-shell");
    expect(root?.className).not.toContain("resize-none");
    expect(textarea?.className).toContain("resize-none");

    dispose();
  });
});
