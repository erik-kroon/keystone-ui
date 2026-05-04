import {
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { assignRef } from "./dom";
import {
  createOverlayLayer,
  type OverlayLayerApi,
  type OverlayLayerOutsideEvent,
} from "./layer-kernel";

export type DismissableLayerOutsideEvent = OverlayLayerOutsideEvent;

export type DismissableLayerApi = OverlayLayerApi & {
  registerBranch: (element: HTMLElement) => () => void;
};

export type DismissableLayerOptions = {
  element: Accessor<HTMLElement | undefined>;
  enabled?: Accessor<boolean>;
  id?: string;
  disableOutsidePointerEvents?: Accessor<boolean>;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
  onFocusOutside?: (event: DismissableLayerOutsideEvent) => void;
  onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
  onDismiss?: (event: Event) => void;
};

export type DismissableLayerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
  children?: JSX.Element;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
  disableOutsidePointerEvents?: boolean;
  enabled?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: DismissableLayerOutsideEvent) => void;
  onFocusOutside?: (event: DismissableLayerOutsideEvent) => void;
  onInteractOutside?: (event: DismissableLayerOutsideEvent) => void;
  onDismiss?: (event: Event) => void;
};

export type DismissableLayerBranchProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "ref"
> & {
  children?: JSX.Element;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

type DismissableLayerContextValue = {
  registerBranch: (element: HTMLElement) => () => void;
};

const DismissableLayerContext = createContext<DismissableLayerContextValue>();

export function createDismissableLayer(options: DismissableLayerOptions): DismissableLayerApi {
  const fallbackId = `keystone-dismissable-layer-${createUniqueId()}`;
  const [branches, setBranches] = createSignal<readonly HTMLElement[]>([]);
  const registerBranch = (element: HTMLElement) => {
    setBranches((current) => (current.includes(element) ? current : [...current, element]));

    return () => {
      setBranches((current) => current.filter((branch) => branch !== element));
    };
  };
  const layer = createOverlayLayer({
    id: options.id ?? fallbackId,
    element: options.element,
    enabled: () => options.enabled?.() ?? true,
    branchElements: branches,
    disableOutsidePointerEvents: () => options.disableOutsidePointerEvents?.() ?? false,
    onEscapeKeyDown: options.onEscapeKeyDown,
    onPointerDownOutside: options.onPointerDownOutside,
    onFocusOutside: options.onFocusOutside,
    onInteractOutside: options.onInteractOutside,
    onDismiss: options.onDismiss,
  });

  return {
    ...layer,
    registerBranch,
  };
}

export function DismissableLayer(props: DismissableLayerProps) {
  const [local, others] = splitProps(props, [
    "children",
    "ref",
    "disableOutsidePointerEvents",
    "enabled",
    "onEscapeKeyDown",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "onDismiss",
  ]);
  const [element, setElement] = createSignal<HTMLDivElement>();

  const layer = createDismissableLayer({
    element,
    id: `keystone-dismissable-layer-${createUniqueId()}`,
    enabled: () => local.enabled ?? true,
    disableOutsidePointerEvents: () => local.disableOutsidePointerEvents ?? false,
    onEscapeKeyDown: local.onEscapeKeyDown,
    onPointerDownOutside: local.onPointerDownOutside,
    onFocusOutside: local.onFocusOutside,
    onInteractOutside: local.onInteractOutside,
    onDismiss: local.onDismiss,
  });

  return (
    <DismissableLayerContext.Provider value={layer}>
      <div
        {...others}
        ref={(node) => {
          setElement(node);
          assignRef(local.ref, node);
        }}
      >
        {local.children}
      </div>
    </DismissableLayerContext.Provider>
  );
}

export function DismissableLayerBranch(props: DismissableLayerBranchProps) {
  const [local, others] = splitProps(props, ["children", "ref"]);
  const [element, setElement] = createSignal<HTMLDivElement>();
  const context = useContext(DismissableLayerContext);

  createEffect(() => {
    const branch = element();

    if (!branch || !context) {
      return;
    }

    const unregister = context.registerBranch(branch);
    onCleanup(unregister);
  });

  return (
    <div
      {...others}
      ref={(node) => {
        setElement(node);
        assignRef(local.ref, node);
      }}
    >
      {local.children}
    </div>
  );
}
