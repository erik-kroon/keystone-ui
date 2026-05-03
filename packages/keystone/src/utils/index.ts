import {
  createComponent,
  createMemo,
  createSignal,
  createUniqueId,
  untrack,
  type Accessor,
  type JSX,
  type Setter,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { getPartDataAttributes } from "../metadata/index";

export type ControllableSignalOptions<T> = {
  value?: Accessor<T | undefined>;
  defaultValue: T | (() => T);
  onChange?: (value: T) => void;
};

export function createControllableSignal<T>(
  options: ControllableSignalOptions<T>,
): [get: Accessor<T>, set: (value: T | ((previous: T) => T)) => T] {
  const [uncontrolled, setUncontrolled] = createSignal<T>(resolveDefault(options.defaultValue));
  const isControlled = createMemo(() => options.value?.() !== undefined);
  const get = createMemo(() => (isControlled() ? (options.value?.() as T) : uncontrolled()));

  const set = (value: T | ((previous: T) => T)) => {
    return untrack(() => {
      const next = resolveNext(value, get());

      if (Object.is(next, get())) {
        return next;
      }

      if (!isControlled()) {
        (setUncontrolled as Setter<T>)(() => next);
      }

      options.onChange?.(next);
      return next;
    });
  };

  return [get, set];
}

export function createControllableBooleanSignal(
  options: ControllableSignalOptions<boolean>,
): [get: Accessor<boolean>, set: (value: boolean | ((previous: boolean) => boolean)) => boolean] {
  const [value, setValue] = createControllableSignal(options);

  return [value, setValue];
}

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

export function createStableId(part: string, id?: Accessor<string | undefined>): Accessor<string> {
  const fallback = `keystone-${part}-${createUniqueId()}`;

  return createMemo(() => id?.() ?? fallback);
}

export function dataBoolean(value: boolean | undefined): "" | undefined {
  return value ? "" : undefined;
}

export function partDataAttributes(scope: string, part: string): Record<string, string> {
  return getPartDataAttributes(scope, part);
}

export type KeystoneAs<Props> =
  | ValidComponent
  | keyof JSX.HTMLElementTags
  | ((props: Props) => JSX.Element);

export type PolymorphicProps<T extends HTMLElement = HTMLElement> = {
  as?: KeystoneAs<JSX.HTMLAttributes<T>>;
};

export function renderPolymorphic<Props extends Record<string, unknown>>(
  as: KeystoneAs<Props> | undefined,
  fallback: keyof JSX.HTMLElementTags,
  props: Props,
): JSX.Element {
  if (typeof as === "function") {
    return as(props);
  }

  return createComponent(Dynamic, { component: as ?? fallback, ...props });
}

function resolveDefault<T>(value: T | (() => T)): T {
  return typeof value === "function" ? (value as () => T)() : value;
}

function resolveNext<T>(value: T | ((previous: T) => T), previous: T): T;
function resolveNext<T>(value: T | ((previous: T) => T), previous: T): T {
  return typeof value === "function" ? (value as (previous: T) => T)(previous) : value;
}
