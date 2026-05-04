import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  splitProps,
  untrack,
  useContext,
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
  renderPolymorphic,
  type KeystoneAs,
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

type FormControlStateAccessors = {
  [Key in keyof FormControlState]: () => FormControlState[Key];
};

export type CreateFormControlOptions = {
  form?: StringAccessor;
  id?: StringAccessor;
  name?: StringAccessor;
  scope?: string;
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
  hiddenInputDescriptors: () => readonly HiddenInputDescriptor[];
  registerDescription: (id?: Accessor<string | undefined>) => () => void;
  registerErrorMessage: (id?: Accessor<string | undefined>) => () => void;
  registerFormReset: (element: Accessor<HTMLElement | undefined>) => void;
  registerFormValueSync: (
    element: Accessor<HTMLInputElement | undefined>,
    onValueChange: (value: string) => void,
  ) => void;
};

export type HiddenInputDescriptor = {
  disabled?: boolean;
  form?: string;
  name: string;
  required?: boolean;
  value: string;
};

export type FormControlPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type FormControlRootProps = FormControlPartProps<HTMLSpanElement> &
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children" | "ref"> & {
    defaultValue?: FormControlValue;
    disabled?: boolean;
    form?: string;
    invalid?: boolean;
    name?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: FormControlValue;
    onReset?: () => void;
  };

export type FormControlLabelProps = FormControlPartProps<HTMLLabelElement> &
  Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, "children" | "ref">;

export type FormControlControlProps<T extends HTMLElement = HTMLElement> = FormControlPartProps<T> &
  Omit<JSX.HTMLAttributes<T>, "children" | "ref"> & {
    as?: KeystoneAs<JSX.HTMLAttributes<T>>;
  };

export type FormControlDescriptionProps = FormControlPartProps &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type FormControlErrorMessageProps = FormControlPartProps &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    forceMount?: boolean;
  };

export type FormControlHiddenInputProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "children" | "ref" | "type"
> & {
  ref?: HTMLInputElement | ((element: HTMLInputElement) => void);
};

export type FieldRootProps = FormControlPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> &
  Pick<
    CreateFieldValidityOptions,
    | "customError"
    | "defaultValue"
    | "revalidationMode"
    | "validate"
    | "validationMode"
    | "onValidityChange"
  > & {
    disabled?: boolean;
    form?: string;
    invalid?: boolean;
    name?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: FormControlValue;
  };

export type FieldLabelProps = FormControlLabelProps;

export type FieldControlProps<T extends HTMLElement = HTMLInputElement> = FormControlPartProps<T> &
  Omit<JSX.HTMLAttributes<T>, "children" | "ref"> & {
    as?: KeystoneAs<JSX.HTMLAttributes<T>>;
  };

export type FieldDescriptionProps = FormControlDescriptionProps;
export type FieldErrorMessageProps = FormControlErrorMessageProps;
export type FieldHiddenInputProps = FormControlHiddenInputProps;

type FormControlContextValue = {
  control: FormControlApi;
  validity?: FieldValidityApi;
};

const FormControlContext = createContext<FormControlContextValue>();
const FieldContext = createContext<FormControlContextValue>();

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
  const scope = options.scope ?? "form-control";
  const describedBy = createMemo(() => {
    const ids = [...descriptionIds.ids()];

    if (invalid()) {
      ids.push(...errorMessageIds.ids());
    }

    return mergeIds(...ids);
  });
  const stateAccessors: FormControlStateAccessors = {
    dirty,
    disabled,
    filled,
    focused,
    invalid,
    readonly,
    required,
    touched,
    validating,
  };

  const getRootProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => applyStateDataAttributes({ ...props }, scope, "root", stateAccessors);

  const getControlProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? controlId(),
        get "aria-labelledby"() {
          return props["aria-labelledby"] ?? labelId();
        },
        get "aria-describedby"() {
          return mergeIds(describedBy(), props["aria-describedby"]);
        },
        get "aria-disabled"() {
          return props["aria-disabled"] ?? ariaBoolean(disabled());
        },
        get "aria-invalid"() {
          return props["aria-invalid"] ?? ariaBoolean(invalid());
        },
        get "aria-readonly"() {
          return props["aria-readonly"] ?? ariaBoolean(readonly());
        },
        get "aria-required"() {
          return props["aria-required"] ?? ariaBoolean(required());
        },
      },
      scope,
      "control",
      stateAccessors,
    );

  const getLabelProps = <T extends HTMLElement = HTMLLabelElement>(
    props: JSX.LabelHTMLAttributes<T> = {},
  ): JSX.LabelHTMLAttributes<T> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? labelId(),
        for: props.for ?? controlId(),
      },
      scope,
      "label",
      stateAccessors,
    );

  const getDescriptionProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? descriptionId(),
      },
      scope,
      "description",
      stateAccessors,
    );

  const getErrorMessageProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? errorMessageId(),
      },
      scope,
      "error-message",
      stateAccessors,
    );

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
    ...partDataAttributes(scope, "hidden-input"),
  });

  const hiddenInputDescriptors = createMemo(() =>
    createHiddenInputDescriptors({
      disabled: disabled(),
      form: form(),
      name: options.name?.(),
      required: required(),
      value: options.value?.(),
    }),
  );

  const registerDescription = descriptionIds.register;
  const registerErrorMessage = errorMessageIds.register;

  const registerFormReset = (element: Accessor<HTMLElement | undefined>) => {
    createEffect(() => {
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
    createEffect(() => {
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
    hiddenInputDescriptors,
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
    createEffect(() => {
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
    createEffect(() => {
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

function applyStateDataAttributes<T extends Record<string, unknown>>(
  props: T,
  scope: string,
  part: string,
  state: FormControlStateAccessors,
): T {
  Object.assign(props, partDataAttributes(scope, part));
  Object.defineProperties(props, {
    "data-dirty": { enumerable: true, get: () => dataBoolean(state.dirty()) },
    "data-disabled": { enumerable: true, get: () => dataBoolean(state.disabled()) },
    "data-filled": { enumerable: true, get: () => dataBoolean(state.filled()) },
    "data-focused": { enumerable: true, get: () => dataBoolean(state.focused()) },
    "data-invalid": { enumerable: true, get: () => dataBoolean(state.invalid()) },
    "data-readonly": { enumerable: true, get: () => dataBoolean(state.readonly()) },
    "data-required": { enumerable: true, get: () => dataBoolean(state.required()) },
    "data-touched": { enumerable: true, get: () => dataBoolean(state.touched()) },
    "data-validating": { enumerable: true, get: () => dataBoolean(state.validating()) },
  });
  return props;
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

export function createHiddenInputDescriptors(options: {
  disabled?: boolean;
  form?: string;
  name?: string;
  required?: boolean;
  value?: FormControlValue;
}): readonly HiddenInputDescriptor[] {
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

function useFormControl(part: string) {
  const context = useContext(FormControlContext);
  if (!context) throw new Error(`FormControl.${part} must be used within FormControl.Root`);
  return context;
}

function useField(part: string) {
  const context = useContext(FieldContext);
  if (!context) throw new Error(`Field.${part} must be used within Field.Root`);
  return context;
}

function FormControlRoot(props: FormControlRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "defaultValue",
    "disabled",
    "form",
    "invalid",
    "name",
    "onReset",
    "readOnly",
    "required",
    "value",
  ]);
  const value = createMemo(() => local.value ?? local.defaultValue);
  const control = createFormControl({
    disabled: () => local.disabled,
    form: () => local.form,
    invalid: () => local.invalid,
    name: () => local.name,
    onReset: local.onReset,
    readonly: () => local.readOnly,
    required: () => local.required,
    value,
  });

  return (
    <FormControlContext.Provider value={{ control }}>
      <span {...control.getRootProps(others)}>{local.children}</span>
    </FormControlContext.Provider>
  );
}

function FormControlLabel(props: FormControlLabelProps) {
  const { control } = useFormControl("Label");
  return <label {...control.getLabelProps(props)} />;
}

function FormControlControl<T extends HTMLElement = HTMLElement>(
  props: FormControlControlProps<T>,
) {
  const { control } = useFormControl("Control");
  const [local, others] = splitProps(props, ["as", "children"]);
  const controlProps = control.getControlProps({
    ...others,
    children: local.children,
  } as JSX.HTMLAttributes<T>);

  if (!local.as) {
    return <div {...(controlProps as unknown as JSX.HTMLAttributes<HTMLDivElement>)} />;
  }

  return renderPolymorphic(local.as, "div", controlProps as Record<string, unknown>);
}

function FormControlDescription(props: FormControlDescriptionProps) {
  const { control } = useFormControl("Description");
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerDescription(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <div
      {...control.getDescriptionProps({
        ...props,
        ref: (nextElement) => {
          element = nextElement;
          assignRef(props.ref, nextElement);
        },
      })}
    />
  );
}

function FormControlErrorMessage(props: FormControlErrorMessageProps) {
  const { control } = useFormControl("ErrorMessage");
  const [local, others] = splitProps(props, ["forceMount"]);
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerErrorMessage(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <Show when={local.forceMount || control.invalid()}>
      <div
        {...control.getErrorMessageProps({
          ...others,
          ref: (nextElement) => {
            element = nextElement;
            assignRef(others.ref, nextElement);
          },
        })}
      />
    </Show>
  );
}

function FormControlHiddenInput(props: FormControlHiddenInputProps) {
  const { control } = useFormControl("HiddenInput");

  return (
    <For each={control.hiddenInputDescriptors()}>
      {(input) => <HiddenInputElement control={control} input={input} props={props} />}
    </For>
  );
}

function FieldRoot(props: FieldRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "customError",
    "defaultValue",
    "disabled",
    "form",
    "invalid",
    "name",
    "onValidityChange",
    "readOnly",
    "required",
    "revalidationMode",
    "validate",
    "validationMode",
    "value",
  ]);
  const validity = createFieldValidity({
    customError: local.customError,
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    invalid: () => local.invalid,
    readonly: () => local.readOnly,
    required: () => local.required,
    revalidationMode: local.revalidationMode,
    validate: local.validate,
    validationMode: local.validationMode,
    value: () => local.value,
    onValidityChange: local.onValidityChange,
  });
  const control = createFormControl({
    dirty: validity.dirty,
    disabled: () => local.disabled,
    filled: validity.filled,
    focused: validity.focused,
    form: () => local.form,
    invalid: () => local.invalid ?? validity.invalid(),
    name: () => local.name,
    readonly: () => local.readOnly,
    required: () => local.required,
    scope: "field",
    touched: validity.touched,
    validating: validity.validating,
    value: () => local.value ?? validity.value(),
  });

  return (
    <FieldContext.Provider value={{ control, validity }}>
      <div {...control.getRootProps(others)}>{local.children}</div>
    </FieldContext.Provider>
  );
}

function FieldLabel(props: FieldLabelProps) {
  const { control } = useField("Label");
  return <label {...control.getLabelProps(props)} />;
}

function FieldControl<T extends HTMLElement = HTMLInputElement>(props: FieldControlProps<T>) {
  const { control, validity } = useField("Control");
  const [local, others] = splitProps(props, ["as", "children", "ref"]);
  const [element, setElement] = createSignal<T>();

  if (validity) {
    validity.registerControl(element);
    validity.registerFormReset(element);
    validity.registerFormSubmit(element);
  }

  const controlProps = control.getControlProps(
    validity?.getControlProps({
      ...others,
      children: local.children,
      ref: (element: T) => {
        setElement(() => element);
        assignRef(local.ref, element);
      },
    } as JSX.HTMLAttributes<T>) ??
      ({ ...others, children: local.children } as JSX.HTMLAttributes<T>),
  );

  if (!local.as) {
    return <input {...(controlProps as JSX.InputHTMLAttributes<HTMLInputElement>)} />;
  }

  return renderPolymorphic(local.as, "input", controlProps as Record<string, unknown>);
}

function FieldDescription(props: FieldDescriptionProps) {
  const { control } = useField("Description");
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerDescription(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <div
      {...control.getDescriptionProps({
        ...props,
        ref: (nextElement) => {
          element = nextElement;
          assignRef(props.ref, nextElement);
        },
      })}
    />
  );
}

function FieldErrorMessage(props: FieldErrorMessageProps) {
  const { control, validity } = useField("ErrorMessage");
  const [local, others] = splitProps(props, ["children", "forceMount"]);
  let element: HTMLElement | undefined;

  onMount(() => {
    const unregister = control.registerErrorMessage(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <Show when={local.forceMount || control.invalid()}>
      <div
        {...control.getErrorMessageProps({
          ...others,
          ref: (nextElement) => {
            element = nextElement;
            assignRef(others.ref, nextElement);
          },
        })}
      >
        {local.children ?? validity?.validationMessage()}
      </div>
    </Show>
  );
}

function FieldHiddenInput(props: FieldHiddenInputProps) {
  const { control } = useField("HiddenInput");

  return (
    <For each={control.hiddenInputDescriptors()}>
      {(input) => <HiddenInputElement control={control} input={input} props={props} />}
    </For>
  );
}

function HiddenInputElement(props: {
  control: FormControlApi;
  input: HiddenInputDescriptor;
  props: FormControlHiddenInputProps;
}) {
  let inputElement: HTMLInputElement | undefined;

  createEffect(() => {
    if (inputElement) {
      inputElement.value = props.input.value;
    }
  });

  return (
    <input
      {...props.control.getHiddenInputProps({
        ...props.props,
        disabled: props.props.disabled ?? props.input.disabled,
        form: props.props.form ?? props.input.form,
        name: props.props.name ?? props.input.name,
        ref: (element) => {
          inputElement = element;
          element.value = props.input.value;
          props.control.registerFormReset(() => element);
          assignRef(props.props.ref, element);
        },
        required: props.props.required ?? props.input.required,
        value: props.props.value ?? props.input.value,
      })}
    />
  );
}

function assignRef<T>(ref: unknown, element: T) {
  if (typeof ref === "function") {
    (ref as (element: T) => void)(element);
  }
}

export const FormControl = {
  Root: FormControlRoot,
  Control: FormControlControl,
  Label: FormControlLabel,
  Description: FormControlDescription,
  ErrorMessage: FormControlErrorMessage,
  HiddenInput: FormControlHiddenInput,
};

export const Field = {
  Root: FieldRoot,
  Control: FieldControl,
  Label: FieldLabel,
  Description: FieldDescription,
  ErrorMessage: FieldErrorMessage,
  HiddenInput: FieldHiddenInput,
};
