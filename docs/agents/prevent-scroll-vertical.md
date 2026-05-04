# Keystone Core Prevent Scroll Vertical

## Issue

- GitHub: #80, "Reach optimal end-state for Core Prevent scroll"
- Layer: Core
- Category: Overlay And Positioning

## Audit

Reusable implementation:

- `packages/core/src/overlay/prevent-scroll.ts` owns the private document-level scroll lock.
- `packages/core/src/overlay/layer-kernel.tsx` acquires the lock for the top active modal
  layer and releases it when no modal layer remains.
- `packages/core/src/overlay/layer-kernel.test.tsx` proves modal-layer integration.

Gaps closed in this pass:

- Scrollbar compensation now lives in the shared helper rather than each primitive.
- Multiple modal owners share a ref-counted lock and restore only after the last release.
- Previous inline body styles are restored exactly.
- iOS body locking uses fixed body positioning, restores the original scroll position, and blocks
  touchmove outside scrollable descendants or when a scrollable descendant is already at an edge.
- Public metadata now lists the actual overlay presence values: `closed`, `closing`, `opening`,
  and `open`.

## End-State Contract

Prevent scroll remains a private Core overlay kernel, not a public primitive anatomy.

Behavior:

- Modal overlays lock the owner document body.
- The body receives `overflow: hidden`; scrollbar width is compensated through `padding-right`.
- Nested modal locks are ref-counted.
- Existing inline `overflow`, `padding-right`, `position`, `top`, `left`, `right`, and `width`
  values are restored on final release.
- iOS locks the body with fixed positioning and prevents scroll chaining at scroll-container edges.
- Cleanup removes empty body `style` attributes when Keystone created the only inline styles.

Accessibility and SSR:

- Prevent scroll itself owns no role, ARIA, focus, form, or keyboard contract.
- Browser globals are only read when a modal layer is mounted with an owner document.

## Verification

- `packages/core/src/overlay/prevent-scroll.test.ts`
- `packages/core/src/overlay/layer-kernel.test.tsx`
- `packages/core/test/dialog.behavior.test.tsx`
- `packages/core/test/overlay-vertical.behavior.test.tsx`

Status: proven as a private overlay kernel module.
