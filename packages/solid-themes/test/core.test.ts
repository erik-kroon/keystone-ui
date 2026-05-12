import {
  applyTheme,
  createThemeScript,
  disableTransitions,
  getStoredTheme,
  resolveTheme,
  setStoredTheme
} from "../src/core";
import { installMatchMedia, resetDom } from "./helpers";

describe("core theme behavior", () => {
  beforeEach(() => {
    resetDom();
    installMatchMedia(false);
  });

  it("resolves stored, default, forced, and system themes", () => {
    expect(resolveTheme({ storedTheme: "dark", defaultTheme: "light" }).theme).toBe("dark");
    expect(resolveTheme({ defaultTheme: "light" }).resolvedTheme).toBe("light");
    expect(resolveTheme({ theme: "system", systemTheme: "dark" }).resolvedTheme).toBe("dark");

    const forced = resolveTheme({
      theme: "light",
      forcedTheme: "dark",
      systemTheme: "light"
    });

    expect(forced.theme).toBe("light");
    expect(forced.forcedTheme).toBe("dark");
    expect(forced.resolvedTheme).toBe("dark");
  });

  it("applies data attributes, multiple attributes, value mappings, and color-scheme", () => {
    applyTheme("dark", {
      attribute: ["data-theme", "data-mode"],
      value: { dark: "night" }
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("night");
    expect(document.documentElement.getAttribute("data-mode")).toBe("night");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("removes previous class values before adding the next class", () => {
    document.documentElement.classList.add("light", "night");

    applyTheme("dark", {
      attribute: "class",
      value: { dark: "night" }
    });

    expect(document.documentElement.className).toBe("night");

    applyTheme("light", {
      attribute: "class",
      value: { dark: "night" }
    });

    expect(document.documentElement.className).toBe("light");
  });

  it("handles unavailable storage without throwing", () => {
    const blockedStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      }
    };

    expect(() => getStoredTheme("theme", blockedStorage)).not.toThrow();
    expect(() => setStoredTheme("dark", "theme", blockedStorage)).not.toThrow();
    expect(getStoredTheme("theme", blockedStorage)).toBeUndefined();
  });

  it("injects and removes transition-disabling style with nonce", async () => {
    vi.useFakeTimers();

    const restore = disableTransitions("nonce-1");
    const style = document.head.querySelector("style");

    expect(style?.getAttribute("nonce")).toBe("nonce-1");

    restore();
    vi.runAllTimers();

    expect(document.head.querySelector("style")).toBeNull();
    vi.useRealTimers();
  });
});

describe("theme startup script", () => {
  beforeEach(() => {
    resetDom();
    installMatchMedia(false);
  });

  it("serializes deterministic executable startup code", () => {
    const config = {
      storageKey: "theme",
      defaultTheme: "light",
      attribute: "data-theme" as const
    };

    expect(createThemeScript(config)).toBe(createThemeScript(config));
  });

  it("applies stored theme before hydration", () => {
    localStorage.setItem("theme", "dark");
    const script = createThemeScript({ attribute: "class" });

    new Function(script)();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("resolves system and escapes serialized values", () => {
    installMatchMedia(true);
    localStorage.setItem("theme", "system");

    const script = createThemeScript({
      attribute: "data-theme",
      value: { dark: "dark</script><script>" }
    });

    expect(script).not.toContain("</script>");

    new Function(script)();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark</script><script>");
  });

  it("uses forced theme without writing storage", () => {
    localStorage.setItem("theme", "light");

    new Function(createThemeScript({ forcedTheme: "dark", attribute: "data-theme" }))();

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
