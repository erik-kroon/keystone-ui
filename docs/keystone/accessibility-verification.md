# Keystone Accessibility Verification

This checklist is the manual release-gate companion to the shared accessibility harness in
`packages/keystone/test/accessibility.ts`.

## Harness Coverage

- Roles and stable `data-scope` / `data-part` attributes are asserted for each released part.
- ARIA relationships are checked with real IDs and DOM targets, not private implementation state.
- Keyboard tables cover arrow keys, Home/End, Escape, activation, and preventable handlers where the primitive owns those interactions.
- Focus trap, focus restore, and outside dismissal are verified for modal and dismissable overlay surfaces.
- Native form submission and reset are checked for controls that expose hidden inputs or field state.
- SSR and hydration smoke checks are included for primitives that render IDs, portals, or force-mounted content.

## Manual Release Gate

- Keyboard: verify tab order, roving or active-descendant movement, Escape behavior, and disabled item skipping in a browser.
- Screen reader: verify name, role, value, expanded/selected/checked state, descriptions, and live-region output with VoiceOver on macOS.
- Focus: verify visible focus, focus trap boundaries, focus restore target, and route/navigation cleanup.
- Pointer and dismissal: verify outside press, pointer blocking, nested layer order, and trigger/content hover or press timing.
- Forms: verify native submit payloads, reset behavior, validation state, required/invalid announcements, and hidden input values.
- Rendering: verify SSR output, hydration, portals, forced mounted content, reduced motion, forced colors, and LTR/RTL direction.
- Styling contract: verify documented `data-*` attributes and `--keystone-*` CSS variables are present on the public parts.

## Stable Primitive Output

For a primitive to move to stable-candidate release posture, attach the harness test name, manual
browser notes, screen-reader notes, and any known gaps to the release checklist or issue. Known
gaps should be explicit follow-up work, not hidden behind broad "needs accessibility review"
language.
