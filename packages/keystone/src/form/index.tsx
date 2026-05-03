import { createMemo, createSignal, onCleanup, onMount, type Accessor, type JSX } from "solid-js";
import { createStableId, dataBoolean, partDataAttributes } from "../utils/index";

type BooleanAccessor = () => boolean | undefined;
type StringAccessor = () => string | undefined;
type FormValueAccessor = () => FormControlValue | undefined;

export type FormControlValue = string | number | boolean | null;

export type CreateFormControlOptions = {
  id?: StringAccessor;
  name?: StringAccessor;
  value?: FormValueAccessor;
  disabled?: BooleanAccessor;
  focused?: BooleanAccessor;
  invalid?: BooleanAccessor;
  readonly?: BooleanAccessor;
  required?: BooleanAccessor;
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
  focused: () => boolean;
  invalid: () => boolean;
  readonly: () => boolean;
  required: () => boolean;
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
};

export function createFormControl(options: CreateFormControlOptions = {}): FormControlApi {
  const controlId = createStableId("form-control", options.id);
  const labelId = createMemo(() => `${controlId()}-label`);
  const descriptionId = createMemo(() => `${controlId()}-description`);
  const errorMessageId = createMemo(() => `${controlId()}-error-message`);
  const [descriptionIds, setDescriptionIds] = createSignal<readonly Accessor<string | undefined>[]>(
    [descriptionId],
  );
  const [errorMessageIds, setErrorMessageIds] = createSignal<
    readonly Accessor<string | undefined>[]
  >([errorMessageId]);
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const focused = createMemo(() => options.focused?.() ?? false);
  const invalid = createMemo(() => options.invalid?.() ?? false);
  const readonly = createMemo(() => options.readonly?.() ?? false);
  const required = createMemo(() => options.required?.() ?? false);
  const describedBy = createMemo(() => {
    const ids = descriptionIds()
      .map((id) => id())
      .filter(Boolean) as string[];

    if (invalid()) {
      ids.push(
        ...(errorMessageIds()
          .map((id) => id())
          .filter(Boolean) as string[]),
      );
    }

    return mergeIds(...ids);
  });

  const getRootProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    ...getStateDataAttributes("root", disabled(), focused(), invalid(), readonly(), required()),
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
    ...getStateDataAttributes("control", disabled(), focused(), invalid(), readonly(), required()),
  });

  const getLabelProps = <T extends HTMLElement = HTMLLabelElement>(
    props: JSX.LabelHTMLAttributes<T> = {},
  ): JSX.LabelHTMLAttributes<T> => ({
    ...props,
    id: props.id ?? labelId(),
    for: props.for ?? controlId(),
    ...getStateDataAttributes("label", disabled(), focused(), invalid(), readonly(), required()),
  });

  const getDescriptionProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    id: props.id ?? descriptionId(),
    ...getStateDataAttributes(
      "description",
      disabled(),
      focused(),
      invalid(),
      readonly(),
      required(),
    ),
  });

  const getErrorMessageProps = <T extends HTMLElement = HTMLElement>(
    props: JSX.HTMLAttributes<T> = {},
  ): JSX.HTMLAttributes<T> => ({
    ...props,
    id: props.id ?? errorMessageId(),
    ...getStateDataAttributes(
      "error-message",
      disabled(),
      focused(),
      invalid(),
      readonly(),
      required(),
    ),
  });

  const getHiddenInputProps = (
    props: JSX.InputHTMLAttributes<HTMLInputElement> = {},
  ): JSX.InputHTMLAttributes<HTMLInputElement> => ({
    ...props,
    type: "hidden",
    name: props.name ?? options.name?.(),
    value: props.value ?? serializeFormValue(options.value?.()),
    disabled: props.disabled ?? disabled(),
    required: props.required ?? required(),
    "aria-hidden": "true",
    ...partDataAttributes("form-control", "hidden-input"),
  });

  const registerDescription = (id: Accessor<string | undefined> = descriptionId) => {
    setDescriptionIds((current) => [...current.filter((candidate) => candidate !== id), id]);

    const unregister = () => {
      setDescriptionIds((current) => current.filter((candidate) => candidate !== id));
    };

    onCleanup(unregister);
    return unregister;
  };

  const registerErrorMessage = (id: Accessor<string | undefined> = errorMessageId) => {
    setErrorMessageIds((current) => [...current.filter((candidate) => candidate !== id), id]);

    const unregister = () => {
      setErrorMessageIds((current) => current.filter((candidate) => candidate !== id));
    };

    onCleanup(unregister);
    return unregister;
  };

  const registerFormReset = (element: Accessor<HTMLElement | undefined>) => {
    onMount(() => {
      const form = element()?.closest("form");

      if (!form) {
        return;
      }

      const onReset = () => options.onReset?.();
      form.addEventListener("reset", onReset);
      onCleanup(() => form.removeEventListener("reset", onReset));
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
    focused,
    invalid,
    readonly,
    required,
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
  };
}

function ariaBoolean(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

function getStateDataAttributes(
  part: string,
  disabled: boolean,
  focused: boolean,
  invalid: boolean,
  readonly: boolean,
  required: boolean,
): Record<string, string | undefined> {
  return {
    ...partDataAttributes("form-control", part),
    "data-disabled": dataBoolean(disabled),
    "data-focused": dataBoolean(focused),
    "data-invalid": dataBoolean(invalid),
    "data-readonly": dataBoolean(readonly),
    "data-required": dataBoolean(required),
  };
}

function mergeIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function serializeFormValue(value: FormControlValue | undefined): string | number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === "boolean" ? String(value) : value;
}
