import path from "node:path";
import { z } from "zod";

export const registryItemTypes = [
  "registry:base",
  "registry:ui",
  "registry:component",
  "registry:block",
  "registry:font",
  "registry:hook",
  "registry:lib",
  "registry:theme",
  "registry:style",
  "registry:page",
  "registry:item",
  "registry:template",
  "registry:config",
  "registry:rule",
  "registry:asset",
  "registry:file",
] as const;

export const installSupportedItemTypes = [
  "registry:ui",
  "registry:component",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:theme",
  "registry:style",
  "registry:config",
  "registry:file",
  "registry:item",
] as const;

export const targetRequiredFileTypes = [
  "registry:block",
  "registry:page",
  "registry:config",
  "registry:rule",
  "registry:asset",
  "registry:file",
] as const;

export const fileModeSchema = z.enum(["create", "overwrite", "merge-json", "append-css"]);
export const registryItemTypeSchema = z.enum(registryItemTypes);
export const registryParityMetadataSchema = z.record(z.string().min(1), z.string().min(1));

export const fileDescriptorSchema = z.object({
  path: z.string().min(1),
  type: registryItemTypeSchema,
  target: z.string().min(1).optional(),
  content: z.string().optional(),
  mode: fileModeSchema.optional(),
});

export const registryItemSchema = z
  .object({
    $schema: z.string().url(),
    name: z.string().min(1),
    type: registryItemTypeSchema,
    title: z.string().min(1),
    description: z.string().min(1),
    version: z.string().min(1),
    filesRoot: z.string().min(1).optional(),
    targetRoot: z.string().min(1).optional(),
    files: z.array(fileDescriptorSchema).min(1),
    dependencies: z.array(z.string().min(1)).default([]),
    devDependencies: z.array(z.string().min(1)).default([]),
    registryDependencies: z.array(z.string().min(1)).default([]),
    compatibility: z.record(z.string().min(1), z.string().min(1)).optional(),
    categories: z.array(z.string().min(1)).optional(),
    keywords: z.array(z.string().min(1)).optional(),
    docs: z.string().url().optional(),
    preview: z.union([z.string().url(), z.record(z.string(), z.unknown())]).optional(),
    changelog: z.string().optional(),
    integrity: z.record(z.string(), z.unknown()).optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
  })
  .superRefine((item, context) => {
    if (item.filesRoot && !item.targetRoot) {
      context.addIssue({
        code: "custom",
        message: "targetRoot is required when filesRoot is provided",
        path: ["targetRoot"],
      });
    }

    if (item.targetRoot && !item.filesRoot) {
      context.addIssue({
        code: "custom",
        message: "filesRoot is required when targetRoot is provided",
        path: ["filesRoot"],
      });
    }

    for (const [index, file] of item.files.entries()) {
      if (
        targetRequiredFileTypes.includes(file.type as (typeof targetRequiredFileTypes)[number]) &&
        !item.targetRoot &&
        !file.target
      ) {
        context.addIssue({
          code: "custom",
          message: `target is required for ${file.type} files`,
          path: ["files", index, "target"],
        });
      }
    }
  })
  .transform((item) => {
    if (!item.filesRoot || !item.targetRoot) return item;
    const filesRoot = item.filesRoot;
    const targetRoot = item.targetRoot;

    return {
      ...item,
      files: item.files.map((file) => {
        if (file.target) return file;
        const relativePath = path.posix.relative(filesRoot, file.path);
        if (relativePath.startsWith("..") || path.posix.isAbsolute(relativePath)) return file;
        return {
          ...file,
          target: path.posix.join(targetRoot, relativePath),
        };
      }),
    };
  });

export const registryItemSummarySchema = z.object({
  name: z.string().min(1),
  type: registryItemTypeSchema,
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const rootRegistrySchema = z.object({
  $schema: z.string().url(),
  name: z.string().min(1),
  homepage: z.string().url(),
  items: z.array(registryItemSummarySchema),
});

export type RegistryItemType = (typeof registryItemTypes)[number];
export type InstallSupportedItemType = (typeof installSupportedItemTypes)[number];
export type FileDescriptor = z.infer<typeof fileDescriptorSchema>;
export type RegistryParityMetadata = z.infer<typeof registryParityMetadataSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RootRegistry = z.infer<typeof rootRegistrySchema>;

export function isInstallSupportedItemType(
  type: RegistryItemType,
): type is InstallSupportedItemType {
  return installSupportedItemTypes.includes(type as InstallSupportedItemType);
}

export const installableItemTypes = installSupportedItemTypes;
export type InstallableItemType = InstallSupportedItemType;

export function isInstallableItemType(type: RegistryItemType): type is InstallableItemType {
  return isInstallSupportedItemType(type);
}
