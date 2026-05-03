import type { JSX } from "solid-js";
import { describe, expect, test } from "vitest";
import { createRoot, createSignal } from "solid-js";
import {
  composeEventHandlers,
  createCollection,
  createControllableSignal,
  createStableId,
  createTypeahead,
  firstEnabledItem,
  lastEnabledItem,
  nextEnabledItem,
  renderPolymorphic,
} from "./index";
import { createFormControl } from "../form/index";
import { getByPart, render } from "../../test/harness";

describe("Keystone kernel utilities", () => {
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
      const collection = createCollection();

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
