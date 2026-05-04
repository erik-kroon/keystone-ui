type PreventScrollState = {
  locks: number;
  originalBodyLeft: string;
  originalBodyOverflow: string;
  originalBodyPaddingRight: string;
  originalBodyPosition: string;
  originalBodyRight: string;
  originalBodyTop: string;
  originalBodyWidth: string;
  scrollX: number;
  scrollY: number;
  touchStartY?: number;
  touchMoveListener?: (event: TouchEvent) => void;
  touchStartListener?: (event: TouchEvent) => void;
};

const preventScrollStateByDocument = new WeakMap<Document, PreventScrollState>();

export function lockPreventScroll(ownerDocument: Document) {
  let released = false;
  const release = () => {
    if (released) {
      return;
    }

    released = true;
    releasePreventScroll(ownerDocument);
  };
  const existing = preventScrollStateByDocument.get(ownerDocument);

  if (existing) {
    existing.locks += 1;
    return release;
  }

  const ownerWindow = ownerDocument.defaultView;
  const body = ownerDocument.body;
  const state: PreventScrollState = {
    locks: 1,
    originalBodyLeft: body.style.left,
    originalBodyOverflow: body.style.overflow,
    originalBodyPaddingRight: body.style.paddingRight,
    originalBodyPosition: body.style.position,
    originalBodyRight: body.style.right,
    originalBodyTop: body.style.top,
    originalBodyWidth: body.style.width,
    scrollX: ownerWindow?.scrollX ?? 0,
    scrollY: ownerWindow?.scrollY ?? 0,
  };
  const scrollbarWidth = getScrollbarWidth(ownerDocument);

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${getBodyPaddingRight(ownerDocument) + scrollbarWidth}px`;
  }

  body.style.overflow = "hidden";

  if (isIOS(ownerDocument)) {
    body.style.position = "fixed";
    body.style.top = `-${state.scrollY}px`;
    body.style.left = `-${state.scrollX}px`;
    body.style.right = "0";
    body.style.width = "100%";

    state.touchStartListener = (event) => {
      state.touchStartY = event.touches[0]?.clientY;
    };
    state.touchMoveListener = (event) => {
      if (!canScrollTouchTarget(event.target, getTouchDeltaY(event, state.touchStartY))) {
        event.preventDefault();
      }
    };
    ownerDocument.addEventListener("touchstart", state.touchStartListener, {
      capture: true,
      passive: true,
    });
    ownerDocument.addEventListener("touchmove", state.touchMoveListener, {
      capture: true,
      passive: false,
    });
  }

  preventScrollStateByDocument.set(ownerDocument, state);

  return release;
}

function releasePreventScroll(ownerDocument: Document) {
  const state = preventScrollStateByDocument.get(ownerDocument);

  if (!state) {
    return;
  }

  state.locks -= 1;

  if (state.locks > 0) {
    return;
  }

  const body = ownerDocument.body;

  body.style.overflow = state.originalBodyOverflow;
  body.style.paddingRight = state.originalBodyPaddingRight;
  body.style.position = state.originalBodyPosition;
  body.style.top = state.originalBodyTop;
  body.style.left = state.originalBodyLeft;
  body.style.right = state.originalBodyRight;
  body.style.width = state.originalBodyWidth;

  if (state.touchStartListener) {
    ownerDocument.removeEventListener("touchstart", state.touchStartListener, true);
  }

  if (state.touchMoveListener) {
    ownerDocument.removeEventListener("touchmove", state.touchMoveListener, true);
    ownerDocument.defaultView?.scrollTo(state.scrollX, state.scrollY);
  }

  preventScrollStateByDocument.delete(ownerDocument);

  if (!body.getAttribute("style")) {
    body.removeAttribute("style");
  }
}

function getScrollbarWidth(ownerDocument: Document) {
  const ownerWindow = ownerDocument.defaultView;

  if (!ownerWindow) {
    return 0;
  }

  return Math.max(0, ownerWindow.innerWidth - ownerDocument.documentElement.clientWidth);
}

function getBodyPaddingRight(ownerDocument: Document) {
  const ownerWindow = ownerDocument.defaultView;
  const paddingRight = ownerWindow?.getComputedStyle(ownerDocument.body).paddingRight;
  const parsed = paddingRight ? Number.parseFloat(paddingRight) : 0;

  return Number.isFinite(parsed) ? parsed : 0;
}

function isIOS(ownerDocument: Document) {
  const navigator = ownerDocument.defaultView?.navigator;
  const platform = navigator?.platform ?? "";

  return (
    /iP(ad|hone|od)/.test(platform) ||
    (platform === "MacIntel" && (navigator?.maxTouchPoints ?? 0) > 1)
  );
}

function getTouchDeltaY(event: TouchEvent, touchStartY: number | undefined) {
  const currentY = event.touches[0]?.clientY;

  if (currentY === undefined || touchStartY === undefined) {
    return 0;
  }

  return currentY - touchStartY;
}

function canScrollTouchTarget(target: EventTarget | null, deltaY: number) {
  if (!(target instanceof Element)) {
    return false;
  }

  let element: Element | null = target;

  while (element && element !== element.ownerDocument.body) {
    if (element instanceof HTMLElement && canElementScroll(element, deltaY)) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}

function canElementScroll(element: HTMLElement, deltaY: number) {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  const overflowY = style?.overflowY;

  if (overflowY !== "auto" && overflowY !== "scroll" && overflowY !== "overlay") {
    return false;
  }

  const maxScrollTop = element.scrollHeight - element.clientHeight;

  if (maxScrollTop <= 0) {
    return false;
  }

  if (deltaY > 0) {
    return element.scrollTop > 0;
  }

  if (deltaY < 0) {
    return element.scrollTop < maxScrollTop;
  }

  return true;
}
