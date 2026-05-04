# UI Checkbox Vertical

Issue: #187

## Scope

- Upgrade the `checkbox` registry item from a thin wrapper to a styled first-party UI source component backed by `@keystone-ui/core/checkbox`.
- Provide wrappers for root, control, indicator, default indicator icon, hidden input, and the Core namespace escape hatch.
- Preserve Core ownership of checked and indeterminate state, role and ARIA, Space keyboard toggling, disabled/read-only guards, required/invalid metadata, hidden native input submission, preventable handlers, and form reset synchronization.

## Implementation Notes

- `registry/default/ui/checkbox.tsx` applies the visual shell to `CheckboxControl`, because Keystone Core places `role=checkbox` on the control part.
- Default `Checkbox` composition renders control, indicator icon, and hidden input when no custom children are supplied.
- Group-level checkbox coordination and field copy remain composition concerns above this UI primitive.

## Verification

- Registry validation covers metadata, anatomy, and generated source contracts.
- Full verification should include Mason registry tests, docs registry tests, typecheck, and the repo check command.
