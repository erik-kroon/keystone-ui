import { createSignal, onCleanup, type Accessor } from "solid-js";

export type CopyToClipboardStatus = "idle" | "copied" | "error";

export type CopyToClipboardOptions = {
  copiedDuration?: number;
  onCopy?: (value: string) => void;
  onError?: (error: unknown, value: string) => void;
  window?: Window;
};

export type CopyToClipboardResult = {
  copied: Accessor<boolean>;
  copy: (value: string) => Promise<boolean>;
  error: Accessor<unknown>;
  isSupported: () => boolean;
  reset: () => void;
  status: Accessor<CopyToClipboardStatus>;
};

function getClipboard(options: CopyToClipboardOptions) {
  const targetNavigator =
    options.window?.navigator ??
    (typeof globalThis.navigator === "undefined" ? undefined : globalThis.navigator);
  return targetNavigator?.clipboard;
}

export function createCopyToClipboard(options: CopyToClipboardOptions = {}): CopyToClipboardResult {
  const [status, setStatus] = createSignal<CopyToClipboardStatus>("idle");
  const [error, setError] = createSignal<unknown>();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const clearCopiedTimeout = () => {
    if (!timeoutId) return;
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  const reset = () => {
    clearCopiedTimeout();
    setStatus("idle");
    setError(undefined);
  };

  const isSupported = () => typeof getClipboard(options)?.writeText === "function";

  const copy = async (value: string) => {
    const clipboard = getClipboard(options);
    if (typeof clipboard?.writeText !== "function") {
      const nextError = new Error("Clipboard API is not available.");
      setError(nextError);
      setStatus("error");
      options.onError?.(nextError, value);
      return false;
    }

    try {
      await clipboard.writeText(value);
      clearCopiedTimeout();
      setError(undefined);
      setStatus("copied");
      options.onCopy?.(value);
      const copiedDuration = options.copiedDuration ?? 2000;
      if (copiedDuration !== 0) {
        timeoutId = setTimeout(() => setStatus("idle"), copiedDuration);
      }
      return true;
    } catch (nextError) {
      clearCopiedTimeout();
      setError(nextError);
      setStatus("error");
      options.onError?.(nextError, value);
      return false;
    }
  };

  onCleanup(clearCopiedTimeout);

  return {
    copied: () => status() === "copied",
    copy,
    error,
    isSupported,
    reset,
    status,
  };
}
