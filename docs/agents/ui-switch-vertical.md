# UI Switch Vertical

Issue: #190

## Scope

- Upgrade the `switch` registry item from a thin wrapper to a styled first-party UI source component backed by `@keystone-ui/core/switch`.
- Provide wrappers for root, control, thumb, hidden input, and the Core namespace escape hatch.
- Preserve Core ownership of checked state, role and ARIA, Space keyboard toggling, disabled/read-only guards, required/invalid metadata, hidden native checkbox submission, preventable handlers, and form reset synchronization.

## Implementation Notes

- `registry/default/ui/switch.tsx` applies the visual track to `SwitchControl`, because Keystone Core places `role=switch` on the control part.
- The thumb uses a `--thumb-size` CSS variable for compact responsive sizing and state-driven translation.
- Drag gestures and field copy remain composition concerns above this UI primitive.

## Verification

- Registry validation covers metadata, anatomy, CSS variables, and generated source contracts.
- Full verification should include Mason registry tests, docs registry tests, typecheck, and the repo check command.
