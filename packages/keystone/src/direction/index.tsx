import {
  createContext,
  createMemo,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import {
  createControllableSignal,
  partDataAttributes,
  type ControllableSignalSetter,
} from "../utils/index";

export type Direction = "ltr" | "rtl";

export type DirectionChangeDetail = {
  event?: Event;
  reason: "programmatic";
};

export type DirectionRootProps = {
  children?: JSX.Element;
  class?: string;
  defaultDir?: Direction;
  dir?: Direction;
  id?: string;
  onDirectionChange?: (dir: Direction, detail: DirectionChangeDetail) => void;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
  style?: JSX.CSSProperties | string;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "dir" | "ref">;

export type CreateDirectionOptions = {
  defaultDir?: Direction | (() => Direction);
  dir?: Accessor<Direction | undefined>;
  onDirectionChange?: (dir: Direction, detail: DirectionChangeDetail) => void;
};

export type DirectionApi = {
  dir: Accessor<Direction>;
  setDir: ControllableSignalSetter<Direction, DirectionChangeDetail>;
};

const DirectionContext = createContext<DirectionApi>();

export function createDirection(options: CreateDirectionOptions = {}): DirectionApi {
  const [dir, setDir] = createControllableSignal<Direction, DirectionChangeDetail>({
    value: options.dir,
    defaultValue: options.defaultDir ?? "ltr",
    defaultDetail: { reason: "programmatic" },
    onChange: (nextDir, detail) => options.onDirectionChange?.(nextDir, detail),
  });

  return {
    dir: createMemo(() => normalizeDirection(dir())),
    setDir,
  };
}

export function useDirection(fallback: Direction = "ltr"): Accessor<Direction> {
  const direction = useContext(DirectionContext);

  return createMemo(() => direction?.dir() ?? fallback);
}

function Root(props: DirectionRootProps) {
  const inheritedDir = useDirection();
  const [local, others] = splitProps(props, ["children", "defaultDir", "dir", "onDirectionChange"]);
  const direction = createDirection({
    defaultDir: () => local.defaultDir ?? inheritedDir(),
    dir: () => local.dir,
    onDirectionChange: local.onDirectionChange,
  });

  return (
    <DirectionContext.Provider value={direction}>
      <div
        {...others}
        data-dir={direction.dir()}
        dir={direction.dir()}
        {...partDataAttributes("direction", "root")}
      >
        {local.children}
      </div>
    </DirectionContext.Provider>
  );
}

function normalizeDirection(dir: Direction): Direction {
  return dir === "rtl" ? "rtl" : "ltr";
}

export const DirectionProvider = {
  Root,
};

export const Direction = DirectionProvider;
