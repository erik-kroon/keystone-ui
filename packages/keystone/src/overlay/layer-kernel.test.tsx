import { Show, createSignal, type JSX } from "solid-js";
import { describe, expect, test } from "vitest";
import { pointerDown, render, settled } from "../../test/harness";
import { OverlayLayerProvider, createOverlayLayer, createOverlayLayerStack } from "./layer-kernel";

function TestLayer(props: {
  children?: JSX.Element;
  id: string;
  modal?: boolean;
  onDismiss?: (event: Event) => void;
  onFocusOutside?: (event: CustomEvent<{ originalEvent: Event }>) => void;
}) {
  const [element, setElement] = createSignal<HTMLDivElement>();
  const layer = createOverlayLayer({
    id: props.id,
    element,
    modal: () => props.modal ?? false,
    onFocusOutside: props.onFocusOutside,
    onDismiss: props.onDismiss,
  });

  return (
    <div
      data-testid={props.id}
      data-layer-index={layer.index()}
      data-top-layer={layer.isTopLayer() ? "" : undefined}
      ref={setElement}
    >
      {props.children}
    </div>
  );
}

describe("Overlay layer kernel", () => {
  test("orders layers, blocks pointer events, and dismisses only the top layer through one stack", async () => {
    let stack!: ReturnType<typeof createOverlayLayerStack>;
    const dismissed: string[] = [];

    render(() => {
      stack = createOverlayLayerStack();
      const [showBase, setShowBase] = createSignal(true);
      const [showTop, setShowTop] = createSignal(true);

      return (
        <OverlayLayerProvider stack={stack}>
          <button data-testid="outside">Outside</button>
          <Show when={showBase()}>
            <TestLayer
              id="base"
              modal
              onFocusOutside={(event) => event.preventDefault()}
              onDismiss={() => {
                dismissed.push("base");
                setShowBase(false);
              }}
            />
          </Show>
          <Show when={showTop()}>
            <TestLayer
              id="top"
              modal
              onDismiss={() => {
                dismissed.push("top");
                setShowTop(false);
              }}
            />
          </Show>
        </OverlayLayerProvider>
      );
    });
    await settled();

    const outside = document.querySelector<HTMLElement>("[data-testid='outside']")!;
    const base = document.querySelector<HTMLElement>("[data-testid='base']")!;
    const top = document.querySelector<HTMLElement>("[data-testid='top']")!;

    expect(stack.layers().map((layer) => layer.id)).toEqual(["base", "top"]);
    expect(stack.isTopLayer("top")).toBe(true);
    expect(document.body.style.pointerEvents).toBe("none");
    expect(document.body.style.overflow).toBe("hidden");
    expect(outside.getAttribute("aria-hidden")).toBe("true");
    expect(base.style.pointerEvents).toBe("auto");
    expect(top.style.pointerEvents).toBe("auto");

    pointerDown(outside);
    await settled();

    expect(dismissed).toEqual(["top"]);
    expect(stack.layers().map((layer) => layer.id)).toEqual(["base"]);
    expect(stack.isTopLayer("base")).toBe(true);
    expect(document.body.style.pointerEvents).toBe("none");
    expect(document.body.style.overflow).toBe("hidden");
    expect(outside.getAttribute("aria-hidden")).toBe("true");

    pointerDown(outside);
    await settled();

    expect(dismissed).toEqual(["top", "base"]);
    expect(stack.layers()).toEqual([]);
    expect(document.body.style.pointerEvents).toBe("");
    expect(document.body.style.overflow).toBe("");
    expect(outside.getAttribute("aria-hidden")).toBeNull();
  });
});
