import { createSignal, onCleanup, onMount, splitProps, type Accessor, type JSX } from "solid-js";
import { assignRef, contains, getOwnerDocument } from "./dom";

export type DismissableLayerOutsideEvent = CustomEvent<{ originalEvent: Event }>;

export type DismissableLayerOptions = {
  element: Accessor<HTMLElement | undefined>;
  enabled?: Accessor<boolean>;
  disableOutsidePointerEvents?: Accessor<boolean>;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
  onFocusOutside?: (event: DismissableLayerOutsideEvent) => void;
  onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
  onDismiss?: (event: Event) => void;
};

export type DismissableLayerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
  children?: JSX.Element;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
  disableOutsidePointerEvents?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
  onFocusOutside?: (event: DismissableLayerOutsideEvent) => void;
  onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
  onDismiss?: (event: Event) => void;
};

type LayerRecord = {
  element: HTMLElement;
  disableOutsidePointerEvents: () => boolean;
};

const layers: LayerRecord[] = [];
let originalBodyPointerEvents = "";
let bodyPointerEventsDisabled = false;

export function createDismissableLayer(options: DismissableLayerOptions) {
  onMount(() => {
    if (options.enabled?.() === false) {
      return;
    }

    const element = options.element();

    if (!element) {
      return;
    }

    const ownerDocument = getOwnerDocument(element);
    const layer: LayerRecord = {
      element,
      disableOutsidePointerEvents: () => options.disableOutsidePointerEvents?.() ?? false,
    };

    layers.push(layer);
    syncPointerEvents(ownerDocument);

    const isTopLayer = () => layers[layers.length - 1]?.element === element;
    let isReady = false;
    queueMicrotask(() => {
      isReady = true;
    });

    const dispatchOutsideEvent = (
      type: "keystone.pointerDownOutside" | "keystone.focusOutside",
      originalEvent: Event,
    ) => new CustomEvent(type, { cancelable: true, detail: { originalEvent } });

    const dismissFromOutside = (
      originalEvent: Event,
      outsideEvent: DismissableLayerOutsideEvent,
      specificHandler?: (event: DismissableLayerOutsideEvent) => void,
    ) => {
      specificHandler?.(outsideEvent);
      options.onInteractOutside?.(outsideEvent);

      if (!outsideEvent.defaultPrevented) {
        options.onDismiss?.(originalEvent);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!isReady || !isTopLayer() || contains(element, event.target as Node | null)) {
        return;
      }

      const outsideEvent = dispatchOutsideEvent("keystone.pointerDownOutside", event);
      dismissFromOutside(event, outsideEvent, options.onPointerDownOutside);
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!isReady || !isTopLayer() || contains(element, event.target as Node | null)) {
        return;
      }

      const outsideEvent = dispatchOutsideEvent("keystone.focusOutside", event);
      dismissFromOutside(event, outsideEvent, options.onFocusOutside);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !isTopLayer() || event.key !== "Escape") {
        return;
      }

      options.onEscapeKeyDown?.(event);

      if (!event.defaultPrevented) {
        event.preventDefault();
        options.onDismiss?.(event);
      }
    };

    ownerDocument.addEventListener("pointerdown", onPointerDown, true);
    ownerDocument.addEventListener("focusin", onFocusIn, true);
    ownerDocument.addEventListener("keydown", onKeyDown);

    onCleanup(() => {
      ownerDocument.removeEventListener("pointerdown", onPointerDown, true);
      ownerDocument.removeEventListener("focusin", onFocusIn, true);
      ownerDocument.removeEventListener("keydown", onKeyDown);

      const index = layers.indexOf(layer);

      if (index >= 0) {
        layers.splice(index, 1);
      }

      syncPointerEvents(ownerDocument);
    });
  });
}

export function DismissableLayer(props: DismissableLayerProps) {
  const [local, others] = splitProps(props, [
    "children",
    "ref",
    "disableOutsidePointerEvents",
    "onEscapeKeyDown",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "onDismiss",
  ]);
  const [element, setElement] = createSignal<HTMLDivElement>();

  createDismissableLayer({
    element,
    disableOutsidePointerEvents: () => local.disableOutsidePointerEvents ?? false,
    onEscapeKeyDown: local.onEscapeKeyDown,
    onPointerDownOutside: local.onPointerDownOutside,
    onFocusOutside: local.onFocusOutside,
    onInteractOutside: local.onInteractOutside,
    onDismiss: local.onDismiss,
  });

  return (
    <div
      {...others}
      ref={(node) => {
        setElement(node);
        assignRef(local.ref, node);
      }}
    >
      {local.children}
    </div>
  );
}

function syncPointerEvents(ownerDocument: Document) {
  const hasBlockingLayer = layers.some((layer) => layer.disableOutsidePointerEvents());

  for (const layer of layers) {
    layer.element.style.pointerEvents = "auto";
  }

  if (hasBlockingLayer && !bodyPointerEventsDisabled) {
    originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
    ownerDocument.body.style.pointerEvents = "none";
    bodyPointerEventsDisabled = true;
  }

  if (!hasBlockingLayer && bodyPointerEventsDisabled) {
    ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
    bodyPointerEventsDisabled = false;

    if (!ownerDocument.body.getAttribute("style")) {
      ownerDocument.body.removeAttribute("style");
    }
  }
}
