import {
  Command as CoreCommand,
  type CommandContentProps as CoreCommandContentProps,
  type CommandGroupLabelProps as CoreCommandGroupLabelProps,
  type CommandGroupProps as CoreCommandGroupProps,
  type CommandInputProps as CoreCommandInputProps,
  type CommandItemProps as CoreCommandItemProps,
  type CommandItemTextProps as CoreCommandItemTextProps,
  type CommandListboxProps as CoreCommandListboxProps,
  type CommandPortalProps as CoreCommandPortalProps,
  type CommandPositionerProps as CoreCommandPositionerProps,
  type CommandRootProps as CoreCommandRootProps,
  type CommandTriggerProps as CoreCommandTriggerProps,
} from "@keystone-ui/core/command";
import {
  createHotkeys,
  formatForDisplay,
  type CreateHotkeyOptions,
  type RegisterableHotkey,
} from "@tanstack/solid-hotkeys";
import { useSelector } from "@tanstack/solid-store";
import { For, Show, createMemo, splitProps, type JSX, type ParentProps } from "solid-js";
import {
  createCommandStore,
  type CommandStore,
  type CommandStoreCommand,
  type CommandStoreState,
} from "@/components/ui/command-store";
import { cn } from "@/lib/cn";

export type CommandMenuItemData = Omit<CommandStoreCommand, "id"> & {
  value: string;
  shortcut?: RegisterableHotkey;
  shortcutLabel?: string;
  onSelect?: (item: CommandMenuItemData) => void;
};

export type CommandMenuState = CommandStoreState<CommandStoreCommand>;
export type CommandMenuStore = CommandStore<CommandStoreCommand>;

export type CommandMenuHotkeysOptions = Omit<CreateHotkeyOptions, "target"> & {
  enabled?: boolean;
  itemShortcuts?: boolean;
  openShortcut?: RegisterableHotkey;
  target?: HTMLElement | Document | Window | null;
};

export type CommandMenuProps = Omit<CoreCommandRootProps, "children" | "inputValue" | "open"> & {
  children?: JSX.Element;
  backdropClass?: string;
  contentClass?: string;
  empty?: JSX.Element;
  footer?: JSX.Element;
  footerClass?: string;
  hotkeys?: boolean | CommandMenuHotkeysOptions;
  inputClass?: string;
  inputPlaceholder?: string;
  items: readonly CommandMenuItemData[];
  listboxClass?: string;
  onSelect?: (item: CommandMenuItemData) => void;
  portal?: CommandMenuPortalProps;
  panelClass?: string;
  positionerClass?: string;
  resetQueryOnSelect?: boolean;
  showBackdrop?: boolean;
  shortcutClass?: string;
  store?: CommandMenuStore;
  trigger?: JSX.Element;
  triggerClass?: string;
};

export type CommandMenuRootProps = CoreCommandRootProps;
export type CommandMenuTriggerProps = CoreCommandTriggerProps;
export type CommandMenuInputProps = CoreCommandInputProps;
export type CommandMenuPortalProps = CoreCommandPortalProps;
export type CommandMenuPositionerProps = CoreCommandPositionerProps;
export type CommandMenuBackdropProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CommandMenuContentProps = CoreCommandContentProps & {
  backdropClass?: string;
  portal?: CommandMenuPortalProps;
  positionerClass?: string;
  showBackdrop?: boolean;
};
export type CommandMenuListProps = CoreCommandListboxProps;
export type CommandMenuPanelProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;
export type CommandMenuGroupProps = CoreCommandGroupProps;
export type CommandMenuGroupLabelProps = CoreCommandGroupLabelProps;
export type CommandMenuItemProps = CoreCommandItemProps & {
  shortcut?: JSX.Element;
};
export type CommandMenuItemTextProps = CoreCommandItemTextProps;
export type CommandMenuShortcutProps = JSX.HTMLAttributes<HTMLElement>;
export type CommandMenuEmptyProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CommandMenuSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CommandMenuFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

type CommandMenuGroupModel = {
  value: string;
  label?: string;
  items: readonly CommandMenuItemData[];
};

const defaultOpenShortcut = "Mod+K";
const ungroupedValue = "__ui-command-menu";
const classes = (...tokens: string[]) => tokens.join(" ");

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

export function createCommandMenuStore(initialState: Partial<CommandMenuState> = {}) {
  return createCommandStore({ initialState }) satisfies CommandMenuStore;
}

export function CommandMenu(props: CommandMenuProps) {
  const [local, rootProps] = splitProps(props, [
    "children",
    "backdropClass",
    "contentClass",
    "empty",
    "footer",
    "footerClass",
    "hotkeys",
    "inputClass",
    "inputPlaceholder",
    "items",
    "listboxClass",
    "onSelect",
    "portal",
    "panelClass",
    "positionerClass",
    "resetQueryOnSelect",
    "showBackdrop",
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
        ...(options.target !== undefined ? { target: options.target } : {}),
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
        backdropClass={local.backdropClass}
        class={local.contentClass}
        portal={local.portal}
        positionerClass={local.positionerClass}
        showBackdrop={local.showBackdrop}
      >
        <CommandMenuInput
          class={local.inputClass}
          placeholder={local.inputPlaceholder ?? "Search commands"}
        />
        <CommandMenuPanel class={local.panelClass}>
          <CommandMenuList class={local.listboxClass}>
            <Show
              when={visibleItems().length > 0}
              fallback={<CommandMenuEmpty>{local.empty ?? "No results found."}</CommandMenuEmpty>}
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
                            <span
                              data-scope="ui-command-menu"
                              data-part="item-label"
                              data-slot="command-menu-item-label"
                              class="truncate"
                            >
                              {item.label}
                            </span>
                            <Show when={item.description}>
                              <span
                                data-scope="ui-command-menu"
                                data-part="item-description"
                                data-slot="command-menu-item-description"
                                class="truncate text-muted-foreground/72 text-xs"
                              >
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
        </CommandMenuPanel>
        <Show when={local.footer}>
          <CommandMenuFooter class={local.footerClass}>{local.footer}</CommandMenuFooter>
        </Show>
        {local.children}
      </CommandMenuContent>
    </CommandMenuRoot>
  );
}

export function CommandMenuRoot(props: CommandMenuRootProps) {
  return <CoreCommand.Root {...props} />;
}

export function CommandMenuTrigger(props: CommandMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCommand.Trigger
      {...rest}
      data-slot="command-menu-trigger"
      class={cn(
        classes(
          "ui-command-menu-trigger",
          "inline-flex",
          "h-8.5",
          "items-center",
          "gap-2",
          "rounded-lg",
          "border",
          "border-input",
          "bg-background",
          "px-3",
          "text-muted-foreground",
          "text-sm",
          "shadow-xs/5",
          "outline-none",
          "transition-[background-color,color,box-shadow]",
          "hover:bg-accent",
          "hover:text-accent-foreground",
          "focus-visible:border-ring",
          "focus-visible:ring-[3px]",
          "focus-visible:ring-ring/24",
          "disabled:pointer-events-none",
          "disabled:opacity-64",
        ),
        local.class,
      )}
    />
  );
}

export function CommandMenuInput(props: CommandMenuInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-scope="ui-command-menu"
      data-part="input-row"
      data-slot="command-menu-input-row"
      class="relative px-2.5 py-1.5"
    >
      <span
        aria-hidden="true"
        data-scope="ui-command-menu"
        data-part="input-icon"
        data-slot="command-menu-input-icon"
        class="pointer-events-none absolute z-10 mt-2.5 ms-[calc(--spacing(3)-1px)] flex size-4.5 items-center justify-center text-muted-foreground/72 sm:size-4"
      >
        <SearchIcon />
      </span>
      <CoreCommand.Input
        {...rest}
        data-slot="command-menu-input"
        class={cn(
          classes(
            "ui-command-menu-input",
            "h-9.5",
            "w-full",
            "min-w-0",
            "rounded-lg",
            "border",
            "border-transparent",
            "bg-transparent",
            "ps-[calc(--spacing(8.5)-1px)]",
            "pe-3",
            "text-base",
            "text-foreground",
            "shadow-none",
            "outline-none",
            "ring-0",
            "transition-colors",
            "placeholder:text-muted-foreground/72",
            "focus-visible:ring-0",
            "sm:h-8.5",
            "sm:text-sm",
            "[&::-webkit-search-cancel-button]:appearance-none",
            "[&::-webkit-search-decoration]:appearance-none",
            "[&::-webkit-search-results-button]:appearance-none",
            "[&::-webkit-search-results-decoration]:appearance-none",
          ),
          local.class,
        )}
      />
    </div>
  );
}

export function CommandMenuPortal(props: CommandMenuPortalProps) {
  return <CoreCommand.Portal {...props} />;
}

export function CommandMenuPositioner(props: CommandMenuPositionerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCommand.Positioner
      {...rest}
      data-slot="command-menu-positioner"
      class={cn(classes("ui-command-menu-positioner", "z-50"), local.class)}
    />
  );
}

export function CommandMenuBackdrop(props: CommandMenuBackdropProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-command-menu"
      data-part="backdrop"
      data-slot="command-menu-backdrop"
      class={cn(
        classes(
          "ui-command-menu-backdrop",
          "fixed",
          "inset-0",
          "z-50",
          "bg-black/32",
          "backdrop-blur-sm",
          "transition-all",
          "duration-200",
          "data-[transition-status=ending]:opacity-0",
          "data-[transition-status=starting]:opacity-0",
        ),
        local.class,
      )}
    />
  );
}

export function CommandMenuContent(props: CommandMenuContentProps) {
  const [local, rest] = splitProps(props, [
    "backdropClass",
    "children",
    "class",
    "portal",
    "positionerClass",
    "showBackdrop",
  ]);
  return (
    <CommandMenuPortal {...local.portal}>
      <Show when={local.showBackdrop !== false}>
        <CommandMenuBackdrop class={local.backdropClass} />
      </Show>
      <CommandMenuPositioner class={local.positionerClass}>
        <CoreCommand.Content
          {...rest}
          data-slot="command-menu-content"
          class={cn(
            classes(
              "ui-command-menu-content",
              "relative",
              "flex",
              "max-h-105",
              "min-h-0",
              "w-[min(calc(100vw-2rem),36rem)]",
              "min-w-0",
              "max-w-xl",
              "origin-(--transform-origin)",
              "flex-col",
              "rounded-2xl",
              "border",
              "bg-popover",
              "not-dark:bg-clip-padding",
              "text-popover-foreground",
              "shadow-lg/5",
              "outline-none",
              "transition-[scale,opacity]",
              "duration-200",
              "ease-in-out",
              "will-change-transform",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-2xl)-1px)]",
              "before:bg-muted/72",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
            local.class,
          )}
        >
          {local.children}
        </CoreCommand.Content>
      </CommandMenuPositioner>
    </CommandMenuPortal>
  );
}

export function CommandMenuList(props: CommandMenuListProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCommand.Listbox
      {...rest}
      data-slot="command-menu-list"
      class={cn(
        classes(
          "ui-command-menu-list",
          "max-h-[min(var(--available-height),22rem)]",
          "min-h-0",
          "overflow-y-auto",
          "not-empty:p-2",
          "not-empty:scroll-py-2",
          "in-data-has-overflow-y:pe-3",
        ),
        local.class,
      )}
    />
  );
}

export function CommandMenuPanel(props: CommandMenuPanelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-command-menu"
      data-part="panel"
      data-slot="command-menu-panel"
      class={cn(
        classes(
          "ui-command-menu-panel",
          "relative",
          "-mx-px",
          "min-h-0",
          "rounded-t-xl",
          "border",
          "border-b-0",
          "bg-popover",
          "bg-clip-padding",
          "shadow-xs/5",
          "[clip-path:inset(0_1px)]",
          "not-has-[+[data-slot=command-menu-footer]]:-mb-px",
          "not-has-[+[data-slot=command-menu-footer]]:rounded-b-2xl",
          "not-has-[+[data-slot=command-menu-footer]]:[clip-path:inset(0_1px_1px_1px_round_0_0_calc(var(--radius-2xl)-1px)_calc(var(--radius-2xl)-1px))]",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-t-[calc(var(--radius-xl)-1px)]",
        ),
        local.class,
      )}
    />
  );
}

export function CommandMenuGroup(props: CommandMenuGroupProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCommand.Group
      {...rest}
      data-slot="command-menu-group"
      class={cn(classes("ui-command-menu-group", "[[role=group]+&]:mt-2"), local.class)}
    />
  );
}

export function CommandMenuGroupLabel(props: CommandMenuGroupLabelProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCommand.GroupLabel
      {...rest}
      data-slot="command-menu-group-label"
      class={cn(
        classes(
          "ui-command-menu-group-label",
          "px-2",
          "py-1.5",
          "font-medium",
          "text-muted-foreground",
          "text-xs",
        ),
        local.class,
      )}
    />
  );
}

export function CommandMenuItem(props: CommandMenuItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "shortcut"]);
  return (
    <CoreCommand.Item
      {...rest}
      data-slot="command-menu-item"
      class={cn(
        classes(
          "ui-command-menu-item",
          "grid",
          "min-h-9",
          "cursor-default",
          "select-none",
          "grid-cols-[minmax(0,1fr)_auto]",
          "items-center",
          "gap-3",
          "rounded-sm",
          "px-2",
          "py-1.5",
          "text-base",
          "text-foreground",
          "outline-none",
          "data-disabled:pointer-events-none",
          "data-highlighted:bg-accent",
          "data-highlighted:text-accent-foreground",
          "data-disabled:opacity-64",
          "sm:min-h-8",
          "sm:text-sm",
          "[&_svg:not([class*='size-'])]:size-4.5",
          "sm:[&_svg:not([class*='size-'])]:size-4",
          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
        ),
        local.class,
      )}
    >
      {local.children}
      {local.shortcut}
    </CoreCommand.Item>
  );
}

export function CommandMenuItemText(props: CommandMenuItemTextProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <CoreCommand.ItemText
      {...rest}
      data-slot="command-menu-item-text"
      class={cn(
        classes(
          "ui-command-menu-item-text",
          "col-start-1",
          "flex",
          "min-w-0",
          "flex-col",
          "gap-0.5",
        ),
        local.class,
      )}
    />
  );
}

export function CommandMenuShortcut(props: CommandMenuShortcutProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <kbd
      {...rest}
      data-scope="ui-command-menu"
      data-part="shortcut"
      data-slot="command-menu-shortcut"
      class={cn(
        classes(
          "ui-command-menu-shortcut",
          "col-start-2",
          "ms-auto",
          "font-medium",
          "font-sans",
          "text-muted-foreground/72",
          "text-xs",
          "tracking-widest",
        ),
        local.class,
      )}
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
      data-slot="command-menu-empty"
      class={cn(
        classes(
          "ui-command-menu-empty",
          "not-empty:py-6",
          "px-2",
          "text-center",
          "text-base",
          "text-muted-foreground",
          "sm:text-sm",
        ),
        local.class,
      )}
    />
  );
}

export function CommandMenuSeparator(props: CommandMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      role="separator"
      data-scope="ui-command-menu"
      data-part="separator"
      data-slot="command-menu-separator"
      class={cn(
        classes("ui-command-menu-separator", "mx-2", "my-2", "h-px", "bg-border"),
        local.class,
      )}
    />
  );
}

export function CommandMenuFooter(props: CommandMenuFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      {...rest}
      data-scope="ui-command-menu"
      data-part="footer"
      data-slot="command-menu-footer"
      class={cn(
        classes(
          "ui-command-menu-footer",
          "flex",
          "items-center",
          "justify-between",
          "gap-2",
          "rounded-b-[calc(var(--radius-2xl)-1px)]",
          "border-t",
          "px-5",
          "py-3",
          "text-muted-foreground",
          "text-xs",
        ),
        local.class,
      )}
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
