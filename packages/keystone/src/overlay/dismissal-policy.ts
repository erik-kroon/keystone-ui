import type { Accessor } from "solid-js";
import { contains } from "./dom";
import type { OverlayLayerOutsideEvent } from "./layer-kernel";

export type OverlayDismissalPolicyContentEvents = {
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onFocusOutside?: (event: OverlayLayerOutsideEvent) => void;
  onInteractOutside?: (event: OverlayLayerOutsideEvent) => void;
  onMountAutoFocus?: (event: Event) => void;
  onPointerDownOutside?: (event: OverlayLayerOutsideEvent) => void;
  onUnmountAutoFocus?: (event: Event) => void;
};

export type OverlayDismissalPolicyLayerOptions<Reason extends string> = {
  containsTrigger?: boolean;
  disableOutsidePointerEvents?: Accessor<boolean>;
  dismissReason?: (event: Event) => Reason;
  modal?: Accessor<boolean>;
  onDismiss?: (event: Event) => void;
  restoreFocus?: Accessor<boolean>;
  trapFocus?: Accessor<boolean>;
};

export type CreateOverlayDismissalPolicyOptions<Reason extends string> = {
  close: (event: Event | undefined, reason: Reason) => void;
  contentEvents: Accessor<OverlayDismissalPolicyContentEvents | undefined>;
  modal: Accessor<boolean>;
  triggerElement: Accessor<HTMLElement | undefined>;
};

export type OverlayDismissalPolicy<Reason extends string> = {
  containsTarget: (
    target: Node | null,
    options: OverlayDismissalPolicyLayerOptions<Reason>,
  ) => boolean;
  disableOutsidePointerEvents: (options: OverlayDismissalPolicyLayerOptions<Reason>) => boolean;
  onDismiss: (event: Event, options: OverlayDismissalPolicyLayerOptions<Reason>) => void;
  onEscapeKeyDown: (event: KeyboardEvent) => void;
  onFocusOutside: (
    event: OverlayLayerOutsideEvent,
    options: OverlayDismissalPolicyLayerOptions<Reason>,
  ) => void;
  onInteractOutside: (
    event: OverlayLayerOutsideEvent,
    options: OverlayDismissalPolicyLayerOptions<Reason>,
  ) => void;
  onMountAutoFocus: (event: Event) => void;
  onPointerDownOutside: (
    event: OverlayLayerOutsideEvent,
    options: OverlayDismissalPolicyLayerOptions<Reason>,
  ) => void;
  onUnmountAutoFocus: (event: Event) => void;
  restoreFocus: (options: OverlayDismissalPolicyLayerOptions<Reason>) => boolean;
  trapFocus: (options: OverlayDismissalPolicyLayerOptions<Reason>) => boolean;
};

export function createOverlayDismissalPolicy<Reason extends string>(
  policyOptions: CreateOverlayDismissalPolicyOptions<Reason>,
): OverlayDismissalPolicy<Reason> {
  let hasInteractedOutside = false;
  let hasPointerDownOutside = false;
  const modal = (options: OverlayDismissalPolicyLayerOptions<Reason>) =>
    options.modal?.() ?? policyOptions.modal();
  const contentEvents = () => policyOptions.contentEvents();

  return {
    containsTarget: (target, options) => {
      return options.containsTrigger === true && contains(policyOptions.triggerElement(), target);
    },
    disableOutsidePointerEvents: (options) => {
      return options.disableOutsidePointerEvents?.() ?? modal(options);
    },
    onDismiss: (event, options) => {
      if (options.onDismiss) {
        options.onDismiss(event);
        return;
      }

      policyOptions.close(event, options.dismissReason?.(event) ?? ("programmatic" as Reason));
    },
    onEscapeKeyDown: (event) => {
      contentEvents()?.onEscapeKeyDown?.(event);
    },
    onFocusOutside: (event, options) => {
      contentEvents()?.onFocusOutside?.(event);

      if (modal(options) || hasPointerDownOutside) {
        event.preventDefault();
      }
    },
    onInteractOutside: (event, options) => {
      contentEvents()?.onInteractOutside?.(event);

      if (!modal(options) && !event.defaultPrevented) {
        hasInteractedOutside = true;

        if (event.detail.originalEvent.type === "pointerdown") {
          hasPointerDownOutside = true;
        }
      }
    },
    onMountAutoFocus: (event) => {
      contentEvents()?.onMountAutoFocus?.(event);
    },
    onPointerDownOutside: (event, options) => {
      contentEvents()?.onPointerDownOutside?.(event);

      if (modal(options) && isContextMenuPointer(event.detail.originalEvent)) {
        event.preventDefault();
      }
    },
    onUnmountAutoFocus: (event) => {
      contentEvents()?.onUnmountAutoFocus?.(event);
      hasInteractedOutside = false;
      hasPointerDownOutside = false;
    },
    restoreFocus: (options) => {
      return options.restoreFocus?.() ?? (modal(options) || !hasInteractedOutside);
    },
    trapFocus: (options) => {
      return options.trapFocus?.() ?? modal(options);
    },
  };
}

function isContextMenuPointer(event: Event) {
  return (
    typeof PointerEvent !== "undefined" &&
    event instanceof PointerEvent &&
    (event.button === 2 || (event.button === 0 && event.ctrlKey === true))
  );
}
