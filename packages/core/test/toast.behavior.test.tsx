import { afterEach, describe, expect, test, vi } from "vitest";
import { Toast, createToastManager } from "../src/toast/index";
import { click, getByPart, queryByPart, render, settled } from "./harness";

function renderToastHarness(manager = createToastManager(), limit?: number) {
  render(() => (
    <Toast.Provider manager={manager} limit={limit}>
      <Toast.Viewport>
        {(toast) => (
          <Toast.Root toast={toast}>
            <Toast.Title />
            <Toast.Description />
            <Toast.Action />
            <Toast.Close>Dismiss</Toast.Close>
          </Toast.Root>
        )}
      </Toast.Viewport>
    </Toast.Provider>
  ));

  return manager;
}

describe("Toast behavior harness", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders manager toasts with stable parts and live-region roles", async () => {
    const manager = renderToastHarness();

    manager.add({
      description: "Saved project settings",
      id: "settings",
      title: "Saved",
      type: "success",
    });
    await settled();

    const viewport = getByPart("toast", "viewport");
    const root = getByPart("toast", "root");

    expect(viewport.getAttribute("role")).toBe("region");
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("data-type")).toBe("success");
    expect(getByPart("toast", "title").textContent).toBe("Saved");
    expect(getByPart("toast", "description").textContent).toBe("Saved project settings");
  });

  test("updates and dismisses a toast by id", async () => {
    const manager = renderToastHarness();

    manager.add({ id: "sync", title: "Syncing", type: "loading" });
    await settled();

    expect(getByPart("toast", "title").textContent).toBe("Syncing");

    manager.update("sync", { title: "Synced", type: "success" });
    await settled();

    expect(getByPart("toast", "title").textContent).toBe("Synced");
    expect(getByPart("toast", "root").getAttribute("data-type")).toBe("success");

    manager.dismiss("sync");
    await settled();

    expect(queryByPart("toast", "root")).toBeNull();
  });

  test("close button runs user handlers before dismissing", async () => {
    const manager = createToastManager();
    const clicks: string[] = [];

    render(() => (
      <Toast.Provider manager={manager}>
        <Toast.Viewport>
          {(toast) => (
            <Toast.Root toast={toast}>
              <Toast.Title />
              <Toast.Close onClick={() => clicks.push("user")}>Dismiss</Toast.Close>
            </Toast.Root>
          )}
        </Toast.Viewport>
      </Toast.Provider>
    ));

    manager.add({ id: "notice", title: "Notice" });
    await settled();

    click(getByPart("toast", "close"));
    await settled();

    expect(clicks).toEqual(["user"]);
    expect(manager.getToasts()).toHaveLength(0);
  });

  test("auto dismisses after duration and respects viewport limit", async () => {
    vi.useFakeTimers();
    const manager = renderToastHarness(createToastManager(), 2);

    manager.add({ duration: 100, id: "one", title: "One" });
    manager.add({ duration: 100, id: "two", title: "Two" });
    manager.add({ duration: 100, id: "three", title: "Three" });
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelectorAll('[data-scope="toast"][data-part="root"]')).toHaveLength(2);
    expect(document.body.textContent).not.toContain("One");
    expect(document.body.textContent).toContain("Three");

    await vi.advanceTimersByTimeAsync(100);

    expect(manager.getToasts()).toHaveLength(0);
  });

  test("action button invokes the toast action callback", async () => {
    const manager = renderToastHarness();
    const actionCalls: string[] = [];

    manager.add({
      action: {
        label: "Undo",
        onClick: (toast) => actionCalls.push(toast.id),
      },
      id: "undo",
      title: "Deleted",
    });
    await settled();

    click(getByPart("toast", "action"));

    expect(actionCalls).toEqual(["undo"]);
  });

  test("typed toaster shortcuts preserve ids and expose type metadata", async () => {
    const manager = renderToastHarness();

    const id = manager.success({ id: "saved", title: "Saved" });
    await settled();

    expect(id).toBe("saved");
    expect(getByPart("toast", "root").getAttribute("data-type")).toBe("success");

    manager.error("Failed");
    await settled();

    const roots = document.querySelectorAll('[data-scope="toast"][data-part="root"]');
    expect(roots[1]?.getAttribute("data-type")).toBe("error");
  });
});
