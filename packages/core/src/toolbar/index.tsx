import {
  createContext,
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import {
  callEventHandler,
  dataBoolean,
  partDataAttributes,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";
import { useDirection, type Direction as CoreDirection } from "../i18n/direction";

export type ToolbarOrientation = "horizontal" | "vertical";
export type ToolbarDirection = CoreDirection;

export type ToolbarPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type ToolbarRootProps = ToolbarPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    dir?: ToolbarDirection;
    disabled?: boolean;
    loopFocus?: boolean;
    orientation?: ToolbarOrientation;
  };

export type ToolbarButtonProps = ToolbarPartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref"> & {
    pressed?: boolean;
  };

export type ToolbarLinkProps = ToolbarPartProps<HTMLAnchorElement> &
  Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "ref"> & {
    disabled?: boolean;
  };

export type ToolbarSeparatorProps = ToolbarPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type CreateToolbarOptions = {
  dir?: () => ToolbarDirection | undefined;
  disabled?: () => boolean | undefined;
  loopFocus?: () => boolean | undefined;
  orientation?: () => ToolbarOrientation | undefined;
};

export type ToolbarApi = {
  dir: Accessor<ToolbarDirection>;
  disabled: Accessor<boolean>;
  loopFocus: Accessor<boolean>;
  moveFocus: (event: KeyboardEvent) => void;
  orientation: Accessor<ToolbarOrientation>;
  registerItem: (element: HTMLElement, disabled: Accessor<boolean>) => () => void;
};

type ToolbarItemRecord = {
  disabled: Accessor<boolean>;
  element: HTMLElement;
};

const ToolbarContext = createContext<ToolbarApi>();

export function createToolbar(options: CreateToolbarOptions = {}): ToolbarApi {
  const dir = createMemo(() => options.dir?.() ?? "ltr");
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const loopFocus = createMemo(() => options.loopFocus?.() ?? true);
  const orientation = createMemo(() => options.orientation?.() ?? "horizontal");
  const records: ToolbarItemRecord[] = [];
  let activeElement: HTMLElement | undefined;

  const enabledRecords = () => records.filter((record) => !record.disabled());

  const updateTabIndexes = () => {
    const enabled = enabledRecords();
    const fallback = enabled[0]?.element;
    const tabbable =
      activeElement && enabled.some((record) => record.element === activeElement)
        ? activeElement
        : fallback;

    for (const record of records) {
      record.element.tabIndex = record.element === tabbable && !record.disabled() ? 0 : -1;
    }
  };

  const moveFocus = (event: KeyboardEvent) => {
    const horizontal = orientation() === "horizontal";
    const nextKey = horizontal ? (dir() === "rtl" ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
    const previousKey = horizontal ? (dir() === "rtl" ? "ArrowRight" : "ArrowLeft") : "ArrowUp";

    if (![nextKey, previousKey, "Home", "End"].includes(event.key)) return;

    const enabled = enabledRecords();
    const currentIndex = enabled.findIndex((record) => record.element === event.currentTarget);
    if (currentIndex < 0) return;

    event.preventDefault();

    const lastIndex = enabled.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else if (event.key === nextKey) nextIndex = currentIndex + 1;
    else if (event.key === previousKey) nextIndex = currentIndex - 1;

    if (nextIndex > lastIndex) nextIndex = loopFocus() ? 0 : lastIndex;
    if (nextIndex < 0) nextIndex = loopFocus() ? lastIndex : 0;

    const nextElement = enabled[nextIndex]?.element;
    if (!nextElement) return;

    activeElement = nextElement;
    updateTabIndexes();
    nextElement.focus();
  };

  return {
    dir,
    disabled,
    loopFocus,
    moveFocus,
    orientation,
    registerItem: (element, itemDisabled) => {
      const record = {
        disabled: createMemo(() => disabled() || itemDisabled()),
        element,
      };
      const handleFocus = () => {
        if (!record.disabled()) {
          activeElement = element;
          updateTabIndexes();
        }
      };

      records.push(record);
      element.addEventListener("focus", handleFocus);
      createEffect(() => {
        record.disabled();
        updateTabIndexes();
      });
      updateTabIndexes();

      return () => {
        element.removeEventListener("focus", handleFocus);
        const index = records.indexOf(record);
        if (index >= 0) records.splice(index, 1);
        if (activeElement === element) activeElement = undefined;
        updateTabIndexes();
      };
    },
  };
}

function useToolbar(part: string) {
  const toolbar = useContext(ToolbarContext);
  if (!toolbar) throw new Error(`Toolbar.${part} must be used within Toolbar.Root`);
  return toolbar;
}

function Root(props: ToolbarRootProps) {
  const inheritedDir = useDirection();
  const [local, others] = splitProps(props, [
    "children",
    "dir",
    "disabled",
    "loopFocus",
    "orientation",
  ]);
  const toolbar = createToolbar({
    dir: () => local.dir ?? inheritedDir(),
    disabled: () => local.disabled,
    loopFocus: () => local.loopFocus,
    orientation: () => local.orientation,
  });

  return (
    <ToolbarContext.Provider value={toolbar}>
      <div
        {...others}
        aria-orientation={toolbar.orientation()}
        data-disabled={dataBoolean(toolbar.disabled())}
        data-dir={toolbar.dir()}
        data-orientation={toolbar.orientation()}
        dir={toolbar.dir()}
        role="toolbar"
        {...partDataAttributes("toolbar", "root")}
      >
        {local.children}
      </div>
    </ToolbarContext.Provider>
  );
}

function Button(props: ToolbarButtonProps) {
  const toolbar = useToolbar("Button");
  const [local, others] = splitProps(props, [
    "as",
    "children",
    "disabled",
    "onClick",
    "onKeyDown",
    "pressed",
    "ref",
    "type",
  ]);
  let unregister: (() => void) | undefined;
  const itemDisabled = createMemo(() => toolbar.disabled() || (local.disabled ?? false));
  const buttonProps = {
    ...others,
    "aria-pressed": local.pressed,
    "data-disabled": dataBoolean(itemDisabled()),
    "data-dir": toolbar.dir(),
    "data-orientation": toolbar.orientation(),
    "data-pressed": dataBoolean(local.pressed),
    disabled: itemDisabled(),
    onClick: (event: MouseEvent) => {
      callEventHandler(local.onClick, event);
    },
    onKeyDown: (event: KeyboardEvent) => {
      callEventHandler(local.onKeyDown, event);
      if (!event.defaultPrevented) toolbar.moveFocus(event);
    },
    ref: (element: HTMLButtonElement) => {
      if (typeof local.ref === "function") local.ref(element);
      unregister?.();
      unregister = toolbar.registerItem(element, itemDisabled);
    },
    type: local.type ?? "button",
    ...partDataAttributes("toolbar", "button"),
  };

  onCleanup(() => unregister?.());

  if (!local.as) return <button {...buttonProps}>{local.children}</button>;

  return renderPolymorphic(local.as, "button", {
    ...buttonProps,
    children: local.children,
  });
}

function Link(props: ToolbarLinkProps) {
  const toolbar = useToolbar("Link");
  const [local, others] = splitProps(props, [
    "children",
    "disabled",
    "onClick",
    "onKeyDown",
    "ref",
  ]);
  let unregister: (() => void) | undefined;
  const itemDisabled = createMemo(() => toolbar.disabled() || (local.disabled ?? false));

  onCleanup(() => unregister?.());

  return (
    <a
      {...others}
      aria-disabled={itemDisabled() ? "true" : undefined}
      data-disabled={dataBoolean(itemDisabled())}
      data-dir={toolbar.dir()}
      data-orientation={toolbar.orientation()}
      onClick={(event) => {
        callEventHandler(local.onClick, event);
        if (!event.defaultPrevented && itemDisabled()) event.preventDefault();
      }}
      onKeyDown={(event) => {
        callEventHandler(local.onKeyDown, event);
        if (!event.defaultPrevented) toolbar.moveFocus(event);
      }}
      ref={(element) => {
        if (typeof local.ref === "function") local.ref(element);
        unregister?.();
        unregister = toolbar.registerItem(element, itemDisabled);
      }}
      {...partDataAttributes("toolbar", "link")}
    >
      {local.children}
    </a>
  );
}

function Separator(props: ToolbarSeparatorProps) {
  const toolbar = useToolbar("Separator");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <div
      {...others}
      aria-orientation={toolbar.orientation()}
      data-orientation={toolbar.orientation()}
      role="separator"
      {...partDataAttributes("toolbar", "separator")}
    >
      {local.children}
    </div>
  );
}

export const Toolbar = {
  Root,
  Button,
  Link,
  Separator,
};
