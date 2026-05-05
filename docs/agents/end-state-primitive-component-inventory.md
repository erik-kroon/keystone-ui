# End-State Primitive And Component Inventory

## Purpose

This inventory records the desired end-state shape so future work can classify new surfaces consistently.

Core owns headless accessible primitives and shared primitive helpers. UI owns styled copy-paste components, TanStack-backed app components, blocks, templates, themes, registry metadata, and generated source conventions.

## Core Primitive Inventory

### Kernel Helpers

- Controllable state
- Event composition and reason details
- Stable ID and SSR guards
- State/data attribute helpers (`proven`; see [state-data-attribute-helpers.md](state-data-attribute-helpers.md))
- Solid polymorphic `as` rendering
- Portal
- Presence and `forceMount`
- Direction provider (`proven`; see [direction-provider-vertical.md](direction-provider-vertical.md))
- Locale/i18n provider (`proven`; see [locale-i18n-provider.md](locale-i18n-provider.md))
- Live announcer
- Visually hidden (`proven`; see [visually-hidden-accessible-icon-vertical.md](visually-hidden-accessible-icon-vertical.md))
- Accessible icon (`proven`; root/label parts, required label, SSR-safe named image contract; see [visually-hidden-accessible-icon-vertical.md](visually-hidden-accessible-icon-vertical.md))

### Overlay And Positioning

- Focus scope
- Dismissable layer
- Layer stack
- Outside hiding/inert
- Prevent scroll
- Popper/positioner (`proven`; see [popper-positioner-vertical.md](popper-positioner-vertical.md))
- Arrow (`proven`; see [arrow-vertical.md](arrow-vertical.md))
- Dialog
- AlertDialog
- Popover
- HoverCard
- Tooltip
- Drawer
- Sheet
- PreviewCard
- Toast

### Collection And Navigation

- Collection (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- DOM-order collection (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Roving focus (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- List navigation (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Typeahead (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Single selection (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Multiple selection (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))

### Forms And Fields

- FormControl (`proven`; compound anatomy, ARIA/data contracts, repeated hidden inputs, and native reset listeners)
- Field (`proven`; public compound surface backed by FormControl and Field validity)
- Fieldset (`proven`; native group anatomy, legend/description/error relationships, invalid/required/readonly/disabled state)
- Label (`proven`; standalone native label primitive with stable part attributes)
- Description (`proven`; standalone descriptive text primitive with stable part attributes)
- ErrorMessage (`proven`; standalone alert feedback primitive with stable part attributes)
- Hidden input helpers (`proven`; repeated inputs for array values and native form ownership)
- Native form reset listener (`proven`; owning-form and external `form` owner changes)
- Required/invalid/disabled/readonly data and ARIA contracts (`proven`; root/control/label/description/error state attributes)

### Disclosure And Structure

- Collapsible
- Accordion
- Tabs

### Selection And Menus

- Select (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Listbox (`internal proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Combobox (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Autocomplete
- Command primitive, only if its behavior cannot be cleanly composed from Combobox/Listbox
- Menu (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- DropdownMenu (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- ContextMenu (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- Menubar (`proven`; see [collection-selection-menu-closure.md](collection-selection-menu-closure.md))
- NavigationMenu

### Inputs

- Checkbox
- CheckboxGroup
- Radio
- RadioGroup
- Switch
- Toggle
- ToggleGroup
- SegmentedControl
- Slider
- NumberField
- SpinButton
- OTPField
- FileField
- TextField
- TextArea
- SearchField
- RatingGroup

### Feedback And Display

- Progress
- Meter
- Separator
- ScrollArea
- Avatar
- Image
- AspectRatio

### Later Complex Primitives

- Calendar
- DateField
- DatePicker
- DateRangePicker
- TimeField
- TimePicker
- ColorField
- ColorArea
- ColorSlider
- ColorWheel
- ColorSwatch

## UI Component Inventory

### UI Base UI

- Button
- ButtonGroup
- IconButton
- LinkButton
- Badge
- Kbd
- Separator
- Skeleton
- Spinner
- Card
- Item
- Empty
- Alert
- Avatar
- AspectRatio
- Image
- Table
- DataList
- CodeBlock
- CopyButton

### Styled Form UI

- Form
- Field
- FieldGroup
- Fieldset
- FieldLabel
- FieldDescription
- FieldError
- Input
- Textarea
- InputGroup
- NativeSelect
- Checkbox
- CheckboxGroup
- RadioGroup
- Switch
- Slider
- NumberField
- OTPInput
- FileInput
- SearchInput
- SubmitButton

### TanStack Form UI

- TanStackForm
- TanStackField
- TextField (`proven`; see [ui-tanstack-form-vertical.md](ui-tanstack-form-vertical.md))
- TextareaField (`proven`; see [ui-tanstack-form-vertical.md](ui-tanstack-form-vertical.md))
- SelectField
- ComboboxField
- CheckboxField (`proven`; see [ui-tanstack-form-vertical.md](ui-tanstack-form-vertical.md))
- RadioGroupField (`proven`; see [ui-tanstack-form-vertical.md](ui-tanstack-form-vertical.md))
- SwitchField (`proven`; see [ui-tanstack-form-vertical.md](ui-tanstack-form-vertical.md))
- SliderField
- NumberField
- FileField
- DatePickerField
- FieldArray
- FormMessage
- FormSubmit (`proven`; see [ui-tanstack-form-vertical.md](ui-tanstack-form-vertical.md))

### Keystone-Backed Styled UI

- Dialog
- AlertDialog
- Drawer
- Sheet
- Popover
- HoverCard
- Tooltip
- DropdownMenu
- ContextMenu
- Menubar
- NavigationMenu
- Toast (`proven`; see [ui-toast-vertical.md](ui-toast-vertical.md))
- Select
- Combobox
- Command
- Tabs
- Accordion
- Collapsible
- Toggle
- ToggleGroup
- SegmentedControl

### TanStack Table UI

- DataTable (`proven`; TanStack Table source kit with controlled/uncontrolled state, native table semantics, stable data parts, and Mason registry metadata; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTableToolbar (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTablePagination (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTableColumnHeader (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTableFacetedFilter (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTableViewOptions (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTableRowActions (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTableEmpty (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))
- DataTableSkeleton (`proven`; see [ui-data-table-vertical.md](ui-data-table-vertical.md))

### TanStack Store And Hotkeys UI

- AppStoreProvider (`0.2`; optional app-shell state provider for generated UI Store/Hotkeys source; see [ui-store-hotkeys-vertical.md](ui-store-hotkeys-vertical.md))
- ThemeStore
- SidebarStore
- CommandStore (`0.2`; extracted command state, while Keystone Combobox keeps intrinsic command menu behavior; see [ui-store-hotkeys-vertical.md](ui-store-hotkeys-vertical.md))
- CommandMenu (`proven for 0.1`; see [ui-command-menu-vertical.md](ui-command-menu-vertical.md); 0.2 should extract reusable app primitives instead of expanding the component)
- KeyboardShortcuts (`0.2`; app-level shortcut registration and scoping, not Core primitive keyboard behavior; see [ui-store-hotkeys-vertical.md](ui-store-hotkeys-vertical.md))
- ShortcutDisplay (`0.2`; display-only shortcut label parts for command rows, buttons, menus, and help surfaces; see [ui-store-hotkeys-vertical.md](ui-store-hotkeys-vertical.md))
- ShortcutRecorder
- ShortcutSequenceRecorder

### Later Styled UI

- Calendar
- DatePicker
- DateRangePicker
- TimePicker
- ColorPicker
- ColorSwatch
- Chart
- ResizablePanels
- Carousel
- Sidebar
- Breadcrumb
- Pagination
- Toolbar

## UI Blocks

- Login
- Signup
- Forgot password
- Auth split screen
- Dashboard shell
- Sidebar layouts
- Settings pages
- Profile/account pages
- Billing pages
- Team/member management
- Data table pages
- CRUD resource pages
- Command palette shell
- Empty states
- Error pages
- Marketing sections
- Docs pages
- App onboarding
- Notification center
- File upload flow
- Search/results page

## UI Templates

- Vite Solid basic
- Vite Solid dashboard
- SolidStart basic
- SolidStart app shell
- TanStack Router app
- TanStack Start app
- Docs/product site
- Admin dashboard
- SaaS starter
- Auth starter
- Registry template
- Component library template

## Preferred Build Order

1. Core kernel helpers.
2. Dialog, AlertDialog, Popover, Tooltip.
3. Field/FormControl, Checkbox, RadioGroup, Switch.
4. Select, Listbox, Combobox.
5. Menu, DropdownMenu, ContextMenu, Menubar.
6. Tabs, Accordion, Collapsible.
7. UI base components: Button, Input, Label, Card, Badge, Separator.
8. UI TanStack Form field adapters.
9. UI Core-backed components: Dialog, Select, Popover, Menu.
10. UI TanStack Table data table components.
11. UI Store and Hotkeys app helpers.
12. UI blocks: auth, dashboard shell, settings, data table.
13. Date, color, rich controls, charts, and advanced templates.

## Classification Rules

- If the surface owns accessibility behavior, focus, keyboard interaction inside a widget, selection semantics, positioning, dismissal, or form-control ARIA wiring, start in Keystone.
- If the surface is visual styling, layout, tokens, app state, schema validation, data table behavior, command shortcuts, examples, blocks, or templates, start in UI.
- If the surface depends on TanStack Form, Table, Store, Hotkeys, Router, or Start, it belongs in UI unless a later ADR changes Keystone's package boundary.
- If a behavior can be shared by multiple Core primitives, implement it as a private Core kernel helper first and expose it publicly only after at least two primitives prove the API.
