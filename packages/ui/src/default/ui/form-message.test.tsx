import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { FormMessage } from "./form-message";

describe("FormMessage", () => {
  test("renders field errors with alert semantics and state hooks", () => {
    const host = document.createElement("div");
    const field = {
      state: {
        meta: {
          errors: [{ message: "Name is required" }],
          isTouched: true,
          isValidating: true,
        },
      },
    };

    const dispose = render(() => <FormMessage field={field} />, host);
    const message = host.querySelector("[data-slot='form-message']");

    expect(message?.textContent).toBe("Name is required");
    expect(message?.getAttribute("role")).toBe("alert");
    expect(message?.getAttribute("aria-live")).toBe("polite");
    expect(message?.hasAttribute("data-invalid")).toBe(true);
    expect(message?.hasAttribute("data-touched")).toBe(true);
    expect(message?.hasAttribute("data-validating")).toBe(true);

    dispose();
  });

  test("does not mount empty messages unless forceMount is requested", () => {
    const host = document.createElement("div");
    const dispose = render(() => <FormMessage forceMount />, host);

    expect(host.querySelector("[data-slot='form-message']")).not.toBeNull();

    dispose();
  });
});
