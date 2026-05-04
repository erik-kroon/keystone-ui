export function contains(container: Node | undefined | null, node: Node | undefined | null) {
  return !!container && !!node && (container === node || container.contains(node));
}

export function getOwnerDocument(element: Element | undefined | null) {
  if (element?.ownerDocument) {
    return element.ownerDocument;
  }

  if (typeof document !== "undefined") {
    return document;
  }

  throw new Error("Keystone DOM owner document is unavailable before mount");
}

export function getActiveElement(element: Element | undefined | null) {
  let activeElement = getOwnerDocument(element).activeElement as HTMLElement | null;

  while (activeElement?.shadowRoot?.activeElement instanceof HTMLElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}

export function focusWithoutScrolling(element: HTMLElement | undefined | null) {
  element?.focus({ preventScroll: true });
}

export function isFocusable(element: Element | undefined | null): element is HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (
    element.hidden ||
    element.getAttribute("aria-hidden") === "true" ||
    element.getAttribute("data-keystone-focus-guard") === ""
  ) {
    return false;
  }

  const disabled =
    element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";

  if (disabled) {
    return false;
  }

  if (element.tabIndex >= 0) {
    return true;
  }

  return (
    /^(AUDIO|BUTTON|DETAILS|INPUT|SELECT|TEXTAREA|VIDEO)$/.test(element.tagName) ||
    (element.tagName === "A" && element.hasAttribute("href"))
  );
}

export function getTabbableElements(container: HTMLElement) {
  const candidates = container.querySelectorAll<HTMLElement>(
    [
      "a[href]",
      "audio[controls]",
      "button",
      "details",
      "input",
      "select",
      "textarea",
      "video[controls]",
      "[contenteditable]:not([contenteditable='false'])",
      "[tabindex]",
    ].join(","),
  );

  return Array.from(candidates).filter((element) => isFocusable(element) && element.tabIndex >= 0);
}

export function assignRef<T extends HTMLElement>(
  ref: T | ((element: T) => void) | undefined,
  element: T,
) {
  if (typeof ref === "function") {
    (ref as (element: T) => void)(element);
  }
}
