# UI Store And Hotkeys Vertical

Issues: #242, #245, #247, #248

## Scope

- Clarify the reusable 0.2 app primitives that should grow out of the CommandMenu proof without bloating CommandMenu itself.
- Keep TanStack Store and TanStack Hotkeys in the UI app layer. Core continues to own intrinsic primitive state, keyboard behavior inside widgets, focus management, ARIA relationships, collection navigation, overlays, and dismissal.
- Treat CommandMenu as good enough for 0.1: it proves the integration path with Keystone Combobox, TanStack Store, TanStack Hotkeys, generated source ownership, registry metadata, and parity notes. The 0.2 work should extract reusable patterns only where reuse is real.

## 0.2 Items

### AppStoreProvider (#242)

- Provides an optional shell-level app state context for generated UI source that needs cross-tree coordination.
- Owns app concerns such as command menu visibility, registered command groups, user-facing shortcut preferences, theme/sidebar shell state, and other workspace state that should be shared across templates or blocks.
- Must stay optional. Single components should keep working with local stores or controlled props when an app provider is overkill.
- Should expose Solid-native accessors and actions, not React-shaped reducers or opaque singleton state.

### CommandStore (#245)

- Extracts reusable command state from the current CommandMenu proof when multiple command surfaces need to coordinate.
- Candidate state: open/closed, query, selected command id, recently used command ids, command registry, route/workspace scope, and async loading/error metadata.
- Does not own combobox/listbox behavior. Keystone Combobox remains responsible for input value wiring, active descendant state, selection semantics, list keyboard behavior, disabled item handling, overlay positioning, and dismissal.
- Should support local store creation plus optional AppStoreProvider registration.

### KeyboardShortcuts (#247)

- Provides app-level shortcut registration, enable/disable scoping, and conflict reporting for user-owned generated source.
- Uses `@tanstack/solid-hotkeys` while its Solid API is useful, but keeps the source easy to adjust because TanStack Hotkeys is still preview/alpha.
- Must distinguish app shortcuts from Core primitive keyboard behavior. App shortcuts open surfaces or invoke commands; primitive keyboard behavior remains inside Core.
- Should handle SSR/hydration defensively by avoiding global target assumptions before the browser environment exists.

### ShortcutDisplay (#248)

- Renders platform-aware shortcut labels for buttons, command rows, menus, and shortcut help surfaces.
- Reuses TanStack Hotkeys formatting where appropriate and allows explicit product copy when teams need fixed labels.
- Should expose stable data attributes for individual shortcut keys and separators so generated UI can style compact `kbd` sequences consistently.
- Should not register shortcuts or own command behavior.

## Boundaries

- Do not promote a generic Core store, hotkey manager, or command primitive from this work.
- Do not make AppStoreProvider mandatory for every generated UI component.
- Do not move CommandMenu filtering, search ranking, async discovery, or route permissions into Core.
- Do not promise a final Hotkeys API guarantee until the TanStack Hotkeys package is stable enough for first-party guarantees.

## Reuse From 0.1 CommandMenu

- `packages/ui/src/default/ui/command-menu.tsx` already demonstrates a local `createCommandMenuStore`, high-level component props, and preview shortcut registration.
- `registry/default/items/command-menu.json` already records dependency, anatomy, parity, Store, Hotkeys, accessibility, and limitation metadata.
- `docs/agents/ui-command-menu-vertical.md` should remain the 0.1 CommandMenu record; this note owns the 0.2 extraction path.

## Verification Targets

- Registry metadata should explain which app primitive is optional provider state, which is command state, which is shortcut registration, and which is display-only.
- Tests should cover generated source contracts where applicable: store actions, selector updates, shortcut registration options, disabled scopes, display formatting, data attributes, SSR-safe no-target behavior, and typecheck/build coverage.
- Examples should show both local usage and provider-backed usage so users are not forced into global state for small components.

## Known Limits

- ThemeStore, SidebarStore, ShortcutRecorder, and ShortcutSequenceRecorder remain later inventory items unless a 0.2 app template forces them into scope.
- Command history, remote command discovery, fuzzy ranking, permissions, and route-level command loading are app/template concerns unless a narrower reusable contract is accepted later.
- This vertical defines the extraction shape; it does not close #242, #245, #247, or #248 until source, registry metadata, docs, and tests exist for each item.
