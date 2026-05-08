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
  name: string;
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

async function publicItem(item: RegistryItem): Promise<RegistryItem> {
  const files = await Promise.all((item.files ?? []).map((file) => withContent(file)));
  const publicMetadata = stripInternalMetadata(item);
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
  const publicItems = await Promise.all(items.map((item) => publicItem(item)));

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
