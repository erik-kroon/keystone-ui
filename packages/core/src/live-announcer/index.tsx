import {
  createContext,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";
import { partDataAttributes, scheduleMicrotask } from "../utils/index";

export type LiveAnnouncerPoliteness = "polite" | "assertive";

export type LiveAnnouncerAnnounceOptions = {
  politeness?: LiveAnnouncerPoliteness;
};

export type LiveAnnouncerApi = {
  announce: (message: string, options?: LiveAnnouncerAnnounceOptions) => void;
  assertiveMessage: Accessor<string>;
  clear: (politeness?: LiveAnnouncerPoliteness) => void;
  politeMessage: Accessor<string>;
};

export type LiveAnnouncerRootProps = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: HTMLDivElement | ((element: HTMLDivElement) => void);
  style?: JSX.CSSProperties | string;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;

export type LiveAnnouncerRegionProps = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: HTMLSpanElement | ((element: HTMLSpanElement) => void);
  style?: JSX.CSSProperties | string;
} & Omit<
  JSX.HTMLAttributes<HTMLSpanElement>,
  "aria-atomic" | "aria-live" | "children" | "ref" | "role"
>;

const scope = "live-announcer";

const visuallyHiddenStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  "clip-path": "inset(50%)",
  "white-space": "nowrap",
  border: "0",
} as const satisfies JSX.CSSProperties;

const LiveAnnouncerContext = createContext<LiveAnnouncerApi>();

export function createLiveAnnouncer(): LiveAnnouncerApi {
  const [politeMessage, setPoliteMessage] = createSignal("");
  const [assertiveMessage, setAssertiveMessage] = createSignal("");
  let assertiveVersion = 0;
  let active = true;
  let politeVersion = 0;

  onCleanup(() => {
    active = false;
    assertiveVersion += 1;
    politeVersion += 1;
  });

  const setMessage = (politeness: LiveAnnouncerPoliteness, message: string) => {
    const setter = politeness === "assertive" ? setAssertiveMessage : setPoliteMessage;
    const version = politeness === "assertive" ? ++assertiveVersion : ++politeVersion;

    setter("");
    scheduleMicrotask(() => {
      const currentVersion = politeness === "assertive" ? assertiveVersion : politeVersion;

      if (active && version === currentVersion) {
        setter(message);
      }
    });
  };

  return {
    announce(message, options = {}) {
      setMessage(options.politeness ?? "polite", message);
    },
    assertiveMessage,
    clear(politeness) {
      if (!politeness || politeness === "polite") {
        politeVersion += 1;
        setPoliteMessage("");
      }

      if (!politeness || politeness === "assertive") {
        assertiveVersion += 1;
        setAssertiveMessage("");
      }
    },
    politeMessage,
  };
}

export function useLiveAnnouncer(): LiveAnnouncerApi | undefined {
  return useContext(LiveAnnouncerContext);
}

function getRegionProps(
  politeness: LiveAnnouncerPoliteness,
  props: LiveAnnouncerRegionProps = {},
): JSX.HTMLAttributes<HTMLSpanElement> {
  return {
    ...props,
    "aria-atomic": "true",
    "aria-live": politeness,
    role: politeness === "assertive" ? "alert" : "status",
    style: mergeVisuallyHiddenStyle(props.style),
    ...partDataAttributes(scope, politeness),
  };
}

function Root(props: LiveAnnouncerRootProps) {
  const [local, others] = splitProps(props, ["children"]);
  const announcer = createLiveAnnouncer();

  return (
    <LiveAnnouncerContext.Provider value={announcer}>
      <div {...others} {...partDataAttributes(scope, "root")}>
        {local.children}
        <span {...getRegionProps("polite")}>{announcer.politeMessage()}</span>
        <span {...getRegionProps("assertive")}>{announcer.assertiveMessage()}</span>
      </div>
    </LiveAnnouncerContext.Provider>
  );
}

function Polite(props: LiveAnnouncerRegionProps) {
  const announcer = useLiveAnnouncer();
  const [local, others] = splitProps(props, ["children"]);

  return (
    <span {...getRegionProps("polite", others)}>
      {local.children ?? announcer?.politeMessage()}
    </span>
  );
}

function Assertive(props: LiveAnnouncerRegionProps) {
  const announcer = useLiveAnnouncer();
  const [local, others] = splitProps(props, ["children"]);

  return (
    <span {...getRegionProps("assertive", others)}>
      {local.children ?? announcer?.assertiveMessage()}
    </span>
  );
}

function mergeVisuallyHiddenStyle(
  style: JSX.CSSProperties | string | undefined,
): JSX.CSSProperties | string {
  if (typeof style === "string") {
    return `${styleFromObject(visuallyHiddenStyle)}${style}`;
  }

  return {
    ...visuallyHiddenStyle,
    ...style,
  };
}

function styleFromObject(style: JSX.CSSProperties): string {
  return Object.entries(style)
    .map(([property, value]) => `${property}:${value};`)
    .join("");
}

export const LiveAnnouncer = {
  Assertive,
  Polite,
  Root,
};
