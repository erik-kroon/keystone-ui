import { describe, expect, test, vi } from "vitest";
import { createCommandStore, type CommandStoreCommand } from "./command-store";

describe("CommandStore", () => {
  test("coordinates open, query, selection, recent ids, and registered commands", () => {
    const commandStore = createCommandStore<CommandStoreCommand>({
      initialState: {
        commands: [
          { id: "open-dashboard", label: "Open dashboard", scope: "global" },
          { id: "create-invoice", label: "Create invoice", scope: "billing" },
        ],
        query: "invoice",
        scope: "billing",
      },
      maxRecentCommands: 2,
    });

    commandStore.open();
    commandStore.selectCommand("create-invoice");
    commandStore.selectCommand("open-dashboard");
    commandStore.selectCommand("create-invoice");
    commandStore.registerCommand({
      id: "open-settings",
      label: "Open settings",
      keywords: ["preferences"],
    });

    expect(commandStore.store.get()).toMatchObject({
      open: true,
      query: "invoice",
      selectedCommandId: "create-invoice",
      lastSelectedValue: "create-invoice",
      recentlyUsedCommandIds: ["create-invoice", "open-dashboard"],
      scope: "billing",
    });
    expect(commandStore.getCommand("open-settings")?.keywords).toEqual(["preferences"]);
    expect(commandStore.getScopedCommands().map((command) => command.id)).toEqual([
      "create-invoice",
      "open-settings",
    ]);

    commandStore.resetQuery();
    commandStore.close();

    expect(commandStore.store.get()).toMatchObject({
      open: false,
      query: "",
    });
  });

  test("supports replacing and unregistering route-scoped command registries", () => {
    const commandStore = createCommandStore<CommandStoreCommand>();

    commandStore.registerCommands([
      { id: "global-help", label: "Open help" },
      { id: "billing-refresh", label: "Refresh invoices", scope: "billing" },
    ]);
    commandStore.registerCommands(
      [{ id: "orders-refresh", label: "Refresh orders", scope: "orders" }],
      {
        replace: true,
      },
    );
    commandStore.setScope("orders");
    commandStore.selectCommand("orders-refresh");
    commandStore.unregisterCommand("orders-refresh");

    expect(commandStore.getCommands()).toEqual([]);
    expect(commandStore.store.get().selectedCommandId).toBeUndefined();
    expect(commandStore.store.get().recentlyUsedCommandIds).toEqual([]);
  });

  test("creates state without browser globals and supports optional provider registration", () => {
    const previousDocument = globalThis.document;
    const previousWindow = globalThis.window;
    const registered: unknown[] = [];

    vi.stubGlobal("document", undefined);
    vi.stubGlobal("window", undefined);

    try {
      const commandStore = createCommandStore({
        initialState: { loading: true, error: "Loading commands failed" },
        onRegister: (store) => registered.push(store),
      });

      commandStore.setLoading(false);
      commandStore.clearError();

      expect(commandStore.store.get()).toMatchObject({
        loading: false,
        error: undefined,
      });
      expect(registered).toEqual([commandStore]);
    } finally {
      vi.stubGlobal("document", previousDocument);
      vi.stubGlobal("window", previousWindow);
      vi.unstubAllGlobals();
    }
  });
});
