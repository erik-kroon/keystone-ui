import { render } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { DatePicker, DatePickerContent, DatePickerTrigger } from "./date-picker";

async function settled() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("DatePicker", () => {
  test("portals popup content outside clipped ancestors", async () => {
    const host = document.createElement("div");
    document.body.append(host);

    const dispose = render(
      () => (
        <div data-testid="clipped" style={{ overflow: "hidden" }}>
          <DatePicker defaultMonth="2026-05">
            <DatePickerTrigger placeholder="Select date" />
            <DatePickerContent />
          </DatePicker>
        </div>
      ),
      host,
    );

    host.querySelector<HTMLButtonElement>("[data-slot='date-picker-trigger']")?.click();
    await settled();

    const clipped = host.querySelector<HTMLElement>("[data-testid='clipped']");
    const content = document.body.querySelector<HTMLElement>("[data-slot='date-picker-content']");
    const positioner = document.body.querySelector<HTMLElement>(
      "[data-slot='date-picker-positioner']",
    );

    expect(content).toBeInstanceOf(HTMLElement);
    expect(positioner).toBeInstanceOf(HTMLElement);
    expect(clipped?.contains(content)).toBe(false);
    expect(clipped?.contains(positioner)).toBe(false);
    expect(positioner?.className).not.toContain("transition-[top,left,right,bottom,transform]");

    dispose();
    host.remove();
  });
});
