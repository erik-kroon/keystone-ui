# Keystone Outside Hiding/Inert Vertical

## Issue

- GitHub: #79, "Reach optimal end-state for Keystone Outside hiding/inert"
- Layer: Keystone
- Category: Overlay And Positioning

## Audit

Reusable implementation:

- `packages/keystone/src/overlay/hide-outside.ts` owns ref-counted outside hiding with
  `aria-hidden`, native `inert`, mutation handling for late DOM insertion, and restoration of
  previous attributes/properties.
- `packages/keystone/src/overlay/layer-kernel.tsx` applies outside hiding for the top active modal
  layer and treats layers registered above that modal as exceptions.
- Dialog, Sheet, and other modal-capable overlays consume the behavior through the shared layer
  stack.

## End-State Contract

Outside hiding remains a private Keystone overlay kernel until an overlay API freeze decides
whether helper exports are stable.

Behavior:

- Only the top active modal layer owns outside hiding for its document.
- The active modal element and registered branch elements remain visible to assistive technology.
- Layers above the active modal remain exceptions so nested or mixed overlay flows do not hide
  their own content.
- Outside body children receive `aria-hidden="true"` and native `inert`.
- Existing `aria-hidden` and `inert` state is restored exactly on final release.
- Body children inserted while a modal is open are hidden/inert and restored on cleanup.
- Multiple hide owners are ref-counted so one cleanup cannot reveal content still hidden by another
  modal owner.

Accessibility and SSR:

- Public modal primitives own their roles, labels, descriptions, focus lifecycle, and keyboard
  behavior.
- The hiding helper runs only from mounted layer effects with an owner document.

## Verification

- `packages/keystone/src/overlay/layer-kernel.test.tsx`
- `packages/keystone/test/dialog.behavior.test.tsx`
- `packages/keystone/test/overlay-vertical.behavior.test.tsx`

Status: proven as a private overlay kernel module.
