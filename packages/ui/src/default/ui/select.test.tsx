import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

async function settled() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("Select", () => {
  test("renders simple item text as the selected value without stretching by default", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <Select defaultOpen defaultValue="solid">
          <SelectTrigger>
            <SelectValue placeholder="Choose a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
          </SelectContent>
        </Select>
      ),
      host,
    );

    const trigger = host.querySelector<HTMLElement>("[data-slot='select-trigger']");
    const value = host.querySelector<HTMLElement>("[data-slot='select-value']");

    expect(value?.textContent).toBe("Solid");
    expect(trigger?.classList.contains("w-full")).toBe(false);
    expect(trigger?.classList.contains("max-w-full")).toBe(true);
    expect(document.querySelectorAll("[data-slot='select-item-indicator']")).toHaveLength(1);

    dispose();
    host.remove();
  });

  test("keeps the selected label after the portaled popup closes", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
          </SelectContent>
        </Select>
      ),
      host,
    );

    const trigger = host.querySelector<HTMLButtonElement>("[data-slot='select-trigger']");
    const value = host.querySelector<HTMLElement>("[data-slot='select-value']");

    expect(value?.textContent).toBe("Choose a framework");

    trigger?.click();
    await settled();
    document.querySelector<HTMLElement>("[data-slot='select-item']")?.click();
    await settled();

    expect(document.querySelector("[data-slot='select-content']")).toBeNull();
    expect(value?.textContent).toBe("Solid");

    dispose();
    host.remove();
  });
});
