import { For, createSignal } from "solid-js";
import {
  CommandMenu,
  createCommandMenuStore,
  type CommandMenuHotkeysOptions,
  type CommandMenuItemData,
} from "@/components/ui/command-menu";
import { ShortcutDisplay } from "@/components/ui/shortcut-display";
import { cn } from "@/lib/cn";

type CommandSurfaceCommand = CommandMenuItemData & {
  section: string;
  surface: string;
};

export type KeyboardCommandSurfaceBlockProps = {
  class?: string;
  title?: string;
  description?: string;
  commands?: readonly CommandSurfaceCommand[];
  hotkeys?: boolean | CommandMenuHotkeysOptions;
};

const commandSurfaceCommands: readonly CommandSurfaceCommand[] = [
  {
    value: "workspace-overview",
    label: "Open workspace overview",
    description: "Move focus to the live workspace summary.",
    group: "Navigation",
    section: "Navigation",
    surface: "Workspace",
    shortcut: "Mod+1",
    keywords: ["workspace", "overview", "home"],
  },
  {
    value: "review-queue",
    label: "Review queue",
    description: "Jump to the records that need a decision.",
    group: "Navigation",
    section: "Navigation",
    surface: "Queue",
    shortcut: "G",
    keywords: ["review", "queue", "triage"],
  },
  {
    value: "create-record",
    label: "Create record",
    description: "Start the primary creation flow.",
    group: "Actions",
    section: "Actions",
    surface: "Records",
    shortcut: "Mod+N",
    keywords: ["create", "new", "record"],
  },
  {
    value: "assign-owner",
    label: "Assign owner",
    description: "Open the owner picker for selected records.",
    group: "Actions",
    section: "Actions",
    surface: "Records",
    shortcut: "A",
    keywords: ["assign", "owner", "people"],
  },
  {
    value: "toggle-inspector",
    label: "Toggle inspector",
    description: "Show or hide the contextual detail panel.",
    group: "Panels",
    section: "Panels",
    surface: "Inspector",
    shortcut: "Mod+.",
    keywords: ["panel", "inspector", "details"],
  },
  {
    value: "focus-search",
    label: "Focus search",
    description: "Move to the workspace search field.",
    group: "Panels",
    section: "Panels",
    surface: "Search",
    shortcut: "/",
    keywords: ["search", "filter", "find"],
  },
];

const fallbackAction = (command: CommandSurfaceCommand) => `${command.label} selected`;

export function KeyboardCommandSurfaceBlock(props: KeyboardCommandSurfaceBlockProps) {
  const [lastAction, setLastAction] = createSignal(
    "Open the command surface or inspect a shortcut.",
  );
  const commandStore = createCommandMenuStore({ open: false });
  const commands = () =>
    (props.commands ?? commandSurfaceCommands).map((command) => ({
      ...command,
      onSelect: (item: CommandMenuItemData) => {
        command.onSelect?.(item as CommandSurfaceCommand);
        setLastAction(fallbackAction(command));
      },
    }));

  return (
    <section
      class={cn(
        "ui-block-keyboard-command-surface rounded-lg border bg-background text-foreground shadow-sm",
        props.class,
      )}
      data-scope="ui-block"
      data-part="keyboard-command-surface"
    >
      <header
        class="grid gap-4 border-b p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
        data-scope="ui-block"
        data-part="command-surface-header"
      >
        <div class="min-w-0">
          <p class="text-xs font-medium uppercase text-muted-foreground">Command surface</p>
          <h2 class="mt-1 text-xl font-semibold tracking-normal">
            {props.title ?? "Keyboard-first workspace commands"}
          </h2>
          <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
            {props.description ??
              "Grouped commands, visible shortcuts, and Core-owned combobox focus behavior in installable UI source."}
          </p>
        </div>
        <CommandMenu
          hotkeys={props.hotkeys ?? true}
          items={commands()}
          store={commandStore}
          trigger="Search commands"
        />
      </header>

      <div
        class="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]"
        data-scope="ui-block"
        data-part="command-surface-grid"
      >
        <div class="min-w-0 p-4" data-scope="ui-block" data-part="command-surface-list">
          <div class="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 class="text-sm font-semibold">Command groups</h3>
              <p class="text-sm text-muted-foreground">
                Rows mirror the command menu data so grouping and shortcuts can be inspected.
              </p>
            </div>
            <span class="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
              {commands().length} commands
            </span>
          </div>

          <div class="overflow-hidden rounded-md border" role="list" aria-label="Command groups">
            <For each={commands()}>
              {(command) => (
                <div
                  class="grid gap-2 border-b px-3 py-3 text-sm last:border-b-0 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center"
                  data-scope="ui-block"
                  data-part="command-row"
                  role="listitem"
                >
                  <span class="font-medium text-muted-foreground">{command.section}</span>
                  <span class="min-w-0">
                    <span class="block truncate font-medium">{command.label}</span>
                    <span class="block truncate text-muted-foreground text-xs">
                      {command.description}
                    </span>
                  </span>
                  <ShortcutDisplay hotkey={command.shortcut} />
                </div>
              )}
            </For>
          </div>
        </div>

        <aside
          class="border-t p-4 lg:border-l lg:border-t-0"
          data-scope="ui-block"
          data-part="command-surface-shortcuts"
        >
          <h3 class="text-sm font-semibold">Shortcut map</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            Display-only shortcut markup stays screen-reader inspectable without registering extra
            handlers.
          </p>
          <dl class="mt-4 space-y-3">
            <For each={commands()}>
              {(command) => (
                <div
                  class="rounded-md border px-3 py-2"
                  data-scope="ui-block"
                  data-part="shortcut-row"
                >
                  <dt class="text-xs font-medium uppercase text-muted-foreground">
                    {command.surface}
                  </dt>
                  <dd class="mt-1 flex min-w-0 items-center justify-between gap-3 text-sm">
                    <span class="truncate">{command.label}</span>
                    <ShortcutDisplay hotkey={command.shortcut} />
                  </dd>
                </div>
              )}
            </For>
          </dl>
          <p
            aria-live="polite"
            class="mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground"
            data-scope="ui-block"
            data-part="command-surface-status"
          >
            {lastAction()}
          </p>
        </aside>
      </div>
    </section>
  );
}
