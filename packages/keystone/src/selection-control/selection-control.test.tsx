import { createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Checkbox } from "../checkbox/index";
import { RadioGroup } from "../radio-group/index";
import { Switch } from "../switch/index";
import { click, getByPart, keyDown, render, settled } from "../../test/harness";

function parts(scope: string, part: string) {
  return Array.from(
    document.body.querySelectorAll<HTMLElement>(`[data-scope="${scope}"][data-part="${part}"]`),
  );
}

describe("Selection controls", () => {
  test("switch exposes role, checked state, hidden input, and preventable toggle", () => {
    const changes: boolean[] = [];

    render(() => (
      <Switch.Root
        defaultChecked
        name="newsletter"
        onCheckedChange={(checked) => changes.push(checked)}
      >
        <Switch.Control onClick={(event) => event.preventDefault()}>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch.Root>
    ));

    const control = getByPart("switch", "control");
    const input = getByPart("switch", "hidden-input") as HTMLInputElement;

    expect(control.getAttribute("role")).toBe("switch");
    expect(control.getAttribute("aria-checked")).toBe("true");
    expect(control.getAttribute("data-state")).toBe("checked");
    expect(input.checked).toBe(true);
    expect(input.name).toBe("newsletter");

    click(control);
    expect(input.checked).toBe(true);
    expect(changes).toEqual([]);
  });

  test("switch resets through its native input form owner", async () => {
    render(() => (
      <form>
        <Switch.Root defaultChecked name="notifications">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.HiddenInput />
        </Switch.Root>
      </form>
    ));

    const form = document.querySelector("form")!;
    click(getByPart("switch", "control"));
    expect(new FormData(form).get("notifications")).toBeNull();

    form.reset();
    await settled();

    expect(getByPart("switch", "control").getAttribute("aria-checked")).toBe("true");
    expect(new FormData(form).get("notifications")).toBe("on");
  });

  test("switch supports user-owned label and description composition", () => {
    render(() => (
      <Switch.Root>
        <span id="switch-label">Notifications</span>
        <span id="switch-description">Send activity updates.</span>
        <Switch.Control aria-describedby="switch-description" aria-labelledby="switch-label" />
        <Switch.HiddenInput />
      </Switch.Root>
    ));

    const control = getByPart("switch", "control");

    expect(control.getAttribute("aria-labelledby")).toBe("switch-label");
    expect(control.getAttribute("aria-describedby")).toBe("switch-description");
  });

  test("checkbox supports indeterminate state and keyboard toggling", () => {
    const changes: Array<boolean | "indeterminate"> = [];

    render(() => (
      <Checkbox.Root
        defaultChecked="indeterminate"
        name="terms"
        onCheckedChange={(checked) => changes.push(checked)}
      >
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
    ));

    const control = getByPart("checkbox", "control");
    const input = getByPart("checkbox", "hidden-input") as HTMLInputElement;

    expect(control.getAttribute("role")).toBe("checkbox");
    expect(control.getAttribute("aria-checked")).toBe("mixed");
    expect(control.getAttribute("data-state")).toBe("indeterminate");
    expect(input.indeterminate).toBe(true);

    keyDown(control, " ");
    expect(control.getAttribute("aria-checked")).toBe("true");
    expect(input.checked).toBe(true);
    expect(changes).toEqual([true]);
  });

  test("checkbox controlled state requests changes without mutating local state", () => {
    const changes: Array<boolean | "indeterminate"> = [];

    function Example() {
      const [checked] = createSignal(false);
      return (
        <Checkbox.Root checked={checked()} onCheckedChange={(next) => changes.push(next)}>
          <Checkbox.Control />
        </Checkbox.Root>
      );
    }

    render(() => <Example />);

    const control = getByPart("checkbox", "control");
    click(control);

    expect(control.getAttribute("aria-checked")).toBe("false");
    expect(changes).toEqual([true]);
  });

  test("checkbox submits, syncs, and resets through its native input", async () => {
    render(() => (
      <form>
        <Checkbox.Root defaultChecked name="terms">
          <Checkbox.Control />
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </form>
    ));

    const form = document.querySelector("form")!;
    const input = getByPart("checkbox", "hidden-input") as HTMLInputElement;

    expect(new FormData(form).get("terms")).toBe("on");

    click(getByPart("checkbox", "control"));
    expect(new FormData(form).get("terms")).toBeNull();

    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    await settled();
    expect(getByPart("checkbox", "control").getAttribute("aria-checked")).toBe("true");

    click(getByPart("checkbox", "control"));
    expect(new FormData(form).get("terms")).toBeNull();

    form.reset();
    await settled();

    expect(getByPart("checkbox", "control").getAttribute("aria-checked")).toBe("true");
    expect(new FormData(form).get("terms")).toBe("on");
  });

  test("checkbox required validation and external form reset use the native input", async () => {
    render(() => (
      <>
        <form id="legal" />
        <Checkbox.Root form="legal" name="terms" required>
          <span id="terms-label">Terms</span>
          <span id="terms-description">Required before continuing.</span>
          <Checkbox.Control aria-describedby="terms-description" aria-labelledby="terms-label" />
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </>
    ));

    const form = document.querySelector<HTMLFormElement>("#legal")!;
    const control = getByPart("checkbox", "control");
    const input = getByPart("checkbox", "hidden-input") as HTMLInputElement;

    expect(control.getAttribute("aria-labelledby")).toBe("terms-label");
    expect(control.getAttribute("aria-describedby")).toBe("terms-description");
    expect(input.form).toBe(form);
    expect(input.required).toBe(true);
    expect(input.checkValidity()).toBe(false);

    click(control);
    expect(input.checkValidity()).toBe(true);
    expect(new FormData(form).get("terms")).toBe("on");

    form.reset();
    await settled();

    expect(input.checkValidity()).toBe(false);
    expect(new FormData(form).get("terms")).toBeNull();
  });

  test("checkbox native input changes are preventable", async () => {
    const changes: Array<boolean | "indeterminate"> = [];

    render(() => (
      <Checkbox.Root onCheckedChange={(checked) => changes.push(checked)}>
        <Checkbox.Control />
        <Checkbox.HiddenInput onChange={(event) => event.preventDefault()} />
      </Checkbox.Root>
    ));

    const input = getByPart("checkbox", "hidden-input") as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    await settled();

    expect(getByPart("checkbox", "control").getAttribute("aria-checked")).toBe("false");
    expect(changes).toEqual([]);
  });

  test("radio group roves focus and selects with keyboard while skipping disabled items", () => {
    const changes: string[] = [];

    render(() => (
      <RadioGroup.Root
        defaultValue="small"
        name="size"
        onValueChange={(value) => changes.push(value ?? "")}
      >
        <RadioGroup.Item value="small">
          Small
          <RadioGroup.ItemIndicator />
          <RadioGroup.HiddenInput />
        </RadioGroup.Item>
        <RadioGroup.Item disabled value="medium">
          Medium
          <RadioGroup.ItemIndicator />
          <RadioGroup.HiddenInput />
        </RadioGroup.Item>
        <RadioGroup.Item value="large">
          Large
          <RadioGroup.ItemIndicator />
          <RadioGroup.HiddenInput />
        </RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const [small, medium, large] = parts("radio-group", "item");

    expect(getByPart("radio-group", "root").getAttribute("role")).toBe("radiogroup");
    expect(small.getAttribute("aria-checked")).toBe("true");
    expect(small.tabIndex).toBe(0);
    expect(medium.getAttribute("data-disabled")).toBe("");
    expect(large.tabIndex).toBe(-1);

    small.focus();
    keyDown(small, "ArrowDown");

    expect(document.activeElement).toBe(large);
    expect(large.getAttribute("aria-checked")).toBe("true");
    expect((parts("radio-group", "hidden-input")[2] as HTMLInputElement).checked).toBe(true);
    expect(changes).toEqual(["large"]);
  });

  test("radio group uses RTL-aware horizontal arrow navigation", () => {
    render(() => (
      <RadioGroup.Root defaultValue="one" dir="rtl" orientation="horizontal">
        <RadioGroup.Item value="one">One</RadioGroup.Item>
        <RadioGroup.Item value="two">Two</RadioGroup.Item>
        <RadioGroup.Item value="three">Three</RadioGroup.Item>
      </RadioGroup.Root>
    ));

    const [one, two] = parts("radio-group", "item");

    expect(getByPart("radio-group", "root").getAttribute("data-dir")).toBe("rtl");

    one.focus();
    keyDown(one, "ArrowLeft");

    expect(document.activeElement).toBe(two);
    expect(two.getAttribute("aria-checked")).toBe("true");
  });

  test("radio group resets through an external form owner", async () => {
    render(() => (
      <>
        <form id="settings" />
        <RadioGroup.Root defaultValue="small" form="settings" name="size">
          <RadioGroup.Item value="small">
            Small
            <RadioGroup.HiddenInput />
          </RadioGroup.Item>
          <RadioGroup.Item value="large">
            Large
            <RadioGroup.HiddenInput />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </>
    ));

    const [, large] = parts("radio-group", "item");
    click(large);

    const form = document.querySelector<HTMLFormElement>("#settings")!;
    expect(new FormData(form).get("size")).toBe("large");

    form.reset();
    await settled();

    expect(new FormData(form).get("size")).toBe("small");
    expect(parts("radio-group", "item")[0].getAttribute("aria-checked")).toBe("true");
  });

  test("radio group exposes label composition, required validation, and preventable item input", async () => {
    const changes: string[] = [];

    render(() => (
      <>
        <form id="profile" />
        <RadioGroup.Root
          aria-describedby="size-description"
          aria-labelledby="size-label"
          form="profile"
          name="size"
          required
          onValueChange={(value) => changes.push(value ?? "")}
        >
          <span id="size-label">Size</span>
          <span id="size-description">Choose one size.</span>
          <RadioGroup.Item value="small">
            Small
            <RadioGroup.HiddenInput onChange={(event) => event.preventDefault()} />
          </RadioGroup.Item>
          <RadioGroup.Item value="large">
            Large
            <RadioGroup.HiddenInput />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </>
    ));

    const form = document.querySelector<HTMLFormElement>("#profile")!;
    const root = getByPart("radio-group", "root");
    const [smallInput, largeInput] = parts("radio-group", "hidden-input") as HTMLInputElement[];

    expect(root.getAttribute("aria-labelledby")).toBe("size-label");
    expect(root.getAttribute("aria-describedby")).toBe("size-description");
    expect(smallInput?.form).toBe(form);
    expect(smallInput?.required).toBe(true);
    expect(largeInput?.required).toBe(true);
    expect(smallInput?.checkValidity()).toBe(false);

    smallInput!.checked = true;
    smallInput!.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    await settled();
    expect(parts("radio-group", "item")[0]?.getAttribute("aria-checked")).toBe("false");
    expect(changes).toEqual([]);

    click(parts("radio-group", "item")[1]!);
    expect(new FormData(form).get("size")).toBe("large");
    expect(largeInput?.checkValidity()).toBe(true);
    expect(changes).toEqual(["large"]);
  });
});
