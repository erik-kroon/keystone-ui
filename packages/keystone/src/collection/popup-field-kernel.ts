import { createEffect, createSignal, type Accessor, type JSX } from "solid-js";
import { createFormControl, type FormControlApi, type FormControlValue } from "../form/index";
import { getPartDataAttributes } from "../metadata/index";
import { assignRef } from "../overlay/dom";
import {
  createFloatingAdapter,
  type FloatingAdapter,
  type FloatingArrowProps,
  type FloatingCollisionBoundary,
  type FloatingPlacement,
  type FloatingRootBoundary,
  type FloatingSticky,
  type FloatingStrategy,
} from "../overlay/index";
import {
  createControllableBooleanSignal,
  createStableId,
  getOpenClosedState,
  scheduleMicrotask,
} from "../utils/index";

export type PopupFieldOpenChangeOptions<Detail> = {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: Detail) => void;
  open?: Accessor<boolean | undefined>;
  programmaticDetail: Detail;
};

export type PopupFieldStateOptions = {
  disabled?: Accessor<boolean | undefined>;
  invalid?: Accessor<boolean | undefined>;
  readOnly?: Accessor<boolean | undefined>;
  required?: Accessor<boolean | undefined>;
};

export type PopupFieldFloatingOptions = {
  arrowPadding?: Accessor<number | undefined>;
  collisionBoundary?: Accessor<FloatingCollisionBoundary | undefined>;
  collisionPadding?: Accessor<number | undefined>;
  fitViewport?: Accessor<boolean | undefined>;
  gutter?: Accessor<number | undefined>;
  placement?: Accessor<FloatingPlacement | undefined>;
  rootBoundary?: Accessor<FloatingRootBoundary | undefined>;
  sameWidth?: Accessor<boolean | undefined>;
  sticky?: Accessor<FloatingSticky | undefined>;
  strategy?: Accessor<FloatingStrategy | undefined>;
};

export type PopupFieldFormOptions<Value> = {
  form?: Accessor<string | undefined>;
  id?: Accessor<string | undefined>;
  name?: Accessor<string | undefined>;
  onReset: () => void;
  value: Accessor<Value>;
};

export type PopupFieldHiddenInputDescriptor = {
  disabled?: boolean;
  name: string;
  value: string;
};

export type PopupFieldHiddenInputOptions = {
  formControl: FormControlApi;
  input: Accessor<PopupFieldHiddenInputDescriptor>;
  ref?: HTMLInputElement | ((element: HTMLInputElement) => void);
  syncInputValue: (value: string) => void;
};

export type PopupFieldKernelOptions<Detail> = PopupFieldStateOptions &
  PopupFieldFloatingOptions & {
    anchorPart: string;
    contentPart?: string;
    listboxPart?: string;
    open: PopupFieldOpenChangeOptions<Detail>;
    positionerPart?: string;
    scope: string;
  };

export type PopupFieldKernelApi<
  Detail,
  Anchor extends HTMLElement,
  Value extends FormControlValue | undefined,
> = {
  anchorId: string;
  contentId: string;
  createFormControl: (options: Omit<PopupFieldFormOptions<Value>, "id">) => FormControlApi;
  disabled: () => boolean;
  floating: FloatingAdapter;
  getArrowProps: <T extends HTMLElement = HTMLElement>(
    props: Omit<FloatingArrowProps<T>, "children">,
  ) => Record<string, unknown>;
  getContentProps: (
    props: JSX.HTMLAttributes<HTMLDivElement> & {
      ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
    },
  ) => Record<string, unknown>;
  getFloatingPartProps: (part: string) => Record<string, unknown>;
  getPartProps: (part: string) => Record<string, unknown>;
  getPositionerProps: (
    props: JSX.HTMLAttributes<HTMLDivElement> & {
      ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
    },
  ) => Record<string, unknown>;
  invalid: () => boolean;
  listboxId: string;
  open: () => boolean;
  readOnly: () => boolean;
  required: () => boolean;
  setAnchorElement: (element: Anchor) => void;
  setOpen: (open: boolean, detail: Detail) => void;
  state: () => "closed" | "open";
};

export function createPopupFieldKernel<
  Detail,
  Anchor extends HTMLElement,
  Value extends FormControlValue | undefined,
>(options: PopupFieldKernelOptions<Detail>): PopupFieldKernelApi<Detail, Anchor, Value> {
  const anchorId = createStableId(`${options.scope}-${options.anchorPart}`);
  const contentId = createStableId(`${options.scope}-${options.contentPart ?? "content"}`);
  const listboxId = createStableId(`${options.scope}-${options.listboxPart ?? "listbox"}`);
  const [anchorElement, setAnchorElement] = createSignal<Anchor>();
  const [contentElement, setContentElement] = createSignal<HTMLDivElement>();
  const [positionerElement, setPositionerElement] = createSignal<HTMLDivElement>();
  const [open, setOpenState] = createControllableBooleanSignal<Detail>({
    value: options.open.open,
    defaultValue: options.open.defaultOpen ?? false,
    defaultDetail: options.open.programmaticDetail,
    onChange: options.open.onOpenChange,
  });
  const disabled = () => options.disabled?.() ?? false;
  const invalid = () => options.invalid?.() ?? false;
  const readOnly = () => options.readOnly?.() ?? false;
  const required = () => options.required?.() ?? false;
  const floating = createFloatingAdapter({
    anchor: anchorElement,
    floating: () => positionerElement() ?? contentElement(),
    enabled: open,
    arrowPadding: options.arrowPadding,
    collisionBoundary: options.collisionBoundary,
    collisionPadding: options.collisionPadding,
    fitViewport: () => options.fitViewport?.() ?? true,
    gutter: options.gutter,
    placement: options.placement,
    rootBoundary: options.rootBoundary,
    sameWidth: () => options.sameWidth?.() ?? true,
    sticky: options.sticky,
    strategy: options.strategy,
  });
  const state = () => getOpenClosedState(open());
  const partProps = (part: string) => ({
    ...getPartDataAttributes(options.scope, part),
  });
  const floatingPartProps = (part: string) => ({
    ...partProps(part),
    get "data-side"() {
      return floating.side();
    },
    get "data-align"() {
      return floating.align();
    },
  });

  return {
    anchorId: anchorId(),
    contentId: contentId(),
    createFormControl: (formOptions) =>
      createFormControl({
        form: formOptions.form,
        id: anchorId,
        name: formOptions.name,
        value: formOptions.value,
        disabled,
        invalid,
        readonly: readOnly,
        required,
        onReset: formOptions.onReset,
      }),
    disabled,
    floating,
    getArrowProps: (props) => ({
      ...floating.getArrowProps(props),
      ...floatingPartProps("arrow"),
      "aria-hidden": "true",
      get "data-state"() {
        return state();
      },
    }),
    getContentProps: (props) => {
      const floatingProps = floating.getFloatingProps({ style: props.style });

      return {
        ...props,
        id: contentId(),
        ...partProps(options.contentPart ?? "content"),
        get "data-state"() {
          return state();
        },
        get "data-side"() {
          return floating.side();
        },
        get "data-align"() {
          return floating.align();
        },
        style: floatingProps.style,
        ref: (element: HTMLDivElement) => {
          setContentElement(element);
          assignRef(props.ref, element);
          scheduleMicrotask(floating.update);
        },
      };
    },
    getFloatingPartProps: floatingPartProps,
    getPartProps: partProps,
    getPositionerProps: (props) => {
      const floatingProps = floating.getFloatingProps({ style: props.style });

      return {
        ...props,
        ...partProps(options.positionerPart ?? "positioner"),
        get "data-state"() {
          return state();
        },
        get "data-side"() {
          return floating.side();
        },
        get "data-align"() {
          return floating.align();
        },
        style: floatingProps.style,
        ref: (element: HTMLDivElement) => {
          setPositionerElement(element);
          assignRef(props.ref, element);
          scheduleMicrotask(floating.update);
        },
      };
    },
    invalid,
    listboxId: listboxId(),
    open,
    readOnly,
    required,
    setAnchorElement,
    setOpen: setOpenState,
    state,
  };
}

export function createPopupFieldHiddenInputProps(
  options: PopupFieldHiddenInputOptions,
): JSX.InputHTMLAttributes<HTMLInputElement> {
  let inputElement: HTMLInputElement | undefined;

  createEffect(() => {
    if (inputElement) {
      inputElement.value = options.input().value;
    }
  });

  return options.formControl.getHiddenInputProps({
    get disabled() {
      return options.input().disabled;
    },
    get name() {
      return options.input().name;
    },
    ref: (element) => {
      inputElement = element;
      element.value = options.input().value;
      options.formControl.registerFormReset(() => element);
      options.formControl.registerFormValueSync(() => element, options.syncInputValue);
      assignRef(options.ref, element);
    },
  });
}
