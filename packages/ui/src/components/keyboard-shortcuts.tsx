import {
  createHotkeys,
  formatForDisplay,
  type CreateHotkeyOptions,
  type HotkeyCallback,
  type RegisterableHotkey,
} from "@tanstack/solid-hotkeys";
import { createEffect, createMemo, type JSX } from "solid-js";

export type KeyboardShortcutScope = string;

export type KeyboardShortcutDefinition = {
  id: string;
  hotkey: RegisterableHotkey;
  label: string;
  description?: string;
  scope?: KeyboardShortcutScope;
  enabled?: boolean;
  ignoreInputs?: boolean;
  preventDefault?: boolean;
  requireReset?: boolean;
  stopPropagation?: boolean;
  onTrigger: HotkeyCallback;
};

export type KeyboardShortcutConflict = {
  hotkey: string;
  shortcutIds: readonly string[];
  scope?: KeyboardShortcutScope;
};

export type KeyboardShortcutsProps = {
  activeScope?: KeyboardShortcutScope;
  children?: JSX.Element;
  disabled?: boolean;
  onConflictsChange?: (conflicts: readonly KeyboardShortcutConflict[]) => void;
  shortcuts: readonly KeyboardShortcutDefinition[];
  target?: HTMLElement | Document | Window | null;
  options?: Omit<CreateHotkeyOptions, "enabled" | "target" | "meta">;
};

export function KeyboardShortcuts(props: KeyboardShortcutsProps) {
  const enabledShortcuts = createMemo(() =>
    props.shortcuts.filter((shortcut) =>
      isShortcutEnabled(shortcut, props.activeScope, props.disabled),
    ),
  );
  const conflicts = createMemo(() => getKeyboardShortcutConflicts(enabledShortcuts()));

  createEffect(() => {
    props.onConflictsChange?.(conflicts());
  });

  createHotkeys(
    () =>
      enabledShortcuts().map((shortcut) => ({
        hotkey: shortcut.hotkey,
        callback: shortcut.onTrigger,
        options: {
          enabled: shortcut.enabled !== false && !props.disabled,
          ignoreInputs: shortcut.ignoreInputs,
          meta: {
            name: shortcut.label,
            description: shortcut.description,
          },
          preventDefault: shortcut.preventDefault,
          requireReset: shortcut.requireReset,
          stopPropagation: shortcut.stopPropagation,
        },
      })),
    () => ({
      ...props.options,
      enabled: !props.disabled,
      ...(props.target !== undefined ? { target: props.target } : {}),
    }),
  );

  return <>{props.children}</>;
}

export function getKeyboardShortcutConflicts(
  shortcuts: readonly Pick<KeyboardShortcutDefinition, "enabled" | "hotkey" | "id" | "scope">[],
) {
  const byKey = new Map<string, string[]>();
  const byScope = new Map<string, KeyboardShortcutScope | undefined>();

  for (const shortcut of shortcuts) {
    if (shortcut.enabled === false) continue;
    const scope = shortcut.scope ?? "";
    const hotkey = formatForDisplay(shortcut.hotkey, { platform: "linux", useSymbols: false });
    const key = `${scope}:${hotkey}`;
    byKey.set(key, [...(byKey.get(key) ?? []), shortcut.id]);
    byScope.set(key, shortcut.scope);
  }

  return Array.from(byKey.entries())
    .filter(([, shortcutIds]) => shortcutIds.length > 1)
    .map(([key, shortcutIds]) => ({
      hotkey: key.slice(key.indexOf(":") + 1),
      shortcutIds,
      scope: byScope.get(key),
    }));
}

function isShortcutEnabled(
  shortcut: KeyboardShortcutDefinition,
  activeScope: KeyboardShortcutScope | undefined,
  disabled: boolean | undefined,
) {
  if (disabled || shortcut.enabled === false) return false;
  if (!activeScope || !shortcut.scope) return true;
  return shortcut.scope === activeScope;
}
