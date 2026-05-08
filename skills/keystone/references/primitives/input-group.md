# Input Group

Use this guide for input compositions with icons, prefixes, suffixes, clear buttons, triggers, or grouped affordances.

## Source

- Input source: `packages/ui/src/ui/input.tsx`
- Combobox input group source: `packages/ui/src/ui/combobox.tsx`
- Text field source: `packages/ui/src/ui/text-field.tsx`
- Field source: `packages/ui/src/ui/field.tsx`
- Registry items: `input`, `text-field`, `combobox`, `combobox-field`
- Mason install: `mason add input` or the concrete field/control item

There is no standalone `input-group` registry item yet. Treat input-group as a composition pattern until Keystone adds a first-party source item.

## Boundary

Plain visual grouping belongs in UI source or app code. Intrinsic behavior still belongs to the specific primitive:

- Text entry: native input and `Input`.
- Field relationships: Core form through `Field`, `TextField`, or `TanStackField`.
- Autocomplete trigger, clear, selected value, listbox, and hidden input: Core combobox through `ComboboxInput` and related parts.

Do not add Core behavior just to style adornments.

## Composition

```tsx
import { Search } from "lucide-solid";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  return (
    <label class="grid gap-2">
      <span class="text-sm font-medium text-foreground">Search</span>
      <span class="relative inline-flex w-full items-center">
        <Search class="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
        <Input type="search" class="pl-8" placeholder="Search projects" />
      </span>
    </label>
  );
}
```

For clear and trigger affordances, prefer `ComboboxInput` because it already owns `showClear`, `showTrigger`, `startAddon`, `inputClass`, `triggerProps`, and `clearProps`.

## Accessibility

- Decorative icons must be `aria-hidden` or pointer-inert.
- Interactive suffixes must be real buttons with names and keyboard focus.
- Prefix text that changes meaning, such as currency or URL scheme, must be conveyed by label, description, or `aria-describedby`.
- Preserve the actual input as the focus target unless the primitive explicitly owns a trigger.
- Use `TextField` or `TanStackField` when the input needs label, description, validation, and error relationships.

## Pitfalls

- Do not place clickable elements inside the native `<input>`.
- Do not use absolute icons that cover text or prevent selection.
- Do not make a visual group responsible for value, blur, or reset behavior.
- Do not invent `InputGroup` imports until a registry item exists.

## Verification

- Run `bun run check-types` after adding reusable grouped input source.
- Keyboard check: adornment buttons are reachable and named; decorative adornments are skipped.
- Layout check: placeholder, typed text, clear button, and long values do not overlap at mobile widths.
- Form check: labels, descriptions, errors, native reset, and autofill styling still work.
