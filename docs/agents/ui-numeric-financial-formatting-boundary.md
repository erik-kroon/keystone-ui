# UI Numeric And Financial Formatting Boundary

## Purpose

This note closes the first boundary decision for [#275](https://github.com/erik-kroon/keystone-ui/issues/275). It decides what Keystone should plan before any numeric or financial formatting implementation starts.

## Decision

Ship the first surface as a generic UI-owned numeric formatting source kit in the default Mason registry plan.

Do not start with a finance-flavored package, and do not keep the behavior example-only. Financial workspace examples may consume the generic kit, but Keystone should not encode finance domain semantics into Core or into the generic UI component names.

The initial planned kit should be generic enough for analytics, admin, developer tooling, ops dashboards, and financial workspaces:

- `NumberText` or equivalent display-only formatted number source.
- `CurrencyText` or equivalent display-only money formatting source using caller-provided currency and locale options.
- `PercentText` or equivalent percent/rate display source.
- `CompactNumberText` or equivalent compact count/volume display source.
- `SignedNumberText` or equivalent delta/change display source.
- Optional freshness and update-emphasis helpers that remain display state helpers, not data-fetching or market-data models.

## Boundary

Core owns no numeric or financial formatting API from this decision. Core may later own a general `NumberField` or `SpinButton` primitive for accessible numeric input behavior, but display formatting, compact notation, currency display, signed deltas, freshness, and update emphasis belong in UI source.

UI owns readable, source-installed formatting components and helpers. They may use platform `Intl.NumberFormat` and small focused helpers, but should not invent a custom i18n, money, quote, market-data, accounting, or time-series engine.

Financial domain language belongs in blocks, examples, templates, or a future optional pack. Examples may use names such as quote, bid, ask, volume, spread, P/L, or market session. The generic formatting kit should use names such as value, amount, change, unit, currency, locale, stale, fresh, pending, increased, decreased, and unchanged.

## Requirements

Money:

- Accept explicit `currency`, optional `locale`, and formatting options that map closely to `Intl.NumberFormat`.
- Leave currency meaning to the caller. Do not infer accounting, settlement, security type, exchange, tax, or jurisdiction behavior.
- Provide predictable handling for empty, nullish, invalid, and loading values through UI-owned fallback props.

Percent:

- Support ratios and already-scaled percentages through an explicit option rather than guessing.
- Preserve sign when used for change displays.
- Allow precision configuration without encoding business-specific rounding rules.

Compact volume:

- Use compact notation for dense scanning.
- Keep raw value accessible through title, label, or caller-provided accessible text when precision is collapsed.
- Avoid finance-specific labels such as shares, contracts, lots, or ADV in the generic component.

Signed change:

- Represent positive, negative, and unchanged states with stable `data-state` values.
- Do not make color the only signal; expose sign text, icon slots, or accessible labels.
- Let callers choose whether positive means good, bad, or neutral.

Stale/fresh state:

- Accept explicit freshness state or timestamp-derived freshness options in UI source, but do not fetch, subscribe, or model realtime data.
- Expose stable state attributes for `fresh`, `stale`, `pending`, and `unknown` where applicable.
- Keep timestamp formatting generic and locale-aware.

Update emphasis:

- Support explicit increase/decrease/unchanged/pending emphasis states.
- Keep animation optional and respectful of `prefers-reduced-motion`.
- Avoid storing previous values internally unless a local display helper can do so without becoming an app data engine.

## Registry Planning

Plan this as a default registry UI source kit after the data-dense direction parent is accepted and after the base UI/TanStack app-layer surfaces are credible enough to consume it.

The first registry item should carry `meta.parity` notes against:

- `Intl.NumberFormat` for locale-aware numeric, currency, percent, sign, and compact notation behavior.
- Data-dense UI references for dense scanning, update emphasis, and stale/fresh display states.

Finance-flavored blocks such as watchlists should depend on this generic kit instead of redefining formatting behavior. A future optional finance pack can be reconsidered only after at least one generic formatting kit and one financial block prove which domain names are repeated across real source.

## Non-Goals

- No Core formatting primitive.
- No finance-specific package for the first iteration.
- No custom money, exchange-rate, quote, accounting, market-session, or i18n engine.
- No charting dependency decision.
- No realtime subscription or server-cache behavior.
