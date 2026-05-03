import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";

export type OverlayPresenceTransitionStatus = "closed" | "closing" | "opening" | "open";

export type OverlayPresenceCompleteDetail = {
  open: boolean;
  preventedUnmount: boolean;
};

export type OverlayPresenceApi = {
  mounted: Accessor<boolean>;
  preventUnmountOnClose: () => void;
  setElement: (element: HTMLElement | undefined) => void;
  transitionStatus: Accessor<OverlayPresenceTransitionStatus>;
};

export type CreateOverlayPresenceOptions = {
  onOpenChangeComplete?: (open: boolean, detail: OverlayPresenceCompleteDetail) => void;
  open: Accessor<boolean>;
};

export function createOverlayPresence(options: CreateOverlayPresenceOptions): OverlayPresenceApi {
  const [element, setElement] = createSignal<HTMLElement>();
  const [mounted, setMounted] = createSignal(options.open());
  const [transitionStatus, setTransitionStatus] = createSignal<OverlayPresenceTransitionStatus>(
    options.open() ? "open" : "closed",
  );
  let cleanupTransition: (() => void) | undefined;
  let preventedUnmount = false;
  let skipInitialEffect = true;

  const complete = (open: boolean) => {
    cleanupTransition?.();
    cleanupTransition = undefined;
    setTransitionStatus(open ? "open" : "closed");

    if (!open && !preventedUnmount) {
      setMounted(false);
    }

    options.onOpenChangeComplete?.(open, {
      open,
      preventedUnmount,
    });
    preventedUnmount = false;
  };

  createEffect(() => {
    const open = options.open();

    if (skipInitialEffect) {
      skipInitialEffect = false;
      return;
    }

    cleanupTransition?.();
    cleanupTransition = undefined;

    if (open) {
      setMounted(true);
      setTransitionStatus("opening");
      cleanupTransition = waitForElementTransition(element, () => complete(true));
      return;
    }

    setTransitionStatus("closing");
    cleanupTransition = waitForElementTransition(element, () => complete(false));
  });

  onCleanup(() => cleanupTransition?.());

  return {
    mounted,
    preventUnmountOnClose: () => {
      preventedUnmount = true;
    },
    setElement,
    transitionStatus,
  };
}

function waitForElementTransition(element: Accessor<HTMLElement | undefined>, done: () => void) {
  let disposed = false;
  let removeListeners: (() => void) | undefined;
  let fallbackTimeout: ReturnType<typeof setTimeout> | undefined;
  const frame = requestAnimationFrame(() => {
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
    cancelAnimationFrame(frame);
    removeListeners?.();
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout);
    }
  };
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
