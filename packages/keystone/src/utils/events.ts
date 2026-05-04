export type KeystoneEventHandler = unknown;

export function composeEventHandlers<E extends Event>(
  userHandler: KeystoneEventHandler,
  internalHandler: (event: E) => void,
  options: { checkForDefaultPrevented?: boolean } = {},
) {
  return (event: E) => {
    callEventHandler(userHandler, event);

    if (options.checkForDefaultPrevented === false || !event.defaultPrevented) {
      internalHandler(event);
    }
  };
}

export function callEventHandler<E extends Event>(handler: KeystoneEventHandler, event: E) {
  if (typeof handler === "function") {
    handler(event);
    return;
  }

  if (Array.isArray(handler)) {
    const [first, second] = handler;

    if (typeof first === "function") {
      first(second, event);
    } else if (typeof second === "function") {
      second(first, event);
    }
  }
}
