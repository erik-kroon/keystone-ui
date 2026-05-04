import {
  createContext,
  createMemo,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
} from "solid-js";

export type TextDirection = "ltr" | "rtl";

export type LocaleMessageKey =
  | "calendar.nextMonth"
  | "calendar.previousMonth"
  | "datePicker.selectDate";

export type LocaleMessages = Partial<Record<LocaleMessageKey, string>>;

export type LocaleApi = {
  direction: Accessor<TextDirection>;
  getMessage: (key: LocaleMessageKey) => string;
  locale: Accessor<string>;
  messages: Accessor<LocaleMessages>;
};

export type CreateLocaleOptions = {
  direction?: Accessor<TextDirection | undefined>;
  locale?: Accessor<string | undefined>;
  messages?: Accessor<LocaleMessages | undefined>;
};

export type LocaleProviderProps = {
  children?: JSX.Element;
  direction?: TextDirection;
  locale?: string;
  messages?: LocaleMessages;
};

const defaultLocale = "en-US";

const defaultMessages = {
  "calendar.nextMonth": "Next month",
  "calendar.previousMonth": "Previous month",
  "datePicker.selectDate": "Select date",
} as const satisfies Record<LocaleMessageKey, string>;

const rtlLanguageCodes = new Set([
  "ar",
  "arc",
  "ckb",
  "dv",
  "fa",
  "he",
  "ks",
  "ku",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
]);

const defaultLocaleApi: LocaleApi = {
  direction: () => "ltr",
  getMessage: (key) => defaultMessages[key],
  locale: () => defaultLocale,
  messages: () => defaultMessages,
};

const LocaleContext = createContext<LocaleApi>();

export function createLocale(options: CreateLocaleOptions = {}): LocaleApi {
  const locale = createMemo(() => options.locale?.() ?? defaultLocale);
  const messages = createMemo(() => ({
    ...defaultMessages,
    ...options.messages?.(),
  }));
  const direction = createMemo(() => options.direction?.() ?? getLocaleDirection(locale()));

  return {
    direction,
    getMessage: (key) => messages()[key] ?? defaultMessages[key],
    locale,
    messages,
  };
}

export function useLocale(): LocaleApi {
  return useContext(LocaleContext) ?? defaultLocaleApi;
}

export function LocaleProvider(props: LocaleProviderProps) {
  const [local] = splitProps(props, ["children", "direction", "locale", "messages"]);
  const parentLocale = useLocale();
  const locale = createLocale({
    direction: () => local.direction,
    locale: () => local.locale ?? parentLocale.locale(),
    messages: () => ({
      ...parentLocale.messages(),
      ...local.messages,
    }),
  });

  return <LocaleContext.Provider value={locale}>{local.children}</LocaleContext.Provider>;
}

export const Locale = {
  Provider: LocaleProvider,
};

export function getLocaleDirection(locale: string): TextDirection {
  const LocaleConstructor = (
    Intl as unknown as {
      Locale?: new (locale: string) => { textInfo?: { direction?: TextDirection } };
    }
  ).Locale;

  try {
    const direction = LocaleConstructor
      ? new LocaleConstructor(locale).textInfo?.direction
      : undefined;
    if (direction === "ltr" || direction === "rtl") {
      return direction;
    }
  } catch {
    // Fall back to language-code heuristics for invalid or unsupported locale identifiers.
  }

  const language = locale.toLowerCase().split("-")[0];
  return language && rtlLanguageCodes.has(language) ? "rtl" : "ltr";
}
