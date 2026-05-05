# Accessibility Testing Plan

## Status

Draft

## Date

2026-05-03

## Related

- [RFC: Core API](../rfcs/core-api.md)
- [ADR 0001: Keystone Core And UI Product Boundary](../adr/0001-keystone-core-ui-boundary.md)

## Summary

Core owns accessibility behavior for primitive runtime code. UI owns styled source, previews, blocks, templates, and CLI output, but it should not reimplement Core accessibility behavior.

This plan defines the quality gate for stable Core primitives and UI items built on top of them. Automated checks are required, but they are not sufficient. Stable primitives must also pass manual keyboard and assistive technology testing against a written primitive accessibility spec.

The baseline standard is WCAG 2.2 Level AA for product surfaces and generated examples, plus WAI-ARIA Authoring Practices Guide patterns when Keystone implements a custom widget pattern such as dialog, alert dialog, menu, select, combobox, tabs, tooltip, or listbox.

## Goals

- Catch regressions in keyboard, focus, labeling, state, form, SSR, and hydration behavior.
- Make each primitive's accessibility contract reviewable before implementation stabilizes.
- Separate Core behavior responsibility from UI styling responsibility.
- Keep accessibility tests focused on public behavior and DOM contracts rather than private implementation details.
- Require manual screen-reader coverage before a primitive moves to stable release.
- Give contributors a repeatable test matrix that scales from kernel utilities to overlays, fields, selection controls, and UI examples.

## Non-Goals

- Guarantee legal compliance for every downstream application.
- Replace user research or product-specific accessibility audits.
- Test every visual permutation of UI blocks with every assistive technology.
- Treat WAI-ARIA APG examples as copy-paste implementation requirements when native HTML can satisfy the interaction more simply.

## Release Gates

### Experimental Primitive

An experimental primitive may ship only when:

- It has a draft accessibility spec.
- It has unit or browser tests for its highest-risk interaction behavior.
- It documents known accessibility gaps.
- It is not exported through the stable Keystone release channel.

### Stable Primitive

A stable Core primitive requires:

- A completed accessibility contract in docs or colocated primitive documentation.
- Automated interaction tests for keyboard, pointer, focus, controlled/uncontrolled state, disabled behavior, and public DOM attributes.
- Automated accessibility smoke tests for rendered examples.
- SSR and hydration tests when the primitive renders IDs, portals, overlays, floating content, presence, or browser-measured state.
- Manual keyboard-only testing.
- Manual screen-reader testing on the supported assistive technology matrix.
- Documented known limitations, if any.

### Mason Registry Item

A Mason registry item requires:

- Core imports for primitive behavior when a Core primitive exists.
- No local reimplementation of focus traps, dismissable layers, roving focus, typeahead, select, combobox, or dialog behavior.
- Automated install simulation into at least one example app.
- Typecheck and build verification after install.
- Automated accessibility smoke testing of preview states.
- Visual regression coverage when styling, layout, forced-color behavior, or responsive behavior is part of the item value.

## Test Layers

### 1. Spec Review

Every stable primitive starts with an accessibility spec that documents:

- Anatomy and required parts.
- Role and ARIA attribute mapping.
- Labeling and description behavior.
- Keyboard interaction.
- Focus entry, focus containment, focus restore, and escape behavior.
- Pointer and outside-interaction behavior.
- Disabled, readonly, required, invalid, selected, checked, highlighted, and placeholder states where applicable.
- Form participation where applicable.
- RTL behavior where applicable.
- SSR and hydration expectations.
- Data attributes used for public state styling.
- Known limitations and unsupported compositions.

The spec is the source of truth for implementation and tests. If implementation differs from WAI-ARIA APG guidance, the spec must explain why, usually because native HTML gives a more robust result.

### 2. Kernel Unit Tests

Kernel tests should cover reusable behavior before primitive breadth grows:

- `createControllableSignal`: controlled and uncontrolled state, initial state, change callbacks, no internal state fights in controlled mode.
- Event composition: user handler runs first, internal handler skips when `event.defaultPrevented`.
- ID generation: deterministic relationships and hydration-safe behavior.
- Collection ordering: registration, removal, disabled items, dynamic content, and stable lookup.
- Typeahead: repeated characters, timeout, disabled items, locale-sensitive matching, and wraparound.
- Roving focus and list navigation: orientation, RTL, looping, disabled items, Home, End, Page Up, and Page Down where applicable.
- Focus scope: trap, restore, nested scopes, initial focus, fallback focus, and teardown.
- Dismissable layer: outside pointer, focus outside, Escape, nested layers, branch elements, and preventable dismissal.
- Presence and force mount: mount state, hidden state, animation lifecycle, and cleanup.
- Floating adapter: placement, collision, anchor geometry variables, transform origin, and no direct browser access during SSR.

### 3. Primitive Browser Tests

Primitive tests should run against real DOM behavior and assert public output:

- Roles, names, descriptions, and ARIA relationships.
- Stable `data-scope` and `data-part` on every rendered part.
- Stable state data attributes such as `data-state`, `data-disabled`, `data-invalid`, `data-selected`, `data-highlighted`, `data-orientation`, `data-side`, and `data-align`.
- Keyboard open, close, navigation, selection, cancellation, and submission flows.
- Pointer flows that mirror keyboard behavior where appropriate.
- Controlled and uncontrolled state behavior.
- Disabled and readonly interaction blocking.
- Focus entry, focus movement, focus containment, focus restore, and nested primitive behavior.
- Outside interaction handling for overlays.
- Portal behavior and stacking behavior for overlays.
- Form reset, form submission, validation attributes, and hidden input behavior where applicable.
- RTL navigation and placement behavior.

Tests should prefer user-observable assertions such as active element, accessible name, attributes, emitted change details, and form data. They should avoid locking private signal structure or internal helper names.

#### Spec-To-Test Harness

Core primitive tests should use `packages/core/test/accessibility.ts` for reusable accessibility contracts instead of rebuilding APG assertions in each primitive test file.

The harness provides:

- `runKeyboardTable` for keyboard interaction tables, including controller prop handlers and rendered DOM targets.
- `expectRole`, `expectPart`, `expectStablePartAttributes`, `expectAriaState`, `expectAriaRelationship`, and `expectNoAriaRelationship` for public DOM and prop getter contracts.
- `expectFocus`, `expectFocusWithin`, `expectFocusTrap`, and `expectFocusRestore` for focus entry, containment, restore, and active-descendant models.
- `expectOutsideDismissal` for preventable outside pointer/focus dismissal checks.
- `expectFormValues` and `expectFormReset` for native submission, reset, and hidden input serialization.
- `expectSsrSmoke` and `expectHydrationSmoke` for server-render and hydration smoke checks.
- `withDirection`, `withReducedMotion`, and `withForcedColors` for RTL, reduced-motion, and forced-color test hooks.

Primitive accessibility specs should include a short "Automated Coverage" section that maps each required behavior to one of these harness interfaces. Example:

| Spec requirement                  | Harness interface                                        |
| --------------------------------- | -------------------------------------------------------- |
| Trigger controls popup            | `expectAriaRelationship({ attribute: "aria-controls" })` |
| Arrow Down opens and highlights   | `runKeyboardTable([{ key: "ArrowDown", ... }])`          |
| Popup exposes listbox semantics   | `expectRole(listbox, "listbox")`                         |
| Selection serializes to form data | `expectFormValues(form, { project: "alpha" })`           |
| RTL navigation is direction-aware | `withDirection("rtl", () => ...)`                        |
| Forced-colors branch stays stable | `withForcedColors(() => ...)`                            |
| Hydration-sensitive IDs are safe  | `expectHydrationSmoke({ html })`                         |

Controller tests should use the same harness against prop getter return objects when rendering is unnecessary. Browser tests should use it against rendered elements when focus, form ownership, portals, or native DOM behavior are part of the requirement.

### 4. Automated Accessibility Smoke Tests

Run automated accessibility checks against docs or preview examples for each stable primitive and UI item.

Automated checks should catch:

- Missing names and descriptions.
- Invalid ARIA attributes or relationships.
- Obvious role misuse.
- Focusable hidden content.
- Color contrast failures in UI and docs surfaces.
- Landmark and heading mistakes in docs, blocks, and templates.

Automated checks do not prove correct keyboard interaction, focus management, screen-reader announcement quality, or custom widget semantics. Those stay manual release blockers for stable primitives.

### 5. SSR And Hydration Tests

SSR and hydration tests are required for primitives that use:

- Generated IDs.
- Portals.
- Presence or force-mounted content.
- Floating or measured content.
- Browser-only APIs.
- Initial focus or focus restore.
- Environment-aware behavior such as media queries, direction, or document access.

Tests should assert:

- Server rendering does not access `window`, `document`, layout APIs, or observers.
- Server and client markup hydrate without warnings.
- ID relationships remain stable across server and client.
- Portal behavior is deterministic after hydration.
- Closed or force-mounted content does not create invalid focus targets.

### 6. Type Tests

Type tests should cover:

- Compound component exports and subpath exports.
- Low-level creator inputs and returned prop getters.
- Controlled and uncontrolled prop combinations.
- Event detail types.
- Polymorphic `as` usage for native elements, router links, and callback-style composition.
- Ref and directive constraints that are specific to Solid.
- UI wrapper imports that consume Core primitive parts.

## Manual Test Matrix

Stable Core primitives require manual coverage across:

| Environment                 | Required Coverage                                            |
| --------------------------- | ------------------------------------------------------------ |
| Chrome + NVDA on Windows    | Primary desktop screen-reader path                           |
| Firefox + NVDA on Windows   | Browser variance for ARIA and focus behavior                 |
| Safari + VoiceOver on macOS | Apple desktop screen-reader path                             |
| iOS Safari + VoiceOver      | Touch screen-reader path                                     |
| Keyboard only in Chromium   | Tab order, arrow keys, Escape, Enter, Space, Home, End       |
| Reduced motion              | Presence, transitions, and UI preview behavior               |
| Forced colors               | UI styling, focus indicators, contrast, and state visibility |
| RTL document                | Direction-aware navigation, placement, and text flow         |

Manual testing should record:

- Primitive name and version.
- Browser, operating system, and assistive technology version.
- Test scenario.
- Expected behavior.
- Actual behavior.
- Pass, fail, or blocked status.
- Follow-up issue or doc note.

Manual evidence can live in `.context/` during active work, but release-blocking results should be summarized in durable docs or release notes.

### Manual Checklist Output

Use this shape for release-blocking manual evidence:

```md
## Manual Accessibility Check

- Primitive:
- Version or commit:
- Tester:
- Date:
- Environment:
- Assistive technology:
- Scenario:
- Expected:
- Actual:
- Result: Pass | Fail | Blocked
- Follow-up:
```

Each stable primitive should have at least one checklist entry for keyboard-only use and one for the relevant screen-reader path before release. Failed or blocked checks need a linked issue or an explicit known-limitation note.

## First Primitive Coverage

### Dialog

Required checks:

- Trigger has an accessible name.
- Content has `role="dialog"` and correct modal state when modal.
- Title and description wire to the dialog through accessible relationships.
- Opening moves focus to the first tabbable descendant, or to the content element when no tabbable descendant exists. `onMountAutoFocus` can prevent the default focus move.
- Tab and Shift+Tab remain inside a modal dialog.
- Escape closes the topmost dialog when not prevented by `onEscapeKeyDown`.
- Outside pointer and focus interactions close the topmost dialog when not prevented by `onPointerDownOutside`, `onFocusOutside`, or `onInteractOutside`.
- Closing restores focus to the previously focused element, falling back to `document.body`. `onUnmountAutoFocus` can prevent the default restore.
- Nested dialogs and nested layers dismiss in top-layer order.
- Portalled content hydrates without warnings.

### Alert Dialog

Required checks:

- Content uses alert dialog semantics.
- Focus lands on the least destructive or spec-defined action.
- Escape, outside interaction, and cancellation behavior match the spec.
- Screen readers announce title, description, and urgency appropriately.
- Destructive action and cancel action are distinguishable by name and focus order.

### Field And Form Control

Required checks:

- Label, description, error message, required, invalid, disabled, and readonly states map to native and ARIA semantics.
- Form submission includes the expected value.
- Form reset restores uncontrolled state.
- Controlled state remains app-owned.
- Error messages are associated without duplicate or stale descriptions.
- Hidden inputs, if used, are not accidentally focusable.

### Select And Combobox

Required checks before stable release:

- Trigger or input has a usable accessible name.
- Popup relationship, expanded state, active descendant or roving focus model, and selected state match the spec.
- Keyboard opening, closing, navigation, typeahead, selection, cancellation, Home, End, and printable character behavior work.
- Pointer and keyboard selection emit the same public state changes.
- Disabled items are announced and skipped or blocked according to spec.
- Form submission and reset behavior work.
- RTL navigation and floating placement are correct.
- Virtualization, async filtering, or creatable behavior remain experimental until separately specified.

## UI-Specific Coverage

UI tests should verify accessibility is preserved after styling and source generation:

- Installed components import Core primitives for behavior.
- Component source keeps labels, descriptions, and required parts visible to app authors.
- Focus indicators are visible in default, hover, active, disabled, invalid, dark, forced-color, and high-contrast states.
- Generated examples avoid unlabeled icon-only buttons unless an accessible name is supplied.
- Blocks have valid heading structure, landmarks, skip paths where needed, and no keyboard traps.
- Templates typecheck, build, hydrate, and pass smoke accessibility checks after installation.
- Docs previews include keyboard-operable examples, not only static screenshots.

## Tooling Baseline

The repo should introduce tooling as product modules appear. The intended stack is:

- Unit tests for kernel behavior.
- Browser interaction tests for primitives and installed UI examples.
- Automated accessibility checks using a browser-integrated accessibility engine.
- SSR render and hydration warning tests.
- Type tests for public APIs.
- Visual regression tests for UI and docs previews.

Tool choices should be recorded when test infrastructure lands. The plan intentionally avoids locking a runner before Keystone Core and UI packages exist.

## CI Expectations

CI should eventually expose these lanes:

- `check-types`: public API and generated example typing.
- `test:unit`: kernel and registry behavior.
- `test:browser`: primitive and UI interaction tests.
- `test:a11y`: automated accessibility smoke checks.
- `test:ssr`: server rendering and hydration checks.
- `test:visual`: UI and docs visual regression checks.

Until these scripts exist, contributors should document manual verification commands in PR notes and keep accessibility evidence attached to the relevant primitive or UI item.

## References

- WCAG 2.2, W3C Recommendation, 2023-10-05: https://www.w3.org/TR/wcag/
- WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- Dialog Modal Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
