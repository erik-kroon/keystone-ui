import { createSignal, onCleanup, onMount, splitProps, type Accessor, type JSX } from "solid-js";
import {
  assignRef,
  contains,
  focusWithoutScrolling,
  getActiveElement,
  getOwnerDocument,
  getTabbableElements,
} from "./dom";

export type FocusScopeOptions = {
  element: Accessor<HTMLElement | undefined>;
  active?: Accessor<boolean>;
  enabled?: Accessor<boolean>;
  trapFocus?: Accessor<boolean>;
  restoreFocus?: Accessor<boolean>;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
};

export type FocusScopeLifecycleOptions = Omit<FocusScopeOptions, "element" | "enabled"> & {
  element: HTMLElement;
};

export type FocusScopeProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
  children?: JSX.Element;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
  trapFocus?: boolean;
  restoreFocus?: boolean;
};

const mountAutoFocusEvent = "keystone.focusScope.mountAutoFocus";
const unmountAutoFocusEvent = "keystone.focusScope.unmountAutoFocus";

export function createFocusScope(options: FocusScopeOptions) {
  onMount(() => {
    if (options.enabled?.() === false) {
      return;
    }

    const element = options.element();

    if (!element) {
      return;
    }

    onCleanup(mountFocusScopeLifecycle({ ...options, element }));
  });
}

export function mountFocusScopeLifecycle(options: FocusScopeLifecycleOptions) {
  const ownerDocument = getOwnerDocument(options.element);
  const previouslyFocusedElement = getActiveElement(options.element);
  let lastFocusedElement = contains(options.element, previouslyFocusedElement)
    ? previouslyFocusedElement
    : undefined;
  const active = () => options.active?.() ?? true;
  const shouldTrapFocus = () => active() && options.trapFocus?.() === true;
  const focusFirstEligibleElement = () => {
    const fallback = getTabbableElements(options.element)[0] ?? options.element;

    focusWithoutScrolling(fallback);
  };
  const restoreLastFocusedElement = () => {
    if (lastFocusedElement?.isConnected && contains(options.element, lastFocusedElement)) {
      focusWithoutScrolling(lastFocusedElement);
      return;
    }

    focusFirstEligibleElement();
  };
  const mountEvent = new CustomEvent(mountAutoFocusEvent, { cancelable: true });

  options.onMountAutoFocus?.(mountEvent);

  if (!mountEvent.defaultPrevented && !contains(options.element, previouslyFocusedElement)) {
    queueMicrotask(() => {
      if (!active() || !options.element.isConnected) {
        return;
      }

      focusFirstEligibleElement();
    });
  }

  const onFocusIn = (event: FocusEvent) => {
    const target = event.target as HTMLElement | null;

    if (contains(options.element, target)) {
      lastFocusedElement = target;
      return;
    }

    if (shouldTrapFocus()) {
      restoreLastFocusedElement();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!shouldTrapFocus() || event.key !== "Tab") {
      return;
    }

    const tabbables = getTabbableElements(options.element);

    if (tabbables.length === 0) {
      event.preventDefault();
      focusWithoutScrolling(options.element);
      return;
    }

    const first = tabbables[0];
    const last = tabbables[tabbables.length - 1];
    const activeElement = getActiveElement(options.element);

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      focusWithoutScrolling(last);
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      focusWithoutScrolling(first);
    }
  };

  ownerDocument.addEventListener("focusin", onFocusIn);
  options.element.addEventListener("keydown", onKeyDown);

  return () => {
    ownerDocument.removeEventListener("focusin", onFocusIn);
    options.element.removeEventListener("keydown", onKeyDown);

    if (options.restoreFocus?.() === false) {
      return;
    }

    const unmountEvent = new CustomEvent(unmountAutoFocusEvent, { cancelable: true });
    options.onUnmountAutoFocus?.(unmountEvent);

    if (!unmountEvent.defaultPrevented) {
      queueMicrotask(() => {
        const restoreTarget = previouslyFocusedElement?.isConnected
          ? previouslyFocusedElement
          : ownerDocument.body;

        focusWithoutScrolling(restoreTarget);
      });
    }
  };
}

export function FocusScope(props: FocusScopeProps) {
  const [local, others] = splitProps(props, ["children", "ref", "trapFocus", "restoreFocus"]);
  const [element, setElement] = createSignal<HTMLDivElement>();

  createFocusScope({
    element,
    trapFocus: () => local.trapFocus ?? true,
    restoreFocus: () => local.restoreFocus ?? true,
  });

  return (
    <div
      tabIndex={-1}
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
