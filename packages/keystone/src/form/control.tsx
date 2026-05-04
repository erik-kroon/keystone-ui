import {
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  untrack,
  type Accessor,
  type JSX,
} from "solid-js";
import {
  composeEventHandlers,
  createRegisteredIds,
  createStableId,
  dataBoolean,
  mergeIds,
  partDataAttributes,
} from "../utils/index";

type BooleanAccessor = () => boolean | undefined;
type StringAccessor = () => string | undefined;
type FormValueAccessor = () => FormControlValue | undefined;

export type FormControlValue = string | number | boolean | null | readonly string[];

export type FieldValidationMode = "input" | "change" | "blur" | "submit" | "manual";
export type FieldValidationReason = "input" | "change" | "blur" | "submit" | "invalid" | "manual";

export type FieldNativeValidity = {
  badInput: boolean;
  customError: boolean;
  patternMismatch: boolean;
  rangeOverflow: boolean;
  rangeUnderflow: boolean;
  stepMismatch: boolean;
  tooLong: boolean;
  tooShort: boolean;
  typeMismatch: boolean;
  valid: boolean;
  valueMissing: boolean;
};

export type FieldValidationContext = {
  dirty: boolean;
  element: HTMLElement | undefined;
  filled: boolean;
  focused: boolean;
  nativeValidity: FieldNativeValidity;
  reason: FieldValidationReason;
  touched: boolean;
  value: FormControlValue | undefined;
};

export type FieldValidationResult = boolean | string | readonly string[] | null | undefined | void;

export type CreateFieldValidityOptions = {
  customError?: StringAccessor;
  defaultValue?: FormControlValue;
  disabled?: BooleanAccessor;
  focused?: BooleanAccessor;
  invalid?: BooleanAccessor;
  readonly?: BooleanAccessor;
  required?: BooleanAccessor;
  revalidationMode?: FieldValidationMode;
  validate?: (
    context: FieldValidationContext,
  ) => FieldValidationResult | Promise<FieldValidationResult>;
  validationMode?: FieldValidationMode;
  value?: FormValueAccessor;
  onValidityChange?: (invalid: boolean, context: FieldValidationContext) => void;
};

export type FieldValidityApi = {
  customError: () => string | undefined;
  dirty: () => boolean;
  filled: () => boolean;
  focused: () => boolean;
  getControlProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  invalid: () => boolean;
  nativeValidity: () => FieldNativeValidity;
  reset: (value?: FormControlValue) => void;
  setCustomValidity: (message?: string) => void;
  touched: () => boolean;
  valid: () => boolean;
  validate: (reason?: FieldValidationReason) => Promise<boolean>;
  validationErrors: () => readonly string[];
  validationMessage: () => string | undefined;
  validating: () => boolean;
  value: () => FormControlValue | undefined;
  registerControl: (element: Accessor<HTMLElement | undefined>) => void;
  registerFormReset: (element: Accessor<HTMLElement | undefined>) => void;
  registerFormSubmit: (element: Accessor<HTMLElement | undefined>) => void;
};

type FormControlState = {
  dirty: boolean;
  disabled: boolean;
  filled: boolean;
  focused: boolean;
  invalid: boolean;
  readonly: boolean;
  required: boolean;
  touched: boolean;
  validating: boolean;
};

export type CreateFormControlOptions = {
  form?: StringAccessor;
  id?: StringAccessor;
  name?: StringAccessor;
  value?: FormValueAccessor;
  disabled?: BooleanAccessor;
  dirty?: BooleanAccessor;
  filled?: BooleanAccessor;
  focused?: BooleanAccessor;
  invalid?: BooleanAccessor;
  readonly?: BooleanAccessor;
  required?: BooleanAccessor;
  touched?: BooleanAccessor;
  validating?: BooleanAccessor;
  onReset?: () => void;
};

export type FormControlApi = {
  controlId: () => string;
  descriptionId: () => string;
  errorMessageId: () => string;
  labelId: () => string;
  name: () => string | undefined;
  value: () => FormControlValue | undefined;
  disabled: () => boolean;
  dirty: () => boolean;
  filled: () => boolean;
  form: () => string | undefined;
  focused: () => boolean;
  invalid: () => boolean;
  readonly: () => boolean;
  required: () => boolean;
  touched: () => boolean;
  validating: () => boolean;
  describedBy: () => string | undefined;
  getControlProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getRootProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getLabelProps: <T extends HTMLElement = HTMLLabelElement>(
    props?: JSX.LabelHTMLAttributes<T>,
  ) => JSX.LabelHTMLAttributes<T>;
  getDescriptionProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getErrorMessageProps: <T extends HTMLElement = HTMLElement>(
    props?: JSX.HTMLAttributes<T>,
  ) => JSX.HTMLAttributes<T>;
  getHiddenInputProps: (
    props?: JSX.InputHTMLAttributes<HTMLInputElement>,
  ) => JSX.InputHTMLAttributes<HTMLInputElement>;
  registerDescription: (id?: Accessor<string | undefined>) => () => void;
  registerErrorMessage: (id?: Accessor<string | undefined>) => () => void;
  registerFormReset: (element: Accessor<HTMLElement | undefined>) => void;
  registerFormValueSync: (
    element: Accessor<HTMLInputElement | undefined>,
    onValueChange: (value: string) => void,
  ) => void;
};

export function createFormControl(options: CreateFormControlOptions = {}): FormControlApi {
  const controlId = createStableId("form-control", options.id);
  const labelId = createMemo(() => `${controlId()}-label`);
  const descriptionId = createMemo(() => `${controlId()}-description`);
  const errorMessageId = createMemo(() => `${controlId()}-error-message`);
  const descriptionIds = createRegisteredIds(descriptionId);
  const errorMessageIds = createRegisteredIds(errorMessageId);
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const dirty = createMemo(() => options.dirty?.() ?? false);
  const filled = createMemo(() => options.filled?.() ?? isFilledValue(options.value?.()));
  const form = createMemo(() => options.form?.());
  const focused = createMemo(() => options.focused?.() ?? false);
  const invalid = createMemo(() => options.invalid?.() ?? false);
  const readonly = createMemo(() => options.readonly?.() ?? false);
  const required = createMemo(() => options.required?.() ?? false);
  const touched = createMemo(() => options.touched?.() ?? false);
  const validating = createMemo(() => options.validating?.() ?? false);
  const describedBy = createMemo(() => {
    const ids = [...descriptionIds.ids()];

    if (invalid()) {
      ids.push(...errorMessageIds.ids());
    }

    return mergeIds(...ids);
  });

  const getRootProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    ...getStateDataAttributes("root", getFormControlState()),
  });

  const getControlProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    id: props.id ?? controlId(),
    "aria-labelledby": props["aria-labelledby"] ?? labelId(),
    "aria-describedby": mergeIds(describedBy(), props["aria-describedby"]),
    "aria-disabled": props["aria-disabled"] ?? ariaBoolean(disabled()),
    "aria-invalid": props["aria-invalid"] ?? ariaBoolean(invalid()),
    "aria-readonly": props["aria-readonly"] ?? ariaBoolean(readonly()),
    "aria-required": props["aria-required"] ?? ariaBoolean(required()),
    ...getStateDataAttributes("control", getFormControlState()),
  });

  const getLabelProps = <T extends HTMLElement = HTMLLabelElement>(
    props: JSX.LabelHTMLAttributes<T> = {},
  ): JSX.LabelHTMLAttributes<T> => ({
    ...props,
    id: props.id ?? labelId(),
    for: props.for ?? controlId(),
    ...getStateDataAttributes("label", getFormControlState()),
  });

  const getDescriptionProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    id: props.id ?? descriptionId(),
    ...getStateDataAttributes("description", getFormControlState()),
  });

  const getErrorMessageProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    id: props.id ?? errorMessageId(),
    ...getStateDataAttributes("error-message", getFormControlState()),
  });

  const getHiddenInputProps = (
    props: JSX.InputHTMLAttributes<HTMLInputElement> = {},
  ): JSX.InputHTMLAttributes<HTMLInputElement> => ({
    ...props,
    type: "hidden",
    name: props.name ?? options.name?.(),
    get value() {
      return props.value ?? serializeFormValue(options.value?.()) ?? "";
    },
    disabled: props.disabled ?? disabled(),
    form: props.form ?? form(),
    required: props.required ?? required(),
    "aria-hidden": "true",
    ...partDataAttributes("form-control", "hidden-input"),
  });

  const getFormControlState = (): FormControlState => ({
    dirty: dirty(),
    disabled: disabled(),
    filled: filled(),
    focused: focused(),
    invalid: invalid(),
    readonly: readonly(),
    required: required(),
    touched: touched(),
    validating: validating(),
  });

  const registerDescription = descriptionIds.register;
  const registerErrorMessage = errorMessageIds.register;

  const registerFormReset = (element: Accessor<HTMLElement | undefined>) => {
    onMount(() => {
      const form = getOwningForm(element());

      if (!form) {
        return;
      }

      const onReset = () => options.onReset?.();
      form.addEventListener("reset", onReset);
      onCleanup(() => form.removeEventListener("reset", onReset));
    });
  };

  const registerFormValueSync = (
    element: Accessor<HTMLInputElement | undefined>,
    onValueChange: (value: string) => void,
  ) => {
    onMount(() => {
      const input = element();

      if (!input) {
        return;
      }

      const syncValue = () => onValueChange(input.value);
      input.addEventListener("change", syncValue);
      input.addEventListener("input", syncValue);
      onCleanup(() => {
        input.removeEventListener("change", syncValue);
        input.removeEventListener("input", syncValue);
      });
    });
  };

  return {
    controlId,
    descriptionId,
    errorMessageId,
    labelId,
    name: () => options.name?.(),
    value: () => options.value?.(),
    disabled,
    dirty,
    filled,
    form,
    focused,
    invalid,
    readonly,
    required,
    touched,
    validating,
    describedBy,
    getControlProps,
    getRootProps,
    getLabelProps,
    getDescriptionProps,
    getErrorMessageProps,
    getHiddenInputProps,
    registerDescription,
    registerErrorMessage,
    registerFormReset,
    registerFormValueSync,
  };
}

export function createFieldValidity(options: CreateFieldValidityOptions = {}): FieldValidityApi {
  const [controlElement, setControlElement] = createSignal<HTMLElement>();
  const [internalValue, setInternalValue] = createSignal<FormControlValue | undefined>(
    options.defaultValue,
  );
  const initialValue = untrack(() => options.value?.() ?? options.defaultValue);
  const value = createMemo(() => options.value?.() ?? internalValue());
  const [dirty, setDirty] = createSignal(false);
  const [filled, setFilled] = createSignal(isFilledValue(value()));
  const [uncontrolledFocused, setFocused] = createSignal(false);
  const [touched, setTouched] = createSignal(false);
  const [nativeValidity, setNativeValidity] =
    createSignal<FieldNativeValidity>(emptyNativeValidity());
  const [nativeMessage, setNativeMessage] = createSignal<string>();
  const [manualCustomError, setManualCustomError] = createSignal<string>();
  const [validationErrors, setValidationErrors] = createSignal<readonly string[]>([]);
  const [validating, setValidating] = createSignal(false);
  let validationVersion = 0;

  const disabled = () => options.disabled?.() ?? false;
  const focused = createMemo(() => options.focused?.() ?? uncontrolledFocused());
  const customError = createMemo(() => options.customError?.() ?? manualCustomError());
  const validationMessage = createMemo(
    () => customError() ?? validationErrors()[0] ?? nativeMessage(),
  );
  const invalid = createMemo(
    () =>
      options.invalid?.() ??
      (!nativeValidity().valid || customError() !== undefined || validationErrors().length > 0),
  );
  const valid = createMemo(() => !invalid());

  const context = (reason: FieldValidationReason): FieldValidationContext => ({
    dirty: dirty(),
    element: controlElement(),
    filled: filled(),
    focused: focused(),
    nativeValidity: nativeValidity(),
    reason,
    touched: touched(),
    value: value(),
  });

  const updateValueState = (element?: HTMLElement) => {
    const nextElement = element ?? controlElement();

    if (!options.value && nextElement) {
      setInternalValue(readElementValue(nextElement));
    }

    const nextValue = value();
    setDirty(!Object.is(nextValue, initialValue));
    setFilled(isFilledValue(nextValue));
  };

  const updateNativeValidity = (element = controlElement()) => {
    if (!isValidityElement(element)) {
      setNativeValidity(emptyNativeValidity());
      setNativeMessage(undefined);
      return;
    }

    setNativeValidity(snapshotValidity(element.validity));
    setNativeMessage(element.validationMessage || undefined);
  };

  const runValidation = async (reason: FieldValidationReason = "manual"): Promise<boolean> => {
    updateValueState();
    updateNativeValidity();

    if (!options.validate || disabled()) {
      setValidationErrors([]);
      options.onValidityChange?.(invalid(), context(reason));
      return valid();
    }

    const version = ++validationVersion;
    const result = options.validate(context(reason));

    if (isPromiseLike(result)) {
      setValidating(true);

      try {
        const awaitedResult = await result;

        if (version !== validationVersion) {
          return valid();
        }

        setValidationErrors(normalizeValidationResult(awaitedResult));
      } finally {
        if (version === validationVersion) {
          setValidating(false);
        }
      }
    } else {
      setValidationErrors(normalizeValidationResult(result));
    }

    options.onValidityChange?.(invalid(), context(reason));
    return valid();
  };

  const validateForMode = (reason: FieldValidationReason) => {
    const mode = dirty()
      ? (options.revalidationMode ?? options.validationMode)
      : options.validationMode;

    if (shouldValidate(reason, mode)) {
      void runValidation(reason);
    }
  };

  const getControlProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    get "aria-invalid"() {
      return props["aria-invalid"] ?? ariaBoolean(invalid());
    },
    get "data-dirty"() {
      return dataBoolean(dirty());
    },
    get "data-filled"() {
      return dataBoolean(filled());
    },
    get "data-focused"() {
      return dataBoolean(focused());
    },
    get "data-invalid"() {
      return dataBoolean(invalid());
    },
    get "data-touched"() {
      return dataBoolean(touched());
    },
    get "data-validating"() {
      return dataBoolean(validating());
    },
    onBlur: composeEventHandlers<FocusEvent>(props.onBlur, (event) => {
      setFocused(false);
      setTouched(true);
      updateValueState(event.currentTarget as HTMLElement);
      updateNativeValidity(event.currentTarget as HTMLElement);
      validateForMode("blur");
    }),
    onChange: composeEventHandlers<Event>(props.onChange, (event) => {
      updateValueState(event.currentTarget as HTMLElement);
      updateNativeValidity(event.currentTarget as HTMLElement);
      validateForMode("change");
    }),
    onFocus: composeEventHandlers<FocusEvent>(props.onFocus, () => {
      setFocused(true);
    }),
    onInput: composeEventHandlers<InputEvent>(props.onInput, (event) => {
      updateValueState(event.currentTarget as HTMLElement);
      updateNativeValidity(event.currentTarget as HTMLElement);
      validateForMode("input");
    }),
    onInvalid: composeEventHandlers<Event>(props.onInvalid, (event) => {
      updateValueState(event.currentTarget as HTMLElement);
      updateNativeValidity(event.currentTarget as HTMLElement);
      void runValidation("invalid");
    }),
  });

  const registerControl = (element: Accessor<HTMLElement | undefined>) => {
    onMount(() => {
      setControlElement(element());
      updateValueState(element());
      updateNativeValidity(element());
    });
  };

  const reset = (nextValue = options.defaultValue) => {
    validationVersion++;
    setInternalValue(nextValue);
    setDirty(false);
    setTouched(false);
    setFocused(false);
    setFilled(isFilledValue(nextValue));
    setValidationErrors([]);
    setValidating(false);
    setManualCustomError(undefined);
    updateNativeValidity();
  };

  const registerFormReset = (element: Accessor<HTMLElement | undefined>) => {
    onMount(() => {
      const form = getOwningForm(element());

      if (!form) {
        return;
      }

      const onReset = () => reset();
      form.addEventListener("reset", onReset);
      onCleanup(() => form.removeEventListener("reset", onReset));
    });
  };

  const registerFormSubmit = (element: Accessor<HTMLElement | undefined>) => {
    onMount(() => {
      const form = getOwningForm(element());

      if (!form) {
        return;
      }

      const onSubmit = (event: SubmitEvent) => {
        if (!shouldValidate("submit", options.validationMode)) {
          return;
        }

        void runValidation("submit");

        if (invalid()) {
          event.preventDefault();
        }
      };
      form.addEventListener("submit", onSubmit);
      onCleanup(() => form.removeEventListener("submit", onSubmit));
    });
  };

  return {
    customError,
    dirty,
    filled,
    focused,
    getControlProps,
    invalid,
    nativeValidity,
    reset,
    setCustomValidity: (message) => {
      const normalized = message || undefined;
      setManualCustomError(normalized);
      const element = controlElement();

      if (isValidityElement(element)) {
        element.setCustomValidity(normalized ?? "");
        updateNativeValidity(element);
      }
    },
    touched,
    valid,
    validate: runValidation,
    validationErrors,
    validationMessage,
    validating,
    value,
    registerControl,
    registerFormReset,
    registerFormSubmit,
  };
}

function ariaBoolean(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

function getStateDataAttributes(
  part: string,
  state: FormControlState,
): Record<string, string | undefined> {
  return {
    ...partDataAttributes("form-control", part),
    "data-dirty": dataBoolean(state.dirty),
    "data-disabled": dataBoolean(state.disabled),
    "data-filled": dataBoolean(state.filled),
    "data-focused": dataBoolean(state.focused),
    "data-invalid": dataBoolean(state.invalid),
    "data-readonly": dataBoolean(state.readonly),
    "data-required": dataBoolean(state.required),
    "data-touched": dataBoolean(state.touched),
    "data-validating": dataBoolean(state.validating),
  };
}

function getOwningForm(element: HTMLElement | undefined): HTMLFormElement | null | undefined {
  if (!element) {
    return undefined;
  }

  if ("form" in element && element.form instanceof HTMLFormElement) {
    return element.form;
  }

  return element.closest("form");
}

function emptyNativeValidity(): FieldNativeValidity {
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

function isValidityElement(element: HTMLElement | undefined): element is HTMLElement & {
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

function snapshotValidity(validity: ValidityState): FieldNativeValidity {
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

function readElementValue(element: HTMLElement | undefined): FormControlValue | undefined {
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

function isFilledValue(value: FormControlValue | undefined): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

function isPromiseLike<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
  return typeof value === "object" && value !== null && "then" in value;
}

function normalizeValidationResult(result: FieldValidationResult): readonly string[] {
  if (result === false) {
    return ["Invalid value"];
  }

  if (typeof result === "string") {
    return result ? [result] : [];
  }

  if (Array.isArray(result)) {
    return result.filter((message) => message.length > 0);
  }

  return [];
}

function shouldValidate(
  reason: FieldValidationReason,
  mode: FieldValidationMode | undefined = "submit",
): boolean {
  if (mode === "manual") {
    return false;
  }

  return mode === reason;
}

function serializeFormValue(value: FormControlValue | undefined): string | number | undefined {
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
