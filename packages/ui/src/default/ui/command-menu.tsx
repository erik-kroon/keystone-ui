import {
  Combobox as CoreCombobox,
  type ComboboxContentProps as CoreComboboxContentProps,
  type ComboboxGroupLabelProps as CoreComboboxGroupLabelProps,
  type ComboboxGroupProps as CoreComboboxGroupProps,
  type ComboboxInputProps as CoreComboboxInputProps,
  type ComboboxItemProps as CoreComboboxItemProps,
  type ComboboxItemTextProps as CoreComboboxItemTextProps,
  type ComboboxListboxProps as CoreComboboxListboxProps,
  type ComboboxPortalProps as CoreComboboxPortalProps,
  type ComboboxPositionerProps as CoreComboboxPositionerProps,
  type ComboboxRootProps as CoreComboboxRootProps,
  type ComboboxTriggerProps as CoreComboboxTriggerProps,
} from "@keystone-ui/core/combobox";
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

export type CommandMenuProps = Omit<CoreComboboxRootProps, "children" | "inputValue" | "open"> & {
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

export type CommandMenuRootProps = CoreComboboxRootProps;
export type CommandMenuTriggerProps = CoreComboboxTriggerProps;
export type CommandMenuInputProps = CoreComboboxInputProps;
export type CommandMenuPortalProps = CoreComboboxPortalProps;
export type CommandMenuPositionerProps = CoreComboboxPositionerProps;
export type CommandMenuContentProps = CoreComboboxContentProps & {
  portal?: CommandMenuPortalProps;
  positionerClass?: string;
};
export type CommandMenuListProps = CoreComboboxListboxProps;
export type CommandMenuGroupProps = CoreComboboxGroupProps;
export type CommandMenuGroupLabelProps = CoreComboboxGroupLabelProps;
export type CommandMenuItemProps = CoreComboboxItemProps & {
  shortcut?: JSX.Element;
};
export type CommandMenuItemTextProps = CoreComboboxItemTextProps;
export type CommandMenuShortcutProps = JSX.HTMLAttributes<HTMLSpanElement>;
export type CommandMenuEmptyProps = JSX.HTMLAttributes<HTMLDivElement>;

type CommandMenuGroupModel = {
  value: string;
  label?: string;
  items: readonly CommandMenuItemData[];
};

const defaultOpenShortcut = "Mod+K";
const ungroupedValue = "__ui-command-menu";

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
                          <span data-scope="ui-command-menu" data-part="item-label">
                            {item.label}
                          </span>
                          <Show when={item.description}>
                            <span data-scope="ui-command-menu" data-part="item-description">
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
  return <CoreCombobox.Root {...props} />;
}

export function CommandMenuTrigger(props: CommandMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Trigger {...rest} class={cn("ui-command-menu-trigger", local.class)} />;
}

export function CommandMenuInput(props: CommandMenuInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Input {...rest} class={cn("ui-command-menu-input", local.class)} />;
}

export function CommandMenuPortal(props: CommandMenuPortalProps) {
  return <CoreCombobox.Portal {...props} />;
}

export function CommandMenuPositioner(props: CommandMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.Positioner {...rest} class={cn("ui-command-menu-positioner", local.class)} />
  );
}

export function CommandMenuContent(props: CommandMenuContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);
  return (
    <CommandMenuPortal {...local.portal}>
      <CommandMenuPositioner class={local.positionerClass}>
        <CoreCombobox.Content {...rest} class={cn("ui-command-menu-content", local.class)}>
          {local.children}
        </CoreCombobox.Content>
      </CommandMenuPositioner>
    </CommandMenuPortal>
  );
}

export function CommandMenuList(props: CommandMenuListProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Listbox {...rest} class={cn("ui-command-menu-list", local.class)} />;
}

export function CommandMenuGroup(props: CommandMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.Group {...rest} class={cn("ui-command-menu-group", local.class)} />;
}

export function CommandMenuGroupLabel(props: CommandMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCombobox.GroupLabel {...rest} class={cn("ui-command-menu-group-label", local.class)} />
  );
}

export function CommandMenuItem(props: CommandMenuItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "shortcut"]);
  return (
    <CoreCombobox.Item {...rest} class={cn("ui-command-menu-item", local.class)}>
      {local.children}
      {local.shortcut}
    </CoreCombobox.Item>
  );
}

export function CommandMenuItemText(props: CommandMenuItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreCombobox.ItemText {...rest} class={cn("ui-command-menu-item-text", local.class)} />;
}

export function CommandMenuShortcut(props: CommandMenuShortcutProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      {...rest}
      data-scope="ui-command-menu"
      data-part="shortcut"
      class={cn("ui-command-menu-shortcut", local.class)}
    />
  );
}

export function CommandMenuEmpty(props: CommandMenuEmptyProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-command-menu"
      data-part="empty"
      class={cn("ui-command-menu-empty", local.class)}
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
