import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";
import { getOpenClosedState } from "../utils/index";

export type OverlayPresenceTransitionStatus = "closed" | "closing" | "opening" | "open";
export type OverlayPresenceTransitionStyle = "ending" | "starting";

export type OverlayPresenceCompleteDetail = {
  open: boolean;
  preventedUnmount: boolean;
};

export type OverlayPresenceApi = {
  hidden: (forceMount?: boolean) => boolean;
  mounted: Accessor<boolean>;
  setElement: (element: HTMLElement | undefined) => void;
  shouldMount: (forceMount?: boolean) => boolean;
  transitionStyle: Accessor<OverlayPresenceTransitionStyle | undefined>;
  transitionStatus: Accessor<OverlayPresenceTransitionStatus>;
};

export type CreateOverlayPresenceOptions = {
  forceMount?: Accessor<boolean | undefined>;
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open: Accessor<boolean>;
};

export function createOverlayPresence(options: CreateOverlayPresenceOptions): OverlayPresenceApi {
  const [element, setElement] = createSignal<HTMLElement>();
  const [mounted, setMounted] = createSignal(options.open());
  const [transitionStatus, setTransitionStatus] = createSignal<OverlayPresenceTransitionStatus>(
    getOpenClosedState(options.open()),
  );
  const [transitionStyle, setTransitionStyle] = createSignal<
    OverlayPresenceTransitionStyle | undefined
  >();
  let cleanupTransition: (() => void) | undefined;
  let clearStartingStyleFrame: number | undefined;
  let preventedUnmount = false;
  let requestedForceMount = false;
  let skipInitialEffect = true;
  const isForceMounted = (forceMount?: boolean) =>
    forceMount === true || requestedForceMount || options.forceMount?.() === true;

  const shouldMount = (forceMount?: boolean) => {
    if (forceMount !== undefined) {
      requestedForceMount = forceMount === true;
    }

    if (forceMount === true && transitionStatus() === "closing") {
      preventedUnmount = true;
    }

    return isForceMounted(forceMount) || mounted();
  };

  const complete = (open: boolean) => {
    const shouldRetainOnClose = !open && (preventedUnmount || isForceMounted());

    clearTransitionWork();
    setTransitionStatus(getOpenClosedState(open));

    if (!open && !shouldRetainOnClose) {
      setMounted(false);
    }

    options.onOpenChangeComplete?.(open, {
      open,
      preventedUnmount: shouldRetainOnClose,
    });
    preventedUnmount = false;
  };
  const clearTransitionWork = () => {
    cleanupTransition?.();
    cleanupTransition = undefined;
    if (clearStartingStyleFrame !== undefined) {
      cancelScheduledAnimationFrame(clearStartingStyleFrame);
      clearStartingStyleFrame = undefined;
    }
    setTransitionStyle(undefined);
  };

  createEffect(() => {
    const open = options.open();

    if (skipInitialEffect) {
      skipInitialEffect = false;
      return;
    }

    clearTransitionWork();

    if (open) {
      setMounted(true);
      setTransitionStatus("opening");
      setTransitionStyle("starting");
      clearStartingStyleFrame = scheduleAnimationFrame(() => {
        clearStartingStyleFrame = undefined;
        setTransitionStyle(undefined);
      });
      cleanupTransition = waitForElementTransition(element, () => complete(true));
      return;
    }

    setTransitionStatus("closing");
    setTransitionStyle("ending");
    cleanupTransition = waitForElementTransition(element, () => complete(false));
  });

  onCleanup(clearTransitionWork);

  return {
    hidden: (forceMount) =>
      shouldMount(forceMount) && !options.open() && transitionStatus() === "closed",
    mounted,
    setElement,
    shouldMount,
    transitionStyle,
    transitionStatus,
  };
}

function waitForElementTransition(element: Accessor<HTMLElement | undefined>, done: () => void) {
  let disposed = false;
  let removeListeners: (() => void) | undefined;
  let fallbackTimeout: ReturnType<typeof setTimeout> | undefined;
  const frame = scheduleAnimationFrame(() => {
    const target = element();

    if (disposed) {
      return;
    }

    if (!target) {
      done();
      return;
    }

    const duration = getLongestTransitionDuration(target);

    if (duration === 0) {
      done();
      return;
    }

    const finish = (event?: Event) => {
      if (event && event.target !== target) {
        return;
      }

      if (disposed) {
        return;
      }

      disposed = true;
      removeListeners?.();
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
      done();
    };

    target.addEventListener("transitionend", finish);
    target.addEventListener("transitioncancel", finish);
    target.addEventListener("animationend", finish);
    target.addEventListener("animationcancel", finish);
    removeListeners = () => {
      target.removeEventListener("transitionend", finish);
      target.removeEventListener("transitioncancel", finish);
      target.removeEventListener("animationend", finish);
      target.removeEventListener("animationcancel", finish);
    };
    fallbackTimeout = setTimeout(finish, duration + 50);
  });

  return () => {
    disposed = true;
    cancelScheduledAnimationFrame(frame);
    removeListeners?.();
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout);
    }
  };
}

function scheduleAnimationFrame(callback: FrameRequestCallback) {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(callback);
  }

  return setTimeout(() => callback(performance.now()), 16) as unknown as number;
}

function cancelScheduledAnimationFrame(frame: number) {
  if (typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(frame);
    return;
  }

  clearTimeout(frame);
}

function getLongestTransitionDuration(element: HTMLElement) {
  const style = getComputedStyle(element);
  return Math.max(
    getLongestTime(
      style.transitionDuration || element.style.transitionDuration,
      style.transitionDelay || element.style.transitionDelay,
    ),
    getLongestTime(
      style.animationDuration || element.style.animationDuration,
      style.animationDelay || element.style.animationDelay,
    ),
  );
}

function getLongestTime(durations: string, delays: string) {
  const durationValues = parseTimeList(durations);
  const delayValues = parseTimeList(delays);
  const count = Math.max(durationValues.length, delayValues.length);
  let longest = 0;

  for (let index = 0; index < count; index += 1) {
    const duration = durationValues[index % durationValues.length] ?? 0;
    const delay = delayValues[index % delayValues.length] ?? 0;
    longest = Math.max(longest, duration + delay);
  }

  return longest;
}

function parseTimeList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      if (item.endsWith("ms")) {
        return Number.parseFloat(item);
      }

      if (item.endsWith("s")) {
        return Number.parseFloat(item) * 1000;
      }

      return 0;
    });
}
