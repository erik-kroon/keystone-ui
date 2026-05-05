# UI Store And Hotkeys Vertical

Issues: #242, #243, #244, #245, #247, #248, #249, #250

## Scope

- Clarify the reusable 0.2 app primitives that should grow out of the CommandMenu proof without bloating CommandMenu itself.
- Keep TanStack Store and TanStack Hotkeys in the UI app layer. Core continues to own intrinsic primitive state, keyboard behavior inside widgets, focus management, ARIA relationships, collection navigation, overlays, and dismissal.
- Treat CommandMenu as good enough for 0.1: it proves the integration path with Keystone Combobox, TanStack Store, TanStack Hotkeys, generated source ownership, registry metadata, and parity notes. The 0.2 work should extract reusable patterns only where reuse is real.

## 0.2 Items

### AppStoreProvider (#242)

- Status: implemented in `packages/ui/src/default/ui/app-store-provider.tsx` with registry item `app-store-provider`.
- Provides an optional shell-level app state context for generated UI source that needs cross-tree coordination.
- Owns app concerns such as command menu visibility/query/selection, registered command groups, user-facing shortcut preferences and active scope, theme/sidebar shell state, and app-owned workspace values.
- Stays optional. Single components can keep working with local stores or controlled props when an app provider is overkill; callers can pass `initialState`, an externally owned TanStack Store, or a `createAppStore` result.
- Exposes Solid-native selectors and actions (`useAppStoreSelector`, `useRequiredAppStore`, and named action methods), not React-shaped reducers or opaque singleton state.
- Emits stable `data-scope="ui-app-store"`, `data-part="provider"`, and `data-slot="app-store-provider"` attributes. It has no widget role and does not own Core primitive keyboard/focus/ARIA behavior.
- SSR/hydration contract: creation and render do not read browser globals. Persistence and global hotkey registration remain app-owned follow-up source.

### CommandStore (#245)

- Status: implemented in `packages/ui/src/default/ui/command-store.ts` with registry item `command-store`; `CommandMenu` now depends on it and keeps `createCommandMenuStore` as a compatibility alias.
- Extracts reusable command state from the current CommandMenu proof when multiple command surfaces need to coordinate.
- Current state: open/closed, query, selected command id, recently used command ids, command registry, route/workspace scope, and async loading/error metadata.
- Does not own combobox/listbox behavior. Keystone Combobox remains responsible for input value wiring, active descendant state, selection semantics, list keyboard behavior, disabled item handling, overlay positioning, and dismissal.
- Supports local store creation plus optional provider registration through `onRegister`, without making AppStoreProvider mandatory.

### ThemeStore (#243)

- Status: implemented in `packages/ui/src/default/stores/theme-store.tsx` with registry item `theme-store`.
- Provides source-owned app theme state for generated UI shells that need light, dark, and system modes.
- Uses TanStack Store for shared app state, with Solid accessors and actions exposed by `createThemeStore`.
- `ThemeProvider` and `useThemeStore` provide optional context; local stores can still be created directly for smaller apps.
- Applies the resolved theme to the document element after mount and exposes `ThemeScript` for SSR shells that need pre-hydration theme application.
- shadcn parity target is provider/hook ergonomics, localStorage persistence, system preference resolution, and document class toggling; Keystone intentionally keeps token definitions outside the store.

### SidebarStore (#244)

- Status: implemented in `packages/ui/src/default/stores/sidebar-store.tsx` with registry item `sidebar-store`.
- Provides source-owned app shell state for future Sidebar UI source without forcing the visual sidebar component into this issue.
- Uses TanStack Store for desktop open state, mobile open state, active item id, media-query state, and expanded/collapsed derivation.
- `SidebarProvider` and `useSidebarStore` provide optional context; local stores can still be created directly for isolated layouts.
- Supports controlled desktop `open`, localStorage persistence for uncontrolled desktop state, mobile media-query sync, and app-level `Mod+B` toggling by default.
- shadcn parity target is provider/hook ergonomics, separate mobile state, keyboard toggle, and collapsed/expanded state; Keystone intentionally leaves drawer focus/dismissal and navigation semantics to future UI Sidebar source backed by Core where appropriate.

### KeyboardShortcuts (#247)

- Status: implemented in `packages/ui/src/default/ui/keyboard-shortcuts.tsx` with registry item `keyboard-shortcuts`.
- Provides app-level shortcut registration, enable/disable scoping, and conflict reporting for user-owned generated source.
- Uses `@tanstack/solid-hotkeys` while its Solid API is useful, but keeps the source easy to adjust because TanStack Hotkeys is still preview/alpha.
- Must distinguish app shortcuts from Core primitive keyboard behavior. App shortcuts open surfaces or invoke commands; primitive keyboard behavior remains inside Core.
- Should handle SSR/hydration defensively by avoiding global target assumptions before the browser environment exists.
- Filters by optional `activeScope`, reports duplicate active hotkeys with `onConflictsChange`, and avoids passing an undefined target so TanStack Hotkeys can fall back to `document` only after a DOM exists.

### ShortcutDisplay (#248)

- Status: implemented in `packages/ui/src/default/ui/shortcut-display.tsx` with registry item `shortcut-display`.
- Renders platform-aware shortcut labels for buttons, command rows, menus, and shortcut help surfaces.
- Reuses TanStack Hotkeys formatting where appropriate and allows explicit product copy when teams need fixed labels.
- Should expose stable data attributes for individual shortcut keys and separators so generated UI can style compact `kbd` sequences consistently.
- Should not register shortcuts or own command behavior.

### ShortcutRecorder (#249)

- Status: implemented in `packages/ui/src/default/ui/shortcut-recorder.tsx` with registry item `shortcut-recorder`.
- Provides a native button settings control for recording one shortcut chord through TanStack Hotkeys `createHotkeyRecorder`.
- Emits stable `data-scope="ui-shortcut-recorder"` hooks, `data-recording`, `data-empty`, and uses `ShortcutDisplay` for the current value.
- Does not persist preferences or resolve conflicts; applications should pair it with their app store or settings backend.

### ShortcutSequenceRecorder (#250)

- Status: implemented in `packages/ui/src/default/ui/shortcut-sequence-recorder.tsx` with registry item `shortcut-sequence-recorder`.
- Provides a native button settings control for recording multi-chord sequences through TanStack Hotkeys `createHotkeySequenceRecorder`.
- Previews in-progress steps, supports TanStack sequence commit options, emits stable `data-scope="ui-shortcut-sequence-recorder"` hooks, and uses `ShortcutDisplay` for the current value.
- Does not persist preferences or resolve conflicts; applications should pair it with their app store or settings backend.

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

- Registry metadata should explain which app primitive is optional provider state, which is command state, which is shortcut registration, which is display-only, and which items record preferences. AppStoreProvider records optional provider state, CommandStore records command state, KeyboardShortcuts records registration, ShortcutDisplay records display-only behavior, and the recorder items record preference-editing behavior.
- Tests should cover generated source contracts where applicable: store actions, selector updates, shortcut registration options, disabled scopes, display formatting, data attributes, SSR-safe no-target behavior, and typecheck/build coverage.
- Examples should show both local usage and provider-backed usage so users are not forced into global state for small components.

## Known Limits

- Command history, remote command discovery, fuzzy ranking, permissions, and route-level command loading are app/template concerns unless a narrower reusable contract is accepted later.
- This vertical defines the extraction shape. #242, #243, #244, #245, #247, #248, #249, and #250 now have source, registry metadata, docs, and verification.
