import {
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  untrack,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { getPartDataAttributes } from "../metadata/index";
import { assignRef, contains, getOwnerDocument } from "./dom";
import { mountFocusScopeLifecycle } from "./focus-scope";

export type OverlayLayerOutsideEvent = CustomEvent<{
  originalEvent: Event;
  pointerType?: string;
}>;

export type OverlayLayerEntry = {
  id: string;
  modal: boolean;
};

type OverlayLayerRegistration = OverlayLayerEntry & {
  element?: HTMLElement;
  getElement?: Accessor<HTMLElement | undefined>;
  disableOutsidePointerEvents: Accessor<boolean>;
};

export type OverlayLayerStack = {
  layers: Accessor<readonly OverlayLayerEntry[]>;
  register: (entry: OverlayLayerRegistration) => () => void;
  isTopLayer: (id: string) => boolean;
  indexOf: (id: string) => number;
  syncModalState: (ownerDocument: Document) => void;
  syncPointerEvents: (ownerDocument: Document) => void;
};

export type OverlayLayerProviderProps = {
  children?: JSX.Element;
  stack?: OverlayLayerStack;
};

export type CreateOverlayLayerOptions = {
  id: string;
  containsTarget?: (target: Node | null) => boolean;
  element?: Accessor<HTMLElement | undefined>;
  modal?: Accessor<boolean>;
  disableOutsidePointerEvents?: Accessor<boolean>;
  trapFocus?: Accessor<boolean>;
  restoreFocus?: Accessor<boolean>;
  stack?: OverlayLayerStack;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
  onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
  onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
  onDismiss?: (event: Event) => void;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
};

export type OverlayLayerApi = {
  id: string;
  index: Accessor<number>;
  isTopLayer: Accessor<boolean>;
};

export type OverlayLayerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
  children?: JSX.Element;
  id: string;
  modal?: boolean;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

type PointerEventsState = {
  disabled: boolean;
  originalBodyPointerEvents: string;
};

type ModalDocumentState = {
  hiddenElements: Array<{
    element: HTMLElement;
    ariaHiddenValue: string | null;
    inertAttributeValue: string | null;
    inertValue: boolean;
  }>;
  originalBodyOverflow: string;
  locked: boolean;
};

const OverlayLayerContext = createContext<OverlayLayerStack>();
const modalStateByDocument = new WeakMap<Document, ModalDocumentState>();
const pointerEventsByDocument = new WeakMap<Document, PointerEventsState>();
const handledOutsideEvents = new WeakSet<Event>();
let defaultOverlayLayerStack: OverlayLayerStack | undefined;

export function createOverlayLayerStack(): OverlayLayerStack {
  const [registrations, setRegistrations] = createSignal<readonly OverlayLayerRegistration[]>([]);
  const layers = createMemo(() =>
    registrations().map((layer) => ({
      id: layer.id,
      modal: layer.modal,
    })),
  );
  const indexOf = (id: string) => registrations().findIndex((layer) => layer.id === id);

  const syncPointerEvents = (ownerDocument: Document) => {
    const state = pointerEventsByDocument.get(ownerDocument) ?? {
      disabled: false,
      originalBodyPointerEvents: "",
    };
    const current = registrations();
    const hasBlockingLayer = current.some((layer) => layer.disableOutsidePointerEvents());

    for (const layer of current) {
      const element = untrack(() => layer.getElement?.() ?? layer.element);

      if (element) {
        element.style.pointerEvents = "auto";
      }
    }

    if (hasBlockingLayer && !state.disabled) {
      state.originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
      ownerDocument.body.style.pointerEvents = "none";
      state.disabled = true;
      pointerEventsByDocument.set(ownerDocument, state);
    }

    if (!hasBlockingLayer && state.disabled) {
      ownerDocument.body.style.pointerEvents = state.originalBodyPointerEvents;
      state.disabled = false;
      pointerEventsByDocument.set(ownerDocument, state);

      if (!ownerDocument.body.getAttribute("style")) {
        ownerDocument.body.removeAttribute("style");
      }
    }
  };

  const syncModalState = (ownerDocument: Document) => {
    const state = modalStateByDocument.get(ownerDocument) ?? {
      hiddenElements: [],
      originalBodyOverflow: "",
      locked: false,
    };

    for (const hidden of state.hiddenElements) {
      if (hidden.ariaHiddenValue === null) {
        hidden.element.removeAttribute("aria-hidden");
      } else {
        hidden.element.setAttribute("aria-hidden", hidden.ariaHiddenValue);
      }

      hidden.element.inert = hidden.inertValue;

      if (hidden.inertAttributeValue === null) {
        hidden.element.removeAttribute("inert");
      } else {
        hidden.element.setAttribute("inert", hidden.inertAttributeValue);
      }
    }

    state.hiddenElements = [];

    const modalLayers = registrations().filter((layer) => layer.modal);
    const topModal = modalLayers[modalLayers.length - 1];
    const topModalElement = untrack(() => topModal?.getElement?.() ?? topModal?.element);

    if (!topModalElement) {
      if (state.locked) {
        ownerDocument.body.style.overflow = state.originalBodyOverflow;
        state.locked = false;

        if (!ownerDocument.body.getAttribute("style")) {
          ownerDocument.body.removeAttribute("style");
        }
      }

      modalStateByDocument.set(ownerDocument, state);
      return;
    }

    if (!state.locked) {
      state.originalBodyOverflow = ownerDocument.body.style.overflow;
      ownerDocument.body.style.overflow = "hidden";
      state.locked = true;
    }

    for (const element of getOutsideElements(topModalElement, ownerDocument)) {
      state.hiddenElements.push({
        element,
        ariaHiddenValue: element.getAttribute("aria-hidden"),
        inertAttributeValue: element.getAttribute("inert"),
        inertValue: element.inert,
      });
      element.setAttribute("aria-hidden", "true");
      element.inert = true;
      element.setAttribute("inert", "");
    }

    modalStateByDocument.set(ownerDocument, state);
  };

  return {
    layers,
    register: (entry) => {
      setRegistrations((current) => [...current.filter((layer) => layer.id !== entry.id), entry]);

      return () => {
        setRegistrations((current) => current.filter((layer) => layer.id !== entry.id));
      };
    },
    indexOf,
    isTopLayer: (id) => indexOf(id) === registrations().length - 1,
    syncModalState,
    syncPointerEvents,
  };
}

export function OverlayLayerProvider(props: OverlayLayerProviderProps) {
  const parentStack = useContext(OverlayLayerContext);
  const stack = props.stack ?? parentStack ?? getDefaultOverlayLayerStack();

  return (
    <OverlayLayerContext.Provider value={stack}>{props.children}</OverlayLayerContext.Provider>
  );
}

export function createOverlayLayer(options: CreateOverlayLayerOptions): OverlayLayerApi {
  const stack = options.stack ?? useContext(OverlayLayerContext) ?? getDefaultOverlayLayerStack();
  const modal = () => options.modal?.() ?? false;
  const isTopLayer = createMemo(() => stack.isTopLayer(options.id));

  onMount(() => {
    const ownerDocument = getOwnerDocument(options.element?.());
    const unregister = stack.register({
      id: options.id,
      modal: modal(),
      element: options.element?.(),
      getElement: options.element,
      disableOutsidePointerEvents: () => options.disableOutsidePointerEvents?.() ?? modal(),
    });
    let isReady = false;
    let restoreFocus: (() => void) | undefined;

    stack.syncPointerEvents(ownerDocument);
    stack.syncModalState(ownerDocument);
    queueMicrotask(() => {
      isReady = true;

      const element = options.element?.();

      if (!element || restoreFocus) {
        return;
      }

      restoreFocus = mountLayerFocusLifecycle({
        element,
        isTopLayer,
        restoreFocus: () => options.restoreFocus?.() ?? true,
        trapFocus: () => options.trapFocus?.() ?? false,
        onMountAutoFocus: options.onMountAutoFocus,
        onUnmountAutoFocus: options.onUnmountAutoFocus,
      });
      stack.syncPointerEvents(getOwnerDocument(element));
      stack.syncModalState(getOwnerDocument(element));
    });

    const element = options.element?.();

    if (element) {
      restoreFocus = mountLayerFocusLifecycle({
        element,
        isTopLayer,
        restoreFocus: () => options.restoreFocus?.() ?? true,
        trapFocus: () => options.trapFocus?.() ?? false,
        onMountAutoFocus: options.onMountAutoFocus,
        onUnmountAutoFocus: options.onUnmountAutoFocus,
      });
    }

    const onPointerDown = (event: PointerEvent) => {
      const element = options.element?.();

      if (
        handledOutsideEvents.has(event) ||
        !element ||
        !isReady ||
        !isTopLayer() ||
        containsLayerTarget(element, event.target as Node | null, options)
      ) {
        return;
      }

      handledOutsideEvents.add(event);
      const outsideEvent = dispatchOutsideEvent("keystone.pointerDownOutside", event);
      dismissFromOutside(event, outsideEvent, options.onPointerDownOutside, options);
    };

    const onFocusIn = (event: FocusEvent) => {
      const element = options.element?.();

      if (
        handledOutsideEvents.has(event) ||
        !element ||
        !isReady ||
        !isTopLayer() ||
        containsLayerTarget(element, event.target as Node | null, options)
      ) {
        return;
      }

      handledOutsideEvents.add(event);
      const outsideEvent = dispatchOutsideEvent("keystone.focusOutside", event);
      dismissFromOutside(event, outsideEvent, options.onFocusOutside, options);
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
      restoreFocus?.();
      unregister();
      stack.syncPointerEvents(ownerDocument);
      stack.syncModalState(ownerDocument);
    });
  });

  return {
    id: options.id,
    index: createMemo(() => stack.indexOf(options.id)),
    isTopLayer,
  };
}

export function OverlayLayer(props: OverlayLayerProps) {
  const [local, others] = splitProps(props, ["children", "id", "modal", "ref"]);
  const [element, setElement] = createSignal<HTMLDivElement>();
  const layer = createOverlayLayer({
    id: local.id,
    element,
    modal: () => local.modal ?? false,
  });

  return (
    <div
      {...getPartDataAttributes("overlay", "layer")}
      data-layer-id={layer.id}
      data-layer-index={layer.index()}
      data-top-layer={layer.isTopLayer() ? "" : undefined}
      data-modal={local.modal ? "" : undefined}
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

function getDefaultOverlayLayerStack() {
  defaultOverlayLayerStack ??= createOverlayLayerStack();
  return defaultOverlayLayerStack;
}

function dispatchOutsideEvent(
  type: "keystone.pointerDownOutside" | "keystone.focusOutside",
  originalEvent: Event,
) {
  const pointerType =
    typeof PointerEvent !== "undefined" && originalEvent instanceof PointerEvent
      ? originalEvent.pointerType
      : undefined;

  return new CustomEvent(type, { cancelable: true, detail: { originalEvent, pointerType } });
}

function containsLayerTarget(
  element: HTMLElement,
  target: Node | null,
  options: CreateOverlayLayerOptions,
) {
  return contains(element, target) || options.containsTarget?.(target) === true;
}

function getOutsideElements(element: HTMLElement, ownerDocument: Document) {
  const elements = new Set<HTMLElement>();
  let current: HTMLElement | null = element;

  while (current && current !== ownerDocument.body) {
    const parent: HTMLElement | null = current.parentElement;

    if (!parent) {
      break;
    }

    for (const child of Array.from(parent.children)) {
      if (child !== current && child instanceof HTMLElement) {
        elements.add(child);
      }
    }

    current = parent;
  }

  elements.delete(element);

  return elements;
}

function dismissFromOutside(
  originalEvent: Event,
  outsideEvent: OverlayLayerOutsideEvent,
  specificHandler: ((event: OverlayLayerOutsideEvent) => void) | undefined,
  options: CreateOverlayLayerOptions,
) {
  specificHandler?.(outsideEvent);
  options.onInteractOutside?.(outsideEvent);

  if (!outsideEvent.defaultPrevented) {
    options.onDismiss?.(originalEvent);
  }
}

function mountLayerFocusLifecycle(options: {
  element: HTMLElement;
  isTopLayer: Accessor<boolean>;
  trapFocus: Accessor<boolean>;
  restoreFocus: Accessor<boolean>;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
}) {
  return mountFocusScopeLifecycle({
    element: options.element,
    active: options.isTopLayer,
    restoreFocus: options.restoreFocus,
    trapFocus: options.trapFocus,
    onMountAutoFocus: options.onMountAutoFocus,
    onUnmountAutoFocus: options.onUnmountAutoFocus,
  });
}
