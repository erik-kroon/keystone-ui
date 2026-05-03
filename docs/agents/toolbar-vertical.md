# Toolbar Vertical

## Shipped Surface

- Keystone primitive: `@keystone-ui/keystone/toolbar`
- Mason registry item: `toolbar`
- Parts: `root`, `button`, `link`, `separator`
- Core behavior: `role="toolbar"`, `aria-orientation`, horizontal and vertical roving focus, RTL-aware horizontal arrow keys, disabled item skipping, non-looping focus boundaries, pressed button metadata, separator semantics, and stable `data-scope`/`data-part` contracts.

## Parity Baseline

The current vertical is the thin Keystone/Mason pass against Kobalte and Base UI toolbar patterns. It covers the root role/orientation contract, roving focus across enabled controls, user-handler-first keyboard handling, Mason copy-paste wrappers, registry metadata, behavior tests, and docs-visible metadata.

## Remaining Parity Gaps

- Toggle group and radio group coordination inside toolbar.
- Cursor and touch behavior for non-button controls.
- Nested coordination with menus, popovers, and command controls.
- Focus restoration after nested overlay tools close.
- Controlled active item state.
- More edge-case tests for dynamic disabled state, unmount/remount order, anchors without `href`, and mixed polymorphic controls.
