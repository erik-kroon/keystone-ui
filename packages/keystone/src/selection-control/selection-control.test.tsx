import { createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Checkbox } from "../checkbox/index";
import { RadioGroup } from "../radio-group/index";
import { Switch } from "../switch/index";
import { click, getByPart, keyDown, render } from "../../test/harness";

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
});
