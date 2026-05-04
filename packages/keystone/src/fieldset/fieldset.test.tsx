import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { render, settled } from "../../test/harness";
import { Fieldset, createFieldset } from "./index";

describe("fieldset", () => {
  test("wires legend, description, error, and grouped state attributes", async () => {
    const [invalid, setInvalid] = createSignal(false);

    render(() => (
      <Fieldset.Root required readOnly invalid={invalid()}>
        <Fieldset.Legend>Notification channels</Fieldset.Legend>
        <Fieldset.Description>Choose at least one channel.</Fieldset.Description>
        <Fieldset.ErrorMessage>Select a channel.</Fieldset.ErrorMessage>
        <label>
          <input type="checkbox" name="channel" value="email" />
          Email
        </label>
      </Fieldset.Root>
    ));

    const root = document.querySelector<HTMLFieldSetElement>(
      '[data-scope="fieldset"][data-part="root"]',
    )!;
    const legend = document.querySelector<HTMLLegendElement>(
      '[data-scope="fieldset"][data-part="legend"]',
    )!;
    const description = document.querySelector<HTMLElement>(
      '[data-scope="fieldset"][data-part="description"]',
    )!;

    expect(root.tagName).toBe("FIELDSET");
    expect(legend.tagName).toBe("LEGEND");
    expect(root.getAttribute("aria-labelledby")).toBe(legend.id);
    expect(root.getAttribute("aria-describedby")).toBe(description.id);
    expect(root.getAttribute("aria-required")).toBe("true");
    expect(root.getAttribute("aria-readonly")).toBe("true");
    expect(root.getAttribute("data-required")).toBe("");
    expect(root.getAttribute("data-readonly")).toBe("");
    expect(document.querySelector('[data-scope="fieldset"][data-part="error-message"]')).toBeNull();

    setInvalid(true);
    await settled();

    const error = document.querySelector<HTMLElement>(
      '[data-scope="fieldset"][data-part="error-message"]',
    )!;
    expect(error.getAttribute("role")).toBe("alert");
    expect(root.getAttribute("aria-invalid")).toBe("true");
    expect(root.getAttribute("aria-describedby")).toBe(`${description.id} ${error.id}`);
    expect(root.getAttribute("data-invalid")).toBe("");
  });

  test("native disabled fieldset exposes disabled state", () => {
    render(() => (
      <form>
        <Fieldset.Root disabled>
          <Fieldset.Legend>Channels</Fieldset.Legend>
          <input name="channel" value="email" />
        </Fieldset.Root>
      </form>
    ));

    const root = document.querySelector<HTMLFieldSetElement>(
      '[data-scope="fieldset"][data-part="root"]',
    )!;

    expect(root.disabled).toBe(true);
    expect(root.getAttribute("data-disabled")).toBe("");
    expect(root.querySelector<HTMLInputElement>("input")?.name).toBe("channel");
  });

  test("createFieldset exposes prop getters for custom composition", () => {
    createRoot((dispose) => {
      const fieldset = createFieldset({
        invalid: () => true,
        required: () => true,
      });

      const rootProps = fieldset.getRootProps({ "aria-describedby": "external-help" });
      const legendProps = fieldset.getLegendProps();

      expect(rootProps["aria-labelledby"]).toBe(legendProps.id);
      expect(rootProps["aria-describedby"]).toBe(
        `${fieldset.descriptionId()} ${fieldset.errorMessageId()} external-help`,
      );
      expect(rootProps["aria-invalid"]).toBe("true");
      expect(rootProps["data-required"]).toBe("");
      dispose();
    });
  });
});
