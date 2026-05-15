import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

type RegistryIndex = {
  homepage: string;
  items: readonly { name: string }[];
  name: string;
};

type RegistryFile = {
  content?: string;
  path: string;
  target?: string;
  type: string;
};

type RegistryItem = {
  $schema?: string;
  description?: string;
  files?: readonly RegistryFile[];
  meta?: {
    maturity?: string;
  };
  name: string;
  registryDependencies?: readonly string[];
  title?: string;
  type: string;
  [key: string]: unknown;
};

const repoRoot = path.resolve(import.meta.dir, "..");
const registryIndexPath = path.join(repoRoot, "registry/default/registry.json");
const registryItemsRoot = path.join(repoRoot, "registry/default/items");
const outputRoot = path.join(repoRoot, "apps/web/public/r");
const shadcnRegistrySchema = "https://ui.shadcn.com/schema/registry.json";
const shadcnItemSchema = "https://ui.shadcn.com/schema/registry-item.json";
const registryBaseUrl = process.env.KEYSTONE_REGISTRY_BASE_URL;
const unpublishedPackageDependencies = new Set(["@keystone-ui/core"]);

function shadcnType(type: string) {
  return type === "registry:template" ? "registry:item" : type;
}

function inferTarget(file: RegistryFile) {
  if (file.target) return file.target;

  const sourcePrefix = "packages/ui/src/";
  if (!file.path.startsWith(sourcePrefix)) return undefined;

  const relativePath = file.path.slice(sourcePrefix.length);
  if (relativePath.startsWith("components/data-table/")) {
    return `@components/${relativePath.slice("components/".length)}`;
  }
  if (relativePath.startsWith("components/")) {
    return `@ui/${relativePath.slice("components/".length)}`;
  }
  if (relativePath.startsWith("lib/")) return `@lib/${relativePath.slice("lib/".length)}`;
  if (relativePath.startsWith("hooks/")) return `@hooks/${relativePath.slice("hooks/".length)}`;
  if (relativePath.startsWith("blocks/")) {
    return `@components/blocks/${relativePath.slice("blocks/".length)}`;
  }
  if (relativePath.startsWith("stores/")) {
    return `@components/stores/${relativePath.slice("stores/".length)}`;
  }

  const templatePrefix = "templates/tanstack-start-dashboard/";
  if (relativePath.startsWith(templatePrefix)) {
    return `~/${relativePath.slice(templatePrefix.length)}`;
  }

  return undefined;
}

function publicPath(file: RegistryFile) {
  const target = inferTarget(file);
  if (!target) return file.path;

  if (target.startsWith("@ui/")) return `components/ui/${target.slice("@ui/".length)}`;
  if (target.startsWith("@lib/")) return `lib/${target.slice("@lib/".length)}`;
  if (target.startsWith("@hooks/")) return `hooks/${target.slice("@hooks/".length)}`;
  if (target.startsWith("@components/")) {
    return `components/${target.slice("@components/".length)}`;
  }
  if (target.startsWith("~/")) return target.slice("~/".length);

  return target;
}

function stripInternalMetadata(item: RegistryItem): RegistryItem {
  const next = structuredClone(item) as RegistryItem;
  const meta = next.meta;

  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    delete (meta as Record<string, unknown>).sourceFiles;
  }

  return next;
}

function registryItemUrl(baseUrl: string, name: string) {
  return `${baseUrl.replace(/\/$/, "")}/r/${name}.json`;
}

function publicRegistryDependency(
  dependency: string,
  itemByName: ReadonlyMap<string, RegistryItem>,
  baseUrl: string,
) {
  if (dependency.startsWith("http://") || dependency.startsWith("https://")) return dependency;
  if (dependency.startsWith("@")) return dependency;
  if (itemByName.has(dependency)) return registryItemUrl(baseUrl, dependency);

  return dependency;
}

function withPublicRegistryDependencies(
  item: RegistryItem,
  itemByName: ReadonlyMap<string, RegistryItem>,
  baseUrl: string,
) {
  const meta = item.meta && typeof item.meta === "object" ? item.meta : undefined;
  const install = `shadcn add ${registryItemUrl(baseUrl, item.name)}`;

  return {
    ...item,
    ...(meta ? { meta: { ...meta, install } } : {}),
    ...(item.registryDependencies
      ? {
          registryDependencies: item.registryDependencies.map((dependency) =>
            publicRegistryDependency(dependency, itemByName, baseUrl),
          ),
        }
      : {}),
  };
}

function withoutUnpublishedPackageDependencies(item: RegistryItem) {
  if (!item.dependencies) return item;

  return {
    ...item,
    dependencies: (item.dependencies as readonly string[]).filter((dependency) => {
      const packageName = dependency.startsWith("@")
        ? dependency.split("@", 3).slice(0, 2).join("@")
        : dependency.split("@", 1)[0];

      return !unpublishedPackageDependencies.has(packageName);
    }),
  };
}

async function withContent(file: RegistryFile): Promise<RegistryFile> {
  const absolutePath = path.join(repoRoot, file.path);
  const content = await readFile(absolutePath, "utf8");
  return {
    path: publicPath(file),
    content,
    type: shadcnType(file.type),
    ...(inferTarget(file) ? { target: inferTarget(file) } : {}),
  };
}

async function readItem(name: string): Promise<RegistryItem> {
  return JSON.parse(
    await readFile(path.join(registryItemsRoot, `${name}.json`), "utf8"),
  ) as RegistryItem;
}

async function publicItem(
  item: RegistryItem,
  itemByName: ReadonlyMap<string, RegistryItem>,
  baseUrl: string,
): Promise<RegistryItem> {
  const files = await Promise.all((item.files ?? []).map((file) => withContent(file)));
  const publicMetadata = withoutUnpublishedPackageDependencies(
    withPublicRegistryDependencies(stripInternalMetadata(item), itemByName, baseUrl),
  );
  return {
    ...publicMetadata,
    $schema: shadcnItemSchema,
    type: shadcnType(item.type),
    files,
  };
}

async function main() {
  const registry = JSON.parse(await readFile(registryIndexPath, "utf8")) as RegistryIndex;
  const items = await Promise.all(registry.items.map((item) => readItem(item.name)));
  const itemByName = new Map(items.map((item) => [item.name, item]));
  const publicSourceItems = publicRegistryItems(items);
  const publicBaseUrl = registryBaseUrl ?? registry.homepage;
  const publicItems = await Promise.all(
    publicSourceItems.map((item) => publicItem(item, itemByName, publicBaseUrl)),
  );

  await rm(outputRoot, { force: true, recursive: true });
  await mkdir(outputRoot, { recursive: true });

  await writeFile(
    path.join(outputRoot, "registry.json"),
    `${JSON.stringify(
      {
        $schema: shadcnRegistrySchema,
        name: registry.name,
        homepage: registry.homepage,
        items: publicItems.map(({ files: _files, ...item }) => item),
      },
      null,
      2,
    )}\n`,
  );

  await Promise.all(
    publicItems.map((item) =>
      writeFile(path.join(outputRoot, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`),
    ),
  );
}

await main();

function publicRegistryItems(items: readonly RegistryItem[]) {
  const itemByName = new Map(items.map((item) => [item.name, item]));
  const hiddenNames = new Set(
    items
      .filter((item) => item.meta?.maturity?.toLowerCase() === "experimental")
      .map((item) => item.name),
  );

  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      if (hiddenNames.has(item.name)) continue;

      const hasHiddenRegistryDependency = (item.registryDependencies ?? []).some((dependency) =>
        hiddenNames.has(dependency),
      );
      const hasMissingRegistryDependency = (item.registryDependencies ?? []).some(
        (dependency) => !itemByName.has(dependency),
      );

      if (hasHiddenRegistryDependency || hasMissingRegistryDependency) {
        hiddenNames.add(item.name);
        changed = true;
      }
    }
  }

  return items.filter((item) => !hiddenNames.has(item.name));
}
