import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Label } from "./label";
import { Switch } from "./switch";

describe("Switch", () => {
  test("renders one visible control and keeps the native input visually hidden", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const [checked, setChecked] = createSignal(false);

    const dispose = render(
      () => <Switch checked={checked()} onCheckedChange={setChecked} name="notifications" />,
      host,
    );
    const control = host.querySelector<HTMLButtonElement>("[data-slot='switch']");
    const input = host.querySelector<HTMLInputElement>("[data-slot='switch-input']");

    expect(control).not.toBeNull();
    expect(control?.classList.contains("data-[state=unchecked]:bg-input")).toBe(true);
    expect(input?.type).toBe("checkbox");
    expect(input?.classList.contains("ui-switch-input")).toBe(true);
    expect(input?.classList.contains("sr-only")).toBe(true);
    expect(host.querySelector("[data-slot='switch-thumb']")).not.toBeNull();

    control?.click();

    expect(checked()).toBe(true);

    dispose();
    host.remove();
  });

  test("supports the label-wrapped composition API", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const [checked, setChecked] = createSignal(false);

    const dispose = render(
      () => (
        <Label>
          <Switch checked={checked()} onCheckedChange={setChecked} />
          Enable notifications
        </Label>
      ),
      host,
    );
    const label = host.querySelector<HTMLLabelElement>("[data-slot='label']");

    expect(label).not.toBeNull();

    label?.click();

    expect(checked()).toBe(true);

    dispose();
    host.remove();
  });
});
