import { describe, expect, test } from "vitest";
import { Autocomplete, createAutocomplete } from "./index";
import { render, settled } from "../../test/harness";

describe("autocomplete", () => {
  test("uses autocomplete scope while preserving combobox keyboard and ARIA behavior", async () => {
    const changes: string[] = [];

    render(() => (
      <Autocomplete.Root defaultOpen onValueChange={(value) => changes.push(value ?? "")}>
        <Autocomplete.Input />
        <Autocomplete.Content>
          <Autocomplete.Listbox>
            <Autocomplete.Item value="alpha">Alpha</Autocomplete.Item>
            <Autocomplete.Item value="bravo">Bravo</Autocomplete.Item>
          </Autocomplete.Listbox>
        </Autocomplete.Content>
      </Autocomplete.Root>
    ));

    const input = document.querySelector<HTMLInputElement>(
      '[data-scope="autocomplete"][data-part="input"]',
    )!;
    const listbox = document.querySelector<HTMLElement>(
      '[data-scope="autocomplete"][data-part="listbox"]',
    )!;

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    expect(listbox.getAttribute("role")).toBe("listbox");

    input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }));
    input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    await settled();

    expect(changes).toEqual(["alpha"]);
  });

  test("createAutocomplete defaults its public scope to autocomplete", () => {
    const autocomplete = createAutocomplete();

    expect(autocomplete.scope).toBe("autocomplete");
    expect(autocomplete.getInputProps({})["data-scope"]).toBe("autocomplete");
  });
});
