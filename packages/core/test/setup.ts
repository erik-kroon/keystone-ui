if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (callback) =>
    globalThis.setTimeout(() => callback(performance.now()), 16) as unknown as number;
}

if (!globalThis.cancelAnimationFrame) {
  globalThis.cancelAnimationFrame = (handle) => {
    globalThis.clearTimeout(handle);
  };
}
