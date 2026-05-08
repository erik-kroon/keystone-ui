# Dialog

Use this guide when building modal dialogs, confirmation flows, editor panels, and any overlay that must trap focus.

## Source

- UI source: `packages/ui/src/ui/dialog.tsx`
- Core primitive: `@keystone-ui/core/dialog`
- Registry item: `registry/default/items/dialog.json`
- Mason install: `mason add dialog`

## Boundary

Keystone Core owns open state, modal behavior, ARIA relationships, focus entry, focus trap, focus restore, Escape/outside dismissal, portal behavior, scroll lock, presence state, and preventable lifecycle events.

Keystone UI owns the styled source wrappers: backdrop, positioner, content surface, panel/header/footer layout, default close button, class escape hatches, and mobile bottom-stick behavior.

Do not reimplement focus management, outside hiding, dismissal, or scroll locking in UI code. Use Core parts through the UI wrappers unless the wrapper cannot express the needed composition.

## Composition

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function RenameProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rename</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>Update the visible project name.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-3">{/* form controls */}</div>
        <DialogFooter>{/* actions */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

`DialogContent` composes `DialogPortal`, `DialogBackdrop`, `DialogPositioner`, and Core content. Use its `portal`, `backdropClass`, `positionerClass`, `bottomStickOnMobile`, `showCloseButton`, and `closeProps` props instead of rebuilding that stack.

## Accessibility

- Every dialog needs a visible `DialogTitle`; pair it with `DialogDescription` when the purpose is not obvious.
- Keep destructive confirmation copy inside the dialog body, not only in button text.
- Use `DialogTrigger` for the opener so Core can restore focus.
- Do not place a second focus trap or custom `inert` logic inside the dialog.
- Prevent outside dismissal only for flows that would lose user work, and expose an explicit close or cancel action.

## Pitfalls

- Do not render `DialogContent` outside `Dialog`.
- Do not skip `DialogPortal` for modal surfaces unless a product constraint requires local stacking.
- Do not put a menu/select popup outside a dialog’s overlay model without testing nested focus and dismissal.
- Do not replace the default close button with an unlabeled icon button.

## Verification

- Run `bun run check-types` after changing dialog source or examples.
- Keyboard check: trigger opens with Enter/Space, Tab stays inside, Escape closes, focus returns to trigger.
- Screen reader check: title and description are announced.
- Pointer check: backdrop/outside behavior matches the product requirement and does not close while interacting with nested overlays.
