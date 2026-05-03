# NavigationMenu Vertical

## Shipped Surface

- Keystone primitive: `@keystone-ui/keystone/navigation-menu`
- Mason registry item: `navigation-menu`
- Parts: `trigger`, `positioner`, `content`, `group`, `group-label`, `separator`, `item`, `link`, `item-indicator`
- Core behavior: menubar role semantics, trigger ARIA, overlay positioning, keyboard navigation, typeahead, disabled item skipping, routed anchor links, groups, separators, item state metadata, and stable `data-scope`/`data-part` contracts.

## Parity Baseline

The current vertical is the thin Keystone/Mason pass against Kobalte and Base UI NavigationMenu patterns. It intentionally reuses the existing Keystone menu kernel so NavigationMenu gets controlled open state, overlay positioning, typeahead, disabled item skipping, and item state behavior before deeper NavigationMenu-specific layout primitives are introduced.

## Remaining Parity Gaps

- Explicit `Root` DOM, `List`, and `Viewport` parts.
- Hover intent tuning and cursor safety between trigger/content regions.
- Touch pointer behavior and coarse-pointer open/close timing.
- Nested menu coordination beyond the shared menu kernel baseline.
- Focus restoration across dynamic route transitions and nested overlays.
- Controlled active item state and richer layout animation metadata.
- More edge-case tests for RTL navigation, dynamic item mounting, viewport sizing, and mixed link/menu item content.
