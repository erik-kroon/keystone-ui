# Keystone Composition Rules

Use this when composing complex UI from Keystone primitives and registry components.

## Core Rules

- Prefer existing Keystone primitives and UI wrappers over custom behavior.
- Keep trigger/content hierarchies intact for overlays, menus, popovers, selects, and tooltips.
- Use complete accessibility substructures: titles, descriptions, labels, listboxes, groups, and error regions.
- Keep state local and explicit unless an existing store item owns the app-level behavior.
- Do not mix React-only patterns into Solid code.

## Trigger + Overlay Shape

Inspect the local wrapper before coding. Keystone overlay wrappers generally follow this conceptual shape:

```tsx
<Dialog>
  <DialogTrigger>
    <Button variant="outline">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogPanel>Body</DialogPanel>
  </DialogContent>
</Dialog>
```

If the local component uses `Portal`, `Positioner`, `Content`, `Popup`, or `Panel` parts separately, preserve that order.

## Grouped Controls

Use existing group, toolbar, tabs, toggle, menu, and field wrappers before custom flex rows.

```tsx
<Toolbar>
  <Button size="icon" variant="ghost" aria-label="Bold">
    <Bold aria-hidden="true" />
  </Button>
</Toolbar>
```

## Anti-Patterns

- Copying an `asChild` or render-prop snippet from another ecosystem without translating to Keystone's Solid API.
- Building a dropdown with plain absolute-positioned divs.
- Omitting title/description parts in a modal flow.
- Using UI stores inside Core.
- Adding a new wrapper when a current registry item can compose the behavior.

