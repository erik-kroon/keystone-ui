import { createSignal, type Accessor, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { ComboboxField } from "./combobox-field";
import { DatePickerField } from "./date-picker-field";
import { FileField } from "./file-field";
import { SliderField } from "./slider-field";

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
  const field = () =>
    ({
      name: "profile.preference",
      state: {
        value: value(),
        meta: {
          errors: touched() ? ["Required"] : [],
          isBlurred: touched(),
          isDirty: true,
          isTouched: touched(),
        },
      },
      handleBlur: () => setTouched(true),
      handleChange: (nextValue: TValue) => setValue(() => nextValue),
    }) satisfies TestFieldApi<TValue, TElement>;

  return {
    value,
    Field: (props: {
      name: string;
      validators?: unknown;
      children: (field: Accessor<TestFieldApi<TValue, TElement>>) => JSX.Element;
    }) => props.children(field),
  };
}

describe("TanStack field components", () => {
  test("ComboboxField renders field relationships and maps selected values", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createForm<string, HTMLInputElement>("");
    const dispose = render(
      () => (
        <ComboboxField
          form={form}
          name="profile.preference"
          label="Preference"
          description="Choose one"
          options={[
            { label: "Alpha", value: "alpha" },
            { label: "Beta", value: "beta" },
          ]}
        />
      ),
      host,
    );

    const input = host.querySelector<HTMLInputElement>("[data-slot='combobox-input']");

    expect(input).not.toBeNull();
    expect(input?.className).toContain("ui-combobox-field-input");
    expect(input?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(input?.getAttribute("aria-describedby")).toBeTruthy();
    expect(host.querySelector("input[type='hidden']")?.getAttribute("name")).toBe(
      "profile.preference",
    );

    dispose();
    host.remove();
  });

  test("SliderField renders one thumb and hidden input per value", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createForm<readonly number[], HTMLDivElement>([25, 75]);
    const dispose = render(
      () => (
        <SliderField
          form={form}
          name="profile.preference"
          label="Range"
          description="Choose a range"
        />
      ),
      host,
    );

    const slider = host.querySelector("[data-slot='slider-field-control']");
    const thumbs = host.querySelectorAll("[data-slot='slider-field-thumb']");
    const hiddenInputs = host.querySelectorAll("input[type='hidden']");

    expect(slider).not.toBeNull();
    expect(slider?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(thumbs).toHaveLength(2);
    expect(hiddenInputs).toHaveLength(2);
    expect(hiddenInputs[0]?.getAttribute("name")).toBe("profile.preference");

    dispose();
    host.remove();
  });

  test("FileField maps native selected files into TanStack field state", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createForm<readonly File[], HTMLInputElement>([]);
    const dispose = render(
      () => (
        <FileField
          form={form}
          name="profile.preference"
          label="Upload"
          description="Choose a file"
        />
      ),
      host,
    );
    const input = host.querySelector<HTMLInputElement>("[data-slot='file-field-input']");
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });

    Object.defineProperty(input, "files", { configurable: true, value: [file] });
    input?.dispatchEvent(new InputEvent("input", { bubbles: true }));

    expect(input?.getAttribute("type")).toBe("file");
    expect(input?.getAttribute("name")).toBe("profile.preference");
    expect(form.value()).toEqual([file]);

    dispose();
    host.remove();
  });

  test("DatePickerField renders trigger, hidden value, and popup calendar contract", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const form = createForm<string, HTMLButtonElement>("2026-05-05");
    const dispose = render(
      () => (
        <DatePickerField
          form={form}
          name="profile.preference"
          label="Date"
          description="Choose a date"
          placeholder="Select date"
          contentProps={{ forceMount: true }}
        />
      ),
      host,
    );

    const trigger = host.querySelector<HTMLButtonElement>(
      "[data-slot='date-picker-field-trigger']",
    );
    const hiddenInput = host.querySelector<HTMLInputElement>(
      "[data-slot='date-picker-field-hidden-input']",
    );
    const grid = host.querySelector("[data-scope='calendar'][data-part='grid']");

    expect(trigger?.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger?.getAttribute("aria-describedby")).toBeTruthy();
    expect(trigger?.textContent).toBe("2026-05-05");
    expect(hiddenInput?.value).toBe("2026-05-05");
    expect(hiddenInput?.getAttribute("name")).toBe("profile.preference");
    expect(grid?.getAttribute("role")).toBe("grid");

    dispose();
    host.remove();
  });
});
