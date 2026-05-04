# UI Toast Vertical

Issue: #223

## Audit

Core already provides the reusable Toast behavior floor: provider, viewport, root, title,
description, action, close, manager shortcuts, id-based update/dismiss, live-region roles, viewport
limits, duration timers, and hover/focus pause behavior. The previous UI source only passed classes
through to Core parts and exported a minimal `Toaster`, so generated apps received little source-owned
presentation or Sonner-style ergonomics.

Reusable pieces were the Core Toast contract, `toaster` manager export, `cn` registry dependency,
stable Core `data-scope`/`data-part` attributes, and the existing registry parity metadata.

## End-State Contract

- API: `Toaster`, `toaster`, `ToastProvider`, `ToastViewport`, `Toast`, `ToastIcon`, `ToastTitle`,
  `ToastDescription`, `ToastAction`, `ToastClose`, and `ToastPrimitive`.
- Anatomy: Core parts stay `viewport`, `root`, `title`, `description`, `action`, and `close`; UI adds
  a decorative `toast-icon` slot plus stable `data-slot` hooks for source customization.
- Presentation: default `Toaster` renders responsive Sonner-inspired notification cards with tone
  icons, close button, action styling, position presets, and `--toast-offset`, `--toast-gap`, and
  `--toast-width` customization variables.
- Accessibility: Core owns the labeled region, status/alert roles, title/description relationships,
  action callbacks, close labeling, timer scheduling, pause/resume, and visible limit. UI icons are
  decorative and `aria-hidden`.
- State: UI does not own toast state. Controlled/uncontrolled behavior remains the Core manager
  contract through `manager`, `toaster`, `add`, `update`, `dismiss`, `clear`, and subscriptions.
- SSR/hydration: UI source has no browser-only effects; server and client markup are determined by
  props and Core context.

## Intentional Limits

Swipe gestures, measured stacking/expand mode, promise helper lifecycle, cancel action, rich custom
renderer presets, and window-blur timer pausing remain explicit follow-up work for Core or a future
UI helper. Toast does not participate in focus trapping, outside hiding, inerting, prevent-scroll, or
overlay layer behavior.

## Verification

- `packages/core/test/toast.behavior.test.tsx` covers the user-visible behavior floor.
- `packages/mason-registry/src/registry-validation.test.ts` covers the generated UI source contract,
  registry anatomy, accessibility metadata, CSS variables, limitations, and parity notes.
