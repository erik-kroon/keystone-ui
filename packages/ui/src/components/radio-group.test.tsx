import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  test("renders one visible control per item and keeps native inputs visually hidden", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const [value, setValue] = createSignal("email");

    const dispose = render(
      () => (
        <RadioGroup value={value()} onValueChange={setValue} name="notifications">
          <RadioGroupItem value="email">Email notifications</RadioGroupItem>
          <RadioGroupItem value="sms">SMS notifications</RadioGroupItem>
          <RadioGroupItem value="none">No notifications</RadioGroupItem>
        </RadioGroup>
      ),
      host,
    );
    const items = host.querySelectorAll<HTMLButtonElement>("[data-slot='radio-group-item']");
    const controls = host.querySelectorAll<HTMLElement>("[data-slot='radio']");
    const inputs = host.querySelectorAll<HTMLInputElement>("[data-slot='radio-group-input']");

    expect(items).toHaveLength(3);
    expect(controls).toHaveLength(3);
    expect(inputs).toHaveLength(3);
    inputs.forEach((input) => {
      expect(input.type).toBe("radio");
      expect(input.classList.contains("ui-radio-group-input")).toBe(true);
      expect(input.classList.contains("sr-only")).toBe(true);
    });
    expect(host.querySelectorAll("[data-slot='radio-indicator']")).toHaveLength(3);
    expect(host.querySelectorAll("[data-slot='radio-indicator'][data-checked]")).toHaveLength(1);

    items[1]?.click();

    expect(value()).toBe("sms");
    expect(items[1]?.getAttribute("data-checked")).toBe("");
    expect(inputs[1]?.checked).toBe(true);
    expect(host.querySelector("[data-slot='radio-indicator'][data-checked]")).toBe(
      host.querySelectorAll("[data-slot='radio-indicator']")[1],
    );

    dispose();
    host.remove();
  });
});
