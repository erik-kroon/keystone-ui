import { createRoot, createSignal } from "solid-js";
import { describe, expect, test } from "vitest";
import { Calendar, DatePicker, createCalendar } from "../src/date-picker/index";
import { Locale } from "../src/locale/index";
import { click, getByPart, keyDown, pointerDown, queryByPart, render, settled } from "./harness";

function getDay(value: string, root: ParentNode = document.body) {
  const element = root.querySelector<HTMLButtonElement>(
    `[data-scope="calendar"][data-part="cell-trigger"][data-date="${value}"]`,
  );

  if (!element) throw new Error(`Unable to find calendar day ${value}`);
  return element;
}

function animationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
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

  test("uses locale week info when weekStartsOn is not provided", () => {
    render(() => <Calendar.Root defaultMonth="2026-05" locale="en-GB" />);

    expect(
      document.body.querySelector('[data-scope="calendar"][data-part="column-header"]')
        ?.textContent,
    ).toBe("Mon");
  });

  test("inherits locale and navigation labels from Locale.Provider", () => {
    render(() => (
      <Locale.Provider
        locale="fr-FR"
        messages={{
          "calendar.nextMonth": "Mois suivant",
          "calendar.previousMonth": "Mois precedent",
        }}
      >
        <Calendar.Root defaultMonth="2026-05" />
      </Locale.Provider>
    ));

    expect(getByPart("calendar", "heading").textContent).toBe("mai 2026");
    expect(getByPart("calendar", "prev-trigger").getAttribute("aria-label")).toBe("Mois precedent");
    expect(getByPart("calendar", "next-trigger").textContent).toBe("Mois suivant");
  });

  test("keeps explicit calendar locale ahead of provider locale", () => {
    render(() => (
      <Locale.Provider locale="fr-FR">
        <Calendar.Root defaultMonth="2026-05" locale="en-GB" />
      </Locale.Provider>
    ));

    expect(getByPart("calendar", "heading").textContent).toBe("May 2026");
  });

  test("supports unavailable dates and range selection state", async () => {
    const ranges: string[] = [];

    render(() => (
      <Calendar.Root
        defaultMonth="2026-05"
        selectionMode="range"
        unavailable={(value) => value === "2026-05-12"}
        onRangeValueChange={(value, detail) =>
          ranges.push(`${value.start ?? ""}:${value.end ?? ""}:${detail.complete}`)
        }
      />
    ));

    const unavailable = getDay("2026-05-12");
    expect(unavailable.disabled).toBe(true);
    expect(unavailable.getAttribute("data-unavailable")).toBe("");

    click(unavailable);
    await settled();
    expect(ranges).toEqual([]);

    click(getDay("2026-05-20"));
    await settled();
    expect(ranges).toEqual(["2026-05-20::false"]);
    expect(getDay("2026-05-20").getAttribute("data-range-start")).toBe("");

    click(getDay("2026-05-18"));
    await settled();
    expect(ranges).toEqual(["2026-05-20::false", "2026-05-18:2026-05-20:true"]);
    expect(getDay("2026-05-18").getAttribute("data-range-start")).toBe("");
    expect(getDay("2026-05-19").getAttribute("data-in-range")).toBe("");
    expect(getDay("2026-05-20").getAttribute("data-range-end")).toBe("");
    expect(getByPart("calendar", "root").getAttribute("data-start-value")).toBe("2026-05-18");
    expect(getByPart("calendar", "root").getAttribute("data-end-value")).toBe("2026-05-20");

    click(getDay("2026-05-10"));
    await settled();
    click(getDay("2026-05-14"));
    await settled();
    expect(ranges).toEqual([
      "2026-05-20::false",
      "2026-05-18:2026-05-20:true",
      "2026-05-10::false",
      "2026-05-14::false",
    ]);
    expect(getByPart("calendar", "root").getAttribute("data-start-value")).toBe("2026-05-14");
    expect(getByPart("calendar", "root").getAttribute("data-end-value")).toBeNull();
  });
});

describe("DatePicker behavior", () => {
  test("opens calendar content from the trigger and stays open after selection", async () => {
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

    expect(values).toEqual(["2026-05-18"]);
    expect(getDay("2026-05-18").getAttribute("data-selected")).toBe("");
    expect(openChanges).toEqual(["true:trigger"]);
    expect(queryByPart("date-picker", "content")).not.toBeNull();
    expect(trigger.textContent).toBe("2026-05-18");
  });

  test("unmounts content immediately when closing from the trigger", async () => {
    render(() => (
      <DatePicker.Root defaultMonth="2026-05">
        <DatePicker.Trigger placeholder="Pick a date" />
        <DatePicker.Content />
      </DatePicker.Root>
    ));

    click(getByPart("date-picker", "trigger"));
    expect(queryByPart("date-picker", "content")).not.toBeNull();

    await settled();
    click(getByPart("date-picker", "trigger"));
    await animationFrame();

    expect(queryByPart("date-picker", "content")).toBeNull();
  });

  test("closes when pressing outside the date picker", async () => {
    const openChanges: string[] = [];

    render(() => (
      <>
        <DatePicker.Root
          defaultMonth="2026-05"
          defaultOpen
          onOpenChange={(open, detail) => openChanges.push(`${open}:${detail.reason}`)}
        >
          <DatePicker.Trigger placeholder="Pick a date" />
          <DatePicker.Content />
        </DatePicker.Root>
        <button type="button" data-testid="outside">
          Outside
        </button>
      </>
    ));

    const trigger = getByPart("date-picker", "trigger");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    pointerDown(document.querySelector<HTMLElement>('[data-testid="outside"]')!);
    await settled();

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(queryByPart("date-picker", "content")).toBeNull();
    expect(openChanges).toEqual(["false:outside"]);
  });

  test("does not move focus into another open calendar after selection", async () => {
    render(() => (
      <>
        <DatePicker.Root defaultMonth="2026-05" defaultOpen>
          <DatePicker.Trigger placeholder="First" />
          <DatePicker.Content data-testid="first-content" />
        </DatePicker.Root>
        <DatePicker.Root defaultMonth="2026-05" defaultOpen>
          <DatePicker.Trigger placeholder="Second" />
          <DatePicker.Content data-testid="second-content" />
        </DatePicker.Root>
      </>
    ));

    const firstContent = document.body.querySelector<HTMLElement>('[data-testid="first-content"]');
    const secondContent = document.body.querySelector<HTMLElement>(
      '[data-testid="second-content"]',
    );
    const firstDay = getDay("2026-05-18", firstContent ?? undefined);
    const secondDay = getDay("2026-05-18", secondContent ?? undefined);

    click(firstDay);
    await settled();

    expect(firstContent?.isConnected).toBe(true);
    expect(document.activeElement).not.toBe(secondDay);
  });

  test("keeps range picker open after completing the range", async () => {
    const openChanges: string[] = [];
    const ranges: string[] = [];

    render(() => (
      <DatePicker.Root
        defaultMonth="2026-05"
        selectionMode="range"
        onOpenChange={(open, detail) => openChanges.push(`${open}:${detail.reason}`)}
        onRangeValueChange={(value, detail) =>
          ranges.push(`${value.start ?? ""}:${value.end ?? ""}:${detail.complete}`)
        }
      >
        <DatePicker.Trigger placeholder="Pick dates" />
        <DatePicker.Content />
      </DatePicker.Root>
    ));

    const trigger = getByPart("date-picker", "trigger");
    click(trigger);
    await settled();

    click(getDay("2026-05-10"));
    await settled();

    expect(ranges).toEqual(["2026-05-10::false"]);
    expect(openChanges).toEqual(["true:trigger"]);
    expect(queryByPart("date-picker", "content")).not.toBeNull();
    expect(trigger.textContent).toBe("2026-05-10");

    click(getDay("2026-05-12"));
    await settled();

    expect(ranges).toEqual(["2026-05-10::false", "2026-05-10:2026-05-12:true"]);
    expect(openChanges).toEqual(["true:trigger"]);
    expect(queryByPart("date-picker", "content")).not.toBeNull();
    expect(trigger.textContent).toBe("2026-05-10 - 2026-05-12");
  });

  test("uses the provider fallback label when no trigger placeholder is supplied", () => {
    render(() => (
      <Locale.Provider messages={{ "datePicker.selectDate": "Choisir une date" }}>
        <DatePicker.Root defaultMonth="2026-05">
          <DatePicker.Trigger />
        </DatePicker.Root>
      </Locale.Provider>
    ));

    expect(getByPart("date-picker", "trigger").textContent).toBe("Choisir une date");
  });
});
