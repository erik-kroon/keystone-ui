import { createRoot } from "solid-js";
import { render } from "solid-js/web";
import { describe, expect, test, vi } from "vitest";
import { createSidebarStore, mountSidebarStore, SidebarProvider } from "@/stores/sidebar-store";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarItems,
  SidebarLayout,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuLink,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMobile,
  SidebarNav,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./sidebar";

describe("Sidebar", () => {
  test("renders app-shell anatomy with landmark semantics and stable data attributes", () => {
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <SidebarProvider defaultOpen>
          <SidebarLayout width="18rem" collapsedWidth="4rem" mobileWidth="20rem">
            <Sidebar id="workspace-sidebar" aria-label="Workspace sidebar" variant="floating">
              <SidebarHeader>
                Acme
                <SidebarInput aria-label="Filter navigation" />
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarGroupAction aria-label="Add workspace">+</SidebarGroupAction>
                  <SidebarGroupContent>
                    <SidebarItems
                      items={[
                        { id: "overview", href: "/overview", label: "Overview", badge: "3" },
                        { id: "settings", href: "/settings", label: "Settings" },
                      ]}
                    />
                    <SidebarNav aria-label="Pinned">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton active tooltip="Pinned">
                            Pinned
                          </SidebarMenuButton>
                          <SidebarMenuAction aria-label="Pin action" showOnHover>
                            +
                          </SidebarMenuAction>
                          <SidebarMenuBadge>9</SidebarMenuBadge>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton active href="/pinned/child">
                                Child
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </SidebarMenuItem>
                      </SidebarMenu>
                      <SidebarMenuLink active href="/pinned-link">
                        Pinned link
                      </SidebarMenuLink>
                    </SidebarNav>
                    <SidebarMenuSkeleton showIcon width="80%" />
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarSeparator />
              <SidebarRail />
            </Sidebar>
            <SidebarInset>Dashboard</SidebarInset>
          </SidebarLayout>
        </SidebarProvider>
      ),
      host,
    );

    const sidebar = host.querySelector('[data-scope="ui-sidebar"][data-part="root"]');
    const nav = host.querySelector("nav");
    const main = host.querySelector("main");

    expect(sidebar?.getAttribute("aria-label")).toBe("Workspace sidebar");
    expect(sidebar?.getAttribute("data-state")).toBe("expanded");
    expect(sidebar?.getAttribute("data-collapsible")).toBe("icon");
    expect(sidebar?.getAttribute("data-variant")).toBe("floating");
    expect(nav?.getAttribute("aria-label")).toBe("Sidebar navigation");
    expect(main?.getAttribute("data-part")).toBe("inset");
    expect(host.innerHTML).toContain("--sidebar-width: 18rem");
    expect(host.innerHTML).toContain("--sidebar-width-mobile: 20rem");
    expect(host.innerHTML).toContain('data-part="menu-badge"');
    expect(host.innerHTML).toContain('data-part="group-action"');
    expect(host.innerHTML).toContain('data-part="menu-action"');
    expect(host.innerHTML).toContain('data-part="menu-skeleton"');
    expect(host.innerHTML).toContain('data-part="menu-sub"');
    expect(host.innerHTML).toContain('data-part="rail"');
    expect(host.querySelector('a[aria-current="page"]')?.textContent).toBe("Child");

    dispose();
  });

  test("trigger toggles desktop state and respects prevented user handlers", () => {
    const store = createSidebarStore({ defaultOpen: true });
    const host = document.createElement("div");
    const dispose = render(
      () => (
        <SidebarProvider store={store} keyboardShortcut={false} storage={null}>
          <SidebarTrigger controls="workspace-sidebar" onClick={(event) => event.preventDefault()}>
            Toggle
          </SidebarTrigger>
          <Sidebar id="workspace-sidebar">Navigation</Sidebar>
        </SidebarProvider>
      ),
      host,
    );

    host.querySelector("button")?.click();

    expect(store.open()).toBe(true);
    expect(host.querySelector("button")?.getAttribute("aria-expanded")).toBe("true");

    dispose();
  });

  test("menu links set active item, expose aria-current, and close the mobile panel", () => {
    createRoot((disposeRoot) => {
      const store = createSidebarStore({ defaultOpen: true });
      store.setIsMobile(true);
      store.setOpenMobile(true);
      const doc = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        defaultView: {
          matchMedia: vi.fn(() => ({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          })),
        },
      } as unknown as Document;
      const host = document.createElement("div");
      document.body.append(host);
      const dispose = render(
        () => (
          <SidebarProvider document={doc} store={store} keyboardShortcut={false} storage={null}>
            <SidebarMobile>
              <SidebarNav>
                <SidebarMenuLink href="/reports" itemId="reports">
                  Reports
                </SidebarMenuLink>
              </SidebarNav>
            </SidebarMobile>
          </SidebarProvider>
        ),
        host,
      );

      const link = host.querySelector("a");
      link?.click();

      expect(store.store.get().activeItemId).toBe("reports");
      expect(store.store.get().openMobile).toBe(false);
      dispose();
      host.remove();
      disposeRoot();
    });
  });

  test("mounts browser behavior after render for storage, media, and keyboard", () => {
    const store = createSidebarStore({ defaultOpen: true });
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const media = {
      matches: true,
      addEventListener,
      removeEventListener,
    } as unknown as MediaQueryList;
    const storage = {
      getItem: vi.fn(() => "false"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 1,
    };
    const doc = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      defaultView: {
        localStorage: storage,
        matchMedia: vi.fn(() => media),
      },
    } as unknown as Document;

    const cleanup = mountSidebarStore(store, { document: doc, storage });

    expect(store.mounted()).toBe(true);
    expect(store.open()).toBe(false);
    expect(store.isMobile()).toBe(true);
    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));

    const keyHandler = vi
      .mocked(doc.addEventListener)
      .mock.calls.find(([type]) => type === "keydown")?.[1] as
      | ((event: KeyboardEvent) => void)
      | undefined;
    keyHandler?.(
      new KeyboardEvent("keydown", {
        key: "b",
        metaKey: true,
      }),
    );

    expect(store.openMobile()).toBe(true);

    cleanup();
    expect(store.mounted()).toBe(false);
    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
