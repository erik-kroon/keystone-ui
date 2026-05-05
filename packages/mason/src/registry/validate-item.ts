import { fail, ok, type UIRegistryError, type ValidationResult } from "./errors";
import { fromZodError } from "./validate-registry";
import {
  isInstallSupportedItemType,
  registryItemSchema,
  registryParityMetadataSchema,
  type RegistryItem,
} from "./schema";
import { validateDependencies } from "./validate-dependencies";
import { validateFiles } from "./validate-files";

export type ValidateItemOptions = {
  installSupportedOnly?: boolean;
  projectRoot?: string;
  registryRoot?: string;
  requireParityMetadata?: boolean;
};

export function validateItem(
  input: unknown,
  options: ValidateItemOptions = {},
): ValidationResult<RegistryItem> {
  const parsed = registryItemSchema.safeParse(input);
  if (!parsed.success) {
    return fail(fromZodError(parsed.error));
  }

  const errors: UIRegistryError[] = [
    ...validateFiles(parsed.data.files, {
      filesRoot: parsed.data.filesRoot,
      projectRoot: options.projectRoot,
      registryRoot: options.registryRoot,
      targetRoot: parsed.data.targetRoot,
    }),
    ...validateDependencies(parsed.data),
  ];

  if (options.installSupportedOnly && !isInstallSupportedItemType(parsed.data.type)) {
    errors.push({
      code: "item.unsupportedForInstall",
      message: `${parsed.data.type} is schema-valid but not install-supported in the first CLI slice.`,
      field: "type",
      value: parsed.data.type,
    });
  }

  if (options.requireParityMetadata) {
    errors.push(...validateParityMetadata(parsed.data));
  }

  return errors.length > 0 ? fail(errors) : ok(parsed.data);
}

function validateParityMetadata(item: RegistryItem): UIRegistryError[] {
  const parity = item.meta?.parity;

  if (parity === undefined) {
    return [
      {
        code: "parity.missing",
        message: `Registry item ${item.name} is missing meta.parity metadata.`,
        path: ["meta", "parity"],
      },
    ];
  }

  const result = registryParityMetadataSchema.safeParse(parity);
  if (!result.success || Object.keys(result.data).length === 0) {
    return [
      {
        code: "parity.invalid",
        message: `Registry item ${item.name} must include non-empty string notes in meta.parity.`,
        path: ["meta", "parity"],
        value: parity,
      },
    ];
  }

  return [];
}

export function validateRegistryItem(
  input: unknown,
  options: ValidateItemOptions = {},
): RegistryItem {
  const result = validateItem(input, options);
  if (result.ok) {
    return result.value;
  }

  throw new Error(result.errors.map((error) => error.message).join("\n"));
}
