import { useNavigate } from "@tanstack/solid-router";
import { Braces, FileText, Package } from "lucide-solid";
import { createEffect, createMemo, createResource, Show, type JSX } from "solid-js";

import {
  CommandMenu,
  createCommandMenuStore,
  type CommandMenuItemData,
} from "@keystone-ui/ui/command-menu";
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

type SearchItem = CommandMenuItemData & {
  href: string;
};

const iconClass = "size-4 text-muted-foreground/80";
let docsSearchDataPromise: Promise<DocsSearchData> | undefined;

export function DocsCommandSearchDialog(props: Readonly<DocsCommandSearchDialogProps>) {
  const navigate = useNavigate();
  const commandStore = createCommandMenuStore({ open: props.open });
  const [searchData] = createResource(
    () => props.open,
    (open) => (open ? loadDocsSearchData() : undefined),
  );
  const items = createMemo<SearchItem[]>(() => {
    const data = searchData();
    return data ? createSearchItems(data) : [];
  });

  createEffect(() => {
    commandStore.setOpen(props.open);
    if (!props.open) commandStore.resetQuery();
  });

  const selectItem = (item: CommandMenuItemData) => {
    const selectedItem = item as SearchItem;
    props.onOpenChange(false);
    const [to, hash] = selectedItem.href.split("#");
    void navigate({
      to: to || "/docs",
      hash: hash ?? "",
    });
  };

  return (
    <CommandMenu
      empty={
        <Show when={searchData()} fallback="Loading documentation...">
          No documentation found.
        </Show>
      }
      footer={
        <>
          <span>Go to Page</span>
          <span class="flex items-center gap-2">
            <Key>↑↓</Key>
            <span>Navigate</span>
            <Key>↵</Key>
            <span>Open</span>
            <Key>Esc</Key>
          </span>
        </>
      }
      hotkeys={false}
      inputPlaceholder="Search documentation..."
      items={items()}
      maxItems={30}
      onOpenChange={(nextOpen) => props.onOpenChange(nextOpen)}
      onSelect={selectItem}
      store={commandStore}
    />
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

function SearchItemIcon(props: { icon: "component" | "hook" | "overview" }) {
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
      icon: <SearchItemIcon icon="overview" />,
      keywords: ["docs", "overview", item.label],
      label: item.label,
      value: item.href,
    })),
    ...data.componentDocs.map((item) => ({
      description: item.description,
      group: "Components",
      href: data.componentHref(item.name),
      icon: <SearchItemIcon icon="component" />,
      keywords: [item.name, item.type, ...item.categories, ...item.keywords],
      label: getDocsItemTitle(item),
      value: data.componentHref(item.name),
    })),
    ...data.hookDocs.map((item) => ({
      description: item.description,
      group: "Hooks",
      href: data.componentHref(item.name),
      icon: <SearchItemIcon icon="hook" />,
      keywords: [item.name, item.type, ...item.categories, ...item.keywords],
      label: item.title,
      value: data.componentHref(item.name),
    })),
  ] satisfies SearchItem[];
}
