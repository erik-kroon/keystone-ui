import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { render, settled } from "../../test/harness";
import { createFieldValidity, createFormControl } from "./index";

describe("field validity", () => {
  test("tracks focus, touch, dirty, and filled state from control events", () => {
    let validity!: ReturnType<typeof createFieldValidity>;
    let input!: HTMLInputElement;

    render(() => {
      validity = createFieldValidity({ defaultValue: "" });
      const props = validity.getControlProps<HTMLInputElement>({
        ref: (element) => {
          input = element;
          validity.registerControl(() => element);
        },
      });

      return <input {...props} />;
    });

    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    expect(validity.focused()).toBe(true);

    input.value = "hello";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(validity.value()).toBe("hello");
    expect(validity.dirty()).toBe(true);
    expect(validity.filled()).toBe(true);
    expect(input.getAttribute("data-dirty")).toBe("");
    expect(input.getAttribute("data-filled")).toBe("");

    input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    expect(validity.focused()).toBe(false);
    expect(validity.touched()).toBe(true);
    expect(input.getAttribute("data-touched")).toBe("");
  });

  test("captures native and custom validity without app form state", () => {
    let validity!: ReturnType<typeof createFieldValidity>;
    let input!: HTMLInputElement;

    render(() => {
      validity = createFieldValidity();
      const props = validity.getControlProps<HTMLInputElement>({
        ref: (element) => {
          input = element;
          validity.registerControl(() => element);
        },
        required: true,
      });

      return <input {...props} />;
    });

    input.dispatchEvent(new Event("invalid", { bubbles: true, cancelable: true }));
    expect(validity.nativeValidity().valueMissing).toBe(true);
    expect(validity.invalid()).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");

    validity.setCustomValidity("Use a project email");
    expect(validity.customError()).toBe("Use a project email");
    expect(validity.validationMessage()).toBe("Use a project email");

    validity.setCustomValidity(undefined);
    input.value = "team@example.com";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(validity.invalid()).toBe(false);
  });

  test("runs validation in the configured mode and exposes errors", async () => {
    const calls: string[] = [];
    let validity!: ReturnType<typeof createFieldValidity>;
    let input!: HTMLInputElement;

    render(() => {
      validity = createFieldValidity({
        defaultValue: "",
        validationMode: "blur",
        validate: (context) => {
          calls.push(context.reason);
          return context.value === "ok" ? undefined : "Required";
        },
      });
      const props = validity.getControlProps<HTMLInputElement>({
        ref: (element) => {
          input = element;
          validity.registerControl(() => element);
        },
      });

      return <input {...props} />;
    });

    input.value = "bad";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await settled();
    expect(calls).toEqual([]);

    input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await settled();
    expect(calls).toEqual(["blur"]);
    expect(validity.validationErrors()).toEqual(["Required"]);
    expect(validity.invalid()).toBe(true);

    input.value = "ok";
    input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await settled();
    expect(validity.validationErrors()).toEqual([]);
    expect(validity.invalid()).toBe(false);
  });

  test("reset clears stale native email validity before the browser reset default action completes", async () => {
    let validity!: ReturnType<typeof createFieldValidity>;
    let input!: HTMLInputElement;

    render(() => {
      validity = createFieldValidity({ defaultValue: "" });
      const props = validity.getControlProps<HTMLInputElement>({
        ref: (element) => {
          input = element;
          validity.registerControl(() => element);
        },
        required: true,
        type: "email",
      });

      return <input {...props} />;
    });

    input.value = "not-an-email";
    input.dispatchEvent(new Event("invalid", { bubbles: true, cancelable: true }));
    await settled();
    expect(validity.nativeValidity().typeMismatch).toBe(true);
    expect(validity.invalid()).toBe(true);

    validity.reset();
    await settled();

    expect(validity.nativeValidity().valid).toBe(true);
    expect(validity.nativeValidity().typeMismatch).toBe(false);
    expect(validity.validationMessage()).toBeUndefined();
    expect(validity.invalid()).toBe(false);
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  test("keeps only the latest async validation result", async () => {
    let releaseFirst!: (message: string) => void;

    await new Promise<void>((resolve, reject) => {
      createRoot((dispose) => {
        const [value, setValue] = createSignal("first");
        const controlledValidity = createFieldValidity({
          value,
          validate: (context) => {
            if (context.value === "first") {
              return new Promise<string>((resolveFirst) => {
                releaseFirst = resolveFirst;
              });
            }

            return Promise.resolve(undefined);
          },
        });

        const first = controlledValidity.validate();
        setValue("second");
        const second = controlledValidity.validate();
        releaseFirst("Too slow");

        void Promise.all([first, second]).then(
          () => {
            try {
              expect(controlledValidity.validationErrors()).toEqual([]);
              expect(controlledValidity.invalid()).toBe(false);
              dispose();
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          (error: unknown) => {
            reject(error);
          },
        );
      });
    });
  });

  test("form-control can consume field validity state attributes", () => {
    createRoot((dispose) => {
      const validity = createFieldValidity({
        defaultValue: "initial",
        validate: () => "Invalid",
      });
      const formControl = createFormControl({
        dirty: validity.dirty,
        filled: validity.filled,
        focused: validity.focused,
        invalid: validity.invalid,
        touched: validity.touched,
        validating: validity.validating,
        value: validity.value,
      });

      void validity.validate();
      const controlProps = formControl.getControlProps();

      expect(controlProps["data-filled"]).toBe("");
      expect(controlProps["data-invalid"]).toBe("");
      expect(controlProps["aria-invalid"]).toBe("true");

      dispose();
    });
  });
});
