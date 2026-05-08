import { createToastManager } from "@keystone-ui/core/toast";
import { render } from "solid-js/web";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Toaster } from "./toast";

async function settled() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function flushed() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("Toaster", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders a coss-style stacked toaster with Sonner/Base defaults", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const manager = createToastManager();
    const dispose = render(
      () => <Toaster manager={manager} viewport={{ offset: "16px", position: "top-center" }} />,
      host,
    );

    manager.success({ id: "one", title: "Saved" });
    manager.error({ id: "two", title: "Failed", description: "Retry the request." });
    await settled();

    const viewport = host.querySelector<HTMLElement>("[data-slot='toast-viewport']");
    const toasts = host.querySelectorAll<HTMLElement>("[data-slot='toast']");

    expect(viewport?.getAttribute("data-position")).toBe("top-center");
    expect(viewport?.style.getPropertyValue("--toast-offset")).toBe("16px");
    expect(viewport?.style.getPropertyValue("--toast-width")).toBe("22.5rem");
    expect(toasts).toHaveLength(2);
    expect(toasts[0]?.getAttribute("data-stacked")).toBe("");
    expect(toasts[0]?.getAttribute("data-behind")).toBe("");
    expect(toasts[0]?.getAttribute("data-position")).toBe("top-center");
    expect(toasts[0]?.style.getPropertyValue("--toast-index")).toBe("1");
    expect(toasts[1]?.getAttribute("data-behind")).toBeNull();
    expect(toasts[1]?.style.getPropertyValue("--toast-index")).toBe("0");
    expect(host.querySelectorAll("[data-slot='toast-content']")).toHaveLength(2);
    expect(host.querySelector("[data-slot='toast-content']")?.getAttribute("data-behind")).toBe("");
    expect(host.querySelectorAll("[data-slot='toast-icon']")).toHaveLength(2);
    expect(host.querySelectorAll("[data-slot='toast-close']")).toHaveLength(0);

    dispose();
    host.remove();
  });

  test("shows a toast from a colocated preview button click", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const manager = createToastManager();
    const dispose = render(
      () => (
        <div>
          <button
            type="button"
            onClick={() =>
              manager.success({
                title: "Saved",
                description: "Your changes were synced.",
              })
            }
          >
            Show toast
          </button>
          <Toaster manager={manager} viewport={{ offset: "32px", position: "bottom-right" }} />
        </div>
      ),
      host,
    );

    host.querySelector<HTMLButtonElement>("button")?.click();
    await settled();

    const toast = host.querySelector<HTMLElement>("[data-slot='toast']");
    expect(toast?.textContent).toContain("Saved");
    expect(toast?.textContent).toContain("Your changes were synced.");
    expect(host.querySelector("[data-slot='toast-viewport']")?.getAttribute("data-position")).toBe(
      "bottom-right",
    );

    dispose();
    host.remove();
  });

  test("keeps existing toast nodes mounted when stacking new toasts", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const manager = createToastManager();
    const dispose = render(() => <Toaster manager={manager} />, host);

    manager.success({ id: "one", title: "Saved" });
    await settled();

    const firstToast = host.querySelector<HTMLElement>("[data-slot='toast']") as HTMLElement & {
      __toastMark?: string;
    };
    firstToast.__toastMark = "one";

    manager.error({ id: "two", title: "Failed" });
    await settled();

    const toasts = host.querySelectorAll<HTMLElement>("[data-slot='toast']");
    expect(toasts).toHaveLength(2);
    expect(toasts[0]).toBe(firstToast);
    expect((toasts[0] as HTMLElement & { __toastMark?: string }).__toastMark).toBe("one");
    expect(toasts[0]?.style.transform).toContain("scale(0.9)");
    expect(toasts[1]?.style.transform).toContain("scale(1)");

    dispose();
    host.remove();
  });

  test("does not keep a transform animation on rapidly stacked toasts", async () => {
    vi.useFakeTimers();
    const host = document.createElement("div");
    document.body.append(host);
    const manager = createToastManager();
    const dispose = render(() => <Toaster manager={manager} />, host);

    manager.success({ id: "one", title: "Saved" });
    await flushed();

    const firstToast = host.querySelector<HTMLElement>("[data-slot='toast']") as HTMLElement & {
      __toastMark?: string;
    };
    firstToast.__toastMark = "one";

    manager.error({ id: "two", title: "Failed" });
    await flushed();

    const toasts = host.querySelectorAll<HTMLElement>("[data-slot='toast']");
    expect(toasts).toHaveLength(2);
    expect(toasts[0]).toBe(firstToast);
    expect((toasts[0] as HTMLElement & { __toastMark?: string }).__toastMark).toBe("one");
    expect(toasts[0]?.style.transform).toContain("scale(0.9)");
    expect(toasts[0]?.style.transform).not.toContain("100% + var(--toast-offset)");
    expect([...toasts].some((toast) => toast.hasAttribute("data-entering"))).toBe(false);

    await vi.advanceTimersByTimeAsync(0);
    expect(toasts[1]?.style.transform).toContain("scale(1)");

    dispose();
    host.remove();
  });

  test("keeps dismissed toasts mounted long enough for exit motion", async () => {
    vi.useFakeTimers();
    const host = document.createElement("div");
    document.body.append(host);
    const manager = createToastManager();
    const dispose = render(() => <Toaster manager={manager} />, host);

    manager.success({ id: "exit", title: "Saved" });
    await flushed();

    manager.dismiss("exit");
    await flushed();

    expect(manager.getToasts()).toHaveLength(0);
    expect(host.querySelector<HTMLElement>("[data-slot='toast']")?.dataset.status).toBe("closed");

    await vi.advanceTimersByTimeAsync(359);
    expect(host.querySelector("[data-slot='toast']")).not.toBeNull();

    await vi.advanceTimersByTimeAsync(1);
    await flushed();
    expect(host.querySelector("[data-slot='toast']")).toBeNull();

    dispose();
    host.remove();
  });
});
