# Menu

Use this guide for action menus, row actions, toolbar menus, and trigger-based command surfaces that behave like menus.

## Source

- UI source: `packages/ui/src/ui/menu.tsx`
- Core primitive: `@keystone-ui/core/menu`
- Registry item: `registry/default/items/menu.json`

## Boundary

Keystone Core owns menu roles, roving focus, typeahead, disabled item skipping, open state, highlighted state, checked radio/checkbox item behavior, positioning, portal behavior, and dismissal.

Keystone UI owns styled wrappers for trigger, portal, positioner, content, groups, group labels, separators, items, checkbox items, radio groups, radio items, and indicators.

## Composition

```tsx
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@/components/ui/button";

export function ProjectActions() {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="ghost" aria-label="Project actions">
          Actions
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem onSelect={() => archiveProject()}>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem variant="destructive" onSelect={() => deleteProject()}>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
```

`MenuContent` composes portal and positioner around Core content. Use `portal` and `positionerClass` props when changing container or positioning behavior.

## Accessibility

- Menu triggers need an accessible name, especially icon-only triggers.
- Menu items should be concise verbs or verb phrases.
- Use checkbox or radio items only for menu state, not for full form inputs.
- Disabled menu items must remain non-interactive and skipped by keyboard navigation.
- Use `onSelect` for menu activation semantics; keep custom pointer handlers secondary.

## Pitfalls

- Do not use menu for persistent navigation lists; use navigation primitives or links.
- Do not put text inputs inside menu content. Use combobox, command menu, popover, or dialog depending on the workflow.
- Do not manually focus the first item; Core manages initial and roving focus.
- Do not close over stale row data in row action menus; pass row-specific handlers at render time.

## Verification

- Run `bun run check-types` after source or example changes.
- Keyboard check: Enter/Space opens, Arrow keys move, Home/End work where supported, typeahead moves to matching items, Escape closes and restores focus.
- Pointer check: outside click closes, disabled items cannot be selected, destructive items are visually distinct.
