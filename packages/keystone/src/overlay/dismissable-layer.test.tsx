import { Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { describe, expect, test } from "vitest";
import { keyDown, pointerDown, render, settled } from "../../test/harness";
import { DismissableLayer, DismissableLayerBranch } from "./dismissable-layer";

describe("Dismissable layer", () => {
  test("dismisses from outside pointer, outside focus, and Escape interactions", async () => {
    const dismissed: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <DismissableLayer onDismiss={(event) => dismissed.push(event.type)}>
          <button data-testid="inside">Inside</button>
        </DismissableLayer>
      </>
    ));
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();
    expect(dismissed).toEqual(["pointerdown"]);

    document
      .querySelector<HTMLElement>("[data-testid='outside']")!
      .dispatchEvent(new FocusEvent("focusin", { bubbles: true, cancelable: true }));
    await settled();
    expect(dismissed).toEqual(["pointerdown", "focusin"]);

    keyDown(document.querySelector<HTMLElement>("[data-testid='inside']")!, "Escape");
    await settled();
    expect(dismissed).toEqual(["pointerdown", "focusin", "keydown"]);
  });

  test("branch elements are treated as inside even when portalled outside the layer DOM", async () => {
    const dismissed: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <DismissableLayer onDismiss={(event) => dismissed.push(event.type)}>
          <button data-testid="inside">Inside</button>
          <Portal>
            <DismissableLayerBranch data-testid="branch">
              <button data-testid="branch-button">Branch</button>
            </DismissableLayerBranch>
          </Portal>
        </DismissableLayer>
      </>
    ));
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='branch-button']")!);
    await settled();
    expect(dismissed).toEqual([]);

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();
    expect(dismissed).toEqual(["pointerdown"]);
  });

  test("prevented outside and Escape handlers block dismissal", async () => {
    const dismissed: string[] = [];
    const interactions: string[] = [];

    render(() => (
      <>
        <button data-testid="outside">Outside</button>
        <DismissableLayer
          onDismiss={(event) => dismissed.push(event.type)}
          onEscapeKeyDown={(event) => {
            interactions.push("escape");
            event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            interactions.push(event.type);
            event.preventDefault();
          }}
          onInteractOutside={(event) => {
            interactions.push(`interact:${event.type}`);
          }}
        >
          <button data-testid="inside">Inside</button>
        </DismissableLayer>
      </>
    ));
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    keyDown(document.querySelector<HTMLElement>("[data-testid='inside']")!, "Escape");
    await settled();

    expect(interactions).toEqual([
      "keystone.pointerDownOutside",
      "interact:keystone.pointerDownOutside",
      "escape",
    ]);
    expect(dismissed).toEqual([]);
  });

  test("enabled controls registration and document listeners reactively", async () => {
    const dismissed: string[] = [];

    render(() => {
      const [enabled, setEnabled] = createSignal(false);

      return (
        <>
          <button data-testid="outside">Outside</button>
          <button data-testid="enable" onClick={() => setEnabled(true)}>
            Enable
          </button>
          <Show when={true}>
            <DismissableLayer enabled={enabled()} onDismiss={(event) => dismissed.push(event.type)}>
              <button data-testid="inside">Inside</button>
            </DismissableLayer>
          </Show>
        </>
      );
    });
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();
    expect(dismissed).toEqual([]);

    document.querySelector<HTMLElement>("[data-testid='enable']")!.click();
    await settled();

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();
    expect(dismissed).toEqual(["pointerdown"]);
  });
});
