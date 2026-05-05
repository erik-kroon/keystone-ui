# Core Core Dialog Vertical

## Scope

Issue #83 covers the Core `Dialog` primitive from
`docs/agents/end-state-primitive-component-inventory.md`.

Dialog is a Core primitive, not a UI app integration. UI may wrap it with styled
copy-paste source, but Core owns the modal behavior, ARIA relationships, focus lifecycle,
dismissal policy, presence lifecycle, and stable part metadata.

## Current Core Contract

API:

- `Dialog.Root` supports controlled `open`, uncontrolled `defaultOpen`, `modal`, `onOpenChange`,
  and `onOpenChangeComplete`.
- `createDialog` exposes the same state contract through Solid accessors for lower-level
  composition.
- `Dialog.Trigger`, `Portal`, `Backdrop`, `Positioner`, `Content`, `Title`, `Description`, and
  `Close` provide the public anatomy.
- Trigger and close support the Solid-native polymorphic `as` contract.

Behavior:

- Modal dialogs default to `aria-modal="true"`, focus entry, Tab trapping, focus restore,
  outside pointer blocking, body scroll lock, and Escape/outside dismissal.
- Non-modal dialogs keep outside content interactive and avoid stealing focus back after outside
  interaction dismissal.
- User event handlers run before internal behavior; `preventDefault()` cancels Escape dismissal,
  outside dismissal, mount autofocus, and unmount autofocus.
- Force-mounted content remains in the DOM for closed-state styling without registering as an
  active modal layer, and closed force-mounted backdrop, positioner, and content parts receive the
  native `hidden` attribute so dialog semantics stay out of the accessibility tree.
- Closing content remains mounted through exit transitions and reports transition completion.
- Nested dialogs dismiss in top-layer order through the shared overlay stack.

Accessibility and DOM contract:

- Content renders `role="dialog"` with title and description IDs wired through
  `aria-labelledby` and `aria-describedby`.
- Public parts expose stable `data-scope="dialog"` and `data-part` attributes.
- Overlay parts expose `data-state`, `data-transition-status`, `data-layer-id`,
  `data-layer-index`, and `data-top-layer`.
- Modal outside hiding applies `aria-hidden` and native `inert` to outside body content, including
  body children inserted after the dialog opens, and restores prior values on close.

## UI Surface

- `registry/default/ui/dialog.tsx` wraps Core Dialog with `ui-dialog-*` styling hooks.
- `registry/default/items/dialog.json` records install metadata, source files, dependencies,
  customization notes, and parity status.

## Parity Notes

Reference surfaces:

- Base UI provides the runtime-depth target for modal behavior, focus management, dismissal,
  presence metadata, scroll lock, and outside hiding.
- Kobalte provides the Solid composition target for Dialog, DismissableLayer, FocusScope,
  hide-outside, and transition primitives.
- Radix remains a secondary precedent for anatomy and preventable events.

Known follow-up:

- Scroll lock is still body `overflow: hidden`; scrollbar compensation and mobile touch edge cases
  belong in a future prevent-scroll module.
- Hide-outside behavior is private to the overlay stack for now. A public utility should wait for a
  later overlay API freeze.
- Browser accessibility matrix testing should expand beyond the current behavior harness.

## Verification

Focused coverage:

- `packages/core/test/dialog.behavior.test.tsx` covers rendering, ARIA, controlled and
  uncontrolled state, outside and Escape dismissal, preventable events, modal inert restoration,
  dynamic outside DOM inerting, force-mounted closed content, nested top-layer dismissal, focus
  entry/restore, and Tab trapping.
- `packages/core/src/overlay/layer-kernel.test.tsx` covers shared stack ordering, pointer
  blocking, modal hiding, cleanup restore, and reactive modal/pointer option changes.
- `docs/accessibility/primitive-evidence.md` records the 2026-05-05 Chromium browser probe and
  manual accessibility status for issue #296.

Status: Dialog remains a stable candidate and first Keystone modal primitive baseline. It should
not be called stable until the manual screen-reader matrix is complete.
