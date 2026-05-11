import { getHotkeyManager } from "@tanstack/solid-hotkeys";
import { render } from "solid-js/web";
import { afterEach, describe, expect, test, vi } from "vitest";
import { CommandMenu, createCommandMenuStore, type CommandMenuItemData } from "./command-menu";

const commands: readonly CommandMenuItemData[] = [
  {
    value: "open-invoices",
    label: "Open invoices",
    description: "Jump to the billing table.",
    group: "Navigation",
    keywords: ["billing", "table"],
    shortcut: "Control+I",
  },
  {
    value: "open-settings",
    label: "Open settings",
    description: "Change workspace preferences.",
    group: "Navigation",
    keywords: ["preferences"],
    shortcut: "Control+,",
  },
  {
    value: "delete-record",
    label: "Delete record",
    description: "Remove the selected record.",
    disabled: true,
    group: "Actions",
    shortcut: "Control+D",
  },
];

describe("CommandMenu", () => {
  afterEach(() => {
    getHotkeyManager().destroy();
    document.body.replaceChildren();
  });

  test("renders Core-backed command roles, grouped UI parts, shortcuts, and filtered empty state", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <CommandMenu
          defaultOpen
          empty="Nothing matched"
          hotkeys={false}
          inputPlaceholder="Find a command"
          items={commands}
        />
      ),
      host,
    );

    await tick();

    const input = document.querySelector<HTMLInputElement>("[data-slot='command-menu-input']");
    const positioner = document.querySelector<HTMLElement>("[data-slot='command-menu-positioner']");
    const content = document.querySelector<HTMLElement>("[data-slot='command-menu-content']");
    const listbox = document.querySelector("[data-slot='command-menu-list']");
    const labels = Array.from(
      document.querySelectorAll("[data-slot='command-menu-group-label']"),
    ).map((label) => label.textContent);
    const shortcut = document.querySelector("[data-slot='command-menu-shortcut']");

    expect(input?.getAttribute("role")).toBe("combobox");
    expect(input?.getAttribute("aria-autocomplete")).toBe("list");
    expect(input?.getAttribute("aria-expanded")).toBe("true");
    expect(input?.placeholder).toBe("Find a command");
    expect(positioner?.getAttribute("data-scope")).toBe("ui-command-menu");
    expect(positioner?.className).toContain("fixed");
    expect(positioner?.style.position).toBe("");
    expect(content?.style.position).toBe("");
    expect(listbox?.getAttribute("role")).toBe("listbox");
    expect(labels).toEqual(["Navigation", "Actions"]);
    expect(shortcut?.textContent).toContain("Ctrl");
    expect(
      document.querySelector("[data-value='delete-record']")?.getAttribute("aria-disabled"),
    ).toBe("true");

    inputText(input!, "preferences");
    await tick();

    expect(document.querySelector("[data-value='open-settings']")).not.toBeNull();
    expect(document.querySelector("[data-value='open-invoices']")).toBeNull();

    inputText(input!, "not-a-command");
    await tick();

    expect(document.querySelector("[data-slot='command-menu-empty']")?.textContent).toBe(
      "Nothing matched",
    );

    dispose();
  });

  test("coordinates selection with the shared command store and resets query after user handlers", async () => {
    const store = createCommandMenuStore({ open: true, query: "settings" });
    const selected = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <CommandMenu
          hotkeys={false}
          items={commands}
          onSelect={selected}
          store={store}
          trigger="Commands"
        />
      ),
      host,
    );

    await tick();

    document.querySelector<HTMLElement>("[data-value='open-settings']")?.click();
    await tick();

    expect(selected).toHaveBeenCalledWith(expect.objectContaining({ value: "open-settings" }));
    expect(store.store.get()).toMatchObject({
      open: false,
      query: "",
      selectedCommandId: "open-settings",
      lastSelectedValue: "open-settings",
    });
    expect(store.store.get().recentlyUsedCommandIds).toEqual(["open-settings"]);

    dispose();
  });

  test("uses ranked command search and supports external filtering escape hatches", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => <CommandMenu defaultOpen hotkeys={false} items={commands} trigger="Commands" />,
      host,
    );

    await tick();

    const input = document.querySelector<HTMLInputElement>("[data-slot='command-menu-input']");

    inputText(input!, "oi");
    await tick();

    expect(document.querySelector("[data-value='open-invoices']")).not.toBeNull();
    expect(document.querySelector("[data-value='open-settings']")).toBeNull();

    inputText(input!, "opp");
    await tick();

    expect(document.querySelector("[data-value='open-invoices']")).toBeNull();
    expect(document.querySelector("[data-value='open-settings']")).toBeNull();

    inputText(input!, "open-settings");
    await tick();

    expect(document.querySelector("[data-value='open-settings']")).not.toBeNull();
    expect(document.querySelector("[data-value='open-invoices']")).toBeNull();

    inputText(input!, "bill tab");
    await tick();

    expect(document.querySelector("[data-value='open-invoices']")).not.toBeNull();
    expect(document.querySelector("[data-value='open-settings']")).toBeNull();

    dispose();

    document.body.replaceChildren();
    document.body.append(host);
    const customFilter = vi.fn(
      (item: CommandMenuItemData, query: string) =>
        item.value === "delete-record" && query === "anything",
    );
    const filteredDispose = render(
      () => <CommandMenu defaultOpen filter={customFilter} hotkeys={false} items={commands} />,
      host,
    );

    await tick();

    const filteredInput = document.querySelector<HTMLInputElement>(
      "[data-slot='command-menu-input']",
    );
    inputText(filteredInput!, "anything");
    await tick();

    expect(customFilter).toHaveBeenCalled();
    expect(document.querySelector("[data-value='delete-record']")).not.toBeNull();
    expect(document.querySelector("[data-value='open-invoices']")).toBeNull();

    filteredDispose();

    document.body.replaceChildren();
    document.body.append(host);
    const externalDispose = render(
      () => (
        <CommandMenu defaultOpen filteredItems={[commands[1]!]} hotkeys={false} items={commands} />
      ),
      host,
    );

    await tick();

    expect(document.querySelector("[data-value='open-settings']")).not.toBeNull();
    expect(document.querySelector("[data-value='open-invoices']")).toBeNull();

    externalDispose();
  });

  test("highlights the first filtered command so Enter selects it", async () => {
    const selected = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => <CommandMenu defaultOpen hotkeys={false} items={commands} onSelect={selected} />,
      host,
    );

    await tick();

    const input = document.querySelector<HTMLInputElement>("[data-slot='command-menu-input']");
    inputText(input!, "open-settings");
    await tick();

    expect(
      document.querySelector("[data-value='open-settings']")?.getAttribute("data-highlighted"),
    ).toBe("");

    keyDown(input!, "Enter");
    await tick();

    expect(selected).toHaveBeenCalledWith(expect.objectContaining({ value: "open-settings" }));

    dispose();
  });

  test("closes from Escape even when focus is outside the command input", async () => {
    const store = createCommandMenuStore({ open: true });
    const onOpenChange = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <CommandMenu hotkeys={false} items={commands} onOpenChange={onOpenChange} store={store} />
      ),
      host,
    );

    await tick();

    document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    await tick();

    expect(store.store.state.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: "escape" }));

    dispose();
  });

  test("registers optional TanStack hotkeys for opening the menu and invoking item shortcuts", async () => {
    const onSelect = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);
    const dispose = render(
      () => (
        <CommandMenu
          hotkeys={{ openShortcut: "Control+K", target: document }}
          items={commands}
          onSelect={onSelect}
        />
      ),
      host,
    );

    await tick();

    const registrations = Array.from(getHotkeyManager().registrations.state.values());
    const openRegistration = registrations.find(
      (registration) => registration.options.meta?.name === "Open command menu",
    );
    const itemRegistration = registrations.find(
      (registration) => registration.options.meta?.name === "Open invoices",
    );

    expect(openRegistration).toBeDefined();
    expect(itemRegistration).toBeDefined();

    getHotkeyManager().triggerRegistration(itemRegistration!.id);

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "open-invoices" }));

    dispose();
  });
});

function inputText(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true }));
}

function keyDown(element: HTMLElement, key: string) {
  element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key }));
}

function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
