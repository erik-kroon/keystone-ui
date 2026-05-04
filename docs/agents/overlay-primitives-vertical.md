# Core Core Overlay Primitives Vertical

## Issues

- #85 Popover
- #86 HoverCard
- #87 Tooltip
- #89 Sheet
- #91 Toast

## Audit

Shared implementation:

- Popover, HoverCard, Tooltip, and Sheet use `createOverlayController` for controlled/uncontrolled
  state, presence, stable IDs, trigger wiring, dismissal, and floating geometry where applicable.
- Shared overlay presence exposes the closed force-mounted hidden state to overlay surfaces so
  content can stay mounted for styling without remaining in the accessibility tree.
- Modal Sheet uses the shared layer stack for focus trap, focus restore, outside hiding/inert,
  prevent scroll, and outside pointer blocking.
- Popover, HoverCard, and Tooltip use the shared floating adapter and Arrow part contract.
- Tooltip and HoverCard add hover/focus timing, hoverable content, and pointer grace behavior above
  the shared overlay controller.
- Toast owns live notification manager behavior instead of layer-stack behavior because it is not a
  dismissable floating layer.

## End-State Contract

Popover:

- Non-modal by default, optional modal mode.
- Trigger toggles disclosure and wires expanded/control metadata.
- Content exposes `role="dialog"`, outside/Escape dismissal, preventable outside handlers, and
  floating side/align/CSS variable metadata.

HoverCard:

- Opens from pointer/focus with configurable open and close delays.
- Supports hoverable content and pointer grace area.
- Content is preview-only and hidden from the accessibility tree with `aria-hidden="true"`.
- Uses outside/Escape dismissal and floating geometry metadata.

Tooltip:

- Opens from pointer/focus with provider-level delay and skip-delay coordination.
- Content exposes `role="tooltip"` and trigger `aria-describedby`.
- Escape closes from trigger or content.
- Hoverable content and pointer grace behavior are shared with the hover-card policy shape.

Sheet:

- Dialog-grade side panel with trigger, backdrop, positioner, content, title, description, and close
  parts.
- Modal by default with focus trap, focus restore, outside hiding/inert, prevent scroll, and
  pointer-event blocking.
- Content exposes `role="dialog"`, `aria-modal`, title/description relationships, and side data.

Toast:

- Provider, viewport, root, title, description, action, and close parts.
- Manager supports `add`, `custom`, `success`, `info`, `warning`, `error`, `loading`, `update`,
  `dismiss`, `clear`, `subscribe`, and `getToasts`.
- Priority maps to `status` or `alert` roles, viewport exposes a labeled region, and timers pause
  on hover/focus.
- Toast intentionally does not use overlay layer focus trapping, outside hiding, or prevent-scroll.

## Verification

- `packages/core/test/overlay-vertical.behavior.test.tsx`
- `packages/core/src/popover/popover.test.tsx`
- `packages/core/src/tooltip/tooltip.test.tsx`
- `packages/core/test/toast.behavior.test.tsx`
- `packages/core/test/dialog.behavior.test.tsx` for the modal baseline reused by Sheet
- `apps/docs/src/routes/docs.overlay.popover-tooltip-sheet.tsx`

Status: these overlay primitives are ready for UI wrappers to build on without duplicating
Core behavior.
