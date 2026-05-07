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

  test("action button dismisses unless the toast action prevents default", async () => {
    const manager = renderToastHarness();

    manager.add({
      action: {
        label: "Stay",
        onClick: (_toast, event) => event.preventDefault(),
      },
      id: "stay",
      title: "Keep visible",
    });
    await settled();

    click(getByPart("toast", "action"));
    await settled();

    expect(getByPart("toast", "root").textContent).toContain("Keep visible");

    manager.update("stay", {
      action: {
        label: "Dismiss",
      },
    });
    await settled();

    click(getByPart("toast", "action"));
    await settled();

    expect(queryByPart("toast", "root")).toBeNull();
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

  test("manager is callable and exposes Sonner-style message and promise helpers", async () => {
    const manager = renderToastHarness();

    const callableId = manager({ id: "callable", title: "Callable" });
    await settled();

    expect(callableId).toBe("callable");
    expect(getByPart("toast", "title").textContent).toBe("Callable");

    const messageId = manager.message({ id: "message", title: "Message" });
    await settled();

    expect(messageId).toBe("message");
    expect(document.body.textContent).toContain("Message");

    const promiseId = manager.promise(Promise.resolve("done"), {
      id: "promise",
      loading: "Saving",
      success: (value) => ({
        description: "Complete",
        title: `Saved ${value}`,
      }),
    });
    await settled();

    expect(promiseId).toBe("promise");
    expect(document.body.textContent).toContain("Saved done");
    expect(document.body.textContent).toContain("Complete");

    const successOnlyId = manager.promise(Promise.resolve("later"), {
      id: "success-only",
      success: (value) => `Resolved ${value}`,
    });
    await settled();

    expect(successOnlyId).toBe("success-only");
    expect(document.body.textContent).toContain("Resolved later");
  });

  test("viewport render callback receives stack metadata and hotkey focus", async () => {
    const manager = createToastManager();

    render(() => (
      <Toast.Provider manager={manager}>
        <Toast.Viewport hotkey={["altKey", "KeyT"]}>
          {(toast, info) => (
            <Toast.Root
              data-count={String(info.count)}
              data-front-index={String(info.frontIndex)}
              toast={toast}
            >
              <Toast.Title />
            </Toast.Root>
          )}
        </Toast.Viewport>
      </Toast.Provider>
    ));

    manager.add({ id: "one", title: "One" });
    manager.add({ id: "two", title: "Two" });
    await settled();

    const roots = document.querySelectorAll<HTMLElement>('[data-scope="toast"][data-part="root"]');
    expect(roots[0]?.getAttribute("data-count")).toBe("2");
    expect(roots[0]?.getAttribute("data-front-index")).toBe("1");
    expect(roots[1]?.getAttribute("data-front-index")).toBe("0");

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        altKey: true,
        bubbles: true,
        cancelable: true,
        code: "KeyT",
      }),
    );

    expect(document.activeElement).toBe(getByPart("toast", "viewport"));
  });

  test("preserves mounted toast roots when appending new toasts", async () => {
    const manager = renderToastHarness();

    manager.add({ id: "one", title: "One" });
    await settled();

    const firstRoot = getByPart("toast", "root") as HTMLElement & { __toastMark?: string };
    firstRoot.__toastMark = "one";

    manager.add({ id: "two", title: "Two" });
    await settled();

    const roots = document.querySelectorAll<HTMLElement>('[data-scope="toast"][data-part="root"]');
    expect(roots).toHaveLength(2);
    expect(roots[0]).toBe(firstRoot);
    expect((roots[0] as HTMLElement & { __toastMark?: string }).__toastMark).toBe("one");
  });
});
