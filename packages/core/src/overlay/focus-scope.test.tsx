import { Show, createSignal, type JSX } from "solid-js";
import { describe, expect, test } from "vitest";
import { keyDown, render, settled } from "../../test/harness";
import { FocusScope } from "./focus-scope";

function getFocusGuards() {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-keystone-focus-guard]"));
}

function FocusScopeFixture(props: {
  children?: JSX.Element;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}) {
  return (
    <FocusScope trapFocus={props.trapFocus} restoreFocus={props.restoreFocus}>
      {props.children}
    </FocusScope>
  );
}

describe("Focus scope", () => {
  test("moves focus to the first tabbable descendant and restores previous focus", async () => {
    render(() => {
      const [open, setOpen] = createSignal(false);

      return (
        <>
          <button data-testid="trigger" onClick={() => setOpen(true)}>
            Open
          </button>
          <Show when={open()}>
            <FocusScopeFixture>
              <button data-testid="first">First</button>
              <button data-testid="close" onClick={() => setOpen(false)}>
                Close
              </button>
            </FocusScopeFixture>
          </Show>
        </>
      );
    });

    const trigger = document.querySelector<HTMLElement>("[data-testid='trigger']")!;
    trigger.focus();
    trigger.click();
    await settled();

    expect(document.activeElement).toBe(document.querySelector("[data-testid='first']"));

    document.querySelector<HTMLElement>("[data-testid='close']")!.click();
    await settled();

    expect(document.activeElement).toBe(trigger);
    expect(getFocusGuards()).toEqual([]);
  });

  test("focus guards wrap native Tab order at scope boundaries", async () => {
    render(() => (
      <>
        <button data-testid="outside-before">Before</button>
        <FocusScopeFixture>
          <button data-testid="first">First</button>
          <button data-testid="last">Last</button>
        </FocusScopeFixture>
        <button data-testid="outside-after">After</button>
      </>
    ));
    await settled();

    const [beforeGuard, afterGuard] = getFocusGuards();
    const first = document.querySelector<HTMLElement>("[data-testid='first']")!;
    const last = document.querySelector<HTMLElement>("[data-testid='last']")!;

    expect(beforeGuard).toBeDefined();
    expect(afterGuard).toBeDefined();

    afterGuard!.focus();
    expect(document.activeElement).toBe(first);

    beforeGuard!.focus();
    expect(document.activeElement).toBe(last);
  });

  test("Tab and Shift+Tab wrap focus from the first and last tabbable descendants", async () => {
    render(() => (
      <FocusScopeFixture>
        <button data-testid="first">First</button>
        <button data-testid="last">Last</button>
      </FocusScopeFixture>
    ));
    await settled();

    const first = document.querySelector<HTMLElement>("[data-testid='first']")!;
    const last = document.querySelector<HTMLElement>("[data-testid='last']")!;

    last.focus();
    const tabFromLast = keyDown(last, "Tab");
    expect(tabFromLast.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    first.focus();
    const shiftTabFromFirst = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Tab",
      shiftKey: true,
    });
    first.dispatchEvent(shiftTabFromFirst);

    expect(shiftTabFromFirst.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  test("falls back to the scope element when there are no tabbable descendants", async () => {
    render(() => <FocusScopeFixture>No tabbables</FocusScopeFixture>);
    await settled();

    const scope = document.querySelector<HTMLElement>("div[tabindex='-1']")!;

    expect(document.activeElement).toBe(scope);

    const tabEvent = keyDown(scope, "Tab");

    expect(tabEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(scope);
  });
});
