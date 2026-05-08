import { createSignal, type Accessor, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { NumberField } from "./number-field";

type TestFieldApi<TValue, TElement extends HTMLElement = HTMLElement> = {
  name: string;
  state: {
    value: TValue;
    meta: {
      errors?: readonly unknown[];
      isBlurred?: boolean;
      isDirty?: boolean;
      isTouched?: boolean;
      isValidating?: boolean;
    };
  };
  handleBlur: (event?: FocusEvent & { currentTarget?: TElement }) => void;
  handleChange: (value: TValue) => void;
};

function createForm<TValue, TElement extends HTMLElement = HTMLElement>(initialValue: TValue) {
  const [value, setValue] = createSignal<TValue>(initialValue);
  const [touched, setTouched] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  const field = () =>
    ({
      name: "profile.preference",
      state: {
        value: value(),
        meta: {
          errors: touched() ? ["Required"] : [],
          isBlurred: touched(),
          isDirty: value() !== initialValue,
          isTouched: touched(),
          isValidating: false,
        },
      },
      handleBlur: () => setTouched(true),
      handleChange: (nextValue: TValue) => setValue(() => nextValue),
    }) satisfies TestFieldApi<TValue, TElement>;

  return {
    value,
    submitted,
    Field: (props: {
      name: string;
      validators?: unknown;
      children: (field: Accessor<TestFieldApi<TValue, TElement>>) => JSX.Element;
    }) => props.children(field),
    handleSubmit: () => setSubmitted(true),
  };
}

describe("NumberField", () => {
  test("maps Core numeric behavior into TanStack field state", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createForm<number | undefined, HTMLInputElement>(2);
    const dispose = render(
      () => (
        <NumberField
          form={form}
          name="profile.preference"
          label="Seats"
          description="Choose a count"
          min={0}
          max={3}
          required
        />
      ),
      host,
    );

    const input = host.querySelector<HTMLInputElement>("[data-slot='number-field-input']");
    const increment = host.querySelector<HTMLButtonElement>(
      "[data-slot='number-field-increment-trigger']",
    );
    const decrement = host.querySelector<HTMLButtonElement>(
      "[data-slot='number-field-decrement-trigger']",
    );

    expect(input).not.toBeNull();
    expect(input?.className).toContain("ui-number-field-input");
    expect(input?.getAttribute("role")).toBe("spinbutton");
    expect(input?.getAttribute("name")).toBe("profile.preference");
    expect(input?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(input?.getAttribute("aria-describedby")).toBeTruthy();
    expect(input?.getAttribute("aria-valuenow")).toBe("2");
    expect(decrement?.type).toBe("button");
    expect(increment?.getAttribute("aria-controls")).toBe(input?.id);

    increment?.click();
    expect(form.value()).toBe(3);
    expect(input?.getAttribute("aria-valuenow")).toBe("3");
    expect(increment?.disabled).toBe(true);

    decrement?.click();
    expect(form.value()).toBe(2);

    dispose();
    host.remove();
  });

  test("maps blur, touched validation, typed values, and native form submission", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createForm<number | undefined, HTMLInputElement>(undefined);
    const dispose = render(
      () => (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <NumberField
            form={form}
            name="profile.preference"
            label="Budget"
            description="Whole dollars"
            min={0}
            max={10}
            step={1}
          />
          <button type="submit">Submit</button>
        </form>
      ),
      host,
    );

    const input = host.querySelector<HTMLInputElement>("[data-slot='number-field-input']");

    input!.value = "4";
    input?.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true }));
    expect(form.value()).toBe(4);

    input?.dispatchEvent(new FocusEvent("blur", { bubbles: true, cancelable: true }));
    expect(host.querySelector("[data-slot='tanstack-field-error']")?.textContent).toBe("Required");
    expect(input?.getAttribute("aria-invalid")).toBe("true");

    host.querySelector("form")?.dispatchEvent(new SubmitEvent("submit", { bubbles: true }));
    expect(form.submitted()).toBe(true);

    dispose();
    host.remove();
  });
});
