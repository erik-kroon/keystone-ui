import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
  untrack,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { getPartDataAttributes } from "../metadata/index";
import { assignRef, contains, getOwnerDocument } from "./dom";
import { mountFocusScopeLifecycle } from "./focus-scope";
import { hideOutside } from "./hide-outside";
import { lockPreventScroll } from "./prevent-scroll";
import { scheduleMicrotask } from "../utils/index";

export type OverlayLayerOutsideEvent = CustomEvent<{
  originalEvent: Event;
  pointerType?: string;
}>;

export type OverlayLayerEntry = {
  id: string;
  modal: boolean;
};

type OverlayLayerRegistration = {
  id: string;
  element?: HTMLElement;
  getElement?: Accessor<HTMLElement | undefined>;
  getBranchElements?: Accessor<readonly HTMLElement[]>;
  modal: Accessor<boolean>;
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
  branchElements?: Accessor<readonly HTMLElement[]>;
  containsTarget?: (target: Node | null) => boolean;
  element?: Accessor<HTMLElement | undefined>;
  enabled?: Accessor<boolean>;
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
  elementStates: Map<HTMLElement, string>;
  originalBodyPointerEvents: string;
};

type ModalDocumentState = {
  cleanupHideOutside?: () => void;
  releasePreventScroll?: () => void;
};

const OverlayLayerContext = createContext<OverlayLayerStack>();
const pointerEventsByDocument = new WeakMap<Document, PointerEventsState>();
const handledOutsideEvents = new WeakSet<Event>();
let defaultOverlayLayerStack: OverlayLayerStack | undefined;

export function createOverlayLayerStack(): OverlayLayerStack {
  const modalStateByDocument = new WeakMap<Document, ModalDocumentState>();
  const [registrations, setRegistrations] = createSignal<readonly OverlayLayerRegistration[]>([]);
  const layers = createMemo(() =>
    registrations().map((layer) => ({
      id: layer.id,
      modal: layer.modal(),
    })),
  );
  const indexOf = (id: string) => registrations().findIndex((layer) => layer.id === id);

  const syncPointerEvents = (ownerDocument: Document) => {
    const state = pointerEventsByDocument.get(ownerDocument) ?? {
      disabled: false,
      elementStates: new Map<HTMLElement, string>(),
      originalBodyPointerEvents: "",
    };
    const current = registrations();
    const hasBlockingLayer = current.some((layer) => layer.disableOutsidePointerEvents());
    const unblockedElements = new Set(
      current.flatMap((layer) => getRegistrationElements(layer, ownerDocument)),
    );

    if (hasBlockingLayer) {
      for (const element of unblockedElements) {
        if (!state.elementStates.has(element)) {
          state.elementStates.set(element, element.style.pointerEvents);
        }

        element.style.pointerEvents = "auto";
      }
    }

    if (hasBlockingLayer && !state.disabled) {
      state.originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
      ownerDocument.body.style.pointerEvents = "none";
      state.disabled = true;
      pointerEventsByDocument.set(ownerDocument, state);
    }

    for (const [element, pointerEvents] of state.elementStates) {
      if (hasBlockingLayer && unblockedElements.has(element)) {
        continue;
      }

      element.style.pointerEvents = pointerEvents;
      state.elementStates.delete(element);

      if (!element.getAttribute("style")) {
        element.removeAttribute("style");
      }
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
    const state = modalStateByDocument.get(ownerDocument) ?? {};

    state.cleanupHideOutside?.();
    state.cleanupHideOutside = undefined;

    const current = registrations();
    const modalLayers = current.filter((layer) => layer.modal());
    const topModal = modalLayers[modalLayers.length - 1];
    const topModalElement = untrack(() => topModal?.getElement?.() ?? topModal?.element);

    if (!topModalElement) {
      state.releasePreventScroll?.();
      state.releasePreventScroll = undefined;

      modalStateByDocument.set(ownerDocument, state);
      return;
    }

    state.releasePreventScroll ??= lockPreventScroll(ownerDocument);

    const topModalIndex = topModal ? current.indexOf(topModal) : -1;
    const layerExceptions = current
      .slice(topModalIndex + 1)
      .flatMap((layer) => getRegistrationElements(layer, ownerDocument));
    const topModalBranches = topModal ? getRegistrationBranchElements(topModal, ownerDocument) : [];

    state.cleanupHideOutside = hideOutside({
      ownerDocument,
      targets: [topModalElement, ...topModalBranches],
      exceptions: layerExceptions,
    });

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
  const ownerDocuments = new Set<Document>();
  let cleanupLayer: (() => void) | undefined;
  let mountedElement: HTMLElement | undefined;
  let syncLayerDocument: ((document: Document) => void) | undefined;

  const syncRegisteredDocuments = () => {
    for (const document of ownerDocuments) {
      stack.syncPointerEvents(document);
      stack.syncModalState(document);
    }
  };

  const cleanupRegisteredLayer = () => {
    cleanupLayer?.();
    cleanupLayer = undefined;
    mountedElement = undefined;
  };

  createEffect(() => {
    const enabled = options.enabled?.() ?? true;
    const element = options.element?.();
    modal();
    options.disableOutsidePointerEvents?.();

    if (!enabled || !element) {
      cleanupRegisteredLayer();
      return;
    }

    if (syncLayerDocument) {
      syncLayerDocument(getOwnerDocument(element));
    }

    if (cleanupLayer && mountedElement === element) {
      return;
    }

    cleanupRegisteredLayer();
    mountedElement = element;

    const ownerDocument = getOwnerDocument(element);
    syncLayerDocument = (document: Document) => {
      ownerDocuments.add(document);
      stack.syncPointerEvents(document);
      stack.syncModalState(document);
    };
    const unregister = stack.register({
      id: options.id,
      modal,
      element,
      getElement: options.element,
      getBranchElements: options.branchElements,
      disableOutsidePointerEvents: () => options.disableOutsidePointerEvents?.() ?? modal(),
    });
    let isReady = false;
    let restoreFocus: (() => void) | undefined;

    syncLayerDocument(ownerDocument);
    scheduleMicrotask(() => {
      isReady = true;
    });

    restoreFocus = mountLayerFocusLifecycle({
      element,
      isTopLayer,
      restoreFocus: () => options.restoreFocus?.() ?? true,
      trapFocus: () => options.trapFocus?.() ?? false,
      onMountAutoFocus: options.onMountAutoFocus,
      onUnmountAutoFocus: options.onUnmountAutoFocus,
    });

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

    cleanupLayer = () => {
      ownerDocument.removeEventListener("pointerdown", onPointerDown, true);
      ownerDocument.removeEventListener("focusin", onFocusIn, true);
      ownerDocument.removeEventListener("keydown", onKeyDown);
      restoreFocus?.();
      unregister();
      ownerDocuments.add(ownerDocument);
      syncRegisteredDocuments();
      mountedElement = undefined;
      syncLayerDocument = undefined;
    };
  });

  onCleanup(cleanupRegisteredLayer);

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
  return (
    contains(element, target) ||
    options.branchElements?.().some((branch) => contains(branch, target)) === true ||
    options.containsTarget?.(target) === true
  );
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

function getRegistrationElements(layer: OverlayLayerRegistration, ownerDocument: Document) {
  const element = untrack(() => layer.getElement?.() ?? layer.element);

  return [element, ...getRegistrationBranchElements(layer, ownerDocument)].filter(
    (candidate): candidate is HTMLElement =>
      candidate instanceof HTMLElement && getOwnerDocument(candidate) === ownerDocument,
  );
}

function getRegistrationBranchElements(layer: OverlayLayerRegistration, ownerDocument: Document) {
  return untrack(() => layer.getBranchElements?.() ?? []).filter(
    (candidate) => getOwnerDocument(candidate) === ownerDocument,
  );
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
