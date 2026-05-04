import { createMemo, createUniqueId, splitProps, type JSX } from "solid-js";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  dataBoolean,
  getOpenClosedState,
  partDataAttributes,
  type CoreChangeDetail,
} from "../utils/index";

export type DisclosureChangeDetail<TReason extends string = "trigger" | "programmatic"> =
  CoreChangeDetail<TReason>;

export type DisclosureControllerOptions<TReason extends string = "trigger" | "programmatic"> = {
  contentId?: () => string | undefined;
  defaultOpen?: boolean;
  disabled?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: DisclosureChangeDetail<TReason>) => void;
  open?: () => boolean | undefined;
  scope: string;
};

export type DisclosureTriggerProps = Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "ref"
> & {
  ref?: HTMLButtonElement | ((element: HTMLButtonElement) => void);
};

export type DisclosureContentProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "ref"
> & {
  hiddenUntilFound?: boolean;
  onBeforeMatch?: JSX.HTMLAttributes<HTMLDivElement>["onBeforeMatch"];
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

export function createDisclosureController<TReason extends string = "trigger" | "programmatic">(
  options: DisclosureControllerOptions<TReason>,
) {
  const fallbackContentId = `keystone-${options.scope}-content-${createUniqueId()}`;
  const contentId = createMemo(() => options.contentId?.() ?? fallbackContentId);
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const [open, setOpenState] = createControllableBooleanSignal<DisclosureChangeDetail<TReason>>({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    defaultDetail: { reason: "programmatic" } as DisclosureChangeDetail<TReason>,
    onChange: options.onOpenChange,
  });

  const setOpen = (nextOpen: boolean, detail: DisclosureChangeDetail<TReason>) => {
    if (disabled() && detail.reason !== "programmatic") {
      return open();
    }

    return setOpenState(nextOpen, detail);
  };

  const getPartProps = (part: string) => ({
    ...partDataAttributes(options.scope, part),
    get "data-state"() {
      return getOpenClosedState(open());
    },
    get "data-disabled"() {
      return dataBoolean(disabled());
    },
  });

  return {
    contentId,
    disabled,
    getContentProps: (props: DisclosureContentProps) => {
      const [local, others] = splitProps(props, ["hiddenUntilFound", "onBeforeMatch"]);

      return {
        ...others,
        id: contentId(),
        ...partDataAttributes(options.scope, "content"),
        get hidden() {
          if (open() || local.hiddenUntilFound) return undefined;
          return true;
        },
        get "attr:hidden"() {
          if (open()) return undefined;
          return local.hiddenUntilFound ? "until-found" : undefined;
        },
        onBeforeMatch: composeEventHandlers(local.onBeforeMatch, (event) =>
          setOpen(true, { event, reason: "browser-find" } as DisclosureChangeDetail<TReason>),
        ),
        get "data-state"() {
          return getOpenClosedState(open());
        },
        get "data-disabled"() {
          return dataBoolean(disabled());
        },
      };
    },
    getTriggerProps: (props: DisclosureTriggerProps) => {
      const [local, others] = splitProps(props, ["disabled", "onClick"]);

      return {
        ...others,
        type: others.type ?? "button",
        ...partDataAttributes(options.scope, "trigger"),
        get disabled() {
          return local.disabled ?? disabled();
        },
        "aria-controls": contentId(),
        get "aria-expanded"() {
          return open();
        },
        onClick: composeEventHandlers(local.onClick, (event) =>
          setOpen(!open(), {
            event,
            reason: "trigger",
          } as unknown as DisclosureChangeDetail<TReason>),
        ),
        get "data-state"() {
          return getOpenClosedState(open());
        },
        get "data-disabled"() {
          return dataBoolean(disabled());
        },
      };
    },
    getPartProps,
    open,
    setOpen,
  };
}
