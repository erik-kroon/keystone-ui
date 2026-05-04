import { createMemo, createSignal, untrack, type Accessor, type Setter } from "solid-js";

export type CoreChangeDetail<Reason extends string = string> = {
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

function resolveDefault<T>(value: T | (() => T)): T {
  return typeof value === "function" ? (value as () => T)() : value;
}

function resolveNext<T>(value: T | ((previous: T) => T), previous: T): T;
function resolveNext<T>(value: T | ((previous: T) => T), previous: T): T {
  return typeof value === "function" ? (value as (previous: T) => T)(previous) : value;
}
