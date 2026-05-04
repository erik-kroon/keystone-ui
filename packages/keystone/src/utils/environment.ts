export function canUseDOM(): boolean {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

export function scheduleMicrotask(callback: () => void) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(callback);
    return;
  }

  void Promise.resolve().then(callback);
}
