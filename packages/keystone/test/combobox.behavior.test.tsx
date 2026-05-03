import { describe, expect, test } from "vitest";
import { Autocomplete, Combobox } from "../src/combobox/index";
import { click, getByPart, keyDown, render, settled } from "./harness";

function inputText(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true }));
}

describe("Combobox behavior harness", () => {
  test("opens from input, highlights with keyboard, and selects a value", async () => {
    const values: string[] = [];
    const inputs: string[] = [];

    render(() => (
      <Combobox.Root
        name="project"
        onInputValueChange={(value) => inputs.push(value)}
        onValueChange={(value) => values.push(value ?? "")}
      >
        <Combobox.Input placeholder="Project" />
        <Combobox.Content>
          <Combobox.Listbox>
            <Combobox.Item value="alpha">Alpha</Combobox.Item>
            <Combobox.Item value="beta" disabled>
              Beta
            </Combobox.Item>
            <Combobox.Item value="bravo">Bravo</Combobox.Item>
          </Combobox.Listbox>
        </Combobox.Content>
      </Combobox.Root>
    ));

    const input = getByPart("combobox", "input") as HTMLInputElement;
    inputText(input, "br");
    await settled();

    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(inputs).toEqual(["br"]);

    keyDown(input, "ArrowDown");
    keyDown(input, "ArrowDown");
    expect(
      document.querySelector('[data-scope="combobox"][data-part="item"][data-highlighted]')
        ?.textContent,
    ).toBe("Bravo");

    keyDown(input, "Enter");
    await settled();

    expect(values).toEqual(["bravo"]);
    expect(input.value).toBe("Bravo");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(
      new FormData(document.querySelector("form") ?? document.createElement("form")).get("project"),
    ).toBeNull();
  });

  test("serializes selected value through a hidden input and resets with its form", async () => {
    render(() => (
      <form>
        <Combobox.Root name="project" defaultValue="alpha" defaultInputValue="Alpha">
          <Combobox.Input />
          <Combobox.Content>
            <Combobox.Listbox>
              <Combobox.Item value="alpha">Alpha</Combobox.Item>
              <Combobox.Item value="bravo">Bravo</Combobox.Item>
            </Combobox.Listbox>
          </Combobox.Content>
        </Combobox.Root>
      </form>
    ));

    const input = getByPart("combobox", "input") as HTMLInputElement;
    keyDown(input, "ArrowDown");
    keyDown(input, "ArrowDown");
    keyDown(input, "Enter");
    await settled();

    const form = document.querySelector("form")!;
    expect(new FormData(form).get("project")).toBe("bravo");

    form.reset();
    await settled();

    expect(new FormData(form).get("project")).toBe("alpha");
  });

  test("clear button resets input and selected value", async () => {
    const values: string[] = [];

    render(() => (
      <form>
        <Combobox.Root
          name="project"
          defaultValue="alpha"
          defaultInputValue="Alpha"
          onValueChange={(value) => values.push(value ?? "")}
        >
          <Combobox.Input />
          <Combobox.Clear>Clear</Combobox.Clear>
          <Combobox.Content>
            <Combobox.Listbox>
              <Combobox.Item value="alpha">Alpha</Combobox.Item>
            </Combobox.Listbox>
          </Combobox.Content>
        </Combobox.Root>
      </form>
    ));

    click(getByPart("combobox", "clear"));
    await settled();

    expect((getByPart("combobox", "input") as HTMLInputElement).value).toBe("");
    expect(new FormData(document.querySelector("form")!).get("project")).toBe("");
    expect(values).toEqual([""]);
  });

  test("autocomplete shares combobox behavior under its own scope", async () => {
    render(() => (
      <Autocomplete.Root defaultOpen>
        <Autocomplete.Input />
        <Autocomplete.Content>
          <Autocomplete.Listbox>
            <Autocomplete.Group value="recent">
              <Autocomplete.GroupLabel>Recent</Autocomplete.GroupLabel>
              <Autocomplete.Item value="alpha">Alpha</Autocomplete.Item>
            </Autocomplete.Group>
          </Autocomplete.Listbox>
        </Autocomplete.Content>
      </Autocomplete.Root>
    ));

    const input = getByPart("autocomplete", "input");
    const listbox = getByPart("autocomplete", "listbox");

    expect(input.getAttribute("role")).toBe("combobox");
    expect(listbox.getAttribute("role")).toBe("listbox");
    expect(getByPart("autocomplete", "group").getAttribute("role")).toBe("group");
  });
});
