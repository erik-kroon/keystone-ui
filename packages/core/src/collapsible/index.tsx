import { Show, createContext, splitProps, useContext, type JSX } from "solid-js";
import { createDisclosureController, type DisclosureChangeDetail } from "../disclosure/controller";
import {
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
    return <button {...triggerProps}>{local.children}</button>;
  }

  return renderPolymorphic(local.as, "button", {
    ...triggerProps,
    children: local.children,
  });
}

function Content(props: CollapsibleContentProps) {
  const collapsible = useCollapsible("Content");
  const [local, others] = splitProps(props, ["children", "forceMount", "hiddenUntilFound"]);
  const contentProps = collapsible.getContentProps({
    ...others,
    hiddenUntilFound: local.hiddenUntilFound,
  });

  return (
    <Show when={local.forceMount || local.hiddenUntilFound || collapsible.open()}>
      <div {...contentProps}>{local.children}</div>
    </Show>
  );
}

export const Collapsible = {
  Root,
  Trigger,
  Content,
};
