# Toast

Use this guide for transient notifications, status updates, undo actions, and background task feedback.

## Source

- UI source: `packages/ui/src/default/ui/toast.tsx`
- Core primitive: `@keystone-ui/core/toast`
- Registry item: `registry/default/items/toast.json`
- Mason install: `mason add toast`

## Boundary

Keystone Core owns the toast manager, provider, viewport rendering, live-region roles, title/description/action/close parts, timers, duration, limits, dismissal, hover/focus pause, and toast data attributes.

Keystone UI owns `Toaster`, tone icons, viewport positioning classes, responsive viewport size, close button defaults, custom render hook, and styled toast parts.

## Composition

```tsx
import { Toaster, toaster } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function SaveButton() {
  return (
    <>
      <Button
        onClick={() =>
          toaster.success({
            title: "Saved",
            description: "Project settings were updated.",
          })
        }
      >
        Save
      </Button>
      <Toaster viewport={{ position: "bottom-right" }} />
    </>
  );
}
```

Render one `Toaster` near the app root or route shell. Use `renderToast` only when the default `Toast`, `ToastIcon`, `ToastTitle`, `ToastDescription`, `ToastAction`, and `ToastClose` composition cannot express the product requirement.

## Accessibility

- Toasts are for non-blocking feedback. Use dialog or inline errors for decisions that require immediate user action.
- Keep titles and descriptions short enough for live-region announcement.
- Action labels must be explicit, such as `Undo`, not vague labels such as `Click`.
- The default `ToastIcon` is decorative and `aria-hidden`; do not use it as the only status text.
- Avoid firing several assertive/error toasts at once.

## Pitfalls

- Do not render a `Toaster` inside every button or row.
- Do not use toast as a replacement for form validation messages.
- Do not implement independent timers or global stores in UI code; use `toaster`.
- Do not put focus-trapping content inside a toast.

## Verification

- Run `bun run check-types` after toast source or manager usage changes.
- Interaction check: close button dismisses, actions fire once, updates by ID replace the intended toast.
- Timing check: duration, hover pause, focus pause, and viewport limit behave as expected.
- Accessibility check: success/info/warning/error states have textual title or description, not icon-only meaning.
