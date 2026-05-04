import { afterEach, describe, expect, test } from "vitest";
import { lockPreventScroll } from "./prevent-scroll";

afterEach(() => {
  document.body.removeAttribute("style");
});

describe("prevent scroll", () => {
  test("locks body scroll with scrollbar compensation and restores previous inline styles", () => {
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "4px";
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1185,
    });

    const release = lockPreventScroll(document);

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("19px");

    release();

    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.paddingRight).toBe("4px");
  });

  test("keeps nested locks active until every lock is released", () => {
    const releaseFirst = lockPreventScroll(document);
    const releaseSecond = lockPreventScroll(document);

    expect(document.body.style.overflow).toBe("hidden");

    releaseFirst();

    expect(document.body.style.overflow).toBe("hidden");

    releaseFirst();

    expect(document.body.style.overflow).toBe("hidden");

    releaseSecond();

    expect(document.body.style.overflow).toBe("");
  });
});
