export type { UIRegistryError, UIRegistryErrorCode, ValidationResult } from "./errors";
export { fail, ok } from "./errors";
export {
  fileDescriptorSchema,
  fileDescriptorSchema as registryFileSchema,
  fileModeSchema,
  fileModeSchema as registryFileModeSchema,
  installableItemTypes,
  installSupportedItemTypes,
  isInstallableItemType,
  isInstallSupportedItemType,
  registryItemSchema,
  registryItemSummarySchema,
  registryParityMetadataSchema,
  registryItemTypes,
  registryItemTypeSchema,
  rootRegistrySchema,
  rootRegistrySchema as registryIndexSchema,
  targetRequiredFileTypes,
  type FileDescriptor,
  type FileDescriptor as RegistryFile,
  type InstallableItemType,
  type InstallSupportedItemType,
  type RegistryItem,
  type RegistryParityMetadata,
  type RegistryItemType,
  type RootRegistry,
  type RootRegistry as RegistryIndex,
} from "./schema";
export {
  validateRegistry,
  validateRootRegistryOrThrow,
  validateRootRegistryOrThrow as validateRegistryIndex,
} from "./validate-registry";
export { validateItem, validateRegistryItem, type ValidateItemOptions } from "./validate-item";
export { validateFiles, type ValidateFilesOptions } from "./validate-files";
export { validateDependencies, isRegistryDependencyReference } from "./validate-dependencies";
export { validateRegistryPath, type PathSafetyOptions } from "./path-safety";
export {
  resolveRegistryDependencyGraph,
  resolveRegistryDependencies,
  type RegistryItemLoader,
  type RegistryItemMap,
  type ResolvedRegistryDependencyGraph,
} from "./resolve-dependencies";
