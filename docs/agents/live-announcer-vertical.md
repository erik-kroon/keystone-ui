# Keystone Core Live Announcer Vertical

## Audit

Before this pass, Keystone's end-state inventory listed a Live announcer kernel helper, but the package had no implementation, subpath export, docs metadata, or tests. Existing reusable surfaces were the small Core helper-component pattern from `VisuallyHidden`, `AccessibleIcon`, `Direction`, and `Locale`, plus the shared `scheduleMicrotask` SSR-safe utility.

## End-State Contract

- `createLiveAnnouncer()` owns two independent message channels: `politeMessage()` and `assertiveMessage()`.
- `announce(message)` targets the polite channel by default.
- `announce(message, { politeness: "assertive" })` targets the assertive channel.
- Each announcement clears its target channel before setting the message in a microtask, so repeating the same string still causes a live-region DOM update.
- `clear()` clears both channels; `clear("polite")` or `clear("assertive")` clears one channel.
- `LiveAnnouncer.Root` renders a provider, a root part, and hidden polite/assertive live regions.
- `LiveAnnouncer.Polite` and `LiveAnnouncer.Assertive` expose caller-owned region parts for custom composition inside the provider.

## Accessibility Contract

- The polite region uses `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`.
- The assertive region uses `role="alert"`, `aria-live="assertive"`, and `aria-atomic="true"`.
- Region parts are visually hidden but remain available to assistive technology.
- Stable styling hooks are `data-scope="live-announcer"` with `data-part="root"`, `polite`, or `assertive`.
- The helper owns no keyboard, pointer, focus, form, controlled/uncontrolled, CSS-variable, or overlay behavior.

## SSR And Hydration

The implementation does not read `window`, `document`, or layout state during render. Server output is deterministic empty live regions; announcements are imperative runtime actions after a Solid owner exists.

## Verification

- `packages/core/src/live-announcer/live-announcer.test.tsx` covers controller announcements, repeated-message clearing, rendered live-region ARIA, context usage, caller-owned regions, SSR output, and docs metadata.
- `packages/core/src/metadata/index.ts` records the public docs metadata for the root and live-region parts.
