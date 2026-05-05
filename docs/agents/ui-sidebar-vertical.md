# UI Sidebar Vertical

## Issue

GitHub: [#260](https://github.com/erik-kroon/keystone-ui/issues/260)

## Audit

- Existing reusable source: `packages/ui/src/default/stores/sidebar-store.tsx` already owned TanStack Store-backed desktop/mobile sidebar state, active item tracking, persistence, media-query sync, SSR-safe creation, and Mod+B toggling.
- Existing registry metadata: `registry/default/items/sidebar-store.json` documented the store contract and explicitly said the visual Sidebar component was missing.
- Existing workspace shell source: `packages/ui/src/default/blocks/resizable-workspace-shell.tsx` proved UI-owned app layout patterns without promoting layout behavior into Core.
- Missing before this vertical: no `sidebar` UI registry item, no visual anatomy, no nav/link/trigger semantics, no CSS variable/data attribute contract for generated sidebar source, no user-visible sidebar tests, and no inventory status.

## End-State Contract

Sidebar is a UI source kit, not a Core primitive. It composes native landmarks and controls:

- `SidebarProvider` owns controlled/uncontrolled desktop open state through `sidebar-store`.
- `SidebarLayout` sets `--sidebar-width`, `--sidebar-width-icon`, and `--sidebar-width-mobile`.
- `Sidebar` renders desktop `aside` landmark source with `data-state`, `data-side`, `data-variant`, and `data-collapsible`.
- `SidebarMobile` renders the mobile panel as `role="dialog"` with `aria-modal="true"` from the store's mobile state.
- `SidebarTrigger` is a native button with `aria-expanded` and optional `aria-controls`.
- `SidebarRail` is a shadcn-style rail toggle adapted as a Solid button.
- `SidebarNav`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuLink`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubItem`, and `SidebarMenuSubButton` keep navigation as native document navigation.
- `SidebarGroupAction`, `SidebarInput`, and `SidebarSeparator` cover the shadcn sidebar support anatomy through Solid source and existing UI primitives.
- Active links expose `aria-current="page"` and `data-active`.
- User event handlers run first; internal state changes stop when `event.defaultPrevented`.
- Browser globals remain isolated to `mountSidebarStore`, so server render can create sidebar source without reading `document`, `window`, `localStorage`, or `matchMedia`.

## Accessibility And Behavior

- Native `aside`, `nav`, `main`, `a`, and `button` semantics are preferred over custom widget roles.
- No roving focus is introduced because sidebar menus are document navigation, not composite selection widgets.
- The app-level keyboard shortcut remains `Mod+B` by default through `sidebar-store`, and can be disabled or changed.
- Mobile focus trapping is intentionally not hand-rolled in this UI item. Products that require enforced modal focus should compose with the existing Sheet/Dialog source.

## Registry Status

- `sidebar-store`: proven state source for app shell coordination.
- `sidebar`: proven visual source kit for app-sidebar anatomy and generated-source ergonomics.
- Shadcn parity source checked against local clone `inspo/shadcn` at `309d950`, especially `apps/v4/styles/base-nova/ui/sidebar.tsx` and the base sidebar docs.

## Known Limitations

- No route adapter is included.
- Collapsed menu tooltips are lightweight source-owned labels, not a Core tooltip primitive integration.
- No nested persisted menu tree state is included.
- No Core primitive was added; future promotion requires a separate ADR/RFC proving reusable intrinsic behavior.
