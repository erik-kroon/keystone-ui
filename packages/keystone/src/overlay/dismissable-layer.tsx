import { createSignal, createUniqueId, splitProps, type Accessor, type JSX } from "solid-js";
import { assignRef } from "./dom";
import { createOverlayLayer, type OverlayLayerOutsideEvent } from "./layer-kernel";

export type DismissableLayerOutsideEvent = OverlayLayerOutsideEvent;

export type DismissableLayerOptions = {
  element: Accessor<HTMLElement | undefined>;
  enabled?: Accessor<boolean>;
  id?: string;
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

export function createDismissableLayer(options: DismissableLayerOptions) {
  const fallbackId = `keystone-dismissable-layer-${createUniqueId()}`;

  createOverlayLayer({
    id: options.id ?? fallbackId,
    element: options.element,
    disableOutsidePointerEvents: () => options.disableOutsidePointerEvents?.() ?? false,
    onEscapeKeyDown: options.onEscapeKeyDown,
    onPointerDownOutside: options.onPointerDownOutside,
    onFocusOutside: options.onFocusOutside,
    onInteractOutside: options.onInteractOutside,
    onDismiss: options.onDismiss,
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
    id: `keystone-dismissable-layer-${createUniqueId()}`,
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
