import { createComponent, createEffect } from "solid-js";
import { render } from "solid-js/web";
import {
  ThemeGate,
  ThemeProvider,
  ThemeScript,
  ThemeSelect,
  useTheme,
  type ThemeContextValue
} from "../src";
import { installMatchMedia, resetDom } from "./helpers";

function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function Probe(props: { onValue: (value: ThemeContextValue) => void }) {
  const theme = useTheme();
  createEffect(() => {
    theme.theme();
    theme.resolvedTheme();
    theme.systemTheme();
    props.onValue(theme);
  });
  return null;
}

describe("Solid runtime", () => {
  beforeEach(() => {
    resetDom();
    installMatchMedia(false);
  });

  it("exposes a stable context object with accessors", async () => {
    const root = document.createElement("div");
    const values: ThemeContextValue[] = [];

    const dispose = render(
      () =>
        createComponent(ThemeProvider, {
          get children() {
            return createComponent(Probe, {
              onValue: (value) => values.push(value)
            });
          }
        }),
      root
    );

    await tick();

    expect(values.length).toBeGreaterThan(0);
    const first = values[0];
    const last = values[values.length - 1];

    expect(first).toBe(last);
    expect(last?.theme()).toBe("system");
    expect(last?.resolvedTheme()).toBe("light");
    expect(last?.mounted()).toBe(true);
    expect(last?.themes()).toEqual(["light", "dark", "system"]);
    expect(root.querySelector("script")).toBeNull();

    dispose();
  });

  it("setTheme updates signals, storage, DOM, and supports functional updates", async () => {
    const root = document.createElement("div");
    let api: ThemeContextValue | undefined;

    const dispose = render(
      () =>
        createComponent(ThemeProvider, {
          attribute: "class",
          get children() {
            return createComponent(Probe, {
              onValue: (value) => {
                api = value;
              }
            });
          }
        }),
      root
    );

    await tick();
    api?.setTheme("dark");
    await tick();

    expect(api?.theme()).toBe("dark");
    expect(api?.resolvedTheme()).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    api?.setTheme((previous) => (previous === "dark" ? "light" : "dark"));
    await tick();

    expect(api?.theme()).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    dispose();
  });

  it("syncs storage and system theme changes", async () => {
    const media = installMatchMedia(false);
    const root = document.createElement("div");
    let api: ThemeContextValue | undefined;

    const dispose = render(
      () =>
        createComponent(ThemeProvider, {
          get children() {
            return createComponent(Probe, {
              onValue: (value) => {
                api = value;
              }
            });
          }
        }),
      root
    );

    await tick();
    media.setMatches(true);
    await tick();

    expect(api?.systemTheme()).toBe("dark");
    expect(api?.resolvedTheme()).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "light" }));
    await tick();

    expect(api?.theme()).toBe("light");
    expect(api?.resolvedTheme()).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    dispose();
  });

  it("applies forced theme without overwriting stored preference", async () => {
    localStorage.setItem("theme", "light");
    const root = document.createElement("div");
    let api: ThemeContextValue | undefined;

    const dispose = render(
      () =>
        createComponent(ThemeProvider, {
          forcedTheme: "dark",
          get children() {
            return createComponent(Probe, {
              onValue: (value) => {
                api = value;
              }
            });
          }
        }),
      root
    );

    await tick();

    expect(api?.theme()).toBe("light");
    expect(api?.forcedTheme()).toBe("dark");
    expect(api?.resolvedTheme()).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("light");

    dispose();
  });

  it("ignores nested providers and cleans up listeners", async () => {
    const media = installMatchMedia(false);
    const root = document.createElement("div");
    let api: ThemeContextValue | undefined;

    const dispose = render(
      () =>
        createComponent(ThemeProvider, {
          storageKey: "outer-theme",
          get children() {
            return createComponent(ThemeProvider, {
              storageKey: "inner-theme",
              get children() {
                return createComponent(Probe, {
                  onValue: (value) => {
                    api = value;
                  }
                });
              }
            });
          }
        }),
      root
    );

    await tick();

    expect(api?.setTheme).toBeDefined();
    api?.setTheme("dark");
    await tick();

    expect(localStorage.getItem("outer-theme")).toBe("dark");
    expect(localStorage.getItem("inner-theme")).toBeNull();
    expect(media.listenerCount()).toBe(1);

    dispose();

    expect(media.listenerCount()).toBe(0);
  });

  it("gates hydration-sensitive UI until mounted", async () => {
    const root = document.createElement("div");
    let gatedTheme: ThemeContextValue | undefined;

    const dispose = render(
      () =>
        createComponent(ThemeProvider, {
          get children() {
            return createComponent(ThemeGate, {
              fallback: "loading",
              children: (theme) => {
                gatedTheme = theme;
                return "ready";
              }
            });
          }
        }),
      root
    );

    await tick();

    expect(root.textContent).toBe("ready");
    expect(gatedTheme?.mounted()).toBe(true);

    dispose();
  });

  it("renders an ergonomic ThemeSelect after mount", async () => {
    const root = document.createElement("div");
    document.body.appendChild(root);

    const dispose = render(
      () =>
        createComponent(ThemeProvider, {
          attribute: "class",
          get children() {
            return createComponent(ThemeSelect, {
              "aria-label": "Theme",
              labels: {
                system: "Use system"
              }
            });
          }
        }),
      root
    );

    await tick();

    const select = root.querySelector("select");
    expect(select?.getAttribute("aria-label")).toBe("Theme");
    expect([...root.querySelectorAll("option")].map((option) => option.value)).toEqual([
      "light",
      "dark",
      "system"
    ]);
    expect(root.querySelector("option[value='system']")?.textContent).toBe("Use system");

    select!.value = "dark";
    select!.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    dispose();
  });

  it("renders ThemeScript nonce and script props", () => {
    const root = document.createElement("div");

    const dispose = render(
      () =>
        createComponent(ThemeScript, {
          nonce: "nonce-2",
          scriptProps: {
            id: "theme-script",
            innerHTML: "overridden",
            nonce: "wrong-nonce"
          }
        }),
      root
    );

    const script = root.querySelector("script");

    expect(script?.id).toBe("theme-script");
    expect(script?.getAttribute("nonce")).toBe("nonce-2");
    expect(script?.innerHTML).toContain("localStorage");
    expect(script?.innerHTML).not.toBe("overridden");

    dispose();
  });
});
