import { contains } from "./dom";

export type HideOutsideOptions = {
  ownerDocument: Document;
  targets: readonly HTMLElement[];
  exceptions?: readonly HTMLElement[];
};

type HiddenElementState = {
  ariaHiddenValue: string | null;
  inertAttributeValue: string | null;
  inertValue: boolean;
  count: number;
};

const hiddenElementStates = new WeakMap<HTMLElement, HiddenElementState>();

export function hideOutside(options: HideOutsideOptions) {
  const hiddenElements = new Set<HTMLElement>();
  const hiddenByThisCall = new WeakSet<HTMLElement>();
  let observer: MutationObserver | undefined;

  const targets = () => options.targets.filter((element) => element.isConnected);
  const exceptions = () => options.exceptions?.filter((element) => element.isConnected) ?? [];

  const isAllowed = (element: HTMLElement) =>
    targets().some((target) => contains(target, element) || contains(element, target)) ||
    exceptions().some(
      (exception) => contains(exception, element) || contains(element, exception),
    ) ||
    isLiveAnnouncerElement(element);

  const hideElement = (element: HTMLElement) => {
    if (hiddenByThisCall.has(element) || isAllowed(element)) {
      return;
    }

    const state = hiddenElementStates.get(element);

    if (state) {
      state.count += 1;
    } else {
      hiddenElementStates.set(element, {
        ariaHiddenValue: element.getAttribute("aria-hidden"),
        inertAttributeValue: element.getAttribute("inert"),
        inertValue: element.inert,
        count: 1,
      });
      element.setAttribute("aria-hidden", "true");
      element.inert = true;
      element.setAttribute("inert", "");
    }

    hiddenByThisCall.add(element);
    hiddenElements.add(element);
  };

  const hideOutsideTarget = (target: HTMLElement) => {
    let current: HTMLElement | null = target;

    while (current && current !== options.ownerDocument.body) {
      const parent: HTMLElement | null = current.parentElement;

      if (!parent) {
        break;
      }

      for (const child of Array.from(parent.children)) {
        if (child instanceof HTMLElement && child !== current) {
          hideElement(child);
        }
      }

      current = parent;
    }
  };

  const hideCurrentOutsideElements = () => {
    for (const target of targets()) {
      hideOutsideTarget(target);
    }
  };

  hideCurrentOutsideElements();

  if (typeof MutationObserver !== "undefined") {
    observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (node instanceof HTMLElement) {
            hideCurrentOutsideElements();
            hideElement(node);
          }
        }
      }
    });
    observer.observe(options.ownerDocument.body, { childList: true, subtree: true });
  }

  return () => {
    observer?.disconnect();

    for (const element of hiddenElements) {
      const state = hiddenElementStates.get(element);

      if (!state) {
        continue;
      }

      state.count -= 1;

      if (state.count > 0) {
        continue;
      }

      if (state.ariaHiddenValue === null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", state.ariaHiddenValue);
      }

      element.inert = state.inertValue;

      if (state.inertAttributeValue === null) {
        element.removeAttribute("inert");
      } else {
        element.setAttribute("inert", state.inertAttributeValue);
      }

      hiddenElementStates.delete(element);
    }
  };
}

function isLiveAnnouncerElement(element: HTMLElement) {
  return (
    element.hasAttribute("data-keystone-live-announcer") ||
    element.getAttribute("aria-live") !== null ||
    element.getAttribute("role") === "status" ||
    element.getAttribute("role") === "alert"
  );
}
