import { getHotkeyManager } from "@tanstack/solid-hotkeys";
import { render } from "solid-js/web";
import { afterEach, describe, expect, test, vi } from "vitest";
import { KeyboardShortcuts, getKeyboardShortcutConflicts } from "./keyboard-shortcuts";

describe("KeyboardShortcuts", () => {
  afterEach(() => {
    getHotkeyManager().destroy();
  });

  test("registers scoped app shortcuts and reports conflicts", async () => {
    const onSave = vi.fn();
    const onDisabled = vi.fn();
    const onConflictsChange = vi.fn();
    const host = document.createElement("div");
    document.body.append(host);

    const dispose = render(
      () => (
        <KeyboardShortcuts
          activeScope="editor"
          onConflictsChange={onConflictsChange}
          shortcuts={[
            {
              id: "save",
              hotkey: "Control+S",
              label: "Save",
              scope: "editor",
              onTrigger: onSave,
            },
            {
              id: "save-copy",
              hotkey: "Control+S",
              label: "Save copy",
              scope: "editor",
              onTrigger: () => undefined,
            },
            {
              id: "dashboard",
              hotkey: "Control+D",
              label: "Dashboard",
              scope: "dashboard",
              onTrigger: onDisabled,
            },
          ]}
        />
      ),
      host,
    );

    await tick();

    const registrations = Array.from(getHotkeyManager().registrations.state.values());
    const saveRegistration = registrations.find(
      (registration) => registration.options.meta?.name === "Save",
    );
    const dashboardRegistration = registrations.find(
      (registration) => registration.options.meta?.name === "Dashboard",
    );

    expect(saveRegistration).toBeDefined();
    expect(dashboardRegistration).toBeUndefined();
    getHotkeyManager().triggerRegistration(saveRegistration!.id);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onDisabled).not.toHaveBeenCalled();
    expect(onConflictsChange).toHaveBeenLastCalledWith([
      {
        hotkey: "Ctrl+S",
        shortcutIds: ["save", "save-copy"],
        scope: "editor",
      },
    ]);

    dispose();
    host.remove();
  });

  test("computes conflicts without rendering", () => {
    expect(
      getKeyboardShortcutConflicts([
        { id: "one", hotkey: "Control+K", scope: "global" },
        { id: "two", hotkey: "Control+K", scope: "global" },
        { id: "three", hotkey: "Control+K", scope: "panel" },
      ]),
    ).toEqual([
      {
        hotkey: "Ctrl+K",
        shortcutIds: ["one", "two"],
        scope: "global",
      },
    ]);
  });
});

function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
