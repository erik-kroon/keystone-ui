import type { JSX } from "solid-js";
import { describe, expect, test } from "vitest";
import { createRoot, createSignal } from "solid-js";
import { createDialog } from "../dialog/index";
import { createSelect } from "../select/index";
import {
  composeEventHandlers,
  createControllableSignal,
  createStableId,
  renderPolymorphic,
} from "./index";
import { createCollectionRegistry } from "../listbox/collection-registry";
import { createListCollectionManager } from "../listbox/collection-manager";
import { createListInteractionKernel } from "../listbox/interaction-kernel";
import { firstEnabledItem, lastEnabledItem, nextEnabledItem } from "../listbox/keyboard-delegate";
import { createListSelectionManager } from "../listbox/selection-manager";
import { createTypeahead } from "../listbox/typeahead";
import { createFormControl } from "../form/index";
import { getByPart, render } from "../../test/harness";

describe("Keystone kernel utilities", () => {
  test("dialog creator exposes trigger and close part contracts", () => {
    createRoot((dispose) => {
      const changes: string[] = [];
      const dialog = createDialog({
        onOpenChange: (_open, detail) => changes.push(detail.reason),
      });
      const preventedTrigger = dialog.getTriggerProps({
        onClick: (event) => event.preventDefault(),
      });
      const trigger = dialog.getTriggerProps({});
      const close = dialog.getCloseProps({});

      expect(trigger["aria-controls"]).toBe(dialog.contentId);
      expect(trigger["data-scope"]).toBe("dialog");
      expect(trigger["data-part"]).toBe("trigger");

      (preventedTrigger.onClick as (event: MouseEvent) => void)(
        new MouseEvent("click", { cancelable: true }),
      );
      expect(dialog.open()).toBe(false);

      (trigger.onClick as (event: MouseEvent) => void)(
        new MouseEvent("click", { cancelable: true }),
      );
      expect(dialog.open()).toBe(true);

      (close.onClick as (event: MouseEvent) => void)(new MouseEvent("click", { cancelable: true }));
      expect(dialog.open()).toBe(false);
      expect(changes).toEqual(["trigger", "close"]);

      dispose();
    });
  });

  test("select creator exposes trigger, listbox, item, and value part contracts", () => {
    createRoot((dispose) => {
      const valueChanges: string[] = [];
      const openChanges: string[] = [];
      const select = createSelect({
        onOpenChange: (_open, detail) => openChanges.push(detail.reason),
        onValueChange: (value) => valueChanges.push(value ?? ""),
      });
      const trigger = select.getTriggerProps({});
      const value = select.getValueProps({});
      const alpha = select.getItemProps({ label: "Alpha", value: "alpha" });
      select.getItemProps({ disabled: true, label: "Beta", value: "beta" });
      select.getItemProps({ label: "Bravo", value: "bravo" });
      const listbox = select.getListboxProps({});

      expect(trigger["aria-haspopup"]).toBe("listbox");
      expect(trigger["data-scope"]).toBe("select");
      expect(trigger["data-part"]).toBe("trigger");
      expect(value["data-part"]).toBe("value");

      (trigger.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "ArrowDown" }),
      );
      expect(select.open()).toBe(true);
      expect(select.listbox.activeDescendant.highlightedValue()).toBe("alpha");

      (listbox.onKeyDown as (event: KeyboardEvent) => void)(
        new KeyboardEvent("keydown", { cancelable: true, key: "ArrowDown" }),
      );
      expect(select.listbox.activeDescendant.highlightedValue()).toBe("bravo");

      (alpha.onClick as (event: MouseEvent) => void)(new MouseEvent("click", { cancelable: true }));
      expect(select.value()).toBe("alpha");
      expect(valueChanges).toEqual(["alpha"]);
      expect(openChanges).toEqual(["keyboard", "select"]);

      dispose();
    });
  });

  test("controlled signals derive from props and request changes without mutating local state", () => {
    createRoot((dispose) => {
      const changes: string[] = [];
      const [value, setValue] = createSignal("controlled");
      const [current, setCurrent] = createControllableSignal({
        value,
        defaultValue: "default",
        onChange: (next) => changes.push(next),
      });

      expect(current()).toBe("controlled");
      expect(setCurrent("requested")).toBe("requested");
      expect(current()).toBe("controlled");
      expect(changes).toEqual(["requested"]);

      setValue("updated");
      expect(current()).toBe("updated");
      dispose();
    });
  });

  test("uncontrolled signals update locally and skip unchanged notifications", () => {
    createRoot((dispose) => {
      const changes: string[] = [];
      const [current, setCurrent] = createControllableSignal({
        defaultValue: "default",
        onChange: (next) => changes.push(next),
      });

      expect(current()).toBe("default");
      setCurrent("next");
      setCurrent("next");

      expect(current()).toBe("next");
      expect(changes).toEqual(["next"]);
      dispose();
    });
  });

  test("composed event handlers run user code first and respect preventDefault", () => {
    const order: string[] = [];
    const event = new MouseEvent("click", { cancelable: true });
    const handler = composeEventHandlers(
      (received: MouseEvent) => {
        order.push("user");
        received.preventDefault();
      },
      () => order.push("internal"),
    );

    handler(event);

    expect(order).toEqual(["user"]);
  });

  test("stable ids keep caller-provided ids reactive", () => {
    createRoot((dispose) => {
      const [id, setId] = createSignal<string | undefined>();
      const stableId = createStableId("test-part", id);
      const fallback = stableId();

      expect(fallback).toMatch(/^keystone-test-part-/);
      setId("custom-id");
      expect(stableId()).toBe("custom-id");
      setId(undefined);
      expect(stableId()).toBe(fallback);
      dispose();
    });
  });

  test("polymorphic rendering supports callback-style composition", () => {
    render(() =>
      renderPolymorphic(
        (props: JSX.HTMLAttributes<HTMLAnchorElement>) => <a href="/settings" {...props} />,
        "button",
        {
          children: "Settings",
          "data-scope": "kernel",
          "data-part": "trigger",
        },
      ),
    );

    const trigger = getByPart("kernel", "trigger");
    expect(trigger.tagName).toBe("A");
    expect(trigger.getAttribute("href")).toBe("/settings");
  });

  test("collections register ordered items and clean up on disposal", () => {
    createRoot((dispose) => {
      const collection = createCollectionRegistry();

      collection.registerItem({ label: "Beta", value: "beta" });
      collection.registerItem({ label: "Alpha", value: "alpha" });

      expect(collection.items().map((item) => item.value)).toEqual(["beta", "alpha"]);
      dispose();
      expect(collection.items()).toEqual([]);
    });
  });

  test("collection navigation skips disabled items and loops by default", () => {
    const items = [
      { label: "Alpha", value: "alpha" },
      { disabled: true, label: "Beta", value: "beta" },
      { label: "Gamma", value: "gamma" },
    ];

    expect(firstEnabledItem(items)?.value).toBe("alpha");
    expect(lastEnabledItem(items)?.value).toBe("gamma");
    expect(nextEnabledItem({ current: "alpha", direction: 1, items })?.value).toBe("gamma");
    expect(nextEnabledItem({ current: "gamma", direction: 1, items })?.value).toBe("alpha");
    expect(nextEnabledItem({ current: "gamma", direction: 1, items, loop: false })).toBeUndefined();
  });

  test("typeahead matches enabled labels and treats space as part of an active search", () => {
    createRoot((dispose) => {
      const matches: string[] = [];
      const typeahead = createTypeahead({
        current: () => matches.at(-1),
        items: () => [
          { label: "Apple", value: "apple" },
          { disabled: true, label: "Apricot", value: "apricot" },
          { label: "B Team", value: "bteam" },
          { label: "Blue Fig", value: "bluefig" },
        ],
        onMatch: (item) => matches.push(item.value),
        resetMs: 1000,
      });

      typeahead.handleKeyDown(new KeyboardEvent("keydown", { key: "a", cancelable: true }));
      expect(matches).toEqual(["apple"]);

      typeahead.reset();
      typeahead.handleKeyDown(new KeyboardEvent("keydown", { key: "b", cancelable: true }));
      const space = new KeyboardEvent("keydown", { key: " ", cancelable: true });
      typeahead.handleKeyDown(space);

      expect(space.defaultPrevented).toBe(true);
      expect(matches).toEqual(["apple", "bteam", "bteam"]);
      dispose();
    });
  });

  test("list interaction kernel owns ordering, navigation, typeahead, highlight, and selection", () => {
    createRoot((dispose) => {
      const changes: Array<{ reason: string; value: string | undefined }> = [];
      const selected: string[] = [];
      const list = createListInteractionKernel<
        { disabled?: boolean; label: string; value: string },
        { reason: string }
      >({
        defaultValue: "alpha",
        programmaticDetail: { reason: "programmatic" },
        onSelectionChange: (value, detail) => changes.push({ value, reason: detail.reason }),
        onValueSelect: (item) => selected.push(item.value),
      });

      list.registerItem({ label: "Alpha", value: "alpha" });
      list.registerItem({ disabled: true, label: "Beta", value: "beta" });
      list.registerItem({ label: "Bravo", value: "bravo" });

      expect(list.items().map((item) => item.value)).toEqual(["alpha", "beta", "bravo"]);
      expect(list.selectedItem()?.value).toBe("alpha");

      list.highlight("selected-or-first");
      expect(list.highlightedValue()).toBe("alpha");

      list.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true }), {
        selectDetail: () => ({ reason: "keyboard" }),
      });
      expect(list.highlightedValue()).toBe("bravo");

      list.handleKeyDown(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }), {
        selectDetail: () => ({ reason: "keyboard" }),
      });
      expect(changes).toEqual([{ value: "bravo", reason: "keyboard" }]);
      expect(selected).toEqual(["bravo"]);

      list.handleKeyDown(new KeyboardEvent("keydown", { key: "a", cancelable: true }), {
        selectDetail: () => ({ reason: "keyboard" }),
      });
      expect(list.highlightedValue()).toBe("alpha");

      dispose();
    });
  });

  test("list collection manager owns registration, lookup, highlight navigation, and typeahead", () => {
    createRoot((dispose) => {
      const collection = createListCollectionManager<{
        disabled?: boolean;
        label: string;
        value: string;
      }>();

      collection.registerItem({ label: "Alpha", value: "alpha" });
      collection.registerItem({ disabled: true, label: "Beta", value: "beta" });
      collection.registerItem({ label: "Bravo", value: "bravo" });

      expect(collection.items().map((item) => item.value)).toEqual(["alpha", "beta", "bravo"]);
      expect(collection.enabledItems().map((item) => item.value)).toEqual(["alpha", "bravo"]);
      expect(collection.itemByValue("beta")?.disabled).toBe(true);

      collection.highlight("first");
      expect(collection.highlightedValue()).toBe("alpha");

      collection.highlight("next");
      expect(collection.highlightedValue()).toBe("bravo");

      collection.typeahead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));
      expect(collection.highlightedValue()).toBe("alpha");

      dispose();
    });
  });

  test("list selection manager owns value state and ignores disabled selects", () => {
    createRoot((dispose) => {
      const changes: Array<{ reason: string; value: string | undefined }> = [];
      const selected: string[] = [];
      const items = new Map([
        ["alpha", { label: "Alpha", value: "alpha" }],
        ["beta", { disabled: true, label: "Beta", value: "beta" }],
      ]);
      const selection = createListSelectionManager<
        { disabled?: boolean; label: string; value: string },
        { reason: string }
      >({
        defaultValue: "alpha",
        itemByValue: (value) => (value ? items.get(value) : undefined),
        programmaticDetail: { reason: "programmatic" },
        onSelectionChange: (value, detail) => changes.push({ value, reason: detail.reason }),
        onValueSelect: (item) => selected.push(item.value),
      });

      expect(selection.value()).toBe("alpha");
      expect(selection.selectedItem()?.label).toBe("Alpha");
      expect(selection.isSelected("alpha")).toBe(true);

      expect(selection.selectValue("beta", { reason: "item" })).toBeUndefined();
      expect(changes).toEqual([]);
      expect(selected).toEqual([]);

      selection.setValue(undefined, { reason: "programmatic" });
      expect(changes).toEqual([{ value: undefined, reason: "programmatic" }]);

      dispose();
    });
  });

  test("form controls derive aria relationships, state data, and hidden input props", () => {
    createRoot((dispose) => {
      const control = createFormControl({
        id: () => "project",
        name: () => "project",
        value: () => "keystone",
        invalid: () => true,
        required: () => true,
      });

      expect(control.getControlProps()["aria-labelledby"]).toBe("project-label");
      expect(control.getControlProps()["aria-describedby"]).toBe(
        "project-description project-error-message",
      );
      expect(control.getControlProps()["data-invalid"]).toBe("");
      expect(control.getLabelProps().for).toBe("project");
      expect(control.getHiddenInputProps().name).toBe("project");
      expect(control.getHiddenInputProps().value).toBe("keystone");
      dispose();
    });
  });
});
