import { createRoot } from "solid-js";
import { describe, expect, test } from "vitest";
import { createListboxInteraction } from "./index";
import { createRovingFocus } from "./roving-focus";

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
      expect(listbox.collection.items().map((item) => item.value)).toEqual([
        "alpha",
        "beta",
        "bravo",
      ]);
      expect(listbox.collection.itemByValue("bravo")?.label).toBe("Bravo");

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

  test("typeahead cycles repeated printable keys across matching options", () => {
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
      listbox.getOptionProps({ label: "Alpine", value: "alpine" });
      listbox.getOptionProps({ label: "Bravo", value: "bravo" });
      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: () => ({ reason: "keyboard" }),
        },
      );

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "a" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("alpha");

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "a" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("alpine");
      dispose();
    });
  });

  test("typeahead keeps cycling repeated keys when repeated-prefix items are not enabled", () => {
    createRoot((dispose) => {
      const listbox = createListboxInteraction<
        { disabled?: boolean; hidden?: boolean; label: string; value: string },
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
      listbox.getOptionProps({ label: "Alpine", value: "alpine" });
      listbox.getOptionProps({ hidden: true, label: "Aardvark", value: "aardvark" });
      listbox.getOptionProps({ disabled: true, label: "Aaron", value: "aaron" });
      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: () => ({ reason: "keyboard" }),
        },
      );

      for (const key of ["a", "a", "a"]) {
        (props.onKeyDown as (event: KeyboardEvent) => void)(
          new KeyboardEvent("keydown", { cancelable: true, key }),
        );
      }

      expect(listbox.activeDescendant.highlightedValue()).toBe("alpha");
      dispose();
    });
  });

  test("typeahead allows enabled repeated-prefix items without blocking later cycling", () => {
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

      listbox.getOptionProps({ label: "Aardvark", value: "aardvark" });
      listbox.getOptionProps({ label: "Alpha", value: "alpha" });
      listbox.getOptionProps({ label: "Alpine", value: "alpine" });
      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: () => ({ reason: "keyboard" }),
        },
      );

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "a" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("aardvark");

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "a" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("aardvark");

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "a" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("alpha");
      dispose();
    });
  });

  test("navigation and typeahead skip hidden options while preserving collection lookup", () => {
    createRoot((dispose) => {
      const listbox = createListboxInteraction<
        { disabled?: boolean; hidden?: boolean; label: string; value: string },
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
      const hidden = listbox.getOptionProps({ hidden: true, label: "Bravo", value: "bravo" });
      listbox.getOptionProps({ label: "Beta", value: "beta" });
      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: () => ({ reason: "keyboard" }),
        },
      );

      expect(hidden["data-hidden"]).toBe("");
      expect(listbox.collection.itemByValue("bravo")?.label).toBe("Bravo");

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "b" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("beta");

      listbox.activeDescendant.setHighlightedValue("alpha");
      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "ArrowDown" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("beta");
      dispose();
    });
  });

  test("selected-or-first falls back when the selected option is hidden", () => {
    createRoot((dispose) => {
      const listbox = createListboxInteraction<
        { disabled?: boolean; hidden?: boolean; label: string; value: string },
        { reason: string }
      >({
        defaultValue: "alpha",
        id: () => "project-listbox",
        labelledBy: () => "project-trigger",
        optionId: (value) => `project-option-${value}`,
        optionSelectDetail: () => ({ reason: "item" }),
        programmaticDetail: { reason: "programmatic" },
        scope: "test-listbox",
      });

      listbox.getOptionProps({ hidden: true, label: "Alpha", value: "alpha" });
      listbox.getOptionProps({ label: "Bravo", value: "bravo" });

      listbox.keyboard.highlight("selected-or-first");

      expect(listbox.activeDescendant.highlightedValue()).toBe("bravo");
      dispose();
    });
  });

  test("orders registered elements by DOM position after refs attach", async () => {
    await createRoot(async (dispose) => {
      const listbox = createListboxInteraction<
        {
          disabled?: boolean;
          element?: () => HTMLElement | undefined;
          label: string;
          value: string;
        },
        { reason: string }
      >({
        id: () => "project-listbox",
        labelledBy: () => "project-trigger",
        optionId: (value) => `project-option-${value}`,
        optionSelectDetail: () => ({ reason: "item" }),
        programmaticDetail: { reason: "programmatic" },
        scope: "test-listbox",
      });
      const alpha = document.createElement("div");
      const bravo = document.createElement("div");
      const props = [
        listbox.getOptionProps({ label: "Bravo", value: "bravo" }),
        listbox.getOptionProps({ label: "Alpha", value: "alpha" }),
      ];

      document.body.append(alpha, bravo);
      (props[0].ref as (element: HTMLElement) => void)(bravo);
      (props[1].ref as (element: HTMLElement) => void)(alpha);

      await Promise.resolve();

      expect(listbox.collection.items().map((item) => item.value)).toEqual(["alpha", "bravo"]);
      dispose();
    });
  });

  test("replaces duplicate option values without letting stale cleanup remove replacements", () => {
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

      const unregisterAlpha = listbox.registerOption({ label: "Alpha", value: "alpha" });
      listbox.registerOption({ label: "Updated alpha", value: "alpha" });
      listbox.registerOption({ label: "Bravo", value: "bravo" });

      expect(listbox.collection.items().map((item) => item.label)).toEqual([
        "Updated alpha",
        "Bravo",
      ]);
      expect(listbox.collection.itemByValue("alpha")?.label).toBe("Updated alpha");

      unregisterAlpha();

      expect(listbox.collection.items().map((item) => item.label)).toEqual([
        "Updated alpha",
        "Bravo",
      ]);
      expect(listbox.collection.itemByValue("alpha")?.label).toBe("Updated alpha");
      expect(listbox.collection.itemByValue("bravo")?.label).toBe("Bravo");
      dispose();
    });
  });

  test("supports grouped options and multiple selection contracts", () => {
    createRoot((dispose) => {
      const changes: Array<readonly string[]> = [];
      const listbox = createListboxInteraction<
        { disabled?: boolean; group?: string; label: string; value: string },
        { reason: string }
      >({
        defaultValues: ["alpha"],
        id: () => "project-listbox",
        labelledBy: () => "project-trigger",
        optionId: (value) => `project-option-${value}`,
        optionSelectDetail: () => ({ reason: "item" }),
        programmaticDetail: { reason: "programmatic" },
        scope: "test-listbox",
        selectionMode: "multiple",
        onSelectedValuesChange: (values) => changes.push([...values]),
      });

      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: () => ({ reason: "keyboard" }),
        },
      );
      const group = listbox.getGroupProps({ value: "recent" });
      const alpha = listbox.getOptionProps({
        group: "recent",
        label: "Alpha",
        value: "alpha",
      });
      const bravo = listbox.getOptionProps({
        group: "recent",
        label: "Bravo",
        value: "bravo",
      });

      expect(props["aria-multiselectable"]).toBe("true");
      expect(group.role).toBe("group");
      expect(group["aria-labelledby"]).toBe("project-listbox-group-recent-label");
      expect(alpha["data-group"]).toBe("recent");
      expect(alpha["aria-selected"]).toBe(true);

      (bravo.onClick as (event: MouseEvent) => void)(new MouseEvent("click", { cancelable: true }));
      expect(listbox.selection.selectedValues()).toEqual(["alpha", "bravo"]);
      expect(changes).toEqual([["alpha", "bravo"]]);

      (alpha.onClick as (event: MouseEvent) => void)(new MouseEvent("click", { cancelable: true }));
      expect(listbox.selection.selectedValues()).toEqual(["bravo"]);
      dispose();
    });
  });

  test("accepts custom keyboard delegates and locale-aware typeahead", () => {
    createRoot((dispose) => {
      const listbox = createListboxInteraction<
        { disabled?: boolean; label: string; value: string },
        { reason: string }
      >({
        id: () => "project-listbox",
        labelledBy: () => "project-trigger",
        keyboardDelegate: {
          next: ({ items }) => items.find((item) => item.value === "charlie"),
        },
        locale: () => "fr",
        optionId: (value) => `project-option-${value}`,
        optionSelectDetail: () => ({ reason: "item" }),
        programmaticDetail: { reason: "programmatic" },
        scope: "test-listbox",
        typeaheadCollator: new Intl.Collator("fr", { sensitivity: "base", usage: "search" }),
      });

      listbox.getOptionProps({ label: "Alpha", value: "alpha" });
      listbox.getOptionProps({ label: "Bravo", value: "bravo" });
      listbox.getOptionProps({ label: "Éclair", value: "charlie" });
      const props = listbox.getListboxProps(
        {},
        {
          selectDetail: () => ({ reason: "keyboard" }),
        },
      );

      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "ArrowDown" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("charlie");

      listbox.activeDescendant.setHighlightedValue(undefined);
      (props.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "e" }),
      );
      expect(listbox.activeDescendant.highlightedValue()).toBe("charlie");
      dispose();
    });
  });

  test("creates roving focus contracts from collection items", () => {
    createRoot((dispose) => {
      const alpha = document.createElement("button");
      const bravo = document.createElement("button");
      const charlie = document.createElement("button");
      const focused: string[] = [];
      alpha.addEventListener("focus", () => focused.push("alpha"));
      bravo.addEventListener("focus", () => focused.push("bravo"));
      charlie.addEventListener("focus", () => focused.push("charlie"));
      document.body.append(alpha, bravo, charlie);

      const roving = createRovingFocus({
        items: () => [
          { element: () => alpha, label: "Alpha", value: "alpha" },
          { element: () => bravo, hidden: true, label: "Bravo", value: "bravo" },
          { element: () => charlie, label: "Charlie", value: "charlie" },
        ],
      });

      expect(roving.currentValue()).toBe("alpha");
      expect(roving.getItemTabIndex("alpha")).toBe(0);
      expect(roving.getItemTabIndex("charlie")).toBe(-1);

      roving.focus("next");
      expect(roving.currentValue()).toBe("charlie");
      expect(focused).toEqual(["charlie"]);

      bravo.remove();
      alpha.remove();
      charlie.remove();
      dispose();
    });
  });
});
