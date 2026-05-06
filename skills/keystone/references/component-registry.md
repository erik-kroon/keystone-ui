# Keystone Component Registry Index

Use this file to choose the right Keystone UI source item and inspect its files before implementing.

## Actions And Display

- **Button**: `packages/ui/src/default/ui/button.tsx`, registry `button`
- **Alert**: `packages/ui/src/default/ui/alert.tsx`, registry `alert`
- **Badge**: `packages/ui/src/default/ui/badge.tsx`, registry `badge`
- **Kbd**: `packages/ui/src/default/ui/kbd.tsx`, registry `kbd`
- **Card**: `packages/ui/src/default/ui/card.tsx`, registry `card`
- **Empty**: `packages/ui/src/default/ui/empty.tsx`, registry `empty`
- **Separator**: `packages/ui/src/default/ui/separator.tsx`, registry `separator`

## Fields And Forms

- **Input**: `packages/ui/src/default/ui/input.tsx`, registry `input`
- **Input Group Pattern**: no standalone registry item yet; use `references/primitives/input-group.md`
- **Textarea**: `packages/ui/src/default/ui/textarea.tsx`, registry `textarea`
- **Label**: `packages/ui/src/default/ui/label.tsx`, registry `label`
- **Field**: `packages/ui/src/default/ui/field.tsx`, registry `field`
- **TextField**: registry `text-field`
- **NumberField**: registry `number-field`
- **TextareaField**: registry `textarea-field`
- **SelectField**: registry `select-field`
- **CheckboxField**: registry `checkbox-field`
- **SwitchField**: registry `switch-field`
- **RadioGroupField**: registry `radio-group-field`
- **FormMessage**: registry `form-message`
- **FormSubmit**: registry `form-submit`
- **FieldArray**: registry `field-array`
- **TanStackField**: registry `tanstack-field`
- **TanStackForm**: registry `tanstack-form`
- Focused guide: `references/primitives/form.md`

## Selection And Input Primitives

- **Checkbox**: `packages/ui/src/default/ui/checkbox.tsx`, registry `checkbox`
- **RadioGroup**: `packages/ui/src/default/ui/radio-group.tsx`, registry `radio-group`
- **Switch**: `packages/ui/src/default/ui/switch.tsx`, registry `switch`
- **Slider**: `packages/ui/src/default/ui/slider.tsx`, registry `slider`
- **Select**: `packages/ui/src/default/ui/select.tsx`, registry `select`
- **Combobox**: `packages/ui/src/default/ui/combobox.tsx`, registry `combobox`
- **Autocomplete**: `packages/ui/src/default/ui/autocomplete.tsx`, registry `autocomplete`
- **DatePicker**: registry `date-picker`
- Focused guides: `references/primitives/select.md`, `references/primitives/combobox.md`

## Overlays And Menus

- **Dialog**: `packages/ui/src/default/ui/dialog.tsx`, registry `dialog`
- **Sheet**: registry `sheet`
- **Popover**: registry `popover`
- **HoverCard**: registry `hover-card`
- **Tooltip**: registry `tooltip`
- **Menu**: registry `menu`
- **DropdownMenu**: registry `dropdown-menu`
- **ContextMenu**: registry `context-menu`
- **Menubar**: registry `menubar`
- **NavigationMenu**: registry `navigation-menu`
- **Toast**: registry `toast`
- Focused guides: `references/primitives/dialog.md`, `references/primitives/menu.md`, `references/primitives/toast.md`

## Layout, Navigation, And App Components

- **Accordion**: registry `accordion`
- **Collapsible**: registry `collapsible`
- **Tabs**: registry `tabs`
- **Toolbar**: registry `toolbar`
- **ScrollArea**: `packages/ui/src/default/ui/scroll-area.tsx`, registry `scroll-area`
- **CommandMenu**: registry `command-menu`
- **Table**: `packages/ui/src/default/ui/table.tsx`, registry `table`
- **DataTable**: registry `data-table`
- **DataTableTanStackRouter**: registry `data-table-tanstack-router`
- Focused guide: `references/primitives/data-table.md`

## Blocks

- **AccountSettings**: `packages/ui/src/default/blocks/account-settings.tsx`, registry `account-settings`
- **InvoiceDashboard**: `packages/ui/src/default/blocks/invoice-dashboard/invoice-dashboard.tsx`, registry `invoice-dashboard`
- **KeyboardCommandSurface**: `packages/ui/src/default/blocks/keyboard-command-surface.tsx`, registry `keyboard-command-surface`
- **RealtimeDataTable**: `packages/ui/src/default/blocks/realtime-data-table/realtime-data-table.tsx`, registry `realtime-data-table`
- **ResizableWorkspaceShell**: `packages/ui/src/default/blocks/resizable-workspace-shell.tsx`, registry `resizable-workspace-shell`

## Stores

- **ThemeStore**: registry `theme-store`
- **CommandStore**: registry `command-store`
- **SidebarStore**: registry `sidebar-store`
- **AppStoreProvider**: registry `app-store-provider`
- **KeyboardShortcuts**: registry `keyboard-shortcuts`

## Hooks

- **useCopyToClipboard**: registry `use-copy-to-clipboard`
- **useMediaQuery**: registry `use-media-query`

## Templates

- **TanStackStartDashboard**: registry `tanstack-start-dashboard`

## Utilities

- **ShortcutDisplay**: registry `shortcut-display`
- **ShortcutRecorder**: registry `shortcut-recorder`
- **ShortcutSequenceRecorder**: registry `shortcut-sequence-recorder`

## Selection Guidance

- Use the plain UI primitive when the user needs one control.
- Use field wrappers when the user needs labels, descriptions, validation, or form wiring.
- Use TanStack items for application-grade forms and data tables.
- Use blocks/templates for product-like surfaces instead of stitching many primitives manually.
- If the item is not listed here, inspect `registry/default/items/` before adding a new one.
