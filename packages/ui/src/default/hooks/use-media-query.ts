import { createSignal, onCleanup, onMount, type Accessor } from "solid-js";

export type MediaQueryInput =
  | string
  | {
      max?: number | string;
      min?: number | string;
      orientation?: "landscape" | "portrait";
      pointer?: "coarse" | "fine" | "none";
      preference?: "dark" | "light" | "motion" | "reduced-motion";
    };

export type UseMediaQueryOptions = {
  defaultValue?: boolean;
  window?: Window;
};

export const mediaQueryBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type MediaQueryBreakpoint = keyof typeof mediaQueryBreakpoints;

export function useMediaQuery(query: MediaQueryInput, options: UseMediaQueryOptions = {}) {
  return createMediaQuery(query, options);
}

export function createMediaQuery(
  query: MediaQueryInput,
  options: UseMediaQueryOptions = {},
): Accessor<boolean> {
  const [matches, setMatches] = createSignal(options.defaultValue ?? false);

  onMount(() => {
    const view = options.window ?? globalThis.window;
    const normalizedQuery = normalizeMediaQuery(query);
    const mediaQueryList = view?.matchMedia?.(normalizedQuery);
    if (!mediaQueryList) return;

    const sync = () => setMatches(mediaQueryList.matches);
    sync();
    addMediaQueryListener(mediaQueryList, sync);

    onCleanup(() => removeMediaQueryListener(mediaQueryList, sync));
  });

  return matches;
}

export function createBreakpointQuery(
  breakpoint: MediaQueryBreakpoint | number,
  direction: "down" | "up" = "up",
) {
  const value = typeof breakpoint === "number" ? breakpoint : mediaQueryBreakpoints[breakpoint];

  if (direction === "down") {
    return `(max-width: ${value - 0.02}px)`;
  }

  return `(min-width: ${value}px)`;
}

export function createPointerQuery(pointer: "coarse" | "fine" | "none") {
  return `(pointer: ${pointer})`;
}

export function normalizeMediaQuery(query: MediaQueryInput) {
  if (typeof query === "string") return query;

  const parts: string[] = [];

  if (query.min !== undefined) {
    parts.push(`(min-width: ${formatMediaValue(query.min)})`);
  }

  if (query.max !== undefined) {
    parts.push(`(max-width: ${formatMediaValue(query.max)})`);
  }

  if (query.orientation) {
    parts.push(`(orientation: ${query.orientation})`);
  }

  if (query.pointer) {
    parts.push(createPointerQuery(query.pointer));
  }

  if (query.preference === "dark" || query.preference === "light") {
    parts.push(`(prefers-color-scheme: ${query.preference})`);
  }

  if (query.preference === "motion") {
    parts.push("(prefers-reduced-motion: no-preference)");
  }

  if (query.preference === "reduced-motion") {
    parts.push("(prefers-reduced-motion: reduce)");
  }

  return parts.length > 0 ? parts.join(" and ") : "all";
}

function formatMediaValue(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function addMediaQueryListener(mediaQueryList: MediaQueryList, listener: () => void) {
  if (mediaQueryList.addEventListener) {
    mediaQueryList.addEventListener("change", listener);
    return;
  }

  mediaQueryList.addListener?.(listener);
}

function removeMediaQueryListener(mediaQueryList: MediaQueryList, listener: () => void) {
  if (mediaQueryList.removeEventListener) {
    mediaQueryList.removeEventListener("change", listener);
    return;
  }

  mediaQueryList.removeListener?.(listener);
}
