import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxListbox,
} from "./combobox";

function settled() {
  return new Promise<void>((resolve) => queueMicrotask(resolve));
}

describe("Combobox", () => {
  test("lets local width classes size the input group", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <Combobox>
          <ComboboxInput aria-label="Project" class="w-72" placeholder="Search projects" />
        </Combobox>
      ),
      host,
    );

    const group = host.querySelector<HTMLElement>("[data-slot='combobox-input-group']");
    const input = host.querySelector<HTMLInputElement>("[data-slot='combobox-input']");

    expect(group?.classList.contains("w-72")).toBe(true);
    expect(group?.classList.contains("w-full")).toBe(false);
    expect(group?.classList.contains("max-w-full")).toBe(true);
    expect(input?.hasAttribute("readonly")).toBe(false);

    dispose();
    host.remove();
  });

  test("resolves Solid children to item labels before syncing the input value", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <Combobox defaultOpen>
          <ComboboxInput aria-label="Project" />
          <ComboboxContent>
            <ComboboxListbox>
              <ComboboxItem value="acme-dashboard">Acme Dashboard</ComboboxItem>
              <ComboboxItem value="billing-console">Billing Console</ComboboxItem>
            </ComboboxListbox>
          </ComboboxContent>
        </Combobox>
      ),
      host,
    );

    const input = host.querySelector<HTMLInputElement>("[data-slot='combobox-input']");
    const item = document.querySelector<HTMLElement>("[data-value='billing-console']");

    item?.click();
    await settled();

    expect(input?.value).toBe("Billing Console");
    expect(input?.value).not.toContain("function");

    dispose();
    host.remove();
  });

  test("renders the selected item indicator only for the selected value", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <Combobox defaultOpen defaultInputValue="Acme Dashboard" defaultValue="acme-dashboard">
          <ComboboxInput aria-label="Project" />
          <ComboboxContent>
            <ComboboxListbox>
              <ComboboxItem value="acme-dashboard">Acme Dashboard</ComboboxItem>
              <ComboboxItem value="billing-console">Billing Console</ComboboxItem>
            </ComboboxListbox>
          </ComboboxContent>
        </Combobox>
      ),
      host,
    );

    const indicators = document.querySelectorAll("[data-slot='combobox-item-indicator']");

    expect(indicators).toHaveLength(1);
    expect(indicators[0]?.closest("[data-value]")?.getAttribute("data-value")).toBe(
      "acme-dashboard",
    );

    dispose();
    host.remove();
  });
});
