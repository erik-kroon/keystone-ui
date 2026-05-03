import { createRoot } from "solid-js";
import { describe, expect, test } from "vitest";
import { createListboxInteraction } from "./index";

describe("Listbox interaction module", () => {
  test("returns listbox, option, active-descendant, keyboard, and selection contracts", () => {
    createRoot((dispose) => {
      const changes: Array<{ reason: string; value: string | undefined }> = [];
      const selected: string[] = [];
      const listbox = createListboxInteraction<
        { disabled?: boolean; label: string; value: string },
        { event?: Event; reason: string }
      >({
        defaultValue: "alpha",
        id: () => "project-listbox",
        labelledBy: () => "project-trigger",
        optionId: (value) => `project-option-${value}`,
        optionSelectDetail: (event) => ({ event, reason: "item" }),
        programmaticDetail: { reason: "programmatic" },
        scope: "test-listbox",
        onSelectionChange: (value, detail) => changes.push({ value, reason: detail.reason }),
        onValueSelect: (item) => selected.push(item.value),
      });

      const alpha = listbox.getOptionProps({ label: "Alpha", value: "alpha" });
      listbox.getOptionProps({ disabled: true, label: "Beta", value: "beta" });
      const bravo = listbox.getOptionProps({ label: "Bravo", value: "bravo" });
      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: (event) => ({ event, reason: "keyboard" }),
        },
      );

      expect(props.id).toBe("project-listbox");
      expect(props.role).toBe("listbox");
      expect(props["aria-labelledby"]).toBe("project-trigger");
      expect(alpha.id).toBe("project-option-alpha");
      expect(alpha.role).toBe("option");
      expect(alpha["data-scope"]).toBe("test-listbox");
      expect(alpha["aria-selected"]).toBe(true);

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "ArrowDown" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("alpha");
      expect(props["aria-activedescendant"]).toBe("project-option-alpha");

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "ArrowDown" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("bravo");

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "Enter" }),
      );
      expect(changes).toEqual([{ value: "bravo", reason: "keyboard" }]);
      expect(selected).toEqual(["bravo"]);

      (alpha.onClick as (event: MouseEvent) => void)(new MouseEvent("click", { cancelable: true }));
      expect(changes.at(-1)).toEqual({ value: "alpha", reason: "item" });

      (bravo.onPointerMove as (event: PointerEvent) => void)(
        new PointerEvent("pointermove", { cancelable: true }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("bravo");
      expect(
        listbox.keyboard.getTriggerOpenIntent(new KeyboardEvent("keydown", { key: " " })),
      ).toBe("open-and-highlight");
      expect(
        listbox.keyboard.getTriggerOpenIntent(new KeyboardEvent("keydown", { key: "Escape" })),
      ).toBe("close");
      expect(listbox.typeahead.isTyping()).toBe(false);

      dispose();
    });
  });

  test("typeahead highlights enabled options through the shared keydown contract", () => {
    createRoot((dispose) => {
      const listbox = createListboxInteraction<
        { disabled?: boolean; label: string; value: string },
        { reason: string }
      >({
        id: () => "project-listbox",
        labelledBy: () => "project-trigger",
        optionId: (value) => `project-option-${value}`,
        optionSelectDetail: () => ({ reason: "item" }),
        programmaticDetail: { reason: "programmatic" },
        scope: "test-listbox",
      });

      listbox.getOptionProps({ label: "Alpha", value: "alpha" });
      listbox.getOptionProps({ disabled: true, label: "Beta", value: "beta" });
      listbox.getOptionProps({ label: "Bravo", value: "bravo" });
      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: () => ({ reason: "keyboard" }),
        },
      );

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "b" }),
      );

      expect(listbox.activeDescendant.highlightedValue()).toBe("bravo");
      dispose();
    });
  });
});
