# End-State Primitive And Component Inventory

## Purpose

This inventory records the desired end-state shape so future work can classify new surfaces consistently.

Keystone owns headless accessible primitives and shared primitive helpers. Mason owns styled copy-paste components, TanStack-backed app components, blocks, templates, themes, registry metadata, and generated source conventions.

## Keystone Primitive Inventory

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
- Visually hidden
- Accessible icon (`proven`; root/label parts, required label, SSR-safe named image contract)

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
- Fieldset
- Label
- Description
- ErrorMessage
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

## Mason Component Inventory

### Mason Base Components

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

### Styled Form Components

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

### TanStack Form Components

- TanStackForm
- TanStackField
- TextField
- TextareaField
- SelectField
- ComboboxField
- CheckboxField
- RadioGroupField
- SwitchField
- SliderField
- NumberField
- FileField
- DatePickerField
- FieldArray
- FormMessage
- FormSubmit

### Keystone-Backed Styled Components

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
- Toast
- Select
- Combobox
- Command
- Tabs
- Accordion
- Collapsible
- Toggle
- ToggleGroup
- SegmentedControl

### TanStack Table Components

- DataTable
- DataTableToolbar
- DataTablePagination
- DataTableColumnHeader
- DataTableFacetedFilter
- DataTableViewOptions
- DataTableRowActions
- DataTableEmpty
- DataTableSkeleton

### TanStack Store And Hotkeys Components

- AppStoreProvider
- ThemeStore
- SidebarStore
- CommandStore
- CommandMenu
- KeyboardShortcuts
- ShortcutDisplay
- ShortcutRecorder
- ShortcutSequenceRecorder

### Later Styled Components

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

## Mason Blocks

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

## Mason Templates

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

1. Keystone kernel helpers.
2. Dialog, AlertDialog, Popover, Tooltip.
3. Field/FormControl, Checkbox, RadioGroup, Switch.
4. Select, Listbox, Combobox.
5. Menu, DropdownMenu, ContextMenu, Menubar.
6. Tabs, Accordion, Collapsible.
7. Mason base components: Button, Input, Label, Card, Badge, Separator.
8. Mason TanStack Form field adapters.
9. Mason Keystone-backed components: Dialog, Select, Popover, Menu.
10. Mason TanStack Table data table components.
11. Mason Store and Hotkeys app helpers.
12. Mason blocks: auth, dashboard shell, settings, data table.
13. Date, color, rich controls, charts, and advanced templates.

## Classification Rules

- If the surface owns accessibility behavior, focus, keyboard interaction inside a widget, selection semantics, positioning, dismissal, or form-control ARIA wiring, start in Keystone.
- If the surface is visual styling, layout, tokens, app state, schema validation, data table behavior, command shortcuts, examples, blocks, or templates, start in Mason.
- If the surface depends on TanStack Form, Table, Store, Hotkeys, Router, or Start, it belongs in Mason unless a later ADR changes Keystone's package boundary.
- If a behavior can be shared by multiple Keystone primitives, implement it as a private Keystone kernel helper first and expose it publicly only after at least two primitives prove the API.
