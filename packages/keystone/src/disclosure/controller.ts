import { createMemo, createUniqueId, splitProps, type JSX } from "solid-js";
import {
  composeEventHandlers,
  createControllableBooleanSignal,
  dataBoolean,
  partDataAttributes,
} from "../utils/index";

export type DisclosureChangeDetail<TReason extends string = "trigger" | "programmatic"> = {
  event?: Event;
  reason: TReason;
};

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
  onBeforeMatch?: unknown;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

export function createDisclosureController<TReason extends string = "trigger" | "programmatic">(
  options: DisclosureControllerOptions<TReason>,
) {
  const fallbackContentId = `keystone-${options.scope}-content-${createUniqueId()}`;
  const contentId = createMemo(() => options.contentId?.() ?? fallbackContentId);
  const disabled = createMemo(() => options.disabled?.() ?? false);
  let pendingDetail: DisclosureChangeDetail<TReason> | undefined;
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (nextOpen) => {
      options.onOpenChange?.(nextOpen, pendingDetail ?? ({ reason: "programmatic" } as never));
      pendingDetail = undefined;
    },
  });

  const setOpen = (nextOpen: boolean, detail: DisclosureChangeDetail<TReason>) => {
    if (disabled() && detail.reason !== "programmatic") {
      return open();
    }

    pendingDetail = detail;
    const result = setOpenState(nextOpen);
    pendingDetail = undefined;
    return result;
  };

  const getPartProps = (part: string) => ({
    ...partDataAttributes(options.scope, part),
    get "data-state"() {
      return open() ? "open" : "closed";
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
          return open() ? "open" : "closed";
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
          setOpen(!open(), { event, reason: "trigger" } as DisclosureChangeDetail<TReason>),
        ),
        get "data-state"() {
          return open() ? "open" : "closed";
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
