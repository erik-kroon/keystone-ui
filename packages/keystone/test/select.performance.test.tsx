import { For } from "solid-js";
import { afterAll, describe, expect, test } from "vitest";
import { Select } from "../src/select/index";
import { keyDown, render, settled } from "./harness";

type SelectPerfSample = {
  itemCount: number;
  registrationMs: number;
  navigationMs: number;
  typeaheadMs: number;
};

const itemCounts = [10, 100, 500, 1000] as const;
const samples: SelectPerfSample[] = [];

describe("Select performance harness", () => {
  test.each(itemCounts)(
    "measures collection registration, navigation, and typeahead for %i mounted items",
    async (itemCount) => {
      const items = Array.from({ length: itemCount }, (_, index) => ({
        label: `Item ${String(index).padStart(4, "0")}`,
        value: `item-${index}`,
      }));

      const registrationStart = performance.now();
      render(() => (
        <Select.Root defaultOpen>
          <Select.Trigger>Choose item</Select.Trigger>
          <Select.Content>
            <Select.Listbox>
              <For each={items}>
                {(item) => <Select.Item value={item.value}>{item.label}</Select.Item>}
              </For>
            </Select.Listbox>
          </Select.Content>
        </Select.Root>
      ));
      await settled();
      const registrationMs = performance.now() - registrationStart;
      const listbox = document.querySelector<HTMLElement>(
        '[data-scope="select"][data-part="listbox"]',
      );

      expect(listbox).toBeTruthy();
      expect(document.querySelectorAll('[data-scope="select"][data-part="item"]').length).toBe(
        itemCount,
      );

      const navigationStart = performance.now();
      for (let index = 0; index < 25; index += 1) {
        keyDown(listbox!, "ArrowDown");
      }
      const navigationMs = performance.now() - navigationStart;

      const typeaheadStart = performance.now();
      for (const key of ["I", "t", "e", "m", " ", "0", "9"]) {
        keyDown(listbox!, key);
      }
      const typeaheadMs = performance.now() - typeaheadStart;

      samples.push({
        itemCount,
        registrationMs,
        navigationMs,
        typeaheadMs,
      });

      expect(registrationMs).toBeGreaterThanOrEqual(0);
      expect(navigationMs).toBeGreaterThanOrEqual(0);
      expect(typeaheadMs).toBeGreaterThanOrEqual(0);
      expect(document.querySelector('[data-part="item"][data-highlighted]')).toBeTruthy();
    },
  );
});

afterAll(() => {
  for (const sample of samples) {
    console.info(
      [
        `[select-perf] items=${sample.itemCount}`,
        `registration=${sample.registrationMs.toFixed(2)}ms`,
        `navigation=${sample.navigationMs.toFixed(2)}ms`,
        `typeahead=${sample.typeaheadMs.toFixed(2)}ms`,
      ].join(" "),
    );
  }
});
