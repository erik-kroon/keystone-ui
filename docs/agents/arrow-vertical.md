# Keystone Core Arrow Vertical

## Audit

- Existing reusable behavior lived in `createFloatingAdapter`: Floating UI arrow middleware, side/align resolution, transform-origin CSS variables, collision padding, SSR guards, and automatic updates.
- A lower-level `Popper.Arrow` existed but was not exported from the package root or package subpaths.
- Overlay primitives accepted `arrowPadding` but did not expose a public Arrow part, leaving users unable to register an arrow element with the middleware.

## End-State Contract

- `Popper.Arrow`, `Popover.Arrow`, `Tooltip.Arrow`, `HoverCard.Arrow`, `Menu.Arrow`, `DropdownMenu.Arrow`, `ContextMenu.Arrow`, `Menubar.Arrow`, `NavigationMenu.Arrow`, `Select.Arrow`, `Combobox.Arrow`, and `Autocomplete.Arrow` render a decorative `span` by default.
- Arrow parts are styling-agnostic and expose `data-scope`, `data-part="arrow"`, `data-side`, and `data-align`.
- Stateful surfaces also expose `data-state` and, for overlay-presence primitives, `data-transition-status`.
- Arrow parts set `aria-hidden="true"` because they are visual geometry only and do not add roles, keyboard behavior, focus behavior, or form semantics.
- Arrow placement is driven by `createFloatingAdapter` and `@floating-ui/dom` arrow middleware. User code can style size/shape while the adapter owns `position`, side offset, and cross-axis coordinates.
- `arrowPadding` on root/create options controls collision padding for the arrow element; when omitted it follows `collisionPadding`.
- SSR/hydration behavior matches the floating adapter: no DOM measurement occurs without `window`, and mounted refs schedule a microtask update.

## Verification

- Focused tests cover owned arrow positioning in the floating adapter and user-visible `Popover.Arrow` data/ARIA contracts.
- Metadata now includes arrow anatomy for popper and every first-party floating primitive.
