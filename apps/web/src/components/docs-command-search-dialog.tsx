import { Command } from "@keystone-ui/core/command";
import { Dialog } from "@keystone-ui/core/dialog";
import { useNavigate } from "@tanstack/solid-router";
import { Braces, FileText, Package, Search } from "lucide-solid";
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
  type JSX,
} from "solid-js";

import type {
  componentHref,
  navGroups,
  searchableComponentDocs,
  searchableHookDocs,
} from "@/lib/docs-data";
import { docsItemTitle as getDocsItemTitle } from "@/lib/docs-data";

type DocsCommandSearchDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

type DocsSearchData = {
  componentDocs: typeof searchableComponentDocs;
  componentHref: typeof componentHref;
  hookDocs: typeof searchableHookDocs;
  navGroups: typeof navGroups;
};

type SearchItem = {
  description: string;
  group: string;
  href: string;
  icon: "component" | "hook" | "overview";
  keywords: readonly string[];
  label: string;
  value: string;
};

type SearchGroup = {
  items: readonly SearchItem[];
  label: string;
};

type SearchFieldWeight = "primary" | "secondary";

type SearchField = {
  value: string;
  weight: SearchFieldWeight;
};

const iconClass = "size-4 text-muted-foreground/80";
let docsSearchDataPromise: Promise<DocsSearchData> | undefined;

export function DocsCommandSearchDialog(props: Readonly<DocsCommandSearchDialogProps>) {
  const navigate = useNavigate();
  const [query, setQuery] = createSignal("");
  let inputRef: HTMLInputElement | undefined;
  const [searchData] = createResource(
    () => props.open,
    (open) => (open ? loadDocsSearchData() : undefined),
  );
  const items = createMemo<SearchItem[]>(() => {
    const data = searchData();
    return data ? createSearchItems(data) : [];
  });
  const visibleItems = createMemo(() => filterItems(items(), query()));
  const groups = createMemo(() => groupItems(visibleItems()));

  const close = () => {
    props.onOpenChange(false);
    queueMicrotask(() => setQuery(""));
  };

  const selectItem = (value: string | undefined) => {
    const item = items().find((candidate) => candidate.value === value);
    if (!item) return;

    close();
    const [to, hash] = item.href.split("#");
    void navigate({
      to: to || "/docs",
      hash: hash ?? "",
    });
  };

  createEffect(() => {
    if (!props.open) return;

    queueMicrotask(() => inputRef?.focus());
  });

  return (
    <Dialog.Root
      open={props.open}
      onOpenChange={(nextOpen) => {
        props.onOpenChange(nextOpen);
        if (!nextOpen) queueMicrotask(() => setQuery(""));
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop class="fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200" />
        <Dialog.Positioner class="fixed inset-0 z-50 flex flex-col items-center px-4 py-[max(1rem,4vh)] sm:py-[10vh]">
          <Dialog.Content class="relative flex max-h-105 min-h-0 w-full min-w-0 max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:bg-muted/72 before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
            <Dialog.Title class="sr-only">Search documentation</Dialog.Title>
            <Dialog.Description class="sr-only">
              Search Keystone documentation pages and registry items.
            </Dialog.Description>
            <Command.Root
              open
              class="flex min-h-0 flex-1 flex-col"
              inputValue={query()}
              onInputValueChange={(value) => setQuery(value)}
              onOpenChange={(nextOpen, detail) => {
                if (!nextOpen && detail.reason === "escape") {
                  close();
                }
              }}
              onValueChange={(value) => selectItem(value)}
            >
              <div class="relative px-2.5 py-1.5">
                <Search
                  class="pointer-events-none absolute top-[calc(50%+1px)] left-5 z-10 size-5 -translate-y-1/2 text-foreground/72 sm:size-4.5"
                  aria-hidden="true"
                />
                <Command.Input
                  autofocus
                  ref={(element) => {
                    inputRef = element;
                  }}
                  class="h-9.5 w-full min-w-0 appearance-none border-0 bg-transparent ps-9 pe-3 text-base text-foreground leading-none shadow-none outline-none ring-0 transition-colors placeholder:text-muted-foreground/72 focus-visible:outline-none focus-visible:ring-0 sm:h-8.5 sm:text-sm [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                  placeholder="Search documentation..."
                  type="search"
                />
              </div>
              <div class="relative -mx-px min-h-0 flex-1 border border-border bg-popover bg-clip-padding shadow-xs/5 [clip-path:inset(0_1px_1px_1px)]">
                <Command.Listbox class="h-full max-h-[min(22rem,calc(100svh-12rem))] min-h-0 overflow-y-auto p-2 scroll-py-2">
                  <Show
                    when={searchData()}
                    fallback={
                      <div class="px-2 py-12 text-center text-muted-foreground text-sm">
                        Loading documentation...
                      </div>
                    }
                  >
                    <Show
                      when={visibleItems().length > 0}
                      fallback={
                        <div class="px-2 py-12 text-center text-muted-foreground text-sm">
                          No documentation found.
                        </div>
                      }
                    >
                      <For each={groups()}>
                        {(group) => (
                          <Command.Group
                            value={group.label}
                            label={group.label}
                            class="mt-2 first:mt-0"
                          >
                            <Command.GroupLabel class="px-2 py-1.5 font-medium text-muted-foreground text-xs">
                              {group.label}
                            </Command.GroupLabel>
                            <For each={group.items}>
                              {(item) => (
                                <Command.Item
                                  class="grid min-h-10 cursor-default select-none grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-md px-2 py-1.5 text-foreground text-sm outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64"
                                  group={group.label}
                                  label={item.label}
                                  value={item.value}
                                >
                                  <span class="flex size-8 items-center justify-center rounded-md border border-border bg-muted text-primary">
                                    <SearchItemIcon icon={item.icon} />
                                  </span>
                                  <Command.ItemText class="flex min-w-0 flex-col gap-0.5">
                                    <span class="truncate">{item.label}</span>
                                    <span class="truncate text-muted-foreground/72 text-xs">
                                      {item.description}
                                    </span>
                                  </Command.ItemText>
                                </Command.Item>
                              )}
                            </For>
                          </Command.Group>
                        )}
                      </For>
                    </Show>
                  </Show>
                </Command.Listbox>
              </div>
            </Command.Root>
            <div class="flex items-center justify-between gap-2 border-border border-t px-5 py-3 text-muted-foreground text-xs">
              <span>Go to Page</span>
              <span class="flex items-center gap-2">
                <Key>↑↓</Key>
                <span>Navigate</span>
                <Key>↵</Key>
                <span>Open</span>
                <Key>Esc</Key>
              </span>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function loadDocsSearchData() {
  docsSearchDataPromise ??= import("@/lib/docs-data").then(
    ({ componentHref, navGroups, searchableComponentDocs, searchableHookDocs }) => ({
      componentDocs: searchableComponentDocs,
      componentHref,
      hookDocs: searchableHookDocs,
      navGroups,
    }),
  );
  return docsSearchDataPromise;
}

function Key(props: { children: JSX.Element }) {
  return (
    <kbd class="inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1.5 font-medium text-[0.6875rem] text-muted-foreground">
      {props.children}
    </kbd>
  );
}

function SearchItemIcon(props: { icon: SearchItem["icon"] }) {
  switch (props.icon) {
    case "component":
      return <Package class={iconClass} />;
    case "hook":
      return <Braces class={iconClass} />;
    case "overview":
      return <FileText class={iconClass} />;
  }
}

function createSearchItems(data: DocsSearchData) {
  const overviewItems = data.navGroups[0]?.items ?? [];

  return [
    ...overviewItems.map((item) => ({
      description: item.href.includes("#") ? "Documentation section" : "Documentation home",
      group: "Overview",
      href: item.href,
      icon: "overview" as const,
      keywords: ["docs", "overview", item.label],
      label: item.label,
      value: item.href,
    })),
    ...data.componentDocs.map((item) => ({
      description: item.description,
      group: "Components",
      href: data.componentHref(item.name),
      icon: "component" as const,
      keywords: [item.name, item.type, ...item.categories, ...item.keywords],
      label: getDocsItemTitle(item),
      value: data.componentHref(item.name),
    })),
    ...data.hookDocs.map((item) => ({
      description: item.description,
      group: "Hooks",
      href: data.componentHref(item.name),
      icon: "hook" as const,
      keywords: [item.name, item.type, ...item.categories, ...item.keywords],
      label: item.title,
      value: data.componentHref(item.name),
    })),
  ] satisfies SearchItem[];
}

function filterItems(items: readonly SearchItem[], query: string) {
  const preparedQuery = prepareSearchQuery(query);
  if (!preparedQuery) return items.slice(0, 20);

  return items
    .map((item, index) => ({
      item,
      index,
      score: rankSearchFields(
        [
          { value: item.label, weight: "primary" },
          { value: item.href, weight: "primary" },
          { value: item.group, weight: "secondary" },
          ...item.keywords.map((keyword) => ({
            value: keyword,
            weight: "secondary" as const,
          })),
        ],
        preparedQuery,
      ),
    }))
    .filter(
      (match): match is { item: SearchItem; index: number; score: number } => match.score !== null,
    )
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, 30)
    .map((match) => match.item);
}

function prepareSearchQuery(query: string) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return null;

  return {
    compact: normalized.replaceAll(" ", ""),
    normalized,
    terms: normalized.split(" ").filter(Boolean),
  };
}

function rankSearchFields(
  fields: readonly SearchField[],
  query: NonNullable<ReturnType<typeof prepareSearchQuery>>,
) {
  let bestScore: number | null = null;
  const searchableFields = fields
    .map((field) => ({
      ...field,
      normalized: normalizeSearchText(field.value),
    }))
    .filter((field) => field.normalized);

  for (const field of searchableFields) {
    const score = rankSearchField(field.normalized, field.weight, query);
    if (score === null) continue;
    bestScore = bestScore === null ? score : Math.min(bestScore, score);
  }

  const allTermsMatch = query.terms.every((term) =>
    searchableFields.some((field) => field.normalized.includes(term)),
  );

  if (allTermsMatch) {
    const termScore = searchableFields.some((field) => field.weight === "primary") ? 24 : 32;
    bestScore = bestScore === null ? termScore : Math.min(bestScore, termScore);
  }

  return bestScore;
}

function rankSearchField(
  field: string,
  weight: SearchFieldWeight,
  query: NonNullable<ReturnType<typeof prepareSearchQuery>>,
) {
  const offset = weight === "primary" ? 0 : 12;
  const compactField = field.replaceAll(" ", "");
  const words = field.split(" ").filter(Boolean);
  const initials = words.map((word) => word[0]).join("");

  if (field === query.normalized || compactField === query.compact) return offset;
  if (field.startsWith(query.normalized) || compactField.startsWith(query.compact)) {
    return offset + 1;
  }
  if (field.includes(query.normalized) || compactField.includes(query.compact)) {
    return offset + 2;
  }
  if (initials.startsWith(query.compact)) return offset + 3;
  if (query.terms.every((term) => words.some((word) => word.startsWith(term)))) {
    return offset + 4;
  }
  if (query.terms.every((term) => words.some((word) => word.includes(term)))) {
    return offset + 5;
  }

  return null;
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/['’]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .toLocaleLowerCase();
}

function groupItems(items: readonly SearchItem[]) {
  const groups: SearchGroup[] = [];
  const byLabel = new Map<string, SearchGroup>();

  for (const item of items) {
    let group = byLabel.get(item.group);
    if (!group) {
      group = { label: item.group, items: [] };
      byLabel.set(item.group, group);
      groups.push(group);
    }
    group.items = [...group.items, item];
  }

  return groups;
}
