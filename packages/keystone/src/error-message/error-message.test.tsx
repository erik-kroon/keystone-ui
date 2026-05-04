import { describe, expect, test } from "vitest";
import { render } from "../../test/harness";
import { ErrorMessage, createErrorMessage } from "./index";

describe("error message", () => {
  test("renders validation feedback with alert semantics by default", () => {
    render(() => <ErrorMessage.Root id="email-error">Use a work email.</ErrorMessage.Root>);

    const error = document.querySelector<HTMLElement>(
      '[data-scope="error-message"][data-part="root"]',
    )!;

    expect(error.id).toBe("email-error");
    expect(error.getAttribute("role")).toBe("alert");
    expect(error.tabIndex).toBe(-1);
  });

  test("createErrorMessage lets explicit roles override the alert default", () => {
    const error = createErrorMessage();

    expect(error.getRootProps({ role: "status" })).toEqual({
      role: "status",
      "data-scope": "error-message",
      "data-part": "root",
    });
  });
});
