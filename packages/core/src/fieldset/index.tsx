import {
  createContext,
  createMemo,
  onCleanup,
  onMount,
  Show,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import {
  createRegisteredIds,
  createStableId,
  dataBoolean,
  mergeIds,
  partDataAttributes,
} from "../utils/index";

export type FieldsetPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type FieldsetRootProps = FieldsetPartProps<HTMLFieldSetElement> &
  Omit<JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>, "children" | "ref"> & {
    invalid?: boolean;
    readOnly?: boolean;
    required?: boolean;
  };

export type FieldsetLegendProps = FieldsetPartProps<HTMLLegendElement> &
  Omit<JSX.HTMLAttributes<HTMLLegendElement>, "children" | "ref">;

export type FieldsetDescriptionProps = FieldsetPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type FieldsetErrorMessageProps = FieldsetPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    forceMount?: boolean;
  };

export type CreateFieldsetOptions = {
  disabled?: Accessor<boolean | undefined>;
  id?: Accessor<string | undefined>;
  invalid?: Accessor<boolean | undefined>;
  readOnly?: Accessor<boolean | undefined>;
  required?: Accessor<boolean | undefined>;
  scope?: string;
};

export type FieldsetApi = {
  describedBy: Accessor<string | undefined>;
  descriptionId: Accessor<string>;
  disabled: Accessor<boolean>;
  errorMessageId: Accessor<string>;
  fieldsetId: Accessor<string>;
  getDescriptionProps: (
    props?: JSX.HTMLAttributes<HTMLDivElement>,
  ) => JSX.HTMLAttributes<HTMLDivElement>;
  getErrorMessageProps: (
    props?: JSX.HTMLAttributes<HTMLDivElement>,
  ) => JSX.HTMLAttributes<HTMLDivElement>;
  getLegendProps: (
    props?: JSX.HTMLAttributes<HTMLLegendElement>,
  ) => JSX.HTMLAttributes<HTMLLegendElement>;
  getRootProps: (
    props?: JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  ) => JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>;
  invalid: Accessor<boolean>;
  legendId: Accessor<string>;
  readOnly: Accessor<boolean>;
  registerDescription: (id?: Accessor<string | undefined>) => () => void;
  registerErrorMessage: (id?: Accessor<string | undefined>) => () => void;
  required: Accessor<boolean>;
};

const FieldsetContext = createContext<FieldsetApi>();

export function createFieldset(options: CreateFieldsetOptions = {}): FieldsetApi {
  const scope = options.scope ?? "fieldset";
  const fieldsetId = createStableId("fieldset", options.id);
  const legendId = createMemo(() => `${fieldsetId()}-legend`);
  const descriptionId = createMemo(() => `${fieldsetId()}-description`);
  const errorMessageId = createMemo(() => `${fieldsetId()}-error-message`);
  const descriptionIds = createRegisteredIds(descriptionId);
  const errorMessageIds = createRegisteredIds(errorMessageId);
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const invalid = createMemo(() => options.invalid?.() ?? false);
  const readOnly = createMemo(() => options.readOnly?.() ?? false);
  const required = createMemo(() => options.required?.() ?? false);
  const describedBy = createMemo(() => {
    const ids = [...descriptionIds.ids()];

    if (invalid()) {
      ids.push(...errorMessageIds.ids());
    }

    return mergeIds(...ids);
  });

  const getRootProps = (
    props: JSX.FieldsetHTMLAttributes<HTMLFieldSetElement> = {},
  ): JSX.FieldsetHTMLAttributes<HTMLFieldSetElement> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? fieldsetId(),
        disabled: props.disabled ?? disabled(),
        get "aria-describedby"() {
          return mergeIds(describedBy(), props["aria-describedby"]);
        },
        get "aria-invalid"() {
          return props["aria-invalid"] ?? ariaBoolean(invalid());
        },
        get "aria-labelledby"() {
          return props["aria-labelledby"] ?? legendId();
        },
        get "aria-readonly"() {
          return props["aria-readonly"] ?? ariaBoolean(readOnly());
        },
        get "aria-required"() {
          return props["aria-required"] ?? ariaBoolean(required());
        },
      },
      scope,
      "root",
      { disabled, invalid, readOnly, required },
    );

  const getLegendProps = (
    props: JSX.HTMLAttributes<HTMLLegendElement> = {},
  ): JSX.HTMLAttributes<HTMLLegendElement> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? legendId(),
      },
      scope,
      "legend",
      { disabled, invalid, readOnly, required },
    );

  const getDescriptionProps = (
    props: JSX.HTMLAttributes<HTMLDivElement> = {},
  ): JSX.HTMLAttributes<HTMLDivElement> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? descriptionId(),
      },
      scope,
      "description",
      { disabled, invalid, readOnly, required },
    );

  const getErrorMessageProps = (
    props: JSX.HTMLAttributes<HTMLDivElement> = {},
  ): JSX.HTMLAttributes<HTMLDivElement> =>
    applyStateDataAttributes(
      {
        ...props,
        id: props.id ?? errorMessageId(),
        role: props.role ?? "alert",
      },
      scope,
      "error-message",
      { disabled, invalid, readOnly, required },
    );

  return {
    describedBy,
    descriptionId,
    disabled,
    errorMessageId,
    fieldsetId,
    getDescriptionProps,
    getErrorMessageProps,
    getLegendProps,
    getRootProps,
    invalid,
    legendId,
    readOnly,
    registerDescription: descriptionIds.register,
    registerErrorMessage: errorMessageIds.register,
    required,
  };
}

function Root(props: FieldsetRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "disabled",
    "id",
    "invalid",
    "readOnly",
    "required",
  ]);
  const fieldset = createFieldset({
    disabled: () => local.disabled,
    id: () => local.id,
    invalid: () => local.invalid,
    readOnly: () => local.readOnly,
    required: () => local.required,
  });

  return (
    <FieldsetContext.Provider value={fieldset}>
      <fieldset {...fieldset.getRootProps({ ...others, id: local.id })}>{local.children}</fieldset>
    </FieldsetContext.Provider>
  );
}

function Legend(props: FieldsetLegendProps) {
  const fieldset = useFieldset("Legend");

  return <legend {...fieldset.getLegendProps(props)} />;
}

function Description(props: FieldsetDescriptionProps) {
  const fieldset = useFieldset("Description");
  let element: HTMLDivElement | undefined;

  onMount(() => {
    const unregister = fieldset.registerDescription(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <div
      {...fieldset.getDescriptionProps({
        ...props,
        ref: (nextElement) => {
          element = nextElement;
          assignRef(props.ref, nextElement);
        },
      })}
    />
  );
}

function ErrorMessage(props: FieldsetErrorMessageProps) {
  const fieldset = useFieldset("ErrorMessage");
  const [local, others] = splitProps(props, ["forceMount"]);
  let element: HTMLDivElement | undefined;

  onMount(() => {
    const unregister = fieldset.registerErrorMessage(() => element?.id);
    onCleanup(unregister);
  });

  return (
    <Show when={local.forceMount || fieldset.invalid()}>
      <div
        {...fieldset.getErrorMessageProps({
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

function useFieldset(part: string) {
  const context = useContext(FieldsetContext);

  if (!context) {
    throw new Error(`Fieldset.${part} must be used within Fieldset.Root`);
  }

  return context;
}

function ariaBoolean(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

function applyStateDataAttributes<T extends Record<string, unknown>>(
  props: T,
  scope: string,
  part: string,
  state: {
    disabled: Accessor<boolean>;
    invalid: Accessor<boolean>;
    readOnly: Accessor<boolean>;
    required: Accessor<boolean>;
  },
): T {
  Object.assign(props, partDataAttributes(scope, part));
  Object.defineProperties(props, {
    "data-disabled": { enumerable: true, get: () => dataBoolean(state.disabled()) },
    "data-invalid": { enumerable: true, get: () => dataBoolean(state.invalid()) },
    "data-readonly": { enumerable: true, get: () => dataBoolean(state.readOnly()) },
    "data-required": { enumerable: true, get: () => dataBoolean(state.required()) },
  });
  return props;
}

function assignRef<T>(ref: unknown, element: T) {
  if (typeof ref === "function") {
    (ref as (element: T) => void)(element);
  }
}

export const Fieldset = {
  Root,
  Legend,
  Description,
  ErrorMessage,
};
