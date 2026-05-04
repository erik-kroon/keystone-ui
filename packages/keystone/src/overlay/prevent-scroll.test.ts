import { afterEach, describe, expect, test, vi } from "vitest";
import { lockPreventScroll } from "./prevent-scroll";

afterEach(() => {
  document.body.removeAttribute("style");
  vi.restoreAllMocks();
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

  test("prevents iOS touch scrolling outside scrollable content and at scroll edges", () => {
    Object.defineProperty(window.navigator, "platform", {
      configurable: true,
      value: "iPhone",
    });
    Object.defineProperty(window.navigator, "maxTouchPoints", {
      configurable: true,
      value: 1,
    });
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

    const scroller = document.createElement("div");
    scroller.style.overflowY = "auto";
    Object.defineProperty(scroller, "clientHeight", { configurable: true, value: 100 });
    Object.defineProperty(scroller, "scrollHeight", { configurable: true, value: 300 });
    document.body.append(scroller);

    const release = lockPreventScroll(document);

    dispatchTouch(scroller, "touchstart", 50);
    const middleMove = dispatchTouch(scroller, "touchmove", 30);
    expect(middleMove.defaultPrevented).toBe(false);

    scroller.scrollTop = 200;
    dispatchTouch(scroller, "touchstart", 50);
    const edgeMove = dispatchTouch(scroller, "touchmove", 30);
    expect(edgeMove.defaultPrevented).toBe(true);

    const bodyMove = dispatchTouch(document.body, "touchmove", 20);
    expect(bodyMove.defaultPrevented).toBe(true);

    release();
    scroller.remove();
  });
});

function dispatchTouch(target: EventTarget, type: "touchmove" | "touchstart", clientY: number) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  Object.defineProperty(event, "touches", {
    configurable: true,
    value: [{ clientY }],
  });
  target.dispatchEvent(event);
  return event;
}
