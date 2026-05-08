import {
  createMemo,
  createUniqueId,
  Index,
  Show,
  splitProps,
  type Accessor,
  type JSX,
  type ParentProps,
} from "solid-js";
import { FormMessage } from "@/components/ui/form-message";
import { cn } from "@/lib/cn";

export type FieldArrayApi<TValue = unknown> = {
  name: string;
  state: {
    value: readonly TValue[];
    meta: {
      errors?: readonly unknown[];
      isDirty?: boolean;
      isTouched?: boolean;
      isValidating?: boolean;
    };
  };
  handleBlur?: () => void;
  handleChange?: (value: readonly TValue[]) => void;
  moveValue?: (fromIndex: number, toIndex: number) => void;
  pushValue: (value: TValue) => void;
  removeValue: (index: number) => void;
  swapValues?: (firstIndex: number, secondIndex: number) => void;
};

export type FieldArrayFormApi<TValue = unknown> = {
  Field: (props: {
    name: string;
    mode: "array";
    validators?: unknown;
    children: (field: Accessor<FieldArrayApi<TValue>>) => JSX.Element;
  }) => JSX.Element;
};

export type FieldArrayRenderContext<TValue = unknown> = {
  add: (value?: TValue) => void;
  count: Accessor<number>;
  field: Accessor<FieldArrayApi<TValue>>;
  firstError: Accessor<string | undefined>;
  invalid: Accessor<boolean>;
  itemName: (index: number, path?: string) => string;
  items: Accessor<readonly TValue[]>;
  move: (fromIndex: number, toIndex: number) => void;
  remove: (index: number) => void;
  swap: (firstIndex: number, secondIndex: number) => void;
};

export type FieldArrayProps<TValue = unknown> = {
  children: (context: FieldArrayRenderContext<TValue>) => JSX.Element;
  form: unknown;
  name: string;
  validators?: unknown;
  class?: string;
  defaultValue?: TValue | (() => TValue);
  description?: JSX.Element;
  descriptionClass?: string;
  empty?: JSX.Element;
  error?: JSX.Element;
  errorClass?: string;
  invalid?: boolean;
  label?: JSX.Element;
  labelClass?: string;
};

export type FieldArrayItemsProps<TValue = unknown> = {
  children: (item: Accessor<TValue>, index: number) => JSX.Element;
  context: FieldArrayRenderContext<TValue>;
  class?: string;
  empty?: JSX.Element;
};

export type FieldArrayItemProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export type FieldArrayActionProps<TValue = unknown> = ParentProps<
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> & {
    context: FieldArrayRenderContext<TValue>;
    onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
    type?: "button";
  }
>;

export type FieldArrayRemoveProps<TValue = unknown> = FieldArrayActionProps<TValue> & {
  index: number;
};

export type FieldArrayMoveProps<TValue = unknown> = FieldArrayActionProps<TValue> & {
  fromIndex: number;
  toIndex: number;
};

const classes = (...tokens: string[]) => tokens.join(" ");

export function FieldArray<TValue = unknown>(props: FieldArrayProps<TValue>) {
  const FormField = (props.form as FieldArrayFormApi<TValue>).Field;

  return (
    <FormField name={props.name} mode="array" validators={props.validators}>
      {(field) => <FieldArrayRoot {...props} field={field} />}
    </FormField>
  );
}

function FieldArrayRoot<TValue = unknown>(
  props: FieldArrayProps<TValue> & {
    field: Accessor<FieldArrayApi<TValue>>;
  },
) {
  const [local] = splitProps(props, [
    "children",
    "class",
    "defaultValue",
    "description",
    "descriptionClass",
    "empty",
    "error",
    "errorClass",
    "field",
    "invalid",
    "label",
    "labelClass",
    "name",
  ]);
  const baseId = createUniqueId();
  const labelId = () => `${baseId}-label`;
  const descriptionId = () => `${baseId}-description`;
  const errorId = () => `${baseId}-error`;
  const items = createMemo(() => local.field().state.value ?? []);
  const firstError = createMemo(() => {
    if (typeof local.error === "string") return local.error;
    const first = local.field().state.meta.errors?.[0];
    return typeof first === "string"
      ? first
      : first && typeof first === "object" && "message" in first
        ? String((first as { message: unknown }).message)
        : first
          ? String(first)
          : undefined;
  });
  const invalid = createMemo(
    () => local.invalid || (Boolean(local.field().state.meta.isTouched) && Boolean(firstError())),
  );
  const describedBy = () =>
    [
      local.description ? descriptionId() : undefined,
      invalid() && firstError() ? errorId() : undefined,
    ]
      .filter(Boolean)
      .join(" ");
  const defaultValue = () =>
    typeof local.defaultValue === "function"
      ? (local.defaultValue as () => TValue)()
      : (local.defaultValue as TValue);
  const context = {
    add: (value?: TValue) => local.field().pushValue(value ?? defaultValue()),
    count: () => items().length,
    field: local.field,
    firstError,
    invalid,
    itemName: (index: number, path = "") =>
      `${local.field().name}[${index}]${path ? (path.startsWith(".") ? path : `.${path}`) : ""}`,
    items,
    move: (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      const moveValue = local.field().moveValue;
      if (moveValue) {
        moveValue(fromIndex, toIndex);
        return;
      }
      const next = [...items()];
      const [item] = next.splice(fromIndex, 1);
      if (item === undefined) return;
      next.splice(toIndex, 0, item);
      local.field().handleChange?.(next);
    },
    remove: (index: number) => local.field().removeValue(index),
    swap: (firstIndex: number, secondIndex: number) => {
      if (firstIndex === secondIndex) return;
      const swapValues = local.field().swapValues;
      if (swapValues) {
        swapValues(firstIndex, secondIndex);
        return;
      }
      const next = [...items()];
      [next[firstIndex], next[secondIndex]] = [
        next[secondIndex] as TValue,
        next[firstIndex] as TValue,
      ];
      local.field().handleChange?.(next);
    },
  } satisfies FieldArrayRenderContext<TValue>;

  return (
    <div
      role="group"
      aria-labelledby={local.label ? labelId() : undefined}
      aria-describedby={describedBy() || undefined}
      aria-invalid={invalid() || undefined}
      data-scope="ui-field-array"
      data-part="root"
      data-slot="field-array"
      data-empty={items().length === 0 ? "" : undefined}
      data-invalid={invalid() ? "" : undefined}
      data-dirty={local.field().state.meta.isDirty ? "" : undefined}
      data-touched={local.field().state.meta.isTouched ? "" : undefined}
      data-validating={local.field().state.meta.isValidating ? "" : undefined}
      data-count={items().length}
      class={cn(classes("ui-field-array", "flex", "flex-col", "gap-2"), local.class)}
    >
      <Show when={local.label}>
        <div
          id={labelId()}
          data-scope="ui-field-array"
          data-part="label"
          data-slot="field-array-label"
          class={cn(
            classes("ui-field-array-label", "font-medium", "text-foreground", "text-sm"),
            local.labelClass,
          )}
        >
          {local.label}
        </div>
      </Show>
      {local.children(context)}
      <Show when={items().length === 0 && local.empty}>
        <div
          data-scope="ui-field-array"
          data-part="empty"
          data-slot="field-array-empty"
          class="ui-field-array-empty text-muted-foreground text-sm"
        >
          {local.empty}
        </div>
      </Show>
      <Show when={local.description}>
        <p
          id={descriptionId()}
          data-scope="ui-field-array"
          data-part="description"
          data-slot="field-array-description"
          class={cn(
            "ui-field-array-description text-muted-foreground text-xs",
            local.descriptionClass,
          )}
        >
          {local.description}
        </p>
      </Show>
      <FormMessage
        id={errorId()}
        field={local.field()}
        forceMount={false}
        invalid={invalid()}
        data-scope="ui-field-array"
        data-part="error"
        data-slot="field-array-error"
        class={cn("ui-field-array-error", local.errorClass)}
      >
        {firstError()}
      </FormMessage>
    </div>
  );
}

export function FieldArrayItems<TValue = unknown>(props: FieldArrayItemsProps<TValue>) {
  return (
    <Show
      when={props.context.items().length > 0}
      fallback={
        <Show when={props.empty}>
          <div
            data-scope="ui-field-array"
            data-part="empty"
            data-slot="field-array-empty"
            class="ui-field-array-empty text-muted-foreground text-sm"
          >
            {props.empty}
          </div>
        </Show>
      }
    >
      <div
        data-scope="ui-field-array"
        data-part="items"
        data-slot="field-array-items"
        class={cn("ui-field-array-items flex flex-col gap-2", props.class)}
      >
        <Index each={props.context.items()}>{(item, index) => props.children(item, index)}</Index>
      </div>
    </Show>
  );
}

export function FieldArrayItem(props: FieldArrayItemProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      {...rest}
      data-scope="ui-field-array"
      data-part="item"
      data-slot="field-array-item"
      class={cn("ui-field-array-item", local.class)}
    />
  );
}

export function FieldArrayAdd<TValue = unknown>(props: FieldArrayActionProps<TValue>) {
  const [local, rest] = splitProps(props, ["children", "class", "context", "onClick", "type"]);

  return (
    <button
      {...rest}
      type={local.type ?? "button"}
      data-scope="ui-field-array"
      data-part="add"
      data-slot="field-array-add"
      onClick={(event) => {
        local.onClick?.(event);
        if (!event.defaultPrevented) {
          local.context.add();
        }
      }}
      class={cn("ui-field-array-add", local.class)}
    >
      {local.children ?? "Add"}
    </button>
  );
}

export function FieldArrayRemove<TValue = unknown>(props: FieldArrayRemoveProps<TValue>) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "context",
    "index",
    "onClick",
    "type",
  ]);

  return (
    <button
      {...rest}
      type={local.type ?? "button"}
      data-scope="ui-field-array"
      data-part="remove"
      data-slot="field-array-remove"
      onClick={(event) => {
        local.onClick?.(event);
        if (!event.defaultPrevented) {
          local.context.remove(local.index);
        }
      }}
      class={cn("ui-field-array-remove", local.class)}
    >
      {local.children ?? "Remove"}
    </button>
  );
}

export function FieldArrayMove<TValue = unknown>(props: FieldArrayMoveProps<TValue>) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "context",
    "fromIndex",
    "onClick",
    "toIndex",
    "type",
  ]);

  return (
    <button
      {...rest}
      type={local.type ?? "button"}
      data-scope="ui-field-array"
      data-part="move"
      data-slot="field-array-move"
      onClick={(event) => {
        local.onClick?.(event);
        if (!event.defaultPrevented) {
          local.context.move(local.fromIndex, local.toIndex);
        }
      }}
      class={cn("ui-field-array-move", local.class)}
    />
  );
}
