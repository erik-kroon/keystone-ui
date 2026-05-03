import { describe, expect, test } from "vitest";
import { Select } from "../src/select/index";
import { click, getByPart, keyDown, render, settled } from "./harness";

describe("Select behavior harness", () => {
  test("navigates enabled items, supports typeahead, and selects from the keyboard", async () => {
    const changes: string[] = [];

    render(() => (
      <Select.Root defaultOpen onValueChange={(value) => changes.push(value ?? "")}>
        <Select.Trigger>Choose project</Select.Trigger>
        <Select.Content>
          <Select.Listbox>
            <Select.Item value="alpha">Alpha</Select.Item>
            <Select.Item value="beta" disabled>
              Beta
            </Select.Item>
            <Select.Item value="bravo">Bravo</Select.Item>
          </Select.Listbox>
        </Select.Content>
      </Select.Root>
    ));

    const listbox = getByPart("select", "listbox");

    keyDown(listbox, "ArrowDown");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Alpha",
    );

    keyDown(listbox, "b");
    expect(document.querySelector('[data-part="item"][data-highlighted]')?.textContent).toBe(
      "Bravo",
    );

    keyDown(listbox, "Enter");
    await settled();

    expect(changes).toEqual(["bravo"]);
    expect(getByPart("select", "trigger").getAttribute("aria-expanded")).toBe("false");
  });

  test("submits and resets through the form-control kernel hidden input", async () => {
    render(() => (
      <form>
        <Select.Root name="project" defaultValue="alpha">
          <Select.Trigger>Choose project</Select.Trigger>
          <Select.Content>
            <Select.Listbox>
              <Select.Item value="alpha">Alpha</Select.Item>
              <Select.Item value="bravo">Bravo</Select.Item>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      </form>
    ));

    click(getByPart("select", "trigger"));
    await settled();
    const bravo = Array.from(document.querySelectorAll<HTMLElement>('[data-part="item"]')).find(
      (item) => item.textContent === "Bravo",
    )!;
    click(bravo);
    await settled();

    const form = document.querySelector("form")!;
    expect(new FormData(form).get("project")).toBe("bravo");

    form.reset();
    await settled();

    expect(new FormData(form).get("project")).toBe("alpha");
  });

  test("exposes floating geometry variables on the positioner", async () => {
    render(() => (
      <Select.Root defaultOpen placement="bottom-start">
        <Select.Trigger>Choose project</Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Content>
              <Select.Listbox>
                <Select.Item value="alpha">Alpha</Select.Item>
              </Select.Listbox>
            </Select.Content>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    ));

    const trigger = getByPart("select", "trigger");
    const positioner = getByPart("select", "positioner");

    trigger.getBoundingClientRect = () =>
      ({
        bottom: 48,
        height: 32,
        left: 12,
        right: 132,
        top: 16,
        width: 120,
      }) as DOMRect;
    positioner.getBoundingClientRect = () =>
      ({
        bottom: 0,
        height: 64,
        left: 0,
        right: 0,
        top: 0,
        width: 180,
      }) as DOMRect;

    window.dispatchEvent(new Event("resize"));
    await settled();

    expect(positioner.getAttribute("data-side")).toBe("bottom");
    expect(positioner.getAttribute("data-align")).toBe("start");
    expect(positioner.style.getPropertyValue("--keystone-anchor-width")).toBe("120px");
  });
});
