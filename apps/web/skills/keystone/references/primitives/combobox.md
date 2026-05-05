# Combobox

Use this guide for autocomplete, searchable selection, async option search, and listbox-backed text input.

## Source

- UI source: `packages/ui/src/default/ui/combobox.tsx`
- Field wrapper: `packages/ui/src/default/ui/combobox-field.tsx`
- Core primitive: `@keystone-ui/core/combobox`
- Registry items: `registry/default/items/combobox.json`, `registry/default/items/combobox-field.json`
- Mason install: `mason add combobox` or `mason add combobox-field`

## Boundary

Keystone Core owns input value, selected value, open state, highlighted item state, clear semantics, trigger semantics, listbox roles, active descendant, collection registration, hidden form input, popup positioning, reset behavior, and data attributes.

Keystone UI owns the styled input group, optional start addon, clear/trigger affordances, content surface, listbox, groups, items, empty/status rows, and field adapter.

Filtering strategy, async loading, server search, object-value mapping, and virtualization are app composition decisions unless a future registry item explicitly owns them.

## Composition

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxListbox,
} from "@/components/ui/combobox";

export function ProjectCombobox(props: { projects: readonly Project[] }) {
  const [value, setValue] = createSignal<string | undefined>();

  return (
    <Combobox value={value()} onValueChange={(next) => setValue(next)}>
      <ComboboxInput aria-label="Project" placeholder="Search projects" showClear />
      <ComboboxContent>
        <ComboboxListbox>
          <For each={props.projects}>
            {(project) => (
              <ComboboxItem value={project.id} label={project.name}>
                {project.name}
              </ComboboxItem>
            )}
          </For>
        </ComboboxListbox>
      </ComboboxContent>
    </Combobox>
  );
}
```

Use `ComboboxField` for TanStack Form values, labels, descriptions, errors, and blur/change wiring.

## Accessibility

- Provide a label through `ComboboxField` or `aria-label`/`aria-labelledby`.
- Supply `label` or `textValue` for options when visible content is not plain text.
- Keep the input as the primary focus target.
- Use `ComboboxEmpty` for no-results feedback and `ComboboxStatus` for loading or async state.
- Preserve `name`, `form`, `required`, `disabled`, and `readOnly` when submitting through forms.

## Pitfalls

- Do not use combobox for a small static option list where select is clearer.
- Do not store full objects as primitive values. Store stable string IDs and map in app code.
- Do not filter by mutating Core collection internals; filter the rendered options from Solid state.
- Do not wire custom `aria-activedescendant`; Core owns it.
- Do not make clear and trigger buttons unnamed when customizing `clearProps` or `triggerProps`.

## Verification

- Run `bun run check-types` after combobox source or field source changes.
- Keyboard check: typing opens/searches, arrows move highlight, Enter selects, Escape closes, clear works.
- Form check: selected value serializes and resets correctly.
- Async check: loading, empty, stale request, and no-results states are visually and semantically distinct.
