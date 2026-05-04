import { createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { render, settled } from "../../test/harness";
import { createHiddenInputDescriptors, Field, FormControl } from "./index";

describe("form control and field contracts", () => {
  test("Field wires label, description, error, required, invalid, disabled, and readonly contracts", async () => {
    let input!: HTMLInputElement;

    render(() => (
      <Field.Root
        name="email"
        required
        readOnly
        validate={(context) => (context.value === "ok" ? undefined : "Use a work email")}
        validationMode="invalid"
      >
        <Field.Label>Email</Field.Label>
        <Field.Control
          ref={(element) => {
            input = element;
          }}
          type="email"
        />
        <Field.Description>Use your work email.</Field.Description>
        <Field.ErrorMessage />
      </Field.Root>
    ));

    const root = document.querySelector<HTMLElement>('[data-scope="field"][data-part="root"]');
    const label = document.querySelector<HTMLLabelElement>(
      '[data-scope="field"][data-part="label"]',
    );
    const description = document.querySelector<HTMLElement>(
      '[data-scope="field"][data-part="description"]',
    );

    expect(root?.getAttribute("data-required")).toBe("");
    expect(label?.htmlFor).toBe(input.id);
    expect(input.getAttribute("aria-labelledby")).toBe(label?.id);
    expect(input.getAttribute("aria-describedby")).toBe(description?.id);
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.getAttribute("aria-readonly")).toBe("true");
    expect(input.getAttribute("data-required")).toBe("");
    expect(input.getAttribute("data-readonly")).toBe("");

    input.dispatchEvent(new Event("invalid", { bubbles: true, cancelable: true }));
    await settled();

    const error = document.querySelector<HTMLElement>(
      '[data-scope="field"][data-part="error-message"]',
    );
    expect(error?.textContent).toBe("Use a work email");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(`${description?.id} ${error?.id}`);
    expect(input.getAttribute("data-invalid")).toBe("");
  });

  test("FormControl hidden input helpers serialize arrays as repeated native inputs", () => {
    const descriptors = createHiddenInputDescriptors({
      form: "settings",
      name: "tag",
      required: true,
      value: ["alpha", "beta"],
    });

    expect(descriptors).toEqual([
      { disabled: undefined, form: "settings", name: "tag", required: true, value: "alpha" },
      { disabled: undefined, form: "settings", name: "tag", required: true, value: "beta" },
    ]);

    render(() => (
      <form id="settings">
        <FormControl.Root name="tag" value={["alpha", "beta"]}>
          <FormControl.HiddenInput />
        </FormControl.Root>
      </form>
    ));

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '[data-scope="form-control"][data-part="hidden-input"]',
      ),
    );
    expect(inputs).toHaveLength(2);
    expect(inputs.map((input) => [input.name, input.value])).toEqual([
      ["tag", "alpha"],
      ["tag", "beta"],
    ]);
  });

  test("Field listens to the native owning form reset and restores validity state", async () => {
    let form!: HTMLFormElement;
    let input!: HTMLInputElement;

    render(() => (
      <form
        ref={(element) => {
          form = element;
        }}
      >
        <Field.Root
          name="project"
          defaultValue="initial"
          validate={() => "Project is required"}
          validationMode="invalid"
        >
          <Field.Label>Project</Field.Label>
          <Field.Control
            ref={(element) => {
              input = element;
            }}
          />
          <Field.ErrorMessage />
        </Field.Root>
      </form>
    ));

    input.dispatchEvent(new Event("invalid", { bubbles: true, cancelable: true }));
    await settled();
    expect(input.getAttribute("data-invalid")).toBe("");
    expect(
      document.querySelector('[data-scope="field"][data-part="error-message"]'),
    ).not.toBeNull();

    form.dispatchEvent(new Event("reset", { bubbles: true }));
    await settled();

    expect(input.getAttribute("data-invalid")).toBeNull();
    expect(document.querySelector('[data-scope="field"][data-part="error-message"]')).toBeNull();
  });

  test("FormControl reset listener follows a changed external form owner", () => {
    const [formId, setFormId] = createSignal("one");
    let resets = 0;
    let input!: HTMLInputElement;

    render(() => (
      <>
        <form id="one" />
        <form id="two" />
        <FormControl.Root form={formId()} name="project" value="keystone" onReset={() => resets++}>
          <FormControl.HiddenInput
            ref={(element) => {
              input = element;
            }}
          />
        </FormControl.Root>
      </>
    ));

    document.getElementById("one")?.dispatchEvent(new Event("reset", { bubbles: true }));
    expect(resets).toBe(1);

    setFormId("two");
    expect(input.form?.id).toBe("two");
    document.getElementById("one")?.dispatchEvent(new Event("reset", { bubbles: true }));
    document.getElementById("two")?.dispatchEvent(new Event("reset", { bubbles: true }));
    expect(resets).toBe(2);
  });
});
