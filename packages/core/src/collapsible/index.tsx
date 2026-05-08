import {
  Show,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { createDisclosureController, type DisclosureChangeDetail } from "../disclosure/controller";
import {
  callEventHandler,
  dataBoolean,
  getOpenClosedState,
  partDataAttributes,
  renderPolymorphic,
  type PolymorphicProps,
} from "../utils/index";

export type CollapsibleOpenChangeDetail = DisclosureChangeDetail<
  "trigger" | "programmatic" | "browser-find"
>;

export type CollapsiblePartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type CollapsibleRootProps = CollapsiblePartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    defaultOpen?: boolean;
    disabled?: boolean;
    onOpenChange?: (open: boolean, detail: CollapsibleOpenChangeDetail) => void;
    open?: boolean;
  };

export type CollapsibleTriggerProps = CollapsiblePartProps<HTMLButtonElement> &
  PolymorphicProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;

export type CollapsibleContentProps = CollapsiblePartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    forceMount?: boolean;
    hiddenUntilFound?: boolean;
  };

export type CollapsibleTriggerContractProps = Omit<CollapsibleTriggerProps, "as" | "children">;
export type CollapsibleContentContractProps = Omit<
  CollapsibleContentProps,
  "children" | "forceMount"
>;

export type CollapsibleApi = {
  contentId: () => string;
  disabled: () => boolean;
  getContentProps: (props: CollapsibleContentContractProps) => Record<string, unknown>;
  getTriggerProps: (props: CollapsibleTriggerContractProps) => Record<string, unknown>;
  open: () => boolean;
  setOpen: (open: boolean, detail: CollapsibleOpenChangeDetail) => boolean;
};

export type CreateCollapsibleOptions = {
  defaultOpen?: boolean;
  disabled?: () => boolean | undefined;
  onOpenChange?: (open: boolean, detail: CollapsibleOpenChangeDetail) => void;
  open?: () => boolean | undefined;
};

const CollapsibleContext = createContext<CollapsibleApi>();
const COLLAPSIBLE_CONTENT_TRANSITION_MS = 200;

export function createCollapsible(options: CreateCollapsibleOptions = {}): CollapsibleApi {
  const disclosure = createDisclosureController({
    scope: "collapsible",
    defaultOpen: options.defaultOpen,
    disabled: options.disabled,
    onOpenChange: options.onOpenChange,
    open: options.open,
  });

  return disclosure;
}

function useCollapsible(part: string) {
  const collapsible = useContext(CollapsibleContext);

  if (!collapsible) {
    throw new Error(`Collapsible.${part} must be used within Collapsible.Root`);
  }

  return collapsible;
}

function Root(props: CollapsibleRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "defaultOpen",
    "disabled",
    "onOpenChange",
    "open",
  ]);
  const collapsible = createCollapsible({
    defaultOpen: local.defaultOpen,
    disabled: () => local.disabled,
    onOpenChange: local.onOpenChange,
    open: () => local.open,
  });

  return (
    <CollapsibleContext.Provider value={collapsible}>
      <div
        {...others}
        data-disabled={dataBoolean(collapsible.disabled())}
        data-state={getOpenClosedState(collapsible.open())}
        {...partDataAttributes("collapsible", "root")}
      >
        {local.children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function Trigger(props: CollapsibleTriggerProps) {
  const collapsible = useCollapsible("Trigger");
  const [local, others] = splitProps(props, ["as", "children"]);
  const triggerProps = collapsible.getTriggerProps(others);

  if (!local.as) {
    return (
      <button {...triggerProps} data-panel-open={collapsible.open() ? "" : undefined}>
        {local.children}
      </button>
    );
  }

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
    "data-panel-open": collapsible.open() ? "" : undefined,
  });
}

function Content(props: CollapsibleContentProps) {
  const collapsible = useCollapsible("Content");
  const [local, others] = splitProps(props, [
    "children",
    "forceMount",
    "hiddenUntilFound",
    "onTransitionEnd",
    "ref",
    "style",
  ]);
  const contentProps = collapsible.getContentProps({
    ...others,
    hiddenUntilFound: local.hiddenUntilFound,
  });
  // Collapsible owns close presence so content can animate before becoming hidden.
  delete contentProps.hidden;
  delete contentProps["attr:hidden"];
  const [present, setPresent] = createSignal(
    local.forceMount || local.hiddenUntilFound || collapsible.open(),
  );
  const [transitionState, setTransitionState] = createSignal<"idle" | "starting" | "ending">(
    "idle",
  );
  const [panelHeight, setPanelHeight] = createSignal(0);
  let contentElement: HTMLDivElement | undefined;
  let frameId: number | undefined;
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

  const measurePanel = () => {
    if (contentElement) setPanelHeight(contentElement.scrollHeight);
  };
  const clearTransitionWork = () => {
    if (frameId !== undefined) {
      cancelAnimationFrame(frameId);
      frameId = undefined;
    }
    if (fallbackTimer !== undefined) {
      clearTimeout(fallbackTimer);
      fallbackTimer = undefined;
    }
  };
  const scheduleFrame = (callback: () => void) => {
    frameId = requestAnimationFrame(() => {
      frameId = undefined;
      callback();
    });
  };

  createEffect(() => {
    if (collapsible.open()) {
      clearTransitionWork();
      setPresent(true);
      setTransitionState("starting");
      scheduleFrame(() => {
        measurePanel();
        scheduleFrame(() => setTransitionState("idle"));
      });
      return;
    }

    if (local.forceMount || local.hiddenUntilFound) {
      clearTransitionWork();
      setPresent(true);
      setTransitionState("idle");
      return;
    }

    if (!present()) return;

    measurePanel();
    setTransitionState("idle");
    scheduleFrame(() => {
      if (contentElement) void contentElement.offsetHeight;
      setTransitionState("ending");
      fallbackTimer = setTimeout(() => {
        setPresent(false);
        setTransitionState("idle");
      }, COLLAPSIBLE_CONTENT_TRANSITION_MS);
    });
  });

  onCleanup(clearTransitionWork);

  const hidden = () => {
    if (collapsible.open() || transitionState() !== "idle") return undefined;
    return local.forceMount ? true : undefined;
  };
  const hiddenUntilFound = () =>
    !collapsible.open() && transitionState() === "idle" && local.hiddenUntilFound
      ? "until-found"
      : undefined;
  const visibilityProps = () => ({
    hidden: hidden(),
    "attr:hidden": hiddenUntilFound(),
  });
  const contentStyle = () => {
    const heightVariable = { "--collapsible-panel-height": `${panelHeight()}px` };
    if (typeof local.style === "string") {
      return `--collapsible-panel-height: ${panelHeight()}px; ${local.style}`;
    }
    return { ...local.style, ...heightVariable } as JSX.CSSProperties;
  };
  const setContentRef = (element: HTMLDivElement) => {
    contentElement = element;
    measurePanel();
    if (typeof local.ref === "function") local.ref(element);
  };

  return (
    <Show when={present()}>
      <div
        {...contentProps}
        {...visibilityProps()}
        data-ending-style={transitionState() === "ending" ? "" : undefined}
        data-starting-style={transitionState() === "starting" ? "" : undefined}
        onTransitionEnd={(event) => {
          callEventHandler(local.onTransitionEnd, event);
          if (event.target !== contentElement || transitionState() !== "ending") return;
          clearTransitionWork();
          setPresent(false);
          setTransitionState("idle");
        }}
        ref={setContentRef}
        style={contentStyle()}
      >
        {local.children}
      </div>
    </Show>
  );
}

export const Collapsible = {
  Root,
  Trigger,
  Content,
};
