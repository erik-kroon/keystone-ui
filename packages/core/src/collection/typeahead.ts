import { createSignal, onCleanup, type Accessor } from "solid-js";
import type { CollectionItem } from "./collection-registry";
import { isCollectionItemEnabled, isCollectionItemHidden } from "./keyboard-delegate";

export type TypeaheadOptions<T extends CollectionItem> = {
  collator?: Intl.Collator;
  items: Accessor<readonly T[]>;
  locale?: Accessor<string | undefined>;
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
  let searchValue = "";
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const reset = () => {
    searchValue = "";
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

      if (event.key === " " && searchValue.trim().length > 0) {
        event.preventDefault();
        event.stopPropagation();
      }

      const nextSearch = normalizeTypeaheadSearch(
        searchValue,
        event.key,
        options.items(),
        options.locale?.(),
      );
      const match = findTypeaheadMatch({
        collator: options.collator,
        current: options.current?.(),
        items: options.items(),
        locale: options.locale?.(),
        search: nextSearch,
      });

      searchValue = nextSearch;
      setSearch(searchValue);
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

function normalizeTypeaheadSearch<T extends CollectionItem>(
  currentSearch: string,
  key: string,
  items: readonly T[],
  locale?: string,
) {
  const nextSearch = currentSearch + key;
  const isRepeatedSearch = Array.from(nextSearch).every((character) => character === key);

  if (!isRepeatedSearch) {
    return nextSearch;
  }

  const hasRepeatedPrefixMatch = items
    .filter(isCollectionItemEnabled)
    .some((item) =>
      startsWithTypeahead(
        normalizeTypeaheadText(item.label, locale),
        normalizeTypeaheadSearchText(nextSearch, locale),
        undefined,
      ),
    );

  return hasRepeatedPrefixMatch ? nextSearch : key;
}

function findTypeaheadMatch<T extends CollectionItem>(options: {
  collator?: Intl.Collator;
  current: string | undefined;
  items: readonly T[];
  locale?: string;
  search: string;
}): T | undefined {
  const { current, items, search } = options;

  if (items.length === 0) {
    return undefined;
  }

  const startIndex = items.findIndex((item) => item.value === current);
  const normalizedStartIndex = startIndex === -1 ? 0 : (startIndex + 1) % items.length;
  const normalizedSearch = normalizeTypeaheadSearchText(search, options.locale);

  for (let offset = 0; offset < items.length; offset += 1) {
    const index = (normalizedStartIndex + offset) % items.length;
    const item = items[index];
    const label = normalizeTypeaheadText(item?.label, options.locale);

    if (
      item &&
      !item.disabled &&
      !isCollectionItemHidden(item) &&
      startsWithTypeahead(label, normalizedSearch, options.collator)
    ) {
      return item;
    }
  }

  return undefined;
}

function normalizeTypeaheadText(value: string | undefined, locale: string | undefined) {
  if (!value) {
    return "";
  }

  return locale ? value.trim().toLocaleLowerCase(locale) : value.trim().toLocaleLowerCase();
}

function normalizeTypeaheadSearchText(value: string, locale: string | undefined) {
  return locale ? value.toLocaleLowerCase(locale) : value.toLocaleLowerCase();
}

function startsWithTypeahead(value: string, search: string, collator: Intl.Collator | undefined) {
  if (!search) {
    return false;
  }

  const candidate = value.slice(0, Array.from(search).length);
  return collator ? collator.compare(candidate, search) === 0 : candidate === search;
}
