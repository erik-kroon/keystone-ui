# Migration Rules

Use this when adapting snippets from shadcn, Radix, React, or Base UI-shaped examples into Keystone.

## Core Translation

- React components become Solid components.
- `className` becomes `class`.
- `useState` becomes `createSignal`.
- `map()` in JSX often becomes `<For>`.
- Conditional rendering often becomes `<Show>`.
- `asChild` and render-prop composition must be translated to Keystone's local Solid component API.
- Radix `Content`/`Trigger` names must be mapped to the actual Keystone wrapper exports.
- Imported icons should come from `lucide-solid` unless the repo already uses another icon source for that surface.

## Behavior Translation

- Do not assume every shadcn/Radix prop exists.
- Inspect `packages/ui/src/default/ui/<component>.tsx` and the relevant Core primitive export first.
- Replace Radix overlay behavior with Keystone Core-backed wrappers.
- Replace one-off app behavior with existing store or TanStack app-layer items when available.
- Use Mason registry items instead of shadcn registry names.

## Example Translations

```tsx
// React
const [open, setOpen] = useState(false);
<Button className="gap-2" onClick={() => setOpen(true)} />
```

```tsx
// Solid / Keystone
const [open, setOpen] = createSignal(false);
<Button class="gap-2" onClick={() => setOpen(true)} />
```

```tsx
// shadcn/Radix mental model
<DialogTrigger asChild>
  <Button variant="outline">Open</Button>
</DialogTrigger>
```

```tsx
// Keystone: inspect local API, then preserve the trigger hierarchy
<DialogTrigger>
  <Button variant="outline">Open</Button>
</DialogTrigger>
```

## Checklist

1. Imports point at Keystone local source or `@keystone-ui/core`.
2. JSX uses Solid syntax.
3. Props are verified against local source.
4. Accessibility parts are preserved.
5. Styling uses Keystone tokens.
6. Registry install names use Mason items.

