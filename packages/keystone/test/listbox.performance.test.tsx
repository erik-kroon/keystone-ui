import { createRoot } from "solid-js";
import { afterAll, describe, expect, test } from "vitest";
import { createListboxInteraction } from "../src/listbox/index";

type ListboxPerfSample = {
  itemCount: number;
  navigationMs: number;
  registrationMs: number;
  typeaheadMs: number;
};

const itemCounts = [100, 1000] as const;
const samples: ListboxPerfSample[] = [];

function createKeyEvent(key: string): KeyboardEvent {
  return new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key });
}

function createBenchmarkListbox() {
  return createListboxInteraction<
    { disabled?: boolean; label: string; value: string },
    { reason: string }
  >({
    id: () => "bench-listbox",
    labelledBy: () => "bench-trigger",
    optionId: (value) => `bench-option-${value}`,
    optionSelectDetail: () => ({ reason: "item" }),
    programmaticDetail: { reason: "programmatic" },
    scope: "bench-listbox",
  });
}

describe("Listbox performance harness", () => {
  test.each(itemCounts)(
    "measures collection registration, navigation, and typeahead for %i kernel items",
    (itemCount) => {
      createRoot((dispose) => {
        const listbox = createBenchmarkListbox();

        const registrationStart = performance.now();
        for (let index = 0; index < itemCount; index += 1) {
          listbox.registerOption({
            disabled: index % 17 === 0,
            label: `Item ${String(index).padStart(5, "0")}`,
            value: `item-${index}`,
          });
        }
        const registrationMs = performance.now() - registrationStart;

        const navigationStart = performance.now();
        for (let index = 0; index < 1000; index += 1) {
          listbox.keyboard.highlight("next");
        }
        const navigationMs = performance.now() - navigationStart;

        const typeaheadStart = performance.now();
        for (const key of ["I", "t", "e", "m", " ", "0", "9"]) {
          listbox.typeahead.handleKeyDown(createKeyEvent(key));
        }
        const typeaheadMs = performance.now() - typeaheadStart;

        samples.push({
          itemCount,
          navigationMs,
          registrationMs,
          typeaheadMs,
        });

        expect(listbox.collection.items()).toHaveLength(itemCount);
        expect(listbox.collection.itemByValue(`item-${itemCount - 1}`)?.label).toBe(
          `Item ${String(itemCount - 1).padStart(5, "0")}`,
        );
        expect(listbox.activeDescendant.highlightedValue()).toBeTruthy();
        expect(registrationMs).toBeLessThan(150);
        expect(navigationMs).toBeLessThan(25);
        expect(typeaheadMs).toBeLessThan(50);

        dispose();
      });
    },
  );
});

afterAll(() => {
  for (const sample of samples) {
    console.info(
      [
        `[listbox-perf] items=${sample.itemCount}`,
        `registration=${sample.registrationMs.toFixed(2)}ms`,
        `navigation1000=${sample.navigationMs.toFixed(2)}ms`,
        `typeahead7=${sample.typeaheadMs.toFixed(2)}ms`,
      ].join(" "),
    );
  }
});
