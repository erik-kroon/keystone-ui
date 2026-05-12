import { SYSTEM_THEME_QUERY } from "./config";
import type { ColorScheme } from "./types";

type MediaQueryTarget = Pick<Window, "matchMedia">;
type MediaQueryChangeHandler = (theme: ColorScheme) => void;

export function getSystemTheme(target?: MediaQueryTarget): ColorScheme | undefined {
  const mediaTarget = target ?? (typeof window !== "undefined" ? window : undefined);
  if (!mediaTarget?.matchMedia) return undefined;

  try {
    return mediaTarget.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
  } catch {
    return undefined;
  }
}

export function addSystemThemeListener(
  callback: MediaQueryChangeHandler,
  target?: MediaQueryTarget
): () => void {
  const mediaTarget = target ?? (typeof window !== "undefined" ? window : undefined);
  if (!mediaTarget?.matchMedia) return () => {};

  let media: MediaQueryList;
  try {
    media = mediaTarget.matchMedia(SYSTEM_THEME_QUERY);
  } catch {
    return () => {};
  }

  const handler = (event: MediaQueryListEvent | MediaQueryList) => {
    callback(event.matches ? "dark" : "light");
  };

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }

  media.addListener(handler);
  return () => media.removeListener(handler);
}
