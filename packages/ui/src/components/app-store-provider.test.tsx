import { createRoot, onMount } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test, vi } from "vitest";
import {
  AppStoreProvider,
  createAppStore,
  useAppStoreSelector,
  useRequiredAppStore,
} from "./app-store-provider";

describe("AppStoreProvider", () => {
  test("creates a local TanStack app store with shell, command, shortcut, and workspace actions", () => {
    createRoot((dispose) => {
      const appStore = createAppStore({
        initialState: {
          commandMenu: {
            query: "invoices",
          },
          shell: {
            sidebarOpen: false,
          },
        },
      });

      appStore.openCommandMenu();
      appStore.selectCommandValue("open-invoice");
      appStore.registerCommandGroup({ id: "billing", label: "Billing", scope: "workspace" });
      appStore.setShortcutPreference({ id: "command-menu", enabled: true, label: "Command menu" });
      appStore.setShortcutScope("workspace");
      appStore.setTheme("dark");
      appStore.toggleSidebar();
      appStore.setWorkspaceValue("activeAccountId", "acct_1");

      expect(appStore.store.get()).toMatchObject({
        commandMenu: {
          open: true,
          query: "invoices",
          lastSelectedValue: "open-invoice",
        },
        commandGroups: {
          billing: {
            id: "billing",
            label: "Billing",
            scope: "workspace",
          },
        },
        shortcutPreferences: {
          "command-menu": {
            id: "command-menu",
            enabled: true,
            label: "Command menu",
          },
        },
        shortcutScope: "workspace",
        shell: {
          sidebarOpen: true,
          theme: "dark",
        },
        workspace: {
          activeAccountId: "acct_1",
        },
      });

      appStore.unregisterCommandGroup("billing");
      appStore.removeShortcutPreference("command-menu");
      appStore.resetWorkspaceValue("activeAccountId");
      appStore.resetCommandQuery();
      appStore.closeCommandMenu();

      expect(appStore.store.get().commandGroups.billing).toBeUndefined();
      expect(appStore.store.get().shortcutPreferences["command-menu"]).toBeUndefined();
      expect(appStore.store.get().workspace.activeAccountId).toBeUndefined();
      expect(appStore.store.get().commandMenu).toMatchObject({
        open: false,
        query: "",
      });

      dispose();
    });
  });

  test("provides Solid-native selectors and actions to descendants", () => {
    const appStore = createAppStore();
    const host = document.createElement("div");

    function Child() {
      const requiredStore = useRequiredAppStore();
      const commandMenuOpen = useAppStoreSelector((state) => state.commandMenu.open);

      onMount(() => {
        requiredStore.toggleCommandMenu();
      });

      return <span data-open={commandMenuOpen()} />;
    }

    const dispose = render(
      () => (
        <AppStoreProvider store={appStore} id="shell">
          <Child />
        </AppStoreProvider>
      ),
      host,
    );

    const html = host.innerHTML;
    expect(html).toContain('data-scope="ui-app-store"');
    expect(html).toContain('data-part="provider"');
    expect(html).toContain('data-slot="app-store-provider"');
    expect(appStore.store.get().commandMenu.open).toBe(true);
    dispose();
  });

  test("reports state changes for externally owned stores", async () => {
    await new Promise<void>((resolve) => {
      createRoot((dispose) => {
        const appStore = createAppStore();
        const changes: string[] = [];
        const host = document.createElement("div");

        function Child() {
          const requiredStore = useRequiredAppStore();

          onMount(() => {
            requiredStore.setCommandQuery("orders");
            requiredStore.setSidebarOpen(false);
          });

          return null;
        }

        const cleanup = render(
          () => (
            <AppStoreProvider
              store={appStore}
              onStateChange={({ next }) => {
                changes.push(`${next.commandMenu.query}:${next.shell.sidebarOpen}`);
              }}
            >
              <Child />
            </AppStoreProvider>
          ),
          host,
        );

        queueMicrotask(() => {
          expect(changes).toEqual(["orders:true", "orders:false"]);
          cleanup();
          dispose();
          resolve();
        });
      });
    });
  });

  test("creates provider state without browser globals", () => {
    const previousDocument = globalThis.document;
    const previousWindow = globalThis.window;

    vi.stubGlobal("document", undefined);
    vi.stubGlobal("window", undefined);

    try {
      const appStore = createAppStore({ initialState: { shell: { theme: "system" } } });
      appStore.openCommandMenu();

      expect(appStore.store.get().commandMenu.open).toBe(true);
      expect(appStore.store.get().shell.theme).toBe("system");
    } finally {
      vi.stubGlobal("document", previousDocument);
      vi.stubGlobal("window", previousWindow);
      vi.unstubAllGlobals();
    }
  });
});
