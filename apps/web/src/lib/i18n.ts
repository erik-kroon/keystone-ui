const messages = {
  "public.runtime.notFound.description": "The page you are looking for could not be found.",
  "public.runtime.errors.actions.back": "Go back",
  "public.runtime.errors.actions.home": "Home",
} as const;

type MessageKey = keyof typeof messages;

export function useI18n() {
  return {
    t: (key: MessageKey) => messages[key],
  };
}
