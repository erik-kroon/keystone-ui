import { createRoot } from "solid-js";
import { describe, expect, test } from "vitest";
import { Command, createCommand } from "../src/command/index";
import { click, getByPart, keyDown, render, settled } from "./harness";

function inputText(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true }));
}

describe("Command behavior harness", () => {
  test("exposes command-scoped combobox and listbox accessibility contracts", async () => {
    const values: string[] = [];
    const inputs: string[] = [];

    render(() => (
      <Command.Root
        name="action"
        onInputValueChange={(value) => inputs.push(value)}
        onValueChange={(value) => values.push(value ?? "")}
      >
        <Command.Input placeholder="Run command" />
        <Command.Clear>Clear</Command.Clear>
        <Command.Content>
          <Command.Listbox>
            <Command.Group value="workspace">
              <Command.GroupLabel>Workspace</Command.GroupLabel>
              <Command.Item value="open-file">Open file</Command.Item>
              <Command.Item value="delete-file" disabled>
                Delete file
              </Command.Item>
              <Command.Item value="open-settings">Open settings</Command.Item>
            </Command.Group>
          </Command.Listbox>
        </Command.Content>
      </Command.Root>
    ));

    const input = getByPart("command", "input") as HTMLInputElement;
    inputText(input, "open");
    await settled();

    const listbox = getByPart("command", "listbox");
    const group = getByPart("command", "group");
    const groupLabel = getByPart("command", "group-label");

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    expect(listbox.getAttribute("role")).toBe("listbox");
    expect(group.getAttribute("role")).toBe("group");
    expect(group.getAttribute("aria-labelledby")).toBe(groupLabel.id);
    expect(inputs).toEqual(["open"]);

    keyDown(input, "ArrowDown");
    keyDown(input, "ArrowDown");
    expect(
      document.querySelector('[data-scope="command"][data-part="item"][data-highlighted]')
        ?.textContent,
    ).toBe("Open settings");

    keyDown(input, "Enter");
    await settled();

    expect(values).toEqual(["open-settings"]);
    expect(input.value).toBe("Open settings");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(
      new FormData(document.querySelector("form") ?? document.createElement("form")).get("action"),
    ).toBeNull();
  });

  test("serializes selected command value and resets with the owning form", async () => {
    render(() => (
      <form>
        <Command.Root name="action" defaultValue="open-file" defaultInputValue="Open file">
          <Command.Input />
          <Command.Content>
            <Command.Listbox>
              <Command.Item value="open-file">Open file</Command.Item>
              <Command.Item value="open-settings">Open settings</Command.Item>
            </Command.Listbox>
          </Command.Content>
        </Command.Root>
      </form>
    ));

    const input = getByPart("command", "input") as HTMLInputElement;
    keyDown(input, "ArrowDown");
    keyDown(input, "ArrowDown");
    keyDown(input, "Enter");
    await settled();

    const form = document.querySelector("form")!;
    expect(new FormData(form).get("action")).toBe("open-settings");

    form.reset();
    await settled();

    expect(new FormData(form).get("action")).toBe("open-file");
  });

  test("clear button resets query and selected command value", async () => {
    const values: string[] = [];

    render(() => (
      <form>
        <Command.Root
          name="action"
          defaultValue="open-file"
          defaultInputValue="Open file"
          onValueChange={(value) => values.push(value ?? "")}
        >
          <Command.Input />
          <Command.Clear>Clear</Command.Clear>
          <Command.Content>
            <Command.Listbox>
              <Command.Item value="open-file">Open file</Command.Item>
            </Command.Listbox>
          </Command.Content>
        </Command.Root>
      </form>
    ));

    click(getByPart("command", "clear"));
    await settled();

    expect((getByPart("command", "input") as HTMLInputElement).value).toBe("");
    expect(new FormData(document.querySelector("form")!).get("action")).toBe("");
    expect(values).toEqual([""]);
  });

  test("createCommand defaults its public scope to command", () => {
    createRoot((dispose) => {
      const command = createCommand();

      expect(command.scope).toBe("command");
      expect(command.getInputProps({})["data-scope"]).toBe("command");
      expect(command.getListboxProps({})["data-scope"]).toBe("command");

      dispose();
    });
  });
});
