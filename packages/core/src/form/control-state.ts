import { createEffect, createMemo, onCleanup, type Accessor, type JSX } from "solid-js";
import {
  createRegisteredIds,
  createStableId,
  dataBoolean,
  mergeIds,
  partDataAttributes,
} from "../utils/index";
import {
  createHiddenInputDescriptors,
  getOwningForm,
  isFilledValue,
  serializeFormValue,
} from "./native-form";
import type { CreateFormControlOptions, FormControlApi, FormControlStateAccessors } from "./types";

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
    registerDescription: descriptionIds.register,
    registerErrorMessage: errorMessageIds.register,
    registerFormReset,
    registerFormValueSync,
  };
}

export function ariaBoolean(value: boolean): "true" | undefined {
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
