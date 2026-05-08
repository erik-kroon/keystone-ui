# RFC: Core PreviewCard / HoverCard End-State

## Status

Accepted for the current experimental Core surface.

## Date

2026-05-05

## Related

- [RFC: Core API](./core-api.md)
- [ADR 0004: Core Kernel API Boundary](../adr/0004-core-kernel-api-boundary.md)
- [Canonical Roadmap](../roadmap/canonical-roadmap.md)
- GitHub issue #90

## Summary

Keystone's Core PreviewCard surface is published as `HoverCard` at `@keystone-ui/core/hover-card`.
The naming intentionally follows the Solid ecosystem and Kobalte precedent while tracking Base UI
PreviewCard as the runtime parity target.

`HoverCard` is a non-modal, pointer/focus-opened preview primitive for sighted users. It previews
content associated with a trigger, usually a link, without adding that preview to the screen-reader
description contract.

## Audit

Reusable implementation now exists in:

- `packages/core/src/hover-card/index.tsx`
- `packages/core/src/overlay/*`
- `packages/ui/src/components/hover-card.tsx`
- `registry/default/items/hover-card.json`
- `packages/core/src/metadata/index.ts`

The primitive already reuses the shared overlay controller, portal, presence, dismissal layer,
Floating UI adapter, arrow geometry, and pointer grace-area behavior. The end-state patch adds
dedicated behavior tests, documents the API contract, exposes the UI Arrow wrapper, and removes
the inherited button `type` attribute from the default anchor trigger.

Known intentional gaps against Base UI PreviewCard are detached triggers, multiple trigger payloads,
Backdrop, Viewport, and explicit trigger-id coordination. Those require broader overlay/controller
shape decisions and should remain follow-up work while this primitive is experimental.

## Anatomy

```tsx
import { HoverCard } from "@keystone-ui/core/hover-card";

<HoverCard.Root>
  <HoverCard.Trigger href="/teams">Team</HoverCard.Trigger>
  <HoverCard.Portal>
    <HoverCard.Positioner>
      <HoverCard.Arrow />
      <HoverCard.Content>Team preview</HoverCard.Content>
    </HoverCard.Positioner>
  </HoverCard.Portal>
</HoverCard.Root>;
```

Parts:

- `Root`: owns open state, timing, positioning options, and overlay context.
- `Trigger`: renders an anchor by default and opens from pointer or focus.
- `Portal`: portals mounted content and supports `forceMount` and custom `mount`.
- `Positioner`: receives floating position styles, side/align data, and geometry CSS variables.
- `Arrow`: decorative floating arrow.
- `Content`: preview popup content.

## API Contract

`Root` supports:

- `open`, `defaultOpen`, and `onOpenChange` for controlled and uncontrolled state.
- `openDelay` and `closeDelay`.
- `hoverableContent` and `pointerGraceArea`.
- `placement`, `gutter`, `sameWidth`, `fitViewport`, `collisionBoundary`,
  `collisionPadding`, `rootBoundary`, `sticky`, `strategy`, and `arrowPadding`.
- `onOpenChangeComplete` for presence lifecycle observation.

`onOpenChange` detail reasons are `pointer`, `focus`, `escape`, `outside`, and `programmatic`.
User event handlers run before internal handlers and can prevent composed behavior where the
underlying event contract is preventable.

## Accessibility

`HoverCard.Content` is intentionally screen-reader-hidden with `aria-hidden="true"` and no role.
The trigger does not receive `aria-describedby`, because the preview is not a durable accessible
description of the trigger. The default trigger is an anchor and should not receive a button
`type` attribute.

Keyboard behavior:

- Focus on the trigger opens the card.
- Blur from the trigger closes the card.
- Escape on the trigger closes an open card.
- Escape and outside interaction on content route through the shared dismissable-layer policy.

Pointer behavior:

- Mouse/pen pointer enter opens after `openDelay`.
- Touch pointer hover emulation is ignored.
- Pointer leave closes after `closeDelay`.
- When `hoverableContent` is enabled, the pointer can travel through the grace area between trigger
  and content without closing.

Focus behavior:

- The primitive is non-modal.
- Focus is not trapped.
- Focus is not moved into content on open.
- Dismissal does not need dialog-style focus restoration because focus remains on the trigger unless
  the application moves it.

## Data Attributes And CSS Variables

All parts expose `data-scope="hover-card"` and their `data-part`.

State attributes:

- `data-state="open|closed"` on trigger, positioner, arrow, and content.
- `data-transition-status="closed|closing|opening|open"` on trigger, positioner, arrow, and content.
- `data-side="top|right|bottom|left"` and `data-align="start|center|end"` on floating parts.

Floating CSS variables on `Positioner` and `Content`:

- `--keystone-anchor-width`
- `--keystone-anchor-height`
- `--keystone-available-width`
- `--keystone-available-height`
- `--keystone-arrow-x`
- `--keystone-arrow-y`
- `--keystone-transform-origin`

## SSR And Hydration

`Portal` renders only when present unless `forceMount` is provided. IDs are generated through the
Core stable-id utility. Floating measurements run after element refs are available and should not be
required for server render correctness.

## Maturity

`hover-card` remains Experimental. The primitive is ready for UI wrappers and docs examples, but
stable maturity should wait for the shared overlay controller decisions needed by detached triggers,
payload-driven previews, and broader manual browser/assistive-technology evidence.
