# Core AlertDialog

Status: implemented beta Core primitive.

## Audit

- Existing reusable behavior: Core `Dialog`, the overlay controller, portal, presence, focus scope, dismissable layer, outside hiding, pointer blocking, scroll lock, and metadata helpers already covered the runtime mechanics AlertDialog needs.
- Missing before this work: no `@keystone-ui/core/alert-dialog` subpath, no `AlertDialog` compound parts, no `createAlertDialog`, no `alert-dialog` metadata scope, no behavior harness, and only generic accessibility-plan notes.
- Intentional Core boundary: AlertDialog stays unstyled and does not add UI registry source. Styled confirmation surfaces belong in Keystone UI and should wrap this Core primitive instead of reimplementing focus, dismissal, or ARIA behavior.

## Public API

The Core surface exports `AlertDialog`, `createAlertDialog`, and public prop/API types from `@keystone-ui/core/alert-dialog` and the package root.

Compound anatomy:

- `AlertDialog.Root`
- `AlertDialog.Trigger`
- `AlertDialog.Portal`
- `AlertDialog.Backdrop`
- `AlertDialog.Positioner`
- `AlertDialog.Content`
- `AlertDialog.Title`
- `AlertDialog.Description`
- `AlertDialog.Cancel`
- `AlertDialog.Action`

State is controlled or uncontrolled through `open`, `defaultOpen`, `onOpenChange`, and `onOpenChangeComplete`. Change reasons are `trigger`, `cancel`, `action`, `escape`, and `programmatic`.

## Behavior Contract

- Content renders `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.
- AlertDialog is always modal. Core hides outside DOM from assistive technology, blocks outside pointer events, prevents scroll, traps focus, and restores focus through the shared overlay layer.
- Initial focus defaults to `AlertDialog.Cancel`, the least destructive action. `onMountAutoFocus` can prevent this default and choose another target.
- `AlertDialog.Cancel` and `AlertDialog.Action` close with distinct reasons and render `type="button"` by default so forms are not submitted accidentally.
- Escape closes with the `escape` reason unless `onEscapeKeyDown` prevents it.
- Outside pointer and focus interactions call `onPointerDownOutside`, `onFocusOutside`, and `onInteractOutside`, but Core prevents the outside interaction by default and does not close the alert dialog.
- Portal `forceMount` uses the shared presence contract: content remains mounted but hidden while closed and keeps `data-state` / `data-transition-status` metadata.
- Core exposes stable `data-scope="alert-dialog"` and `data-part` attributes for every anatomy part. No AlertDialog-specific CSS variables are currently required.

## Known Limitations

- Manual screen-reader evidence still gates any stable maturity claim.
- UI registry wrappers and visual examples are intentionally deferred to the UI layer.
- Deep nested alert-dialog/manual browser matrices should follow the Dialog overlay evidence plan.
