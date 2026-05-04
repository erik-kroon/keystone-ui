import {
  Combobox as KeystoneCombobox,
  type ComboboxContentProps as KeystoneComboboxContentProps,
  type ComboboxGroupLabelProps as KeystoneComboboxGroupLabelProps,
  type ComboboxGroupProps as KeystoneComboboxGroupProps,
  type ComboboxInputProps as KeystoneComboboxInputProps,
  type ComboboxItemProps as KeystoneComboboxItemProps,
  type ComboboxItemTextProps as KeystoneComboboxItemTextProps,
  type ComboboxListboxProps as KeystoneComboboxListboxProps,
  type ComboboxPortalProps as KeystoneComboboxPortalProps,
  type ComboboxPositionerProps as KeystoneComboboxPositionerProps,
  type ComboboxRootProps as KeystoneComboboxRootProps,
  type ComboboxTriggerProps as KeystoneComboboxTriggerProps,
} from "@keystone-ui/keystone/combobox";
import {
  createHotkeys,
  formatForDisplay,
  type CreateHotkeyOptions,
  type RegisterableHotkey,
} from "@tanstack/solid-hotkeys";
import { createStore, useSelector, type Store } from "@tanstack/solid-store";
import { For, Show, createMemo, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export type CommandMenuItemData = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
  keywords?: readonly string[];
  shortcut?: RegisterableHotkey;
  shortcutLabel?: string;
  onSelect?: (item: CommandMenuItemData) => void;
};

export type CommandMenuState = {
  open: boolean;
  query: string;
  lastSelectedValue?: string;
};

export type CommandMenuStore = {
  store: Store<CommandMenuState>;
  close: () => void;
  open: () => void;
  resetQuery: () => void;
  selectValue: (value: string) => void;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  toggleOpen: () => void;
};

export type CommandMenuHotkeysOptions = Omit<CreateHotkeyOptions, "target"> & {
  enabled?: boolean;
  itemShortcuts?: boolean;
  openShortcut?: RegisterableHotkey;
  target?: HTMLElement | Document | Window | null;
};

export type CommandMenuProps = Omit<
  KeystoneComboboxRootProps,
  "children" | "inputValue" | "open"
> & {
  children?: JSX.Element;
  contentClass?: string;
  empty?: JSX.Element;
  hotkeys?: boolean | CommandMenuHotkeysOptions;
  inputClass?: string;
  inputPlaceholder?: string;
  items: readonly CommandMenuItemData[];
  listboxClass?: string;
  onSelect?: (item: CommandMenuItemData) => void;
  portal?: CommandMenuPortalProps;
  positionerClass?: string;
  resetQueryOnSelect?: boolean;
  shortcutClass?: string;
  store?: CommandMenuStore;
  trigger?: JSX.Element;
  triggerClass?: string;
};

export type CommandMenuRootProps = KeystoneComboboxRootProps;
export type CommandMenuTriggerProps = KeystoneComboboxTriggerProps;
export type CommandMenuInputProps = KeystoneComboboxInputProps;
export type CommandMenuPortalProps = KeystoneComboboxPortalProps;
export type CommandMenuPositionerProps = KeystoneComboboxPositionerProps;
export type CommandMenuContentProps = KeystoneComboboxContentProps & {
  portal?: CommandMenuPortalProps;
  positionerClass?: string;
};
export type CommandMenuListProps = KeystoneComboboxListboxProps;
export type CommandMenuGroupProps = KeystoneComboboxGroupProps;
export type CommandMenuGroupLabelProps = KeystoneComboboxGroupLabelProps;
export type CommandMenuItemProps = KeystoneComboboxItemProps & {
  shortcut?: JSX.Element;
};
export type CommandMenuItemTextProps = KeystoneComboboxItemTextProps;
export type CommandMenuShortcutProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type CommandMenuEmptyProps = JSX.HTMLAttributes<HTMLDivElement>;

type CommandMenuGroupModel = {
  value: string;
  label?: string;
  items: readonly CommandMenuItemData[];
};

const defaultOpenShortcut = "Mod+K";
const ungroupedValue = "__mason-command-menu";

export function createCommandMenuStore(initialState: Partial<CommandMenuState> = {}) {
  const store = createStore<CommandMenuState>({
    open: initialState.open ?? false,
    query: initialState.query ?? "",
    lastSelectedValue: initialState.lastSelectedValue,
  });

  const setOpen = (open: boolean) => store.setState((state) => ({ ...state, open }));
  const setQuery = (query: string) => store.setState((state) => ({ ...state, query }));

  return {
    store,
    close: () => setOpen(false),
    open: () => setOpen(true),
    resetQuery: () => setQuery(""),
    selectValue: (value: string) =>
      store.setState((state) => ({
        ...state,
        lastSelectedValue: value,
      })),
    setOpen,
    setQuery,
    toggleOpen: () => store.setState((state) => ({ ...state, open: !state.open })),
  } satisfies CommandMenuStore;
}

export function CommandMenu(props: CommandMenuProps) {
  const [local, rootProps] = splitProps(props, [
    "children",
    "contentClass",
    "empty",
    "hotkeys",
    "inputClass",
    "inputPlaceholder",
    "items",
    "listboxClass",
    "onSelect",
    "portal",
    "positionerClass",
    "resetQueryOnSelect",
    "shortcutClass",
    "store",
    "trigger",
    "triggerClass",
  ]);
  const commandStore = local.store ?? createCommandMenuStore({ open: rootProps.defaultOpen });
  const open = useSelector(commandStore.store, (state) => state.open);
  const query = useSelector(commandStore.store, (state) => state.query);
  const visibleItems = createMemo(() => filterCommandItems(local.items, query()));
  const groups = createMemo(() => groupCommandItems(visibleItems()));
  const hotkeys = createMemo(() => normalizeHotkeys(local.hotkeys));

  const selectItem = (item: CommandMenuItemData) => {
    if (item.disabled) return;
    commandStore.selectValue(item.value);
    item.onSelect?.(item);
    local.onSelect?.(item);
    commandStore.close();

    if (local.resetQueryOnSelect !== false) {
      commandStore.resetQuery();
    }
  };

  createHotkeys(
    () => {
      const options = hotkeys();
      if (!options.enabled) return [];
      const definitions = [
        {
          hotkey: options.openShortcut,
          callback: (event: KeyboardEvent) => {
            event.preventDefault();
            commandStore.toggleOpen();
          },
          options: {
            ignoreInputs: false,
            meta: {
              name: "Open command menu",
              description: "Preview TanStack Hotkeys shortcut for the command menu.",
            },
          },
        },
      ];

      if (!options.itemShortcuts) return definitions;

      for (const item of local.items) {
        if (!item.shortcut || item.disabled) continue;
        definitions.push({
          hotkey: item.shortcut,
          callback: (event: KeyboardEvent) => {
            event.preventDefault();
            selectItem(item);
          },
          options: {
            ignoreInputs: true,
            meta: {
              name: item.label,
              description: "Preview TanStack Hotkeys command item shortcut.",
            },
          },
        });
      }

      return definitions;
    },
    () => {
      const options = hotkeys();
      return {
        enabled: options.enabled && !rootProps.disabled,
        preventDefault: options.preventDefault ?? true,
        requireReset: options.requireReset ?? true,
        stopPropagation: options.stopPropagation ?? true,
        target: options.target,
      };
    },
  );

  return (
    <CommandMenuRoot
      {...rootProps}
      inputValue={query()}
      open={open()}
      onInputValueChange={(value, detail) => {
        commandStore.setQuery(value);
        rootProps.onInputValueChange?.(value, detail);
      }}
      onOpenChange={(nextOpen, detail) => {
        commandStore.setOpen(nextOpen);
        rootProps.onOpenChange?.(nextOpen, detail);
      }}
      onValueChange={(value, detail) => {
        const item = local.items.find((candidate) => candidate.value === value);
        if (item) {
          selectItem(item);
        }
        rootProps.onValueChange?.(value, detail);
      }}
    >
      <Show when={local.trigger}>
        <CommandMenuTrigger class={local.triggerClass}>{local.trigger}</CommandMenuTrigger>
      </Show>
      <CommandMenuContent
        class={local.contentClass}
        portal={local.portal}
        positionerClass={local.positionerClass}
      >
        <CommandMenuInput
          class={local.inputClass}
          placeholder={local.inputPlaceholder ?? "Search commands"}
        />
        <CommandMenuList class={local.listboxClass}>
          <Show
            when={visibleItems().length > 0}
            fallback={<CommandMenuEmpty>{local.empty ?? "No commands found."}</CommandMenuEmpty>}
          >
            <For each={groups()}>
              {(group) => (
                <CommandMenuGroup value={group.value} label={group.label ?? "Commands"}>
                  <Show when={group.label}>
                    <CommandMenuGroupLabel>{group.label}</CommandMenuGroupLabel>
                  </Show>
                  <For each={group.items}>
                    {(item) => (
                      <CommandMenuItem
                        disabled={item.disabled}
                        group={group.value}
                        label={item.label}
                        value={item.value}
                        shortcut={
                          item.shortcut ? (
                            <CommandMenuShortcut class={local.shortcutClass}>
                              {item.shortcutLabel ?? formatForDisplay(item.shortcut)}
                            </CommandMenuShortcut>
                          ) : undefined
                        }
                      >
                        <CommandMenuItemText>
                          <span data-scope="mason-command-menu" data-part="item-label">
                            {item.label}
                          </span>
                          <Show when={item.description}>
                            <span data-scope="mason-command-menu" data-part="item-description">
                              {item.description}
                            </span>
                          </Show>
                        </CommandMenuItemText>
                      </CommandMenuItem>
                    )}
                  </For>
                </CommandMenuGroup>
              )}
            </For>
          </Show>
        </CommandMenuList>
        {local.children}
      </CommandMenuContent>
    </CommandMenuRoot>
  );
}

export function CommandMenuRoot(props: CommandMenuRootProps) {
  return <KeystoneCombobox.Root {...props} />;
}

export function CommandMenuTrigger(props: CommandMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.Trigger {...rest} class={cn("mason-command-menu-trigger", local.class)} />
  );
}

export function CommandMenuInput(props: CommandMenuInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Input {...rest} class={cn("mason-command-menu-input", local.class)} />;
}

export function CommandMenuPortal(props: CommandMenuPortalProps) {
  return <KeystoneCombobox.Portal {...props} />;
}

export function CommandMenuPositioner(props: CommandMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.Positioner
      {...rest}
      class={cn("mason-command-menu-positioner", local.class)}
    />
  );
}

export function CommandMenuContent(props: CommandMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <CommandMenuPortal {...local.portal}>
      <CommandMenuPositioner class={local.positionerClass}>
        <KeystoneCombobox.Content {...rest} class={cn("mason-command-menu-content", local.class)}>
          {local.children}
        </KeystoneCombobox.Content>
      </CommandMenuPositioner>
    </CommandMenuPortal>
  );
}

export function CommandMenuList(props: CommandMenuListProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Listbox {...rest} class={cn("mason-command-menu-list", local.class)} />;
}

export function CommandMenuGroup(props: CommandMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneCombobox.Group {...rest} class={cn("mason-command-menu-group", local.class)} />;
}

export function CommandMenuGroupLabel(props: CommandMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.GroupLabel
      {...rest}
      class={cn("mason-command-menu-group-label", local.class)}
    />
  );
}

export function CommandMenuItem(props: CommandMenuItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "shortcut"]);
  return (
    <KeystoneCombobox.Item {...rest} class={cn("mason-command-menu-item", local.class)}>
      {local.children}
      {local.shortcut}
    </KeystoneCombobox.Item>
  );
}

export function CommandMenuItemText(props: CommandMenuItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KeystoneCombobox.ItemText {...rest} class={cn("mason-command-menu-item-text", local.class)} />
  );
}

export function CommandMenuShortcut(props: CommandMenuShortcutProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      {...rest}
      data-scope="mason-command-menu"
      data-part="shortcut"
      class={cn("mason-command-menu-shortcut", local.class)}
    />
  );
}

export function CommandMenuEmpty(props: CommandMenuEmptyProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="mason-command-menu"
      data-part="empty"
      class={cn("mason-command-menu-empty", local.class)}
    />
  );
}

function normalizeHotkeys(
  options: CommandMenuProps["hotkeys"],
): Required<Pick<CommandMenuHotkeysOptions, "enabled" | "itemShortcuts" | "openShortcut">> &
  Omit<CommandMenuHotkeysOptions, "enabled" | "itemShortcuts" | "openShortcut"> {
  if (options === false) {
    return { enabled: false, itemShortcuts: false, openShortcut: defaultOpenShortcut };
  }

  if (options === true || options === undefined) {
    return { enabled: true, itemShortcuts: true, openShortcut: defaultOpenShortcut };
  }

  return {
    ...options,
    enabled: options.enabled ?? true,
    itemShortcuts: options.itemShortcuts ?? true,
    openShortcut: options.openShortcut ?? defaultOpenShortcut,
  };
}

function filterCommandItems(items: readonly CommandMenuItemData[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) => {
    const haystack = [
      item.label,
      item.value,
      item.description,
      item.group,
      ...(item.keywords ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function groupCommandItems(items: readonly CommandMenuItemData[]) {
  const groups: CommandMenuGroupModel[] = [];
  const byValue = new Map<string, CommandMenuGroupModel>();

  for (const item of items) {
    const value = item.group ?? ungroupedValue;
    let group = byValue.get(value);

    if (!group) {
      group = {
        value,
        label: item.group,
        items: [],
      };
      byValue.set(value, group);
      groups.push(group);
    }

    group.items = [...group.items, item];
  }

  return groups;
}
