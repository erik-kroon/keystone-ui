import { performance } from "node:perf_hooks";
import { createRoot } from "solid-js";
import { createListboxInteraction } from "../src/collection/index";

type BenchmarkResult = {
  itemCount: number;
  navigationMs: number;
  registrationMs: number;
  typeaheadMs: number;
};

function keyEvent(key: string): KeyboardEvent {
  return {
    altKey: false,
    ctrlKey: false,
    key,
    metaKey: false,
    preventDefault() {},
    stopPropagation() {},
  } as KeyboardEvent;
}

function benchmarkListbox(itemCount: number): BenchmarkResult {
  return createRoot((dispose) => {
    const listbox = createListboxInteraction<
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
      listbox.typeahead.handleKeyDown(keyEvent(key));
    }
    const typeaheadMs = performance.now() - typeaheadStart;

    dispose();

    return {
      itemCount,
      navigationMs,
      registrationMs,
      typeaheadMs,
    };
  });
}

const counts = process.argv
  .slice(2)
  .map((value) => Number.parseInt(value, 10))
  .filter(Number.isFinite);
const itemCounts = counts.length > 0 ? counts : [100, 1000, 5000, 10000, 20000];

for (const result of itemCounts.map(benchmarkListbox)) {
  console.info(
    [
      `[listbox-bench] items=${result.itemCount}`,
      `registration=${result.registrationMs.toFixed(2)}ms`,
      `navigation1000=${result.navigationMs.toFixed(2)}ms`,
      `typeahead7=${result.typeaheadMs.toFixed(2)}ms`,
    ].join(" "),
  );
}
