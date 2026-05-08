# Toast

Use this guide for transient notifications, status updates, undo actions, and background task feedback.

## Source

- UI source: `packages/ui/src/ui/toast.tsx`
- Core primitive: `@keystone-ui/core/toast`
- Registry item: `registry/default/items/toast.json`
- Shadcn registry install: `shadcn add https://keystone-ui.dev/r/toast.json`

## Boundary

Keystone Core owns the toast manager, callable/message/typed/promise helpers, provider, viewport rendering, render metadata, live-region roles, title/description/action/close parts, timers, duration, limits, dismissal, exit-duration status retention, hotkey focus, page-idle pause, hover/focus pause, and toast data attributes.

Keystone UI owns `Toaster`, coss-style stacked viewport presentation, measured stack expansion, tone icons, viewport positioning classes, responsive viewport size, status-driven exit transition classes, opt-in close button, custom render hook, and styled toast parts.

## References

- Sonner is the first-class ergonomic reference: callable toaster, typed helpers, id updates, promise lifecycle, visible stack defaults, close button, and hover/focus expansion.
- Base UI is the first-class stacked viewport reference: front-index metadata, visible limits, measured height offsets, and composable toast anatomy.
- Kobalte is the first-class Solid/accessibility reference: region/list composition, hover/focus/page-idle pausing, hotkey access, duration, limits, and polite/assertive announcement behavior.
- coss UI is the first-class styling reference: bottom-right default placement, compact bordered popover surface, small shadow, separate animated shell/content layers, keyframed enter motion, tone icons, stacked transforms, and neutral product-tool density.

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

Render one `Toaster` near the app root or route shell. Use `renderToast` only when the default `Toast`, `ToastContent`, `ToastIcon`, `ToastTitle`, `ToastDescription`, `ToastAction`, and optional `ToastClose` composition cannot express the product requirement.

For async work, prefer `toaster.promise()` over manually coordinating loading, success, and error toasts:

```tsx
toaster.promise(saveSettings(), {
  id: "settings-save",
  loading: "Saving settings",
  success: "Settings saved",
  error: "Settings could not be saved",
});
```

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
- Do not reimplement stacking, limits, promise lifecycle, hotkey focus, page-idle pause, or action dismissal in UI source; these belong in Core.
- Do not put focus-trapping content inside a toast.

## Verification

- Run `bun run check-types` after toast source or manager usage changes.
- Interaction check: close button dismisses, actions fire once and dismiss unless default-prevented, updates by ID replace the intended toast, and `toaster.promise()` moves loading to success/error.
- Timing check: duration, hover pause, focus pause, page-idle pause, stack expansion, exit retention, and viewport limit behave as expected.
- Accessibility check: success/info/warning/error states have textual title or description, not icon-only meaning.
