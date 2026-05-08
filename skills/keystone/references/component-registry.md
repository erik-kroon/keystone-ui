# Keystone Component Registry Index

Use this file to choose the right Keystone UI source item and inspect its files before implementing.

## Actions And Display

- **Button**: `packages/ui/src/ui/button.tsx`, registry `button`
- **Alert**: `packages/ui/src/ui/alert.tsx`, registry `alert`
- **Badge**: `packages/ui/src/ui/badge.tsx`, registry `badge`
- **Kbd**: `packages/ui/src/ui/kbd.tsx`, registry `kbd`
- **Card**: `packages/ui/src/ui/card.tsx`, registry `card`
- **Empty**: `packages/ui/src/ui/empty.tsx`, registry `empty`
- **Separator**: `packages/ui/src/ui/separator.tsx`, registry `separator`

## Fields And Forms

- **Input**: `packages/ui/src/ui/input.tsx`, registry `input`
- **Input Group Pattern**: no standalone registry item yet; use `references/primitives/input-group.md`
- **Textarea**: `packages/ui/src/ui/textarea.tsx`, registry `textarea`
- **Label**: `packages/ui/src/ui/label.tsx`, registry `label`
- **Field**: `packages/ui/src/ui/field.tsx`, registry `field`
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

- **Checkbox**: `packages/ui/src/ui/checkbox.tsx`, registry `checkbox`
- **RadioGroup**: `packages/ui/src/ui/radio-group.tsx`, registry `radio-group`
- **Switch**: `packages/ui/src/ui/switch.tsx`, registry `switch`
- **Slider**: `packages/ui/src/ui/slider.tsx`, registry `slider`
- **Select**: `packages/ui/src/ui/select.tsx`, registry `select`
- **Combobox**: `packages/ui/src/ui/combobox.tsx`, registry `combobox`
- **Autocomplete**: `packages/ui/src/ui/autocomplete.tsx`, registry `autocomplete`
- **DatePicker**: registry `date-picker`
- Focused guides: `references/primitives/select.md`, `references/primitives/combobox.md`

## Overlays And Menus

- **Dialog**: `packages/ui/src/ui/dialog.tsx`, registry `dialog`
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
- **ScrollArea**: `packages/ui/src/ui/scroll-area.tsx`, registry `scroll-area`
- **CommandMenu**: registry `command-menu`
- **Table**: `packages/ui/src/ui/table.tsx`, registry `table`
- **DataTable**: registry `data-table`
- **DataTableTanStackRouter**: registry `data-table-tanstack-router`
- Focused guide: `references/primitives/data-table.md`

## Blocks

- **AccountSettings**: `packages/ui/src/blocks/account-settings.tsx`, registry `account-settings`
- **InvoiceDashboard**: `packages/ui/src/blocks/invoice-dashboard/invoice-dashboard.tsx`, registry `invoice-dashboard`
- **KeyboardCommandSurface**: `packages/ui/src/blocks/keyboard-command-surface.tsx`, registry `keyboard-command-surface`
- **RealtimeDataTable**: `packages/ui/src/blocks/realtime-data-table/realtime-data-table.tsx`, registry `realtime-data-table`
- **ResizableWorkspaceShell**: `packages/ui/src/blocks/resizable-workspace-shell.tsx`, registry `resizable-workspace-shell`

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
