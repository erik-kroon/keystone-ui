import { describe, expect, test } from "vitest";
import { render } from "../../test/harness";
import { Description, createDescription } from "./index";

describe("description", () => {
  test("renders descriptive text without adding widget semantics", () => {
    render(() => <Description.Root id="email-help">Use your work email.</Description.Root>);

    const description = document.querySelector<HTMLElement>(
      '[data-scope="description"][data-part="root"]',
    )!;

    expect(description.id).toBe("email-help");
    expect(description.getAttribute("role")).toBeNull();
    expect(description.tabIndex).toBe(-1);
  });

  test("createDescription returns root props for custom composition", () => {
    const description = createDescription();

    expect(description.getRootProps({ id: "help" })).toEqual({
      id: "help",
      "data-scope": "description",
      "data-part": "root",
    });
  });
});
