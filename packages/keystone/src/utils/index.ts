import {
  createComponent,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  untrack,
  type Accessor,
  type JSX,
  type Setter,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { getPartDataAttributes } from "../metadata/index";

export type KeystoneChangeDetail<Reason extends string = string> = {
  event?: Event;
  reason: Reason;
};

export type ControllableSignalOptions<T, Detail = undefined> = {
  defaultDetail?: Detail;
  value?: Accessor<T | undefined>;
  defaultValue: T | (() => T);
  isControlled?: Accessor<boolean | undefined>;
  onChange?: (value: T, detail: Detail) => void;
};

export type ControllableSignalSetter<T, Detail = undefined> = (
  value: T | ((previous: T) => T),
  detail?: Detail,
) => T;

export function createControllableSignal<T, Detail = undefined>(
  options: ControllableSignalOptions<T, Detail>,
): [get: Accessor<T>, set: ControllableSignalSetter<T, Detail>] {
  const [uncontrolled, setUncontrolled] = createSignal<T>(resolveDefault(options.defaultValue));
  const isControlled = createMemo(
    () => options.isControlled?.() ?? options.value?.() !== undefined,
  );
  const get = createMemo(() => (isControlled() ? (options.value?.() as T) : uncontrolled()));

  const set: ControllableSignalSetter<T, Detail> = (value, detail = options.defaultDetail) => {
    return untrack(() => {
      const previous = get();
      const next = resolveNext(value, previous);

      if (Object.is(next, previous)) {
        return next;
      }

      if (!isControlled()) {
        (setUncontrolled as Setter<T>)(() => next);
      }

      options.onChange?.(next, detail as Detail);
      return next;
    });
  };

  return [get, set];
}

export function createControllableBooleanSignal(
  options: ControllableSignalOptions<boolean, undefined>,
): [get: Accessor<boolean>, set: ControllableSignalSetter<boolean, undefined>];
export function createControllableBooleanSignal<Detail>(
  options: ControllableSignalOptions<boolean, Detail>,
): [get: Accessor<boolean>, set: ControllableSignalSetter<boolean, Detail>];
export function createControllableBooleanSignal<Detail>(
  options: ControllableSignalOptions<boolean, Detail>,
): [get: Accessor<boolean>, set: ControllableSignalSetter<boolean, Detail>] {
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

export type RegisteredIdsApi = {
  ids: Accessor<readonly string[]>;
  register: (id?: Accessor<string | undefined>) => () => void;
};

export function createKeystoneId(
  part: string,
  id?: Accessor<string | undefined>,
): Accessor<string> {
  const fallback = `keystone-${part}-${createUniqueId()}`;

  return createMemo(() => id?.() ?? fallback);
}

export const createStableId = createKeystoneId;

export function createRegisteredIds(defaultId?: Accessor<string | undefined>): RegisteredIdsApi {
  const [registeredIds, setRegisteredIds] = createSignal<readonly Accessor<string | undefined>[]>(
    defaultId ? [defaultId] : [],
  );

  const register = (id?: Accessor<string | undefined>) => {
    if (!id) {
      return () => {};
    }

    setRegisteredIds((current) => [...current.filter((candidate) => candidate !== id), id]);

    let active = true;
    const unregister = () => {
      if (!active) {
        return;
      }

      active = false;
      setRegisteredIds((current) => current.filter((candidate) => candidate !== id));
    };

    onCleanup(unregister);
    return unregister;
  };

  const ids = createMemo(() => {
    const seen = new Set<string>();
    const next: string[] = [];

    for (const id of registeredIds()) {
      const value = id();

      if (value && !seen.has(value)) {
        seen.add(value);
        next.push(value);
      }
    }

    return next;
  });

  return { ids, register };
}

export function mergeIds(...ids: Array<string | undefined | null | false>): string | undefined {
  const next = ids.filter(Boolean) as string[];

  return next.length > 0 ? next.join(" ") : undefined;
}

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

export type DataBooleanAttribute = "" | undefined;
export type DataOpenClosedState = "open" | "closed";
export type DataCheckedState = "checked" | "unchecked";
export type DataSelectionState = DataCheckedState | "indeterminate";

export function dataBoolean(value: boolean | null | undefined): DataBooleanAttribute {
  return value ? "" : undefined;
}

export function getOpenClosedState(open: boolean): DataOpenClosedState {
  return open ? "open" : "closed";
}

export function getCheckedState(checked: boolean): DataCheckedState {
  return checked ? "checked" : "unchecked";
}

export function getSelectionState(checked: boolean | "indeterminate"): DataSelectionState {
  if (checked === "indeterminate") return "indeterminate";
  return getCheckedState(checked);
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
    return createComponent(as as (props: Props) => JSX.Element, props);
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
