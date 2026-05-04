# Keystone Portal Vertical

## Audit

Portal behavior previously existed only as repeated local overlay parts in Dialog, Popover, HoverCard, Tooltip, Menu, Select, Combobox, and Sheet. Those parts all exposed `children`, `forceMount`, and `mount`, but Keystone had no shared Portal kernel export, no direct tests for custom targets, and no single place to document the SSR and presence contract.

Reusable proof already existed through overlay behavior tests: Dialog, Popover, Tooltip, Sheet, Select, Combobox, and Menu consume portalled content through their public parts. The missing piece was the standalone primitive contract and direct mount/forceMount coverage.

## End-State Contract

`Portal` is a Keystone kernel helper exported from `@keystone-ui/keystone` and `@keystone-ui/keystone/portal`.

API:

- `children`: Solid content to render.
- `mount?: Node`: optional custom portal target. When omitted, Solid's default portal target is used.
- `present?: boolean`: presence gate. `false` unmounts children; `true` or `undefined` mounts children.
- `forceMount?: boolean`: keeps children mounted even when `present` is `false`, so animation and presence-managed primitives can retain DOM.

Behavior:

- Portal does not create a Keystone wrapper element, role, ARIA relationship, data attribute, or CSS variable. Accessibility belongs to the portalled primitive content.
- Portal has no controlled/uncontrolled state. `present` is a render gate owned by the consuming primitive or user code.
- Overlay portal parts keep their existing public props and delegate to the shared Portal helper.
- Presence-managed overlays still pass `forceMount` through their overlay presence controller before Portal renders so close-transition retention and `onOpenChangeComplete` semantics remain owned by overlay presence.

SSR and hydration:

- Portal centralizes usage of Solid's native portal primitive. Keystone code should not access `document`, `window`, layout APIs, or custom mount targets before Solid's render lifecycle supplies them.
- Server and client output must be driven by the same `present`/`forceMount` values to avoid hydration mismatch.

## Proof

- `packages/keystone/src/portal/portal.test.tsx` proves hidden presence, `forceMount`, custom mount targets, and cleanup when presence changes.
- Existing public overlay tests continue to prove consumer behavior through `Dialog.Portal`, `Popover.Portal`, `Tooltip.Portal`, `Sheet.Portal`, `Select.Portal`, `Combobox.Portal`, and `Menu.Portal`.

## Known Limitations

- Portal intentionally has no standalone ARIA, keyboard, focus, pointer, or form behavior.
- SSR smoke coverage for real SolidStart portal hydration remains a future app-level verification item; the kernel contract is limited to avoiding Keystone-owned browser-global access.
