import {
  createComponent,
  createMemo,
  createSelector,
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
  return {
    "data-scope": scope,
    "data-part": part,
  };
}

export type CollectionItem = {
  disabled?: boolean;
  element?: Accessor<HTMLElement | undefined>;
  label?: string;
  value: string;
};

export type CollectionRegistration<T extends CollectionItem> = T & {
  index?: number;
};

export type CollectionApi<T extends CollectionItem> = {
  items: Accessor<readonly T[]>;
  registerItem: (item: CollectionRegistration<T>) => () => void;
};

export function createCollection<T extends CollectionItem>(): CollectionApi<T> {
  const [items, setItems] = createSignal<Array<T>>([], { equals: false });
  const currentItems: Array<T> = [];
  let order = 0;
  let needsOrderedSort = false;
  const fallbackOrder = new Map<string, number>();

  const registerItem = (item: CollectionRegistration<T>) => {
    const registrationOrder = item.index ?? order++;
    fallbackOrder.set(item.value, registrationOrder);
    const nextItem = item as T;
    const existingIndex = currentItems.findIndex((candidate) => candidate.value === nextItem.value);
    needsOrderedSort ||= item.index !== undefined || item.element !== undefined;

    if (existingIndex === -1) {
      currentItems.push(nextItem);
    } else {
      currentItems[existingIndex] = nextItem;
    }

    if (needsOrderedSort) {
      currentItems.sort((a, b) => sortCollectionItemOrder(a, b, fallbackOrder));
    }

    setItems(currentItems);

    const cleanup = () => {
      fallbackOrder.delete(nextItem.value);
      const index = currentItems.findIndex((candidate) => candidate.value === nextItem.value);

      if (index !== -1) {
        currentItems.splice(index, 1);
        setItems(currentItems);
      }
    };

    onCleanup(cleanup);
    return cleanup;
  };

  return {
    items: () => items(),
    registerItem,
  };
}

export type CollectionNavigationOptions<T extends CollectionItem> = {
  current?: string;
  items: readonly T[];
  loop?: boolean;
};

export function firstEnabledItem<T extends CollectionItem>(items: readonly T[]): T | undefined {
  return items.find((item) => !item.disabled);
}

export function lastEnabledItem<T extends CollectionItem>(items: readonly T[]): T | undefined {
  return items.findLast((item) => !item.disabled);
}

export function nextEnabledItem<T extends CollectionItem>(
  options: CollectionNavigationOptions<T> & { direction: 1 | -1 },
): T | undefined {
  const enabled = options.items.filter((item) => !item.disabled);

  if (enabled.length === 0) {
    return undefined;
  }

  const currentIndex = enabled.findIndex((item) => item.value === options.current);
  const fallbackIndex = options.direction === 1 ? 0 : enabled.length - 1;

  if (currentIndex === -1) {
    return enabled[fallbackIndex];
  }

  const nextIndex = currentIndex + options.direction;

  if (nextIndex < 0 || nextIndex >= enabled.length) {
    return options.loop === false
      ? undefined
      : enabled[(nextIndex + enabled.length) % enabled.length];
  }

  return enabled[nextIndex];
}

export type TypeaheadOptions<T extends CollectionItem> = {
  items: Accessor<readonly T[]>;
  current?: Accessor<string | undefined>;
  onMatch: (item: T, event: KeyboardEvent) => void;
  resetMs?: number;
};

export type TypeaheadApi = {
  handleKeyDown: (event: KeyboardEvent) => boolean;
  isTyping: Accessor<boolean>;
  reset: () => void;
};

export function createTypeahead<T extends CollectionItem>(
  options: TypeaheadOptions<T>,
): TypeaheadApi {
  const [search, setSearch] = createSignal("");
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const reset = () => {
    setSearch("");
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  const queueReset = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(reset, options.resetMs ?? 750);
  };

  onCleanup(reset);

  return {
    handleKeyDown: (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
        return false;
      }

      if (event.key === " " && search().trim().length > 0) {
        event.preventDefault();
        event.stopPropagation();
      }

      const nextSearch = normalizeTypeaheadSearch(search(), event.key, options.items());
      const match = findTypeaheadMatch(options.items(), nextSearch, options.current?.());

      setSearch(nextSearch);
      queueReset();

      if (!match) {
        return false;
      }

      options.onMatch(match, event);
      return true;
    },
    isTyping: () => search().length > 0,
    reset,
  };
}

export type ListInteractionNavigationIntent =
  | "first"
  | "last"
  | "next"
  | "previous"
  | "selected-or-first";

export type ListInteractionKernelOptions<T extends CollectionItem, Detail> = {
  defaultValue?: string;
  loop?: boolean;
  onSelectionChange?: (value: string | undefined, detail: Detail) => void;
  onValueSelect?: (item: T, detail: Detail) => void;
  programmaticDetail: Detail;
  typeaheadResetMs?: number;
  value?: Accessor<string | undefined>;
};

export type ListInteractionKeyboardOptions<Detail> = {
  selectDetail: (event: KeyboardEvent) => Detail;
};

export type ListInteractionKernelApi<T extends CollectionItem, Detail> = {
  highlightedItem: Accessor<T | undefined>;
  highlightedValue: Accessor<string | undefined>;
  handleKeyDown: (event: KeyboardEvent, options: ListInteractionKeyboardOptions<Detail>) => boolean;
  highlight: (intent: ListInteractionNavigationIntent) => T | undefined;
  isHighlighted: (value: string) => boolean;
  isSelected: (value: string) => boolean;
  items: Accessor<readonly T[]>;
  registerItem: (item: CollectionRegistration<T>) => () => void;
  selectHighlighted: (detail: Detail) => T | undefined;
  setValue: (value: string | undefined, detail: Detail) => T | undefined;
  selectValue: (value: string, detail: Detail) => T | undefined;
  selectedItem: Accessor<T | undefined>;
  setHighlightedValue: (value: string | undefined) => void;
  value: Accessor<string | undefined>;
};

export function createListInteractionKernel<T extends CollectionItem, Detail>(
  options: ListInteractionKernelOptions<T, Detail>,
): ListInteractionKernelApi<T, Detail> {
  const collection = createCollection<T>();
  const itemList = collection.items;
  const itemByValueMap = createMemo(() => {
    const map = new Map<string, T>();

    for (const item of itemList()) {
      map.set(item.value, item);
    }

    return map;
  });
  const enabledItems = createMemo(() => itemList().filter((item) => !item.disabled));
  let lastSelectionDetail = options.programmaticDetail;
  const [highlightedValue, setHighlightedValue] = createControllableSignal<string | undefined>({
    defaultValue: undefined,
  });
  const [value, setValue] = createControllableSignal<string | undefined>({
    value: options.value,
    defaultValue: options.defaultValue,
    onChange: (next) => options.onSelectionChange?.(next, lastSelectionDetail),
  });
  const isHighlighted = createSelector(highlightedValue);
  const isSelected = createSelector(value);
  const itemByValue = (candidateValue: string | undefined) =>
    candidateValue === undefined ? undefined : itemByValueMap().get(candidateValue);
  const selectedItem = createMemo(() => itemByValue(value()));
  const highlightedItem = createMemo(() => itemByValue(highlightedValue()));
  const typeahead = createTypeahead({
    current: highlightedValue,
    items: itemList,
    onMatch: (item) => setHighlightedValue(item.value),
    resetMs: options.typeaheadResetMs,
  });

  const highlightItem = (item: T | undefined) => {
    setHighlightedValue(item?.value);
    return item;
  };

  const highlight = (intent: ListInteractionNavigationIntent) => {
    if (intent === "first") {
      return highlightItem(firstEnabledItem(enabledItems()));
    }

    if (intent === "last") {
      return highlightItem(lastEnabledItem(enabledItems()));
    }

    if (intent === "selected-or-first") {
      const selected = selectedItem();
      return highlightItem(
        selected && !selected.disabled ? selected : firstEnabledItem(enabledItems()),
      );
    }

    return highlightItem(
      nextEnabledFromEnabledItems({
        current: highlightedValue(),
        direction: intent === "next" ? 1 : -1,
        items: enabledItems(),
        loop: options.loop,
      }),
    );
  };

  const selectValue = (next: string, detail: Detail) => {
    const item = itemByValue(next);

    if (!item || item.disabled) {
      return undefined;
    }

    lastSelectionDetail = detail;
    setValue(next);
    options.onValueSelect?.(item, detail);
    return item;
  };

  const setSelectionValue = (next: string | undefined, detail: Detail) => {
    lastSelectionDetail = detail;
    setValue(next);
    return itemByValue(next);
  };

  const selectHighlighted = (detail: Detail) => {
    const highlighted = highlightedValue();
    return highlighted ? selectValue(highlighted, detail) : undefined;
  };

  return {
    highlightedItem,
    highlightedValue,
    handleKeyDown: (event, keyboardOptions) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        highlight("next");
        return true;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        highlight("previous");
        return true;
      }

      if (event.key === "Home") {
        event.preventDefault();
        highlight("first");
        return true;
      }

      if (event.key === "End") {
        event.preventDefault();
        highlight("last");
        return true;
      }

      if (event.key === "Enter" || event.key === " ") {
        if (event.key === " " && typeahead.isTyping()) {
          return typeahead.handleKeyDown(event);
        }

        event.preventDefault();
        selectHighlighted(keyboardOptions.selectDetail(event));
        return true;
      }

      return typeahead.handleKeyDown(event);
    },
    highlight,
    isHighlighted,
    isSelected,
    items: itemList,
    registerItem: collection.registerItem,
    selectHighlighted,
    setValue: setSelectionValue,
    selectValue,
    selectedItem,
    setHighlightedValue,
    value,
  };
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

function sortCollectionItemOrder<T extends CollectionItem>(
  a: T,
  b: T,
  fallbackOrder: Map<string, number>,
): number {
  const elementOrder = compareElements(a.element?.(), b.element?.());

  if (elementOrder !== 0) {
    return elementOrder;
  }

  return (fallbackOrder.get(a.value) ?? 0) - (fallbackOrder.get(b.value) ?? 0);
}

function compareElements(a: HTMLElement | undefined, b: HTMLElement | undefined) {
  if (!a || !b || a === b) {
    return 0;
  }

  const position = a.compareDocumentPosition(b);

  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1;
  }

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1;
  }

  return 0;
}

function normalizeTypeaheadSearch<T extends CollectionItem>(
  currentSearch: string,
  key: string,
  items: readonly T[],
) {
  const repeatedCharacter = currentSearch.length === 1 && currentSearch === key;
  const canCycleRepeatedCharacter = items.every((item) => {
    const normalized = item.label?.trim().toLocaleLowerCase();
    return !normalized || normalized[0] !== normalized[1];
  });

  return repeatedCharacter && canCycleRepeatedCharacter ? key : currentSearch + key;
}

function findTypeaheadMatch<T extends CollectionItem>(
  items: readonly T[],
  search: string,
  current: string | undefined,
): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  const startIndex = items.findIndex((item) => item.value === current);
  const normalizedStartIndex = startIndex === -1 ? 0 : (startIndex + 1) % items.length;
  const normalizedSearch = search.toLocaleLowerCase();

  for (let offset = 0; offset < items.length; offset += 1) {
    const index = (normalizedStartIndex + offset) % items.length;
    const item = items[index];
    const label = item?.label?.trim().toLocaleLowerCase();

    if (item && !item.disabled && label?.startsWith(normalizedSearch)) {
      return item;
    }
  }

  return undefined;
}

function nextEnabledFromEnabledItems<T extends CollectionItem>(
  options: CollectionNavigationOptions<T> & { direction: 1 | -1 },
): T | undefined {
  if (options.items.length === 0) {
    return undefined;
  }

  const currentIndex = options.items.findIndex((item) => item.value === options.current);
  const fallbackIndex = options.direction === 1 ? 0 : options.items.length - 1;

  if (currentIndex === -1) {
    return options.items[fallbackIndex];
  }

  const nextIndex = currentIndex + options.direction;

  if (nextIndex < 0 || nextIndex >= options.items.length) {
    return options.loop === false
      ? undefined
      : options.items[(nextIndex + options.items.length) % options.items.length];
  }

  return options.items[nextIndex];
}
