import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  untrack,
  type Accessor,
  type JSX,
} from "solid-js";
import { composeEventHandlers, dataBoolean } from "../utils/index";
import { ariaBoolean } from "./control-state";
import {
  emptyNativeValidity,
  getOwningForm,
  isFilledValue,
  isValidityElement,
  readElementValue,
  snapshotValidity,
} from "./native-form";
import type {
  CreateFieldValidityOptions,
  FieldNativeValidity,
  FieldValidationContext,
  FieldValidationMode,
  FieldValidationReason,
  FieldValidationResult,
  FieldValidityApi,
  FormControlValue,
} from "./types";

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
