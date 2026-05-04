import { composeEventHandlers } from "../utils/index";
import type { MenuApi, MenuTriggerProps } from "./types";

const contextMenuLongPressStart = { x: 0, y: 0 };
let contextMenuLongPressTimeout: ReturnType<typeof setTimeout> | undefined;

function createPointAnchor(x: number, y: number, contextElement?: Element) {
  return {
    contextElement,
    getBoundingClientRect: () =>
      ({
        bottom: y,
        height: 0,
        left: x,
        right: x,
        top: y,
        width: 0,
        x,
        y,
        toJSON: () => undefined,
      }) as DOMRect,
  };
}

function clearContextMenuLongPress() {
  if (contextMenuLongPressTimeout !== undefined) {
    clearTimeout(contextMenuLongPressTimeout);
    contextMenuLongPressTimeout = undefined;
  }
}

function scheduleContextMenuLongPress(
  event: PointerEvent,
  menu: Pick<MenuApi, "setOpen" | "setVirtualAnchor">,
) {
  clearContextMenuLongPress();
  contextMenuLongPressStart.x = event.clientX;
  contextMenuLongPressStart.y = event.clientY;
  const target = event.currentTarget as Element | null;

  contextMenuLongPressTimeout = setTimeout(() => {
    menu.setVirtualAnchor(createPointAnchor(event.clientX, event.clientY, target ?? undefined));
    menu.setOpen(true, { event, reason: "trigger" });
  }, 700);
}

export function getContextMenuTriggerProps(
  props: Omit<MenuTriggerProps, "as" | "children">,
  menu: Pick<MenuApi, "setOpen" | "setVirtualAnchor">,
) {
  return {
    ...props,
    onContextMenu: composeEventHandlers<MouseEvent>(props.onContextMenu, (event) => {
      event.preventDefault();
      menu.setVirtualAnchor(
        createPointAnchor(event.clientX, event.clientY, event.currentTarget as Element),
      );
      menu.setOpen(true, { event, reason: "trigger" });
    }),
    onPointerCancel: composeEventHandlers<PointerEvent>(props.onPointerCancel, () => {
      clearContextMenuLongPress();
    }),
    onPointerDown: composeEventHandlers<PointerEvent>(props.onPointerDown, (event) => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") {
        return;
      }

      scheduleContextMenuLongPress(event, menu);
    }),
    onPointerMove: composeEventHandlers<PointerEvent>(props.onPointerMove, (event) => {
      if (
        Math.abs(event.clientX - contextMenuLongPressStart.x) > 8 ||
        Math.abs(event.clientY - contextMenuLongPressStart.y) > 8
      ) {
        clearContextMenuLongPress();
      }
    }),
    onPointerUp: composeEventHandlers<PointerEvent>(props.onPointerUp, () => {
      clearContextMenuLongPress();
    }),
  };
}
