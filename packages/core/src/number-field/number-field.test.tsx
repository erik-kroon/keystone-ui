import { describe, expect, test } from "vitest";
import { getByPart, keyDown, render, settled } from "../../test/harness";
import { NumberField } from "./index";

describe("NumberField", () => {
  test("exposes number-field scoped parts backed by spinbutton behavior", () => {
    render(() => (
      <NumberField.Root id="seats" defaultValue={2} min={1} max={4} name="seats" required>
        <NumberField.DecrementTrigger>Down</NumberField.DecrementTrigger>
        <NumberField.Input aria-label="Seats" />
        <NumberField.IncrementTrigger>Up</NumberField.IncrementTrigger>
      </NumberField.Root>
    ));

    const input = getByPart("number-field", "input");

    expect(getByPart("number-field", "root").getAttribute("data-required")).toBe("");
    expect(input.getAttribute("role")).toBe("spinbutton");
    expect(input.getAttribute("id")).toBe("seats");
    expect(input.getAttribute("name")).toBe("seats");
    expect(input.getAttribute("aria-valuenow")).toBe("2");
    expect(getByPart("number-field", "increment-trigger").getAttribute("aria-controls")).toBe(
      "seats",
    );
  });

  test("updates, clamps, and resets through the shared numeric controller", async () => {
    const changes: number[] = [];

    render(() => (
      <form>
        <NumberField.Root
          defaultValue={1}
          min={1}
          max={2}
          onValueChange={(value) => {
            if (value !== undefined) changes.push(value);
          }}
        >
          <NumberField.DecrementTrigger>Down</NumberField.DecrementTrigger>
          <NumberField.Input />
          <NumberField.IncrementTrigger>Up</NumberField.IncrementTrigger>
        </NumberField.Root>
      </form>
    ));

    const input = getByPart("number-field", "input") as HTMLInputElement;

    keyDown(input, "ArrowUp");
    keyDown(input, "ArrowUp");
    expect(input.value).toBe("2");
    expect(getByPart("number-field", "increment-trigger").hasAttribute("disabled")).toBe(true);

    document.querySelector("form")?.reset();
    await settled();
    expect(input.value).toBe("1");
    expect(changes).toEqual([2, 1]);
  });
});
