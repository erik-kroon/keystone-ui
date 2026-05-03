import { createRoot } from "solid-js";
import { describe, expect, test } from "vitest";
import { createSelect } from "./controller";
import {
  expectAriaState,
  expectPart,
  expectRole,
  runKeyboardTable,
} from "../../test/accessibility";

describe("Select controller", () => {
  test("coordinates open state, listbox selection, and part prop getters without rendering parts", async () => {
    await new Promise<void>((resolve, reject) => {
      createRoot((dispose) => {
        const openChanges: string[] = [];
        const valueChanges: string[] = [];
        const select = createSelect({
          onOpenChange: (_open, detail) => openChanges.push(detail.reason),
          onValueChange: (value) => valueChanges.push(value ?? ""),
        });
        const trigger = select.getTriggerProps({});
        const listbox = select.getListboxProps({});
        const alpha = select.getItemProps({ label: "Alpha", value: "alpha" });
        select.getItemProps({ disabled: true, label: "Beta", value: "beta" });
        select.getItemProps({ label: "Bravo", value: "bravo" });

        expectPart(trigger, "select", "trigger");
        expectRole(listbox, "listbox");

        void runKeyboardTable([
          {
            key: "ArrowDown",
            handler: trigger.onKeyDown as (event: KeyboardEvent) => void,
            defaultPrevented: true,
            after: () => {
              expect(select.open()).toBe(true);
              expectAriaState(trigger, "aria-expanded", true);
              expect(select.listbox.activeDescendant.highlightedValue()).toBe("alpha");
            },
          },
          {
            key: "ArrowDown",
            handler: listbox.onKeyDown as (event: KeyboardEvent) => void,
            defaultPrevented: true,
            after: () => {
              expect(select.listbox.activeDescendant.highlightedValue()).toBe("bravo");
            },
          },
        ])
          .then(() => {
            (alpha.onClick as (event: MouseEvent) => void)(
              new MouseEvent("click", { cancelable: true }),
            );
            expect(select.value()).toBe("alpha");
            expect(valueChanges).toEqual(["alpha"]);
            expect(openChanges).toEqual(["keyboard", "select"]);

            dispose();
            resolve();
          })
          .catch((error: unknown) => {
            dispose();
            reject(error);
          });
      });
    });
  });
});
