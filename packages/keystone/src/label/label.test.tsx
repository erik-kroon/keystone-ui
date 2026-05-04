import { describe, expect, test } from "vitest";
import { render } from "../../test/harness";
import { Label, createLabel } from "./index";

describe("label", () => {
  test("renders a native label with stable part attributes", () => {
    render(() => (
      <>
        <Label.Root for="email">Email</Label.Root>
        <input id="email" />
      </>
    ));

    const label = document.querySelector<HTMLLabelElement>(
      '[data-scope="label"][data-part="root"]',
    )!;

    expect(label.tagName).toBe("LABEL");
    expect(label.htmlFor).toBe("email");
    expect(document.getElementById(label.htmlFor)?.tagName).toBe("INPUT");
  });

  test("createLabel returns root props for custom composition", () => {
    const label = createLabel();

    expect(label.getRootProps({ for: "name" })).toEqual({
      for: "name",
      "data-scope": "label",
      "data-part": "root",
    });
  });
});
