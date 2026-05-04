# Keystone Layer Stack Vertical

## Scope

Issue #78 covers the Keystone `Layer stack` inventory item from
`docs/agents/end-state-primitive-component-inventory.md`.

The layer stack is a private Keystone overlay kernel. It is consumed by Dialog, Popover,
Tooltip, Sheet, menu-derived primitives, and `DismissableLayer`; it is not a promoted public
package subpath yet. That matches `docs/agents/keystone-internal-kernel-guidance.md`, which keeps
overlay internals private until a later API decision freezes selected helpers.

## Current Audit

Reusable implementation:

- `packages/keystone/src/overlay/layer-kernel.tsx` owns stack registration, top-layer checks,
  outside pointer/focus dismissal, Escape routing, modal outside hiding, inert application, body
  scroll locking, body pointer-event blocking, and focus lifecycle integration.
- `packages/keystone/src/overlay/focus-scope.tsx` owns preventable mount/unmount autofocus,
  focus trapping, and focus restore.
- `packages/keystone/src/overlay/dismissal-policy.ts` centralizes modal/non-modal dismissal policy
  and trigger containment.
- `packages/keystone/src/overlay/controller.ts` adapts the stack to public primitive parts and
  exposes `data-layer-id`, `data-layer-index`, and `data-top-layer`.
- `packages/keystone/src/overlay/layer-kernel.test.tsx` and
  `packages/keystone/test/overlay-vertical.behavior.test.tsx` cover observable stack behavior.

Reusable docs:

- `apps/docs/src/routes/docs.overlay.popover-tooltip-sheet.tsx` documents the shared overlay
  vertical through Popover, Tooltip, and Sheet.
- `apps/docs/src/lib/primitive-contracts.ts` includes the overlay contract summary used by the
  docs app.
- `docs/agents/keystone-internals-inspiration-map.md` records the Base UI/Kobalte/Radix parity
  references that shaped this kernel.

Gaps closed in this pass:

- Layer registration now stores live accessors for modal and pointer-blocking options instead of
  mount-time snapshots.
- The stack now resyncs modal hiding, inert state, scroll lock, and pointer blocking when a
  controlled primitive changes modal behavior after mount.
- Outside hiding now uses the private hide-outside helper with `aria-hidden`, native `inert`,
  ref-counted cleanup, mutation handling for newly inserted outside DOM, and exceptions for layers
  registered above the active modal.
- Pointer blocking now restores prior inline `pointer-events` values and re-enables registered
  branch elements, not just layer roots, while body-level pointer suppression is active.
- Cleanup now resyncs every document touched by a layer, including the fallback owner document and
  the eventual mounted element document.

Known limitations:

- Outside hiding remains a private overlay helper. Public promotion should wait until portal-heavy
  mixed overlay flows and live-announcer exceptions have broader primitive coverage.
- Scroll locking is delegated to the shared prevent-scroll helper, including scrollbar
  compensation, nested lock ref counts, inline-style restoration, and iOS touch edge blocking.
- The kernel remains private. Public promotion of `@keystone-ui/keystone/overlay` should wait for
  an ADR/RFC that decides which helpers are stable API.

## End-State Contract

API shape:

- `createOverlayLayerStack()` creates the stack used by overlay roots.
- `OverlayLayerProvider` shares a stack across nested overlay roots and portal children.
- `createOverlayLayer(options)` registers a layer and returns `id`, `index()`, and `isTopLayer()`.
- `DismissableLayer` and public primitives consume the kernel rather than duplicating dismissal or
  focus behavior.

Behavior:

- Layers are ordered by registration, and only the top layer handles outside pointer/focus and
  Escape dismissal.
- User event handlers run before internal dismissal; `preventDefault()` cancels internal close.
- Modal layers hide/inert outside elements, lock body scroll, and default to outside pointer-event
  blocking.
- Non-modal layers may still opt into outside pointer-event blocking.
- Body pointer-event blocking preserves existing inline body, layer, and branch pointer styles and
  restores them when blocking is disabled or the layer unregisters.
- Nested overlays share stack state through Solid context, including across portals.
- Controlled option changes after mount update the stack's modal and pointer-blocking effects.
- Cleanup restores body styles and outside element attributes to their prior values.

Accessibility and SSR:

- Modal primitives layered on this kernel expose the appropriate primitive roles and ARIA
  relationships at their public parts.
- The stack avoids document access before Solid mount and resyncs again once the layer element is
  available.
- Focus entry and restore are preventable through Keystone autofocus events.

Data attributes:

- `data-scope="overlay"` and `data-part="layer"` on the standalone `OverlayLayer` component.
- `data-layer-id` on public content/layer parts that consume the kernel.
- `data-layer-index` for stack order.
- `data-top-layer` on the current top layer.
- `data-modal` on standalone `OverlayLayer` when modal.

CSS variables:

- Layer stack itself owns no CSS variables.
- Floating overlays compose this kernel with the floating adapter, which owns
  `--keystone-anchor-width`, `--keystone-anchor-height`, `--keystone-available-width`,
  `--keystone-available-height`, and `--keystone-transform-origin`.

## Verification

Focused coverage:

- `packages/keystone/src/overlay/layer-kernel.test.tsx` verifies ordering, top-layer dismissal,
  pointer-event blocking, registered branch pointer re-enabling, modal hiding, prevent-scroll
  acquisition, cleanup restore, and reactive modal/pointer option changes.
- `packages/keystone/src/overlay/prevent-scroll.test.ts` verifies scrollbar compensation,
  ref-counted nested locks, style restoration, and iOS touch edge blocking.
- `packages/keystone/test/overlay-vertical.behavior.test.tsx` verifies Popover, Tooltip, and Sheet
  reuse of the layer model for outside dismissal, Escape dismissal, focus restore, and modal
  pointer blocking.

Status: ready for future overlay work to build on, with the limitations above tracked as separate
kernel modules rather than rework inside each primitive.
