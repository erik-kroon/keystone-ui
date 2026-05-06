import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  test("renders one visible control and toggles the indicator from that control", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const [checked, setChecked] = createSignal(false);

    const dispose = render(
      () => <Checkbox checked={checked()} onCheckedChange={setChecked} name="digest" />,
      host,
    );
    const control = host.querySelector<HTMLButtonElement>("[data-slot='checkbox']");
    const input = host.querySelector<HTMLInputElement>("[data-slot='checkbox-input']");

    expect(control).not.toBeNull();
    expect(input?.type).toBe("checkbox");
    expect(input?.classList.contains("ui-checkbox-input")).toBe(true);
    expect(input?.classList.contains("sr-only")).toBe(true);
    expect(host.querySelector("[data-slot='checkbox-indicator']")).toBeNull();

    control?.click();

    expect(checked()).toBe(true);
    expect(host.querySelector("[data-slot='checkbox-indicator']")).not.toBeNull();

    dispose();
    host.remove();
  });
});
