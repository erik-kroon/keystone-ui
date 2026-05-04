import type { Accessor, JSX } from "solid-js";
import type { KeystoneAs } from "../utils/index";

export type BooleanAccessor = () => boolean | undefined;
export type StringAccessor = () => string | undefined;
export type FormValueAccessor = () => FormControlValue | undefined;

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

export type FormControlState = {
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

export type FormControlStateAccessors = {
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

export type HiddenInputDescriptorOptions = {
  disabled?: boolean;
  form?: string;
  name?: string;
  required?: boolean;
  value?: FormControlValue;
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
