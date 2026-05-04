import type { JSX } from "solid-js";
import { describe, expect, test } from "vitest";
import { createRoot, createSignal, splitProps } from "solid-js";
import { Dialog, createDialog } from "../dialog/index";
import { createSelect } from "../select/index";
import {
  composeEventHandlers,
  createControllableSignal,
  dataBoolean,
  getCheckedState,
  createCoreId,
  getOpenClosedState,
  createRegisteredIds,
  getSelectionState,
  createStableId,
  mergeIds,
  renderPolymorphic,
  scheduleMicrotask,
} from "./index";
import { createCollectionRegistry } from "../collection/collection-registry";
import { createListCollectionManager } from "../collection/collection-manager";
import { createListInteractionKernel } from "../collection/interaction-kernel";
import {
  firstEnabledItem,
  lastEnabledItem,
  nextEnabledItem,
} from "../collection/keyboard-delegate";
import { createListSelectionManager } from "../collection/selection-manager";
import { createTypeahead } from "../collection/typeahead";
import { createFormControl } from "../form/index";
import { getByPart, render } from "../../test/harness";

describe("Core kernel utilities", () => {
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

  test("controlled signals can treat undefined as a controlled value when presence is explicit", () => {
    createRoot((dispose) => {
      const changes: Array<string | undefined> = [];
      const [value, setValue] = createSignal<string | undefined>(undefined);
      const [current, setCurrent] = createControllableSignal({
        value,
        isControlled: () => true,
        defaultValue: "default",
        onChange: (next) => changes.push(next),
      });

      expect(current()).toBeUndefined();
      expect(setCurrent("requested")).toBe("requested");
      expect(current()).toBeUndefined();
      expect(changes).toEqual(["requested"]);

      setValue("controlled");
      expect(current()).toBe("controlled");
      dispose();
    });
  });

  test("controllable signals pass typed change details without mutable caller state", () => {
    createRoot((dispose) => {
      const changes: Array<[string, string]> = [];
      const [current, setCurrent] = createControllableSignal<
        string,
        { reason: "keyboard" | "programmatic" }
      >({
        defaultValue: "default",
        defaultDetail: { reason: "programmatic" },
        onChange: (next, detail) => changes.push([next, detail.reason]),
      });

      expect(current()).toBe("default");
      setCurrent("typed", { reason: "keyboard" });
      setCurrent("reset");
      setCurrent("reset", { reason: "keyboard" });

      expect(current()).toBe("reset");
      expect(changes).toEqual([
        ["typed", "keyboard"],
        ["reset", "programmatic"],
      ]);
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

  test("composed event handlers support Solid bound event tuples", () => {
    const order: string[] = [];
    const event = new MouseEvent("click", { cancelable: true });
    const handler = composeEventHandlers<MouseEvent>(
      [
        (label: string, received: MouseEvent) => {
          order.push(label);
          expect(received).toBe(event);
        },
        "user",
      ],
      () => order.push("internal"),
    );

    handler(event);

    expect(order).toEqual(["user", "internal"]);
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

  test("keystone ids expose the target utility name while preserving stable fallback semantics", () => {
    createRoot((dispose) => {
      const keystoneId = createCoreId("test-part");
      const fallback = keystoneId();

      expect(fallback).toMatch(/^keystone-test-part-/);
      expect(keystoneId()).toBe(fallback);
      dispose();
    });
  });

  test("registered ids keep default and dynamic ARIA references stable and removable", () => {
    createRoot((dispose) => {
      const [dynamicId, setDynamicId] = createSignal<string | undefined>("dynamic-description");
      const defaultId = () => "default-description";
      const registry = createRegisteredIds(defaultId);
      const unregister = registry.register(dynamicId);

      expect(registry.ids()).toEqual(["default-description", "dynamic-description"]);
      expect(mergeIds(...registry.ids())).toBe("default-description dynamic-description");

      setDynamicId("default-description");
      expect(registry.ids()).toEqual(["default-description"]);

      setDynamicId("dynamic-description");
      unregister();
      expect(registry.ids()).toEqual(["default-description"]);
      dispose();
    });
  });

  test("microtask scheduling works when the host queueMicrotask global is unavailable", async () => {
    const previousQueueMicrotask = globalThis.queueMicrotask;
    const calls: string[] = [];

    try {
      Object.defineProperty(globalThis, "queueMicrotask", {
        configurable: true,
        value: undefined,
      });

      scheduleMicrotask(() => calls.push("scheduled"));
      await Promise.resolve();

      expect(calls).toEqual(["scheduled"]);
    } finally {
      Object.defineProperty(globalThis, "queueMicrotask", {
        configurable: true,
        value: previousQueueMicrotask,
      });
    }
  });

  test("state data helpers preserve Keystone public attribute values", () => {
    expect(dataBoolean(true)).toBe("");
    expect(dataBoolean(false)).toBeUndefined();
    expect(dataBoolean(null)).toBeUndefined();
    expect(dataBoolean(undefined)).toBeUndefined();

    expect(getOpenClosedState(true)).toBe("open");
    expect(getOpenClosedState(false)).toBe("closed");
    expect(getCheckedState(true)).toBe("checked");
    expect(getCheckedState(false)).toBe("unchecked");
    expect(getSelectionState(true)).toBe("checked");
    expect(getSelectionState(false)).toBe("unchecked");
    expect(getSelectionState("indeterminate")).toBe("indeterminate");
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

  test("polymorphic rendering supports intrinsic element names", () => {
    render(() =>
      renderPolymorphic("a", "button", {
        children: "Settings",
        href: "/settings",
        "data-scope": "kernel",
        "data-part": "trigger",
      }),
    );

    const trigger = getByPart("kernel", "trigger");
    expect(trigger.tagName).toBe("A");
    expect(trigger.getAttribute("href")).toBe("/settings");
  });

  test("polymorphic rendering supports direct Solid components", () => {
    type RouterLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
      to: string;
    };
    function RouterLink(props: RouterLinkProps) {
      const [local, others] = splitProps(props, ["to"]);

      return <a href={local.to} {...others} />;
    }

    render(() =>
      renderPolymorphic(RouterLink, "button", {
        children: "Security",
        to: "/account/security",
        "data-scope": "kernel",
        "data-part": "trigger",
      }),
    );

    const trigger = getByPart("kernel", "trigger");
    expect(trigger.tagName).toBe("A");
    expect(trigger.getAttribute("href")).toBe("/account/security");
  });

  test("polymorphic rendering supports router-link-like Solid components", () => {
    type RouterLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
      to: string;
    };
    function RouterLink(props: RouterLinkProps) {
      const [local, others] = splitProps(props, ["to"]);

      return <a href={local.to} {...others} />;
    }

    render(() => (
      <Dialog.Root>
        <Dialog.Trigger as={(props) => <RouterLink to="/account/security" {...props} />}>
          Security
        </Dialog.Trigger>
      </Dialog.Root>
    ));

    const trigger = getByPart("dialog", "trigger");
    expect(trigger.tagName).toBe("A");
    expect(trigger.getAttribute("href")).toBe("/account/security");
    expect(trigger.getAttribute("aria-haspopup")).toBeNull();
    expect(trigger.getAttribute("type")).toBe("button");
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

  test("form controls register dynamic descriptions and errors without duplicating ids", () => {
    createRoot((dispose) => {
      const [descriptionId, setDescriptionId] = createSignal<string | undefined>("project-hint");
      const [errorId, setErrorId] = createSignal<string | undefined>("project-error");
      const control = createFormControl({
        id: () => "project",
        invalid: () => true,
      });
      const unregisterDescription = control.registerDescription(descriptionId);
      const unregisterError = control.registerErrorMessage(errorId);

      expect(control.getControlProps()["aria-describedby"]).toBe(
        "project-description project-hint project-error-message project-error",
      );

      setDescriptionId("project-description");
      setErrorId(undefined);
      expect(control.getControlProps()["aria-describedby"]).toBe(
        "project-description project-error-message",
      );

      unregisterDescription();
      unregisterError();
      expect(control.getControlProps()["aria-describedby"]).toBe(
        "project-description project-error-message",
      );
      dispose();
    });
  });
});
