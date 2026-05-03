import { fail, ok, type MasonRegistryError, type ValidationResult } from "./errors";
import { fromZodError } from "./validate-registry";
import { isInstallSupportedItemType, registryItemSchema, type RegistryItem } from "./schema";
import { validateDependencies } from "./validate-dependencies";
import { validateFiles } from "./validate-files";

export type ValidateItemOptions = {
  installSupportedOnly?: boolean;
  projectRoot?: string;
  registryRoot?: string;
};

export function validateItem(
  input: unknown,
  options: ValidateItemOptions = {},
): ValidationResult<RegistryItem> {
  const parsed = registryItemSchema.safeParse(input);
  if (!parsed.success) {
    return fail(fromZodError(parsed.error));
  }

  const errors: MasonRegistryError[] = [
    ...validateFiles(parsed.data.files, {
      projectRoot: options.projectRoot,
      registryRoot: options.registryRoot,
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

  return errors.length > 0 ? fail(errors) : ok(parsed.data);
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
