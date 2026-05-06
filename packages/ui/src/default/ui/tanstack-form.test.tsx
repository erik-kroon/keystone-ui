import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import {
  formatFieldError,
  getTanStackFormState,
  TanStackForm,
  TanStackFormErrors,
  TanStackFormSubmit,
} from "./tanstack-form";

describe("TanStackForm", () => {
  test("runs user submit handlers first, then prevents native submission and calls TanStack submit", () => {
    const host = document.createElement("div");
    let submitted = 0;
    const calls: string[] = [];
    const formApi = {
      handleSubmit: () => {
        submitted += 1;
        calls.push("handleSubmit");
      },
      state: {
        canSubmit: true,
        isDirty: true,
        isSubmitting: true,
        isTouched: true,
        isValidating: true,
        submissionAttempts: 2,
      },
    };
    const dispose = render(
      () => (
        <TanStackForm
          form={formApi}
          onSubmit={(event) => {
            expect(event.defaultPrevented).toBe(false);
            calls.push("user");
          }}
        >
          <TanStackFormSubmit form={formApi}>Save</TanStackFormSubmit>
        </TanStackForm>
      ),
      host,
    );

    const form = host.querySelector("form");
    const event = new SubmitEvent("submit", { bubbles: true, cancelable: true });
    form?.dispatchEvent(event);

    expect(calls).toEqual(["user", "handleSubmit"]);
    expect(submitted).toBe(1);
    expect(event.defaultPrevented).toBe(true);
    expect(form?.getAttribute("aria-busy")).toBe("true");
    expect(form?.hasAttribute("data-submitting")).toBe(true);
    expect(form?.hasAttribute("data-validating")).toBe(true);
    expect(form?.hasAttribute("data-dirty")).toBe(true);
    expect(form?.hasAttribute("data-touched")).toBe(true);
    expect(form?.getAttribute("data-submission-attempts")).toBe("2");

    dispose();
  });

  test("preserves prevented user submit handlers as an escape hatch", () => {
    const host = document.createElement("div");
    let submitted = 0;
    const formApi = {
      handleSubmit: () => {
        submitted += 1;
      },
      state: { canSubmit: true },
    };
    const dispose = render(
      () => (
        <TanStackForm
          form={formApi}
          onSubmit={(event) => {
            event.preventDefault();
          }}
        />
      ),
      host,
    );

    const event = new SubmitEvent("submit", { bubbles: true, cancelable: true });
    host.querySelector("form")?.dispatchEvent(event);

    expect(submitted).toBe(0);
    expect(event.defaultPrevented).toBe(true);

    dispose();
  });

  test("mirrors invalid form state and disables submit from TanStack canSubmit/submitting state", () => {
    const host = document.createElement("div");
    const formApi = {
      handleSubmit: () => undefined,
      state: {
        canSubmit: false,
        isSubmitting: true,
        isValid: false,
      },
    };
    const dispose = render(
      () => (
        <TanStackForm form={formApi}>
          <TanStackFormSubmit form={formApi} formId="settings-form">
            Save
          </TanStackFormSubmit>
        </TanStackForm>
      ),
      host,
    );

    const form = host.querySelector("form");
    const submit = host.querySelector<HTMLButtonElement>("[data-slot='tanstack-form-submit']");

    expect(form?.hasAttribute("data-invalid")).toBe(true);
    expect(form?.hasAttribute("data-can-submit")).toBe(false);
    expect(submit?.disabled).toBe(true);
    expect(submit?.getAttribute("form")).toBe("settings-form");
    expect(submit?.type).toBe("submit");
    expect(submit?.hasAttribute("data-submitting")).toBe(true);
    expect(submit?.hasAttribute("data-can-submit")).toBe(false);

    dispose();
  });

  test("renders root errors with alert semantics and formats common error shapes", () => {
    const host = document.createElement("div");
    const formApi = {
      handleSubmit: () => undefined,
      state: {
        errors: ["Name is required", { message: "Email is invalid" }, 42],
      },
    };
    const dispose = render(() => <TanStackFormErrors form={formApi} />, host);
    const errors = host.querySelector("[data-slot='tanstack-form-errors']");

    expect(errors?.getAttribute("role")).toBe("alert");
    expect(errors?.textContent).toBe("Name is required, Email is invalid, 42");
    expect(formatFieldError({ message: "Too short" })).toBe("Too short");
    expect(formatFieldError(null)).toBeUndefined();
    expect(getTanStackFormState(formApi).errors).toHaveLength(3);

    dispose();
  });
});
