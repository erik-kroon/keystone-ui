import { createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { getByPart, keyDown, render, settled } from "../../test/harness";
import { SpinButton } from "./index";

function inputValue(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true }));
}

function blur(element: HTMLElement) {
  element.dispatchEvent(new FocusEvent("blur", { bubbles: true, cancelable: true }));
}

describe("SpinButton", () => {
  test("exposes root, input, and trigger metadata with spinbutton ARIA", () => {
    render(() => (
      <SpinButton.Root id="quantity" defaultValue={2} min={0} max={10} step={2} required invalid>
        <SpinButton.DecrementTrigger>Down</SpinButton.DecrementTrigger>
        <SpinButton.Input aria-label="Quantity" />
        <SpinButton.IncrementTrigger>Up</SpinButton.IncrementTrigger>
      </SpinButton.Root>
    ));

    const input = getByPart("spin-button", "input");

    expect(getByPart("spin-button", "root").getAttribute("data-invalid")).toBe("");
    expect(input.getAttribute("id")).toBe("quantity");
    expect(input.getAttribute("role")).toBe("spinbutton");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
    expect(input.getAttribute("aria-valuenow")).toBe("2");
    expect(input.getAttribute("data-required")).toBe("");
    expect(getByPart("spin-button", "increment-trigger").getAttribute("aria-controls")).toBe(
      "quantity",
    );
  });

  test("updates uncontrolled value from keyboard and trigger buttons", () => {
    const changes: Array<{ reason: string; value: number | undefined }> = [];

    render(() => (
      <SpinButton.Root
        defaultValue={5}
        min={0}
        max={20}
        step={5}
        onValueChange={(value, detail) => changes.push({ value, reason: detail.reason })}
      >
        <SpinButton.DecrementTrigger>Down</SpinButton.DecrementTrigger>
        <SpinButton.Input />
        <SpinButton.IncrementTrigger>Up</SpinButton.IncrementTrigger>
      </SpinButton.Root>
    ));

    const input = getByPart("spin-button", "input");

    keyDown(input, "ArrowUp");
    expect(input.getAttribute("aria-valuenow")).toBe("10");

    getByPart("spin-button", "increment-trigger").click();
    expect(input.getAttribute("aria-valuenow")).toBe("15");

    keyDown(input, "PageDown");
    expect(input.getAttribute("aria-valuenow")).toBe("0");
    expect(getByPart("spin-button", "decrement-trigger").hasAttribute("disabled")).toBe(true);
    expect(changes.map((change) => change.reason)).toEqual(["keyboard", "increment", "keyboard"]);
  });

  test("supports controlled value updates", () => {
    const [value, setValue] = createSignal<number | undefined>(1);

    render(() => (
      <SpinButton.Root value={value()} min={0} max={5} onValueChange={setValue}>
        <SpinButton.Input />
        <SpinButton.IncrementTrigger>Up</SpinButton.IncrementTrigger>
      </SpinButton.Root>
    ));

    const input = getByPart("spin-button", "input");

    expect((input as HTMLInputElement).value).toBe("1");
    keyDown(input, "ArrowUp");
    expect(value()).toBe(2);
    expect(input.getAttribute("aria-valuenow")).toBe("2");
    expect((input as HTMLInputElement).value).toBe("2");
  });

  test("lets user handlers prevent internal keyboard changes", () => {
    render(() => (
      <SpinButton.Root defaultValue={1}>
        <SpinButton.Input onKeyDown={(event) => event.preventDefault()} />
      </SpinButton.Root>
    ));

    const input = getByPart("spin-button", "input");

    keyDown(input, "ArrowUp");
    expect(input.getAttribute("aria-valuenow")).toBe("1");
  });

  test("parses typed input and clamps on blur", () => {
    render(() => (
      <SpinButton.Root defaultValue={2} min={0} max={10} step={0.5}>
        <SpinButton.Input />
      </SpinButton.Root>
    ));

    const input = getByPart("spin-button", "input") as HTMLInputElement;

    inputValue(input, "4.6");
    expect(input.getAttribute("aria-valuenow")).toBe("4.5");

    inputValue(input, "99");
    blur(input);
    expect(input.value).toBe("10");
    expect(input.getAttribute("data-at-max")).toBe("");
  });

  test("resets to the default value with native form reset", async () => {
    render(() => (
      <form>
        <SpinButton.Root defaultValue={3} name="amount">
          <SpinButton.Input />
        </SpinButton.Root>
        <button type="reset">Reset</button>
      </form>
    ));

    const input = getByPart("spin-button", "input") as HTMLInputElement;

    keyDown(input, "ArrowUp");
    expect(input.value).toBe("4");

    document.querySelector("form")?.reset();
    await settled();
    expect(input.value).toBe("3");
    expect(input.getAttribute("name")).toBe("amount");
  });
});
