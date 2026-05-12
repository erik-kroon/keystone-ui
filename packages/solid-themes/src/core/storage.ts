import { DEFAULT_STORAGE_KEY } from "./config";
import type { StorageLike } from "./types";

export function getBrowserStorage(): StorageLike | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function getStoredTheme(
  storageKey = DEFAULT_STORAGE_KEY,
  storage = getBrowserStorage()
): string | undefined {
  if (!storage) return undefined;

  try {
    return storage.getItem(storageKey) || undefined;
  } catch {
    return undefined;
  }
}

export function setStoredTheme(
  theme: string,
  storageKey = DEFAULT_STORAGE_KEY,
  storage = getBrowserStorage()
): void {
  if (!storage) return;

  try {
    storage.setItem(storageKey, theme);
  } catch {
    // Storage can be blocked by browser settings or quota.
  }
}
