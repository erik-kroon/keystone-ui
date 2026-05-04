# Dialog Accessibility Spec

## Status

Beta accessibility spec for the 0.1 preview.

## Scope

This spec covers Core Dialog and UI Dialog items that delegate modal behavior to Keystone. It applies to `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Title`, `Dialog.Description`, `Dialog.Close`, `Dialog.Backdrop`, `Dialog.Positioner`, and `Dialog.Portal`.

## Anatomy

- `Root`: owns open state and modal configuration.
- `Trigger`: opens the dialog.
- `Portal`: moves overlay DOM to the configured mount point after client mount.
- `Backdrop`: optional inert visual backdrop.
- `Positioner`: positions content and participates in overlay layout.
- `Content`: owns dialog semantics and focus containment.
- `Title`: provides the accessible name.
- `Description`: provides the accessible description.
- `Close`: closes the dialog.

## Roles And ARIA

- `Content` uses `role="dialog"` for modal dialog content.
- Modal content sets `aria-modal="true"`.
- `Content` references `Title` with `aria-labelledby` when a title is rendered.
- `Content` references `Description` with `aria-describedby` when a description is rendered.
- `Trigger` reflects open state with `aria-expanded` and controls the content when a stable content ID is available.
- Hidden or unmounted content must not remain focusable.

## Keyboard

| Key                          | Requirement                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `Enter` / `Space` on trigger | Opens the dialog through native button activation.                                     |
| `Tab`                        | Moves focus within modal content while open.                                           |
| `Shift+Tab`                  | Moves focus backward within modal content while open.                                  |
| `Escape`                     | Requests dismissal of the topmost dismissable dialog when escape dismissal is enabled. |
| `Enter` / `Space` on close   | Closes the dialog through native button activation.                                    |

User event handlers run before internal behavior. If a user handler prevents default on trigger, close, outside interaction, or escape events, Core must skip the matching internal action.

## Focus

- Opening a modal dialog moves focus into content or to the configured initial focus target.
- Focus is trapped inside the topmost modal dialog.
- Closing restores focus to the trigger or the previously focused element when it is still available.
- Nested dialogs restore focus within the parent layer before returning focus outside the stack.
- Force-mounted closed content must not trap focus.

## Pointer And Outside Interaction

- Pointer interaction outside modal content requests dismissal when outside dismissal is enabled.
- Outside dismissal is preventable.
- Interactions inside registered branches are not outside interactions.
- Backdrop clicks follow the same preventable outside-dismissal path as other outside pointer events.

## State And Data Attributes

Dialog parts expose `data-scope="dialog"` and their `data-part` value. Overlay parts expose:

- `data-state="open|closed"`
- `data-transition-status="closed|closing|opening|open"`

UI Dialog styling must use these public attributes instead of private overlay internals.

## SSR And Hydration

- Server rendering must not touch `document` or `window`.
- Portal mounting, focus movement, outside hiding, and prevent-scroll behavior are client lifecycle effects.
- Generated IDs for title and description relationships must be hydration-safe.
- Force-mounted content should preserve stable data attributes across server and client output.

## Automated Coverage

| Requirement                      | Harness interface                            |
| -------------------------------- | -------------------------------------------- |
| Content role and accessible name | `expectRole`, `expectAriaRelationship`       |
| Stable part attributes           | `expectStablePartAttributes`                 |
| Escape dismissal                 | `runKeyboardTable`, `expectOutsideDismissal` |
| Focus trap and restore           | `expectFocusTrap`, `expectFocusRestore`      |
| SSR and hydration safety         | `expectSsrSmoke`, `expectHydrationSmoke`     |

## Known Gaps Before Stable

- Manual screen-reader evidence must be recorded for VoiceOver/Safari, NVDA/Firefox, and JAWS/Chrome.
- Nested modal and non-modal composition needs broader browser verification.
- AlertDialog-specific semantics are out of scope until a dedicated primitive or variant is specified.
