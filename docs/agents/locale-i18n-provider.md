# Locale/i18n Provider

## Status

Implemented for the Core kernel in `packages/core/src/locale/index.tsx`.

## Audit

- Before this work, Calendar and DatePicker accepted local `locale` props and used `Intl.DateTimeFormat`, but there was no shared Keystone locale context.
- No Keystone direction provider existed, and primitives could not share localized fallback labels.
- Calendar tests already covered locale-specific week starts and were reusable for provider integration coverage.

## API Contract

- `createLocale(options)` returns Solid accessors for `locale`, `direction`, merged `messages`, and `getMessage(key)`.
- `Locale.Provider` / `LocaleProvider` provides locale, optional text direction override, and partial localized primitive messages to child Core primitives.
- `useLocale()` returns the nearest provider context or stable SSR-safe defaults.
- Default locale is `en-US`; default direction is inferred from the locale with `Intl.Locale.textInfo` when available and an RTL language-code fallback otherwise.
- Explicit primitive props win over provider context. For example, `Calendar.Root locale="en-GB"` formats with `en-GB` even inside a `Locale.Provider locale="fr-FR"`.

## Accessibility And Rendering

- The provider does not render DOM, expose anatomy, require CSS variables, or add data attributes.
- Applications remain responsible for setting `lang` and `dir` attributes on their app shell or document root. `useLocale()` exposes both values so portaled and app-level wrappers can do that consistently.
- The default context is deterministic during SSR and hydration; it does not read `navigator.language`.
- Primitive metadata intentionally records `locale` with no parts because the provider is context-only.

## Current Consumers

- `Calendar.Root` and `DatePicker.Root` consume provider locale when their local `locale` prop is absent.
- Calendar navigation triggers and DatePicker trigger fallback text consume provider messages.

## Known Limits

- This is a primitive-message kernel, not a full application translation system. UI or user apps should own route content, async dictionaries, pluralization workflows, and generated source translations.
- Additional Keystone message keys should be added only when a primitive has user-visible fallback text or ARIA labels.
