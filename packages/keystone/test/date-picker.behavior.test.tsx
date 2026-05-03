import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Calendar, DatePicker, createCalendar } from "../src/date-picker/index";
import { click, getByPart, keyDown, queryByPart, render, settled } from "./harness";

function getDay(value: string) {
  const element = document.body.querySelector<HTMLButtonElement>(
    `[data-scope="calendar"][data-part="cell-trigger"][data-date="${value}"]`,
  );

  if (!element) throw new Error(`Unable to find calendar day ${value}`);
  return element;
}

describe("Calendar behavior", () => {
  test("renders the grid contract and selects a date", async () => {
    const changes: string[] = [];

    render(() => (
      <Calendar.Root
        defaultMonth="2026-05"
        onValueChange={(value, detail) => changes.push(`${value}:${detail.reason}`)}
      />
    ));

    expect(getByPart("calendar", "root").getAttribute("data-scope")).toBe("calendar");
    expect(getByPart("calendar", "grid").getAttribute("role")).toBe("grid");
    expect(
      document.body.querySelectorAll('[data-scope="calendar"][data-part="column-header"]'),
    ).toHaveLength(7);

    const day = getDay("2026-05-15");
    click(day);
    await settled();

    expect(changes).toEqual(["2026-05-15:cell"]);
    expect(getDay("2026-05-15").getAttribute("data-selected")).toBe("");
    expect(getByPart("calendar", "root").getAttribute("data-value")).toBe("2026-05-15");
  });

  test("navigates months and respects prevented user events", () => {
    const months: string[] = [];

    render(() => (
      <Calendar.Root defaultMonth="2026-05" onMonthChange={(month) => months.push(month)}>
        <Calendar.Header>
          <Calendar.PreviousTrigger onClick={(event) => event.preventDefault()} />
          <Calendar.Heading />
          <Calendar.NextTrigger />
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar.Root>
    ));

    expect(getByPart("calendar", "heading").textContent).toBe("May 2026");

    click(getByPart("calendar", "prev-trigger"));
    expect(months).toEqual([]);
    expect(getByPart("calendar", "heading").textContent).toBe("May 2026");

    click(getByPart("calendar", "next-trigger"));
    expect(months).toEqual(["2026-06"]);
    expect(getByPart("calendar", "heading").textContent).toBe("June 2026");
  });

  test("supports controlled state, disabled bounds, and keyboard movement", async () => {
    render(() => (
      <Calendar.Root
        defaultMonth="2026-05"
        defaultValue="2026-05-15"
        minValue="2026-05-10"
        maxValue="2026-05-20"
      />
    ));

    const selected = getDay("2026-05-15");
    selected.focus();
    keyDown(selected, "ArrowRight");
    await settled();
    expect(document.activeElement).toBe(getDay("2026-05-16"));

    const disabled = getDay("2026-05-09");
    expect(disabled.disabled).toBe(true);
    click(disabled);
    await settled();
    expect(getDay("2026-05-15").getAttribute("data-selected")).toBe("");

    createRoot((dispose) => {
      const [value, setValue] = createSignal("2026-05-12");
      const changes: string[] = [];
      const calendar = createCalendar({
        defaultMonth: "2026-05",
        onValueChange: (nextValue) => changes.push(nextValue),
        value,
      });

      calendar.selectDate("2026-05-13", { reason: "programmatic" });
      expect(changes).toEqual(["2026-05-13"]);
      expect(calendar.value()).toBe("2026-05-12");

      setValue("2026-05-13");
      expect(calendar.value()).toBe("2026-05-13");
      dispose();
    });
  });
});

describe("DatePicker behavior", () => {
  test("opens calendar content from the trigger and closes after selection", async () => {
    const openChanges: string[] = [];
    const values: string[] = [];

    render(() => (
      <DatePicker.Root
        defaultMonth="2026-05"
        onOpenChange={(open, detail) => openChanges.push(`${open}:${detail.reason}`)}
        onValueChange={(value) => values.push(value)}
      >
        <DatePicker.Trigger placeholder="Pick a date" />
        <DatePicker.Content />
      </DatePicker.Root>
    ));

    const trigger = getByPart("date-picker", "trigger");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(queryByPart("date-picker", "content")).toBeNull();

    click(trigger);
    await settled();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(getByPart("date-picker", "content").getAttribute("role")).toBe("dialog");
    expect(openChanges).toEqual(["true:trigger"]);

    click(getDay("2026-05-18"));
    await settled();

    expect(values).toEqual(["2026-05-18"]);
    expect(openChanges).toEqual(["true:trigger", "false:select"]);
    expect(queryByPart("date-picker", "content")).toBeNull();
    expect(trigger.textContent).toBe("2026-05-18");
  });
});
