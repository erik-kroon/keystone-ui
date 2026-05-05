import { createStore, type Store } from "@tanstack/solid-store";

export type CommandStoreCommand = {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
  keywords?: readonly string[];
  scope?: string;
  meta?: Record<string, unknown>;
};

export type CommandStoreState<TCommand extends CommandStoreCommand = CommandStoreCommand> = {
  open: boolean;
  query: string;
  selectedCommandId?: string;
  lastSelectedValue?: string;
  recentlyUsedCommandIds: readonly string[];
  commands: readonly TCommand[];
  scope?: string;
  loading: boolean;
  error?: string;
};

export type CommandStoreOptions<TCommand extends CommandStoreCommand = CommandStoreCommand> = {
  initialState?: Partial<CommandStoreState<TCommand>>;
  maxRecentCommands?: number;
  onRegister?: (commandStore: CommandStore<TCommand>) => void;
};

export type RegisterCommandsOptions = {
  replace?: boolean;
};

export type SelectCommandOptions = {
  recordRecent?: boolean;
};

export type CommandStore<TCommand extends CommandStoreCommand = CommandStoreCommand> = {
  store: Store<CommandStoreState<TCommand>>;
  clearCommands: () => void;
  clearError: () => void;
  close: () => void;
  getCommand: (id: string) => TCommand | undefined;
  getCommands: () => readonly TCommand[];
  getScopedCommands: (scope?: string) => readonly TCommand[];
  open: () => void;
  registerCommand: (command: TCommand) => void;
  registerCommands: (commands: readonly TCommand[], options?: RegisterCommandsOptions) => void;
  reset: () => void;
  resetQuery: () => void;
  selectCommand: (id: string, options?: SelectCommandOptions) => void;
  selectValue: (value: string, options?: SelectCommandOptions) => void;
  setError: (error?: string) => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setScope: (scope?: string) => void;
  toggleOpen: () => void;
  unregisterCommand: (id: string) => void;
};

const defaultMaxRecentCommands = 10;

export function createCommandStore<TCommand extends CommandStoreCommand = CommandStoreCommand>(
  options: CommandStoreOptions<TCommand> = {},
) {
  const initialState = options.initialState ?? {};
  const maxRecentCommands = options.maxRecentCommands ?? defaultMaxRecentCommands;
  const initialCommands = dedupeCommands(initialState.commands ?? []);
  const store = createStore<CommandStoreState<TCommand>>({
    open: initialState.open ?? false,
    query: initialState.query ?? "",
    selectedCommandId: initialState.selectedCommandId ?? initialState.lastSelectedValue,
    lastSelectedValue: initialState.lastSelectedValue ?? initialState.selectedCommandId,
    recentlyUsedCommandIds: initialState.recentlyUsedCommandIds ?? [],
    commands: initialCommands,
    scope: initialState.scope,
    loading: initialState.loading ?? false,
    error: initialState.error,
  });

  const setOpen = (open: boolean) => store.setState((state) => ({ ...state, open }));
  const setQuery = (query: string) => store.setState((state) => ({ ...state, query }));
  const setScope = (scope?: string) => store.setState((state) => ({ ...state, scope }));
  const setLoading = (loading: boolean) => store.setState((state) => ({ ...state, loading }));
  const setError = (error?: string) => store.setState((state) => ({ ...state, error }));
  const getCommands = () => store.state.commands;
  const getCommand = (id: string) => store.state.commands.find((command) => command.id === id);

  const commandStore = {
    store,
    clearCommands: () => store.setState((state) => ({ ...state, commands: [] })),
    clearError: () => setError(undefined),
    close: () => setOpen(false),
    getCommand,
    getCommands,
    getScopedCommands: (scope?: string) => {
      const activeScope = scope ?? store.state.scope;
      if (!activeScope) return store.state.commands;
      return store.state.commands.filter(
        (command) => command.scope === activeScope || !command.scope,
      );
    },
    open: () => setOpen(true),
    registerCommand: (command: TCommand) =>
      store.setState((state) => ({
        ...state,
        commands: upsertCommand(state.commands, command),
      })),
    registerCommands: (commands: readonly TCommand[], options?: RegisterCommandsOptions) =>
      store.setState((state) => ({
        ...state,
        commands: options?.replace
          ? dedupeCommands(commands)
          : dedupeCommands([...state.commands, ...commands]),
      })),
    reset: () =>
      store.setState((state) => ({
        ...state,
        open: initialState.open ?? false,
        query: initialState.query ?? "",
        selectedCommandId: initialState.selectedCommandId ?? initialState.lastSelectedValue,
        lastSelectedValue: initialState.lastSelectedValue ?? initialState.selectedCommandId,
        recentlyUsedCommandIds: initialState.recentlyUsedCommandIds ?? [],
        commands: initialCommands,
        scope: initialState.scope,
        loading: initialState.loading ?? false,
        error: initialState.error,
      })),
    resetQuery: () => setQuery(""),
    selectCommand: (id: string, options?: SelectCommandOptions) =>
      store.setState((state) => ({
        ...state,
        selectedCommandId: id,
        lastSelectedValue: id,
        recentlyUsedCommandIds:
          options?.recordRecent === false
            ? state.recentlyUsedCommandIds
            : limitRecentCommands([id, ...state.recentlyUsedCommandIds], maxRecentCommands),
      })),
    selectValue: (value: string, options?: SelectCommandOptions) =>
      commandStore.selectCommand(value, options),
    setError,
    setLoading,
    setOpen,
    setQuery,
    setScope,
    toggleOpen: () => store.setState((state) => ({ ...state, open: !state.open })),
    unregisterCommand: (id: string) =>
      store.setState((state) => ({
        ...state,
        commands: state.commands.filter((command) => command.id !== id),
        recentlyUsedCommandIds: state.recentlyUsedCommandIds.filter(
          (commandId) => commandId !== id,
        ),
        selectedCommandId: state.selectedCommandId === id ? undefined : state.selectedCommandId,
        lastSelectedValue: state.lastSelectedValue === id ? undefined : state.lastSelectedValue,
      })),
  } satisfies CommandStore<TCommand>;

  options.onRegister?.(commandStore);

  return commandStore;
}

function upsertCommand<TCommand extends CommandStoreCommand>(
  commands: readonly TCommand[],
  command: TCommand,
) {
  const nextCommands = commands.filter((candidate) => candidate.id !== command.id);
  return [...nextCommands, command];
}

function dedupeCommands<TCommand extends CommandStoreCommand>(commands: readonly TCommand[]) {
  const byId = new Map<string, TCommand>();

  for (const command of commands) {
    byId.set(command.id, command);
  }

  return Array.from(byId.values());
}

function limitRecentCommands(commandIds: readonly string[], maxRecentCommands: number) {
  return Array.from(new Set(commandIds)).slice(0, Math.max(0, maxRecentCommands));
}
