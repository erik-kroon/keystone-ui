# Collection And Typeahead Kernel Boundary Note

## Status

Preview boundary note for Keystone collection internals.

## Boundary

The collection and typeahead kernels are private Keystone implementation. They support list-like primitives without freezing a general-purpose collection API before Select and Combobox prove the shape.

Current private responsibilities:

- DOM-backed item registration and ordering.
- Disabled and hidden item filtering.
- Highlighted item movement.
- Active-descendant state.
- Roving focus where a primitive requires it.
- Selection management.
- List navigation for arrow keys, Home, End, and looping behavior.
- Typeahead search, repeated-character handling, timeout behavior, and wraparound.
- Group metadata used by listbox, select, combobox, and menu-family primitives.

## Public Surfaces

Public behavior is exposed through primitives:

- Select exposes trigger, listbox, item, selected, highlighted, and form serialization contracts.
- Combobox and Autocomplete expose input plus popup collection behavior.
- Menu-family primitives expose item navigation and checked/highlighted states.
- Tabs and Toolbar use composite navigation patterns where appropriate.
- Listbox remains internal until Select and Combobox settle the public collection API.

## Rules

- Do not export `packages/keystone/src/collection/*` as public package subpaths without an ADR or RFC.
- Do not let Mason import collection or typeahead internals.
- Mason should not reimplement Select, Combobox, Menu, or listbox navigation when a Keystone primitive exists.
- Collection tests should assert observable focus, highlighted state, selection, form value, and data attributes.
- Typeahead behavior should stay centralized so locale, timeout, disabled item, and dynamic item fixes apply across primitives.

## Promotion Criteria

A collection kernel API can be promoted only after Select, Combobox, Menu, and virtualized/large-list requirements are reconciled. Promotion requires a stable item identity model, SSR-safe registration story, keyboard matrix, typeahead contract, and migration policy.
