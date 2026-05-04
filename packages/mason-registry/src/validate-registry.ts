import type { z } from "zod";
import { fail, ok, type UIRegistryError, type ValidationResult } from "./errors";
import { rootRegistrySchema, type RootRegistry } from "./schema";

function fromZodError(error: z.ZodError): UIRegistryError[] {
  return error.issues.map((issue) => ({
    code: "schema.invalid",
    message: issue.message,
    path: issue.path.filter((part) => typeof part === "string" || typeof part === "number"),
  }));
}

export function validateRegistry(input: unknown): ValidationResult<RootRegistry> {
  const parsed = rootRegistrySchema.safeParse(input);
  return parsed.success ? ok(parsed.data) : fail(fromZodError(parsed.error));
}

export function validateRootRegistryOrThrow(input: unknown): RootRegistry {
  const result = validateRegistry(input);
  if (!result.ok) {
    throw new Error(result.errors.map((error) => error.message).join("\n"));
  }
  return result.value;
}

export { fromZodError };
