# Accordion And Collapsible Vertical

## Scope

This vertical establishes the delivery standard for disclosure primitives:

- Compare Keystone and Mason against Kobalte and Base UI.
- Ship the thin Keystone primitive over a shared disclosure controller.
- Add Mason copy-paste wrappers and registry metadata.
- Add behavior tests for the core accessibility and state contract.
- Record parity gaps before deepening.

## Current Keystone Contract

Collapsible:

- `Collapsible.Root` supports `open`, `defaultOpen`, `disabled`, and `onOpenChange`.
- `Collapsible.Root` renders the root part with `data-scope`, `data-part`, `data-state`, and `data-disabled`.
- `Collapsible.Trigger` exposes `aria-expanded`, `aria-controls`, `data-scope`, `data-part`, `data-state`, and `data-disabled`.
- `Collapsible.Content` owns the controlled content id and exposes `data-state`.
- `Collapsible.Content hiddenUntilFound` keeps closed content mounted with `hidden="until-found"` and opens from the browser `beforematch` reveal event.
- User click handlers run first; internal toggle behavior skips when the event is default-prevented.

Accordion:

- `Accordion.Root` supports controlled and uncontrolled `value`, `defaultValue`, `multiple`, `disabled`, `orientation`, and `loopFocus`.
- `Accordion.Item` coordinates item value state over the shared disclosure controller.
- `Accordion.Trigger` exposes trigger/content ARIA relationships and roves focus with vertical arrow keys, Home, and End.
- `Accordion.Content` renders a region labelled by the trigger.
- `Accordion.Content hiddenUntilFound` keeps closed panels discoverable by browser find and opens the item when the browser reveals the panel.

## Mason Surface

- `registry/default/ui/collapsible.tsx` wraps Keystone Collapsible with `mason-collapsible-*` styling hooks.
- `registry/default/ui/accordion.tsx` wraps Keystone Accordion with `mason-accordion-*` styling hooks and app-owned content markup.
- Registry metadata records dependencies, parts, install command, source files, customization notes, and parity gaps.

## Parity Notes

Reference surfaces:

- Kobalte Accordion and Collapsible document `div` roots, button triggers, `div` content, controlled/uncontrolled state, shared open/closed/disabled data attributes, and accordion roving trigger focus.
- Base UI Accordion and Collapsible document root/trigger/panel parts, controlled/uncontrolled state, `hiddenUntilFound`, measured panel CSS variables, loop focus, and transition lifecycle data attributes.

Kobalte and Base UI both go deeper than this first vertical in transition and browser edge behavior. The next parity pass should add measured panel CSS variables, transition lifecycle data attributes, RTL-aware horizontal keyboard behavior, disabled-but-focusable trigger policy decisions, and broader edge-case tests.
