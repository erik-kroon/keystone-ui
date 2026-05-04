import { defaultRegistryItems, defaultRegistrySourcePreviews } from "./default-registry-items.gen";

type RawRegistryFile = {
  path: string;
  type: string;
  target?: string;
};

type RawRegistryItem = {
  name: string;
  title: string;
  description: string;
  type: string;
  dependencies?: readonly string[];
  registryDependencies?: readonly string[];
  files: readonly RawRegistryFile[];
  meta: {
    install: string;
    customization?: string;
    limitations?: string;
    sourceFiles?: readonly string[];
    parity: Readonly<Record<string, string>>;
  };
};

export type RegistryFileContract = {
  path: string;
  type: string;
  target: string;
};

export type RegistryItemContract = {
  name: string;
  title: string;
  description: string;
  type: string;
  install: string;
  dependencies: readonly string[];
  registryDependencies: readonly string[];
  sourceFiles: readonly string[];
  sourcePreview: string;
  customization: string;
  caveats: string;
  files: readonly RegistryFileContract[];
  parity: Readonly<Record<string, string>>;
};

const rawItems = defaultRegistryItems as readonly RawRegistryItem[];

export const registryItemContracts = rawItems
  .map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    type: item.type,
    install: item.meta.install,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    sourceFiles: item.meta.sourceFiles ?? item.files.map((file) => `registry/default/${file.path}`),
    sourcePreview: createSourcePreview(
      item.name,
      item.meta.sourceFiles ?? item.files.map((file) => `registry/default/${file.path}`),
    ),
    customization: String(item.meta.customization ?? item.meta.limitations ?? ""),
    caveats: String(
      item.meta.limitations ??
        "Generated output is user-owned source. Mason may plan future diffs and updates, but app teams can edit the installed files.",
    ),
    files: item.files.map((file) => ({
      path: file.path,
      type: file.type,
      target: file.target ?? deriveTarget(file.path, file.type),
    })),
    parity: item.meta.parity,
  }))
  .sort((left, right) =>
    left.name.localeCompare(right.name),
  ) satisfies readonly RegistryItemContract[];

export function getRegistryItemContract(name: string): RegistryItemContract {
  const item = registryItemContracts.find((candidate) => candidate.name === name);

  if (!item) {
    throw new Error(`Missing registry docs contract for ${name}`);
  }

  return item;
}

function deriveTarget(sourcePath: string, type: string): string {
  if (type === "registry:block") {
    return sourcePath.replace(/^blocks\//, "src/components/blocks/");
  }

  if (type === "registry:lib") {
    return sourcePath.replace(/^lib\//, "src/lib/");
  }

  if (sourcePath.startsWith("components/")) {
    return `src/${sourcePath}`;
  }

  return sourcePath.replace(/^ui\//, "src/components/ui/");
}

function createSourcePreview(itemName: string, sourceFiles: readonly string[]): string {
  return sourceFiles
    .map((sourceFile) => {
      const source =
        defaultRegistrySourcePreviews[itemName as keyof typeof defaultRegistrySourcePreviews]?.[
          sourceFile
        ];
      return [`// ${sourceFile}`, source ?? ""].join("\n").trimEnd();
    })
    .join("\n\n");
}
