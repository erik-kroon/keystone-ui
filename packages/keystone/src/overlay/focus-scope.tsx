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
  enabled?: Accessor<boolean>;
  trapFocus?: Accessor<boolean>;
  restoreFocus?: Accessor<boolean>;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
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

    const ownerDocument = getOwnerDocument(element);
    const previouslyFocusedElement = getActiveElement(element);
    const mountEvent = new CustomEvent(mountAutoFocusEvent, { cancelable: true });

    options.onMountAutoFocus?.(mountEvent);

    if (!mountEvent.defaultPrevented && !contains(element, previouslyFocusedElement)) {
      queueMicrotask(() => {
        const firstTabbable = getTabbableElements(element)[0];
        focusWithoutScrolling(firstTabbable ?? element);
      });
    }

    const onFocusIn = (event: FocusEvent) => {
      if (!options.trapFocus?.()) {
        return;
      }

      const target = event.target as Node | null;

      if (!contains(element, target)) {
        focusWithoutScrolling(getTabbableElements(element)[0] ?? element);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!options.trapFocus?.() || event.key !== "Tab") {
        return;
      }

      const tabbables = getTabbableElements(element);

      if (tabbables.length === 0) {
        event.preventDefault();
        focusWithoutScrolling(element);
        return;
      }

      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      const active = getActiveElement(element);

      if (event.shiftKey && active === first) {
        event.preventDefault();
        focusWithoutScrolling(last);
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        focusWithoutScrolling(first);
      }
    };

    ownerDocument.addEventListener("focusin", onFocusIn);
    element.addEventListener("keydown", onKeyDown);

    onCleanup(() => {
      ownerDocument.removeEventListener("focusin", onFocusIn);
      element.removeEventListener("keydown", onKeyDown);

      if (options.restoreFocus?.() === false) {
        return;
      }

      const unmountEvent = new CustomEvent(unmountAutoFocusEvent, { cancelable: true });
      options.onUnmountAutoFocus?.(unmountEvent);

      if (!unmountEvent.defaultPrevented) {
        queueMicrotask(() => focusWithoutScrolling(previouslyFocusedElement ?? ownerDocument.body));
      }
    });
  });
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
