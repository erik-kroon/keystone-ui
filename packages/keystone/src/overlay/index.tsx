import {
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
export { DismissableLayer, createDismissableLayer } from "./dismissable-layer";
export { FocusScope, createFocusScope } from "./focus-scope";
export { createFloatingAdapter } from "./floating";
export type {
  DismissableLayerOptions,
  DismissableLayerOutsideEvent,
  DismissableLayerProps,
} from "./dismissable-layer";
export type {
  CreateFloatingAdapterOptions,
  FloatingAdapter,
  FloatingAlign,
  FloatingPlacement,
  FloatingSide,
  FloatingStrategy,
} from "./floating";
export type { FocusScopeOptions, FocusScopeProps } from "./focus-scope";

export type OverlayLayerEntry = {
  id: string;
  modal: boolean;
};

export type OverlayLayerStack = {
  layers: Accessor<readonly OverlayLayerEntry[]>;
  register: (entry: OverlayLayerEntry) => () => void;
  isTopLayer: (id: string) => boolean;
  indexOf: (id: string) => number;
};

export type OverlayLayerProviderProps = {
  children?: JSX.Element;
  stack?: OverlayLayerStack;
};

export type CreateOverlayLayerOptions = {
  id: string;
  modal?: Accessor<boolean>;
  stack?: OverlayLayerStack;
};

export type OverlayLayerApi = {
  id: string;
  index: Accessor<number>;
  isTopLayer: Accessor<boolean>;
};

export type OverlayLayerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
  children?: JSX.Element;
  id: string;
  modal?: boolean;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
};

const OverlayLayerContext = createContext<OverlayLayerStack>();

export function createOverlayLayerStack(): OverlayLayerStack {
  const [layers, setLayers] = createSignal<readonly OverlayLayerEntry[]>([]);

  const register = (entry: OverlayLayerEntry) => {
    setLayers((current) => [...current.filter((layer) => layer.id !== entry.id), entry]);

    return () => {
      setLayers((current) => current.filter((layer) => layer.id !== entry.id));
    };
  };

  const indexOf = (id: string) => layers().findIndex((layer) => layer.id === id);

  return {
    layers,
    register,
    indexOf,
    isTopLayer: (id) => indexOf(id) === layers().length - 1,
  };
}

export function OverlayLayerProvider(props: OverlayLayerProviderProps) {
  const parentStack = useContext(OverlayLayerContext);
  const stack = props.stack ?? parentStack ?? createOverlayLayerStack();

  return (
    <OverlayLayerContext.Provider value={stack}>{props.children}</OverlayLayerContext.Provider>
  );
}

export function createOverlayLayer(options: CreateOverlayLayerOptions): OverlayLayerApi {
  const stack = options.stack ?? useOverlayLayerStack("createOverlayLayer");
  const modal = () => options.modal?.() ?? false;

  onMount(() => {
    const unregister = stack.register({ id: options.id, modal: modal() });
    onCleanup(unregister);
  });

  return {
    id: options.id,
    index: createMemo(() => stack.indexOf(options.id)),
    isTopLayer: createMemo(() => stack.isTopLayer(options.id)),
  };
}

export function OverlayLayer(props: OverlayLayerProps) {
  const [local, others] = splitProps(props, ["children", "id", "modal"]);
  const layer = createOverlayLayer({
    id: local.id,
    modal: () => local.modal ?? false,
  });

  return (
    <div
      data-scope="overlay"
      data-part="layer"
      data-layer-id={layer.id}
      data-layer-index={layer.index()}
      data-top-layer={layer.isTopLayer() ? "" : undefined}
      data-modal={local.modal ? "" : undefined}
      {...others}
    >
      {local.children}
    </div>
  );
}

function useOverlayLayerStack(caller: string) {
  const stack = useContext(OverlayLayerContext);

  if (!stack) {
    throw new Error(`${caller} must be used within OverlayLayerProvider`);
  }

  return stack;
}
