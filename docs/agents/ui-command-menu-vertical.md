# UI CommandMenu Vertical

Issue: #246

Status: Good enough for 0.1 proof. 0.2 follow-up should clarify reusable Store/Hotkeys app primitives in [ui-store-hotkeys-vertical.md](ui-store-hotkeys-vertical.md) rather than expanding CommandMenu into a general app state system.

## Scope

- Promote the `command-menu` registry item from a functional app-layer wrapper to a Coss-styled command palette source component.
- Preserve Keystone Combobox ownership of input value, listbox roles, active descendant navigation, highlighted item state, disabled item handling, selection, popup positioning, dismissal, and controlled/uncontrolled open/input contracts.
- Preserve TanStack Store for shared app-level command state and TanStack Hotkeys for command palette and item shortcuts.

## Implementation Notes

- `packages/ui/src/default/ui/command-menu.tsx` mirrors the Coss command visual anatomy in Solid source form: backdrop, rounded popup, transparent search row with icon, bordered results panel, grouped list, dense command rows, shortcut kbd, separator, and footer slot.
- The generated source remains user-owned and dependency-light: no Coss, React, Base UI, cmdk, or icon package dependency is copied into Keystone UI.
- Filtering remains a simple readable local function so applications can replace it with fuzzy ranking, remote search, permissions, or route-scoped command discovery.

## Known Limits

- This is still a local command palette pattern rather than a dedicated Core command primitive.
- Nested command pages, async loading states, command history, copy-command footer behavior, user preference persistence, and route-level command discovery remain app-layer follow-up work.
- TanStack Hotkeys remains a preview integration and is documented as replaceable generated source.
- Reusable AppStoreProvider, CommandStore, KeyboardShortcuts, and ShortcutDisplay extraction is deferred to 0.2.

## Verification

- Registry validation now covers CommandMenu metadata, anatomy, Coss visual reference notes, and generated source hooks.
- `bun run check-types --filter=@keystone-ui/ui` passes for the UI package.
