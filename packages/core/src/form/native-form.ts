import type {
  FieldNativeValidity,
  FormControlValue,
  HiddenInputDescriptor,
  HiddenInputDescriptorOptions,
} from "./types";

export function getOwningForm(
  element: HTMLElement | undefined,
): HTMLFormElement | null | undefined {
  if (!element) {
    return undefined;
  }

  if ("form" in element && element.form instanceof HTMLFormElement) {
    return element.form;
  }

  return element.closest("form");
}

export function emptyNativeValidity(): FieldNativeValidity {
  return {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false,
  };
}

export function isValidityElement(element: HTMLElement | undefined): element is HTMLElement & {
  setCustomValidity: (message: string) => void;
  validationMessage: string;
  validity: ValidityState;
} {
  return (
    element !== undefined &&
    "validity" in element &&
    "validationMessage" in element &&
    "setCustomValidity" in element
  );
}

export function snapshotValidity(validity: ValidityState): FieldNativeValidity {
  return {
    badInput: validity.badInput,
    customError: validity.customError,
    patternMismatch: validity.patternMismatch,
    rangeOverflow: validity.rangeOverflow,
    rangeUnderflow: validity.rangeUnderflow,
    stepMismatch: validity.stepMismatch,
    tooLong: validity.tooLong,
    tooShort: validity.tooShort,
    typeMismatch: validity.typeMismatch,
    valid: validity.valid,
    valueMissing: validity.valueMissing,
  };
}

export function readElementValue(element: HTMLElement | undefined): FormControlValue | undefined {
  if (!element) {
    return undefined;
  }

  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox") {
      return element.checked;
    }

    return element.value;
  }

  if (element instanceof HTMLTextAreaElement) {
    return element.value;
  }

  if (element instanceof HTMLSelectElement) {
    if (element.multiple) {
      return Array.from(element.selectedOptions, (option) => option.value);
    }

    return element.value;
  }

  return element.textContent ?? undefined;
}

export function isFilledValue(value: FormControlValue | undefined): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

export function serializeFormValue(
  value: FormControlValue | undefined,
): string | number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (isStringArray(value)) {
    return value[0];
  }

  return typeof value === "boolean" ? String(value) : value;
}

function isStringArray(value: FormControlValue): value is readonly string[] {
  return Array.isArray(value);
}

export function createHiddenInputDescriptors(
  options: HiddenInputDescriptorOptions,
): readonly HiddenInputDescriptor[] {
  if (!options.name || options.value === undefined || options.value === null) {
    return [];
  }

  const base = {
    disabled: options.disabled,
    form: options.form,
    name: options.name,
    required: options.required,
  };

  if (Array.isArray(options.value)) {
    return options.value.map((value) => ({ ...base, value }));
  }

  return [
    {
      ...base,
      value: typeof options.value === "boolean" ? String(options.value) : String(options.value),
    },
  ];
}
