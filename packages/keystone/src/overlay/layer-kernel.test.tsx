import { Show, createSignal, type JSX } from "solid-js";
import { describe, expect, test } from "vitest";
import { pointerDown, render, settled } from "../../test/harness";
import { hideOutside } from "./hide-outside";
import { OverlayLayerProvider, createOverlayLayer, createOverlayLayerStack } from "./layer-kernel";

function TestLayer(props: {
  children?: JSX.Element;
  id: string;
  modal?: boolean;
  disableOutsidePointerEvents?: boolean;
  onDismiss?: (event: Event) => void;
  onFocusOutside?: (event: CustomEvent<{ originalEvent: Event }>) => void;
}) {
  const [element, setElement] = createSignal<HTMLDivElement>();
  const layer = createOverlayLayer({
    id: props.id,
    element,
    modal: () => props.modal ?? false,
    disableOutsidePointerEvents: () => props.disableOutsidePointerEvents ?? props.modal ?? false,
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

  test("preserves existing body styles while a modal layer owns the scroll lock", async () => {
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "4px";
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1185,
    });

    render(() => {
      const [show, setShow] = createSignal(true);

      return (
        <OverlayLayerProvider stack={createOverlayLayerStack()}>
          <button data-testid="outside" onClick={() => setShow(false)}>
            Outside
          </button>
          <Show when={show()}>
            <TestLayer id="layer" modal onDismiss={() => setShow(false)} />
          </Show>
        </OverlayLayerProvider>
      );
    });
    await settled();

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("19px");

    pointerDown(document.querySelector<HTMLElement>("[data-testid='outside']")!);
    await settled();

    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.paddingRight).toBe("4px");

    document.body.removeAttribute("style");
  });

  test("reacts to modal and pointer-blocking changes after registration", async () => {
    let stack!: ReturnType<typeof createOverlayLayerStack>;
    let setModal!: (modal: boolean) => void;
    let setBlocksPointer!: (blocksPointer: boolean) => void;

    render(() => {
      stack = createOverlayLayerStack();
      const [modal, updateModal] = createSignal(true);
      const [blocksPointer, updateBlocksPointer] = createSignal(true);
      setModal = updateModal;
      setBlocksPointer = updateBlocksPointer;

      return (
        <OverlayLayerProvider stack={stack}>
          <button data-testid="outside">Outside</button>
          <TestLayer id="layer" modal={modal()} disableOutsidePointerEvents={blocksPointer()} />
        </OverlayLayerProvider>
      );
    });
    await settled();

    const outside = document.querySelector<HTMLElement>("[data-testid='outside']")!;
    const layer = document.querySelector<HTMLElement>("[data-testid='layer']")!;

    expect(stack.layers()).toEqual([{ id: "layer", modal: true }]);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.pointerEvents).toBe("none");
    expect(outside.getAttribute("aria-hidden")).toBe("true");
    expect(layer.style.pointerEvents).toBe("auto");

    setModal(false);
    await settled();

    expect(stack.layers()).toEqual([{ id: "layer", modal: false }]);
    expect(document.body.style.overflow).toBe("");
    expect(outside.getAttribute("aria-hidden")).toBeNull();
    expect(document.body.style.pointerEvents).toBe("none");

    setBlocksPointer(false);
    await settled();

    expect(document.body.style.pointerEvents).toBe("");

    setModal(true);
    await settled();

    expect(stack.layers()).toEqual([{ id: "layer", modal: true }]);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.pointerEvents).toBe("");
    expect(outside.getAttribute("aria-hidden")).toBe("true");

    setBlocksPointer(true);
    await settled();

    expect(document.body.style.pointerEvents).toBe("none");
    expect(outside.getAttribute("aria-hidden")).toBe("true");
  });

  test("hides outside content added while a modal layer is open and restores it on close", async () => {
    let setOpen!: (open: boolean) => void;

    render(() => {
      const [open, updateOpen] = createSignal(true);
      setOpen = updateOpen;

      return (
        <OverlayLayerProvider stack={createOverlayLayerStack()}>
          <Show when={open()}>
            <TestLayer id="modal" modal />
          </Show>
        </OverlayLayerProvider>
      );
    });
    await settled();

    const lateOutside = document.createElement("aside");
    lateOutside.setAttribute("data-testid", "late-outside");
    lateOutside.setAttribute("aria-hidden", "false");
    document.body.append(lateOutside);
    await settled();

    expect(lateOutside.getAttribute("aria-hidden")).toBe("true");
    expect(lateOutside.inert).toBe(true);
    expect(lateOutside.hasAttribute("inert")).toBe(true);

    setOpen(false);
    await settled();

    expect(lateOutside.getAttribute("aria-hidden")).toBe("false");
    expect(lateOutside.inert).toBe(false);
    expect(lateOutside.hasAttribute("inert")).toBe(false);
  });

  test("keeps layers registered above a modal visible to assistive technology", async () => {
    render(() => (
      <OverlayLayerProvider stack={createOverlayLayerStack()}>
        <button data-testid="outside">Outside</button>
        <TestLayer id="modal" modal />
        <TestLayer id="nonmodal" />
      </OverlayLayerProvider>
    ));
    await settled();

    const outside = document.querySelector<HTMLElement>("[data-testid='outside']")!;
    const nonmodal = document.querySelector<HTMLElement>("[data-testid='nonmodal']")!;

    expect(outside.getAttribute("aria-hidden")).toBe("true");
    expect(outside.inert).toBe(true);
    expect(nonmodal.getAttribute("aria-hidden")).toBeNull();
    expect(nonmodal.inert).toBe(false);
  });

  test("keeps outside content hidden until every hide-outside owner releases it", () => {
    const firstTarget = document.createElement("section");
    const secondTarget = document.createElement("section");
    const outside = document.createElement("button");
    document.body.append(outside, firstTarget, secondTarget);

    const releaseFirst = hideOutside({ ownerDocument: document, targets: [firstTarget] });
    const releaseSecond = hideOutside({ ownerDocument: document, targets: [secondTarget] });

    expect(outside.getAttribute("aria-hidden")).toBe("true");
    expect(outside.inert).toBe(true);

    releaseFirst();

    expect(outside.getAttribute("aria-hidden")).toBe("true");
    expect(outside.inert).toBe(true);

    releaseSecond();

    expect(outside.getAttribute("aria-hidden")).toBeNull();
    expect(outside.inert).toBe(false);
  });
});
