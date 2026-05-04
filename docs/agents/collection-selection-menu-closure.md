# Collection, Selection, And Menu Closure

## Scope

This note records the closure contract for GitHub issues #92, #93, #94, #96, #97, #98, #111, #112, #113, #116, #117, #118, and #119.

The implemented Keystone layer is a shared collection/navigation kernel consumed by Select, Combobox, Menu, DropdownMenu, ContextMenu, and Menubar. Listbox remains an internal primitive facade for the 0.1 preview rather than a public subpath.

## Current Implementation

- `packages/keystone/src/collection/collection-registry.ts`: keyed registration, replacement-safe cleanup, explicit index ordering, DOM-order refresh after refs attach, group/disabled/hidden metadata, and SSR-safe operation before elements exist.
- `packages/keystone/src/collection/collection-manager.ts`: value lookup, enabled-item filtering, highlighted item state, keyboard delegate integration, and DOM-order refresh scheduling.
- `packages/keystone/src/collection/interaction-kernel.ts`: Arrow/Home/End navigation, typeahead dispatch, Enter/Space selection, and shared list interaction contracts.
- `packages/keystone/src/collection/typeahead.ts`: printable-key search, repeated-key cycling, disabled/hidden item skips, locale/collator support, and reset timing.
- `packages/keystone/src/collection/selection-manager.ts`: controlled/uncontrolled single selection, multiple selection, toggle/replace behavior, disabled item guards, selected item lookup, and structured change details.
- `packages/keystone/src/collection/roving-focus.ts`: reusable roving focus contract for composites that move DOM focus instead of using `aria-activedescendant`.
- `packages/keystone/src/collection/index.ts`: private Listbox interaction facade with listbox/option/group prop getters, active descendant wiring, data attributes, group metadata, and keyboard selection.
- `packages/keystone/src/select/*`: public Select surface with controlled/uncontrolled open/value, multi-select hidden inputs, form reset and external form owners, readonly guards, groups, dynamic DOM order, floating geometry, and listbox-backed keyboard behavior.
- `packages/keystone/src/combobox/index.tsx`: public Combobox and Autocomplete surfaces sharing the Listbox facade for input-driven option navigation and selection.
- `packages/keystone/src/menu/index.tsx`: public Menu, DropdownMenu, ContextMenu, Menubar, and NavigationMenu scoped surfaces sharing overlay, floating, collection navigation, typeahead, item roles, checkbox/radio items, groups, separators, submenus, virtual context-menu anchor, and hidden-item-aware navigation.

## End-State Contract

Collection items carry stable `value`, optional `label`, `disabled`, `hidden`, `group`, and DOM `element` metadata. Registration is keyed by value; a newer registration replaces an older one without allowing stale cleanup to remove the replacement. Once item refs attach, DOM order wins over registration order. Explicit `index` remains available for non-DOM or virtualized callers.

Navigation is centralized around enabled visible items. Disabled and hidden items remain available for lookup and state reconciliation, but keyboard navigation, typeahead, pointer highlight, and roving focus skip them.

Selection is value-based for this milestone. Object equality customization and virtualized item adapters are intentionally deferred until object-valued collections exist.

Listbox is an internal Keystone facade in 0.1. Select and Combobox are the public proof surfaces for option roles, `aria-activedescendant`, groups, selected/highlighted state, and form behavior. A public `@keystone-ui/keystone/listbox` subpath should wait for a deliberate API decision.

Menu-family primitives share the same list navigation kernel but expose menu roles and overlay behavior. DropdownMenu and ContextMenu are scoped Menu aliases; ContextMenu adds a virtual point anchor and native `contextmenu` trigger. Menubar currently shares menu internals with `role="menubar"` and is suitable for the 0.1 preview; deeper horizontal menubar root orchestration can be added without replacing the collection kernel.

## Public Styling And Accessibility Contracts

- Stable part attributes: `data-scope` and `data-part` on every primitive part.
- Listbox/option item state: `data-disabled`, `data-hidden`, `data-group`, `data-highlighted`, `data-selected`.
- Menu item state: `data-disabled`, `data-hidden`, `data-highlighted`, `data-checked`, `data-indeterminate`, `data-value`.
- Select, Combobox, and Menu floating parts expose side/align metadata and Keystone geometry CSS variables through the shared floating adapter.
- Listbox-style composites expose `role="listbox"`, `role="option"`, `role="group"`, `aria-activedescendant`, `aria-selected`, `aria-disabled`, and `aria-multiselectable` where applicable.
- Menu composites expose `role="menu"`, `role="menubar"`, `role="menuitem"`, `role="menuitemcheckbox"`, `role="menuitemradio"`, `role="separator"`, `aria-checked`, `aria-disabled`, and `aria-activedescendant` where applicable.

## Tests

Primary proof surfaces:

- `packages/keystone/src/collection/collection.test.tsx`
- `packages/keystone/src/select/controller.test.tsx`
- `packages/keystone/test/select.behavior.test.tsx`
- `packages/keystone/test/combobox.behavior.test.tsx`
- `packages/keystone/test/menu.behavior.test.tsx`
- `packages/keystone/test/listbox.performance.test.tsx`
- `packages/keystone/test/select.performance.test.tsx`

The coverage asserts registration, duplicate replacement, stale cleanup, DOM ordering, dynamic mount/unmount, grouped options, active descendant state, keyboard navigation, typeahead, repeated-key cycling, hidden-item skips, roving focus, single selection, multiple selection, form submission/reset, external form owners, readonly guards, floating geometry, menu roles, checked menu items, context menu opening, and menubar role output.

## Known Limits

- Public Listbox subpath is intentionally deferred.
- Virtualization hooks are limited to explicit ordering and hidden-item metadata.
- Item equality customization is deferred until object-valued collections are in scope.
- Menubar-specific multi-root orchestration and pointer submenu grace can deepen later on top of the current menu kernel.
