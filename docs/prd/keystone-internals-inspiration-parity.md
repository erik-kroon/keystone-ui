# PRD: Keystone Internals Inspiration Parity

## Problem Statement

Keystone has early primitive tracers, but the runtime depth is not yet comparable to the inspiration libraries. Dialog, Form, Overlay, and Select prove public direction, but much of their behavior is still local to each primitive. That makes the library fragile: future primitives will either duplicate hard behavior or ship shallow accessibility and interaction support.

Base UI demonstrates the level of architecture and runtime depth Keystone should aspire to: reusable systems for dialogs, fields, floating content, forms, menus, collections, and composite widgets. Kobalte demonstrates how similar ideas should be expressed in Solid, especially around polymorphism, controllable state, collections, focus, form controls, poppers, and listbox/select composition. Radix remains useful precedent, but its React-specific API shapes should not drive Keystone design.

The immediate problem is not that Keystone lacks more components. The immediate problem is that Keystone lacks a deep internal kernel. Without that kernel, adding more primitives will increase surface area faster than reliability.

## Solution

Build a Keystone internal kernel that reaches parity with the relevant architectural lessons from Base UI and Kobalte before expanding the primitive catalog.

The work should proceed through independently testable internal modules, each proven by a narrow primitive or demo path:

- Controllable state and event composition.
- Solid-native polymorphic rendering.
- Hydration-safe IDs and environment guards.
- Collection registration and lookup.
- Typeahead and list navigation.
- Focus scope and focus restore.
- Dismissable layer and layer stack.
- Prevent scroll and outside hiding/inert behavior.
- Presence and force-mount lifecycle.
- Floating adapter and geometry CSS variables.
- Form-control registration and field state.

Existing Dialog, Overlay, Form, and Select tracers should be refactored onto these internals instead of growing more local behavior. Each module should be small at the public interface and deep in behavior, with browser-visible tests and docs/spec notes where user-facing contracts are affected.

## User Stories

1. As a Keystone maintainer, I want internal systems before broad primitive work, so that primitives share reliable behavior instead of duplicating logic.
2. As a Keystone maintainer, I want Base UI treated as the primary runtime-depth reference, so that Keystone is measured against serious primitive architecture.
3. As a Keystone maintainer, I want Kobalte treated as the primary Solid-native reference, so that Keystone APIs fit Solid rather than React.
4. As a Keystone maintainer, I want Radix treated as secondary precedent, so that useful concepts are considered without copying React-specific APIs.
5. As a primitive implementer, I want a robust controllable state utility, so that controlled and uncontrolled primitive state behaves consistently.
6. As a primitive implementer, I want event composition standardized, so that user handlers can prevent internal behavior predictably.
7. As a primitive implementer, I want a Solid-native polymorphic renderer, so that primitive parts can render native elements and router links without losing props, refs, or accessibility attributes.
8. As a primitive implementer, I want hydration-safe IDs, so that labels, descriptions, triggers, and content relationships survive SSR and hydration.
9. As a primitive implementer, I want collection registration, so that item-based primitives can reason about order, disabled items, labels, and dynamic children.
10. As a primitive implementer, I want typeahead behavior, so that Select, Combobox, Menu, and Listbox interactions are consistent.
11. As a primitive implementer, I want list navigation behavior, so that arrow keys, Home, End, looping, disabled items, and RTL rules are centralized.
12. As a primitive implementer, I want focus scope behavior, so that modal primitives can trap, restore, and direct focus reliably.
13. As a primitive implementer, I want dismissable layer behavior, so that outside pointer, outside focus, Escape, nested layers, and preventable dismissal are consistent.
14. As a primitive implementer, I want a layer stack, so that only the topmost relevant overlay responds to global dismissal.
15. As a primitive implementer, I want prevent-scroll behavior, so that modal overlays can block page scroll without layout bugs.
16. As a primitive implementer, I want outside hiding or inert behavior, so that modal overlays are not announced with unrelated page content.
17. As a primitive implementer, I want presence and force-mount behavior, so that animations and SSR-sensitive rendering have a shared lifecycle.
18. As a primitive implementer, I want a floating adapter, so that Popover, Select, Tooltip, Menu, and Combobox share positioning behavior.
19. As a primitive implementer, I want geometry CSS variables, so that Mason and design-system wrappers can animate and size floating content.
20. As a primitive implementer, I want form-control registration, so that fields, labels, descriptions, errors, invalid state, required state, and disabled state are consistent.
21. As a Dialog user, I want focus to move into a modal dialog on open, so that keyboard use starts in the expected place.
22. As a Dialog user, I want focus to restore on close, so that I return to the control that opened the dialog.
23. As a Dialog user, I want nested dialogs and overlays to dismiss in the correct order, so that complex UI does not close the wrong layer.
24. As a Dialog user, I want outside interactions to be preventable, so that product-specific confirmation or validation flows can intercept dismissal.
25. As a Select user, I want keyboard navigation and typeahead to work across disabled and dynamic items, so that list interactions feel complete.
26. As a Select user, I want selected and highlighted state exposed through stable attributes, so that styling remains independent from behavior.
27. As a Select user, I want form submission to include the selected value, so that Select can replace native controls in real forms.
28. As a Mason component author, I want Keystone internals to expose stable data and CSS contracts, so that Mason wrappers can stay simple.
29. As a design-system author, I want low-level internals to remain testable through public primitive behavior, so that wrappers do not depend on private structures.
30. As a contributor, I want each internal system to have clear inspiration notes, so that Base UI/Kobalte comparisons guide implementation without cargo-culting.
31. As a contributor, I want tests to assert public behavior, so that internal refactors remain possible.
32. As a future primitive author, I want Dialog and Select refactored onto the kernel, so that new overlay and collection primitives have proven examples.

## Implementation Decisions

- Base UI is the first-priority reference for runtime depth, internal architecture, and behavior completeness.
- Kobalte is the first-priority reference for Solid-native API design, polymorphism, composition, and reactive constraints.
- Radix is secondary precedent and should not override Solid-native choices.
- Keystone should not add broad new primitives until Dialog and Select are refactored onto shared internals.
- Internal modules should be designed as deep modules: small stable interfaces, substantial encapsulated behavior, and focused tests.
- Public primitive behavior should be the verification surface for internals whenever possible.
- Private internals should not become public subpath exports until a deliberate API decision is made.
- Existing utility and primitive files may be reorganized when it reduces duplication and improves testability.
- Kernel modules must remain Keystone-only and must not depend on Mason.
- Data attributes and CSS variables remain public styling contracts and should be documented when internals affect them.

## Testing Decisions

- Good tests assert user-observable behavior: DOM attributes, focus movement, emitted change details, keyboard outcomes, form data, and hydration safety.
- Avoid tests that lock private signal names, private file layout, or incidental helper structure.
- Controllable state and event composition should have unit tests.
- Polymorphism should have type tests and runtime tests for native elements and router-link-like callbacks.
- ID utilities should have SSR/hydration tests or equivalent server/client rendering checks.
- Collection, typeahead, and list navigation should have unit tests and Select-driven browser tests.
- Focus scope, dismissable layer, layer stack, prevent scroll, and outside hiding should have Dialog-driven browser tests.
- Floating adapter behavior should be tested through geometry attributes/styles and a positioned primitive path.
- Form-control behavior should be tested through form submission and accessible relationship output.
- Existing Mason registry and CLI tests are useful prior art for deterministic behavior and path-safety testing, but Keystone needs browser/component tests beyond current package typechecks.

## Out of Scope

- New broad primitive catalog expansion.
- Mason blocks and templates.
- Final naming, package scope clearance, or commercial packaging.
- Full Combobox, Menu, Popover, Tooltip, or Date Picker implementation unless needed as a small proving harness.
- Copying Base UI, Kobalte, or Radix code wholesale.
- Publicly committing to private kernel export names before they are proven.

## Further Notes

This PRD supersedes a component-count mindset for Keystone. The expected result is fewer primitives with much deeper runtime quality.

The first implementation sequence should be:

1. Map Base UI/Kobalte internals for each kernel module.
2. Build state, event, ID, and polymorphic foundations.
3. Build focus, dismissal, layer, presence, and scroll systems.
4. Refactor Dialog onto those systems.
5. Build collection, typeahead, navigation, form-control, and floating systems.
6. Refactor Select onto those systems.
7. Use the refactored Dialog and Select as the baseline for future primitives.
