# PRD: Keystone Core And UI Foundation

## Problem Statement

Solid has strong rendering primitives and several useful UI libraries, but it does not yet have a single coherent ecosystem that combines a serious primitive layer, a copy-paste styled source registry, CLI workflows, blocks, templates, documentation, accessibility QA, and community publishing.

This makes Solid feel riskier for teams that need production UI infrastructure. App developers must assemble behavior, accessibility, styling, docs, and templates from separate sources. Design-system authors must either build low-level interaction behavior themselves or adopt APIs that may not fit their needs. Library authors lack a standard registry loop for publishing Solid UI that can be installed, previewed, validated, and customized.

The result is not merely a missing component catalog. The missing product is an ecosystem flywheel: accessible primitives enable styled wrappers, styled wrappers enable registry items, registry items enable blocks and templates, and blocks/templates make Solid faster and safer to adopt for real applications.

## Solution

Build one monorepo with two product-distinct layers:

- Keystone: a Solid-native, headless, accessible, unstyled primitive system.
- UI: a copy-paste UI registry, CLI, blocks, themes, templates, and documentation layer built on Keystone.

Core should handle the hard interaction and accessibility details that teams do not want to rebuild: controlled and uncontrolled state, focus management, keyboard interaction, dismissal, layering, portals, positioning, collections, typeahead, forms, SSR, hydration, and stable DOM contracts.

Mason should install readable Solid UI source files into user projects. UI items should use Core primitives for behavior, while giving users ownership of styled component source. UI source should also include blocks, templates, and theme tokens; Mason owns registry validation, CLI project detection, diffs, updates, and publishing workflows.

The foundation should prioritize depth before breadth. The initial milestone should establish durable product boundaries, API conventions, registry conventions, and accessibility expectations before building a large component catalog.

## User Stories

1. As a Solid app developer, I want to initialize UI in an existing app, so that I can add polished UI without manually wiring project conventions.
2. As a Solid app developer, I want to add a dialog component from UI, so that I can use accessible modal behavior with editable styled source.
3. As a Solid app developer, I want UI items to import Core behavior, so that accessibility and interaction fixes can be updated centrally.
4. As a Solid app developer, I want generated component files to be readable, so that I can customize them without learning a hidden design system.
5. As a Solid app developer, I want UI to detect my package manager, framework, TypeScript setup, styles, aliases, and router where possible, so that setup requires minimal manual configuration.
6. As a Solid app developer, I want UI to support dry runs and diffs, so that I can understand file changes before accepting them.
7. As a Solid app developer, I want UI to warn before overwriting local changes, so that I do not lose customizations.
8. As a Solid app developer, I want to add production-shaped blocks, so that I can start from dashboard, auth, settings, billing, and admin flows instead of single components.
9. As a Solid app developer, I want templates for common Solid app shapes, so that I can start new projects with working UI, routing, styles, and dependencies.
10. As a Solid app developer, I want installed components to typecheck and build in example apps, so that registry items are trustworthy.
11. As a Solid app developer, I want Core-backed components to avoid hydration warnings, so that SolidStart and SSR projects remain reliable.
12. As a Solid app developer, I want components to expose stable state attributes, so that I can customize styling and animation without changing behavior code.
13. As a Solid app developer, I want floating components to expose geometry variables, so that popovers, selects, and tooltips can size and animate correctly.
14. As a Solid app developer, I want accessible keyboard behavior in menus, dialogs, tabs, and selects, so that my app works for keyboard users.
15. As a Solid app developer, I want UI docs to show install commands, usage, source, dependencies, and customization notes, so that I can adopt components confidently.
16. As a design-system author, I want unstyled primitives, so that I can apply my own visual language.
17. As a design-system author, I want Keystone to avoid a global theme provider requirement, so that primitives fit existing systems.
18. As a design-system author, I want stable compound component parts, so that I can wrap only the pieces I need.
19. As a design-system author, I want low-level creator APIs, so that I can build abstractions beyond the default compound components.
20. As a design-system author, I want a Solid-native polymorphic API, so that primitives compose with anchors, router links, and custom elements.
21. As a design-system author, I want controlled and uncontrolled state conventions, so that primitives can support simple usage and fully managed app state.
22. As a design-system author, I want event handlers to run user code before internal behavior, so that consumers can prevent default interactions intentionally.
23. As a design-system author, I want primitives to document roles, ARIA attributes, keyboard behavior, focus behavior, disabled behavior, RTL behavior, form behavior, SSR behavior, and limitations, so that accessibility is auditable.
24. As a design-system author, I want Keystone to expose data attributes on every part, so that wrappers can style state consistently.
25. As a design-system author, I want overlay primitives to support nested layers, escape handling, outside interaction handling, focus trap, focus restore, prevent scroll, portals, and force mounting, so that modal and popover behavior is production-ready.
26. As a primitive power user, I want kernel utilities to be reusable and tested, so that primitives share consistent behavior.
27. As a primitive power user, I want collection, typeahead, list navigation, roving focus, and form-control systems, so that advanced controls are built from stable internals.
28. As a primitive power user, I want Keystone to avoid direct browser access during SSR, so that server rendering remains safe.
29. As a primitive power user, I want generated IDs to be hydration-safe, so that accessible labeling does not break across server and client.
30. As a library author, I want to publish Mason registry items, so that other Solid users can install my components and blocks.
31. As a library author, I want registry schema validation, so that invalid paths, dependencies, and file targets are rejected before publication.
32. As a library author, I want install simulation, so that I can verify registry items in realistic project layouts.
33. As a library author, I want registry items to describe dependencies and registry dependencies, so that installs are deterministic.
34. As a library author, I want registry previews and screenshots, so that consumers can evaluate components before installing them.
35. As a library author, I want private registry support without leaking credentials, so that teams can distribute internal UI.
36. As a docs reader, I want Keystone documentation organized around philosophy, accessibility, polymorphism, styling, controlled state, SSR, composition, primitives, utilities, and API references, so that I can understand the system before adopting it.
37. As a docs reader, I want every primitive page to include anatomy, basic usage, controlled usage, styling with data attributes, animation, accessibility, API reference, examples, recipes, and known issues, so that I can use primitives correctly.
38. As a docs reader, I want UI documentation organized around CLI, components, blocks, themes, templates, registry, publishing, customization, framework support, monorepos, migration, and troubleshooting, so that I can solve practical adoption problems.
39. As a maintainer, I want Keystone Core and UI package boundaries to be explicit, so that future contributors do not accidentally couple primitive behavior to styled registry output.
40. As a maintainer, I want the first milestone to include naming, scope, license, governance, API RFC, registry RFC, and accessibility testing decisions, so that expensive changes happen before implementation depth grows.
41. As a maintainer, I want Keystone to publish as one package with subpath exports, so that installation and semver remain simple while imports can tree-shake.
42. As a maintainer, I want UI to use Solid-specific project detection and transforms, so that it is not limited by React-oriented tooling.
43. As a maintainer, I want automated tests for kernel behavior, component interactions, SSR, hydration, registry validation, CLI operations, and generated code, so that regressions are caught early.
44. As a maintainer, I want manual accessibility testing expectations to be explicit, so that launch quality is not defined only by automated checks.
45. As a maintainer, I want unstable primitives to live outside stable release channels, so that experimental product areas do not destabilize core APIs.
46. As a contributor, I want clear contribution targets for kernel, overlays, fields, selection controls, CLI, registry, docs, and examples, so that work can proceed independently.
47. As a contributor, I want ADRs and RFCs for major decisions, so that product and architecture context does not live only in chat.
48. As a team evaluating Solid, I want a coherent primitive and registry ecosystem, so that choosing Solid feels less risky for production UI.

## Implementation Decisions

- Keystone Core and UI will be separate product layers in one monorepo.
- Keystone will own primitive behavior, accessibility contracts, state, focus, keyboard interaction, dismissal, layering, positioning, forms, SSR, hydration, and DOM styling contracts.
- UI will own CLI workflows, project detection, registry schema, registry validation, styled source generation, blocks, templates, themes, previews, and publishing workflows.
- Core must not depend on UI.
- UI items should depend on Core primitives for behavior by default.
- Core should start with internal kernel modules before visible component breadth.
- Core should expose compound component APIs for app and wrapper authors.
- Core should expose low-level creator APIs for primitive power users and advanced wrappers.
- JSX component APIs should use Solid reactive props for controlled state.
- Low-level creator APIs should accept accessors for controlled state.
- Stateful primitives should support controlled and uncontrolled usage.
- Change events should emit structured details with state, source event, and reason where useful.
- Core should use a Solid-native polymorphic `as` API, including callback-style advanced usage.
- Stable `data-scope` and `data-part` attributes are required on primitive parts.
- State, orientation, placement, disabled, invalid, selected, highlighted, and related attributes should be stable and documented.
- Floating and measured components should expose CSS variables for anchor size, available size, transform origin, and arrow positioning.
- Event composition should run user handlers first and skip internal behavior when the event is default-prevented.
- Overlay primitives should be designed around reusable focus, dismissal, layer, portal, prevent-scroll, presence, and floating systems.
- Floating behavior should use Floating UI or a thin internal adapter around it.
- Core must avoid direct browser access during SSR and avoid hydration-unsafe ID generation.
- Mason CLI must validate registry input and prevent path traversal.
- Mason CLI should support dry run, diff, deterministic writes, overwrite handling, and monorepo-aware project detection.
- Mason registry items should support components, blocks, hooks, utilities, themes, pages, templates, config, rules, and assets.
- Mason registry compatibility should follow shadcn-style concepts where useful without depending on React-specific behavior.
- Keystone stable releases should avoid experimental advanced primitives until API confidence is high.
- Docs are product surface and should be developed alongside implementation, not after it.
- Initial durable decisions should be recorded as ADRs or RFCs before implementation.

## Testing Decisions

- Tests should validate external behavior, accessibility contracts, public APIs, CLI effects, generated project output, and registry guarantees rather than private implementation details.
- Core kernel modules should have focused unit tests for controllable state, event composition, collections, typeahead, focus stacks, dismissal stacks, presence, and floating adapters.
- Core primitive tests should cover keyboard interaction, focus restore, outside interaction, nested overlays, disabled states, RTL, form submission, and controlled/uncontrolled behavior.
- Keystone SSR tests should cover server rendering, hydration, portals, generated IDs, force-mounted content, and absence of hydration warnings.
- Keystone type tests should cover polymorphic props, refs, event handlers, component exports, and low-level creator APIs.
- Mason CLI tests should cover init detection, add, diff, update, remove, doctor, dry run, overwrite handling, path aliases, monorepos, private registry auth, and invalid registry rejection.
- Mason registry tests should cover schema validation, dependency resolution, file target validation, path traversal rejection, install simulation, and item version compatibility.
- UI generated-code tests should install registry items into example apps, typecheck them, build them, and run smoke interactions.
- Visual regression tests should focus on UI items, blocks, templates, and docs previews.
- Automated accessibility smoke tests should be required, but manual screen-reader and keyboard testing remains a launch blocker for stable primitives.
- Manual accessibility coverage should include Chrome with NVDA, Firefox with NVDA, Safari with VoiceOver, iOS Safari with VoiceOver, keyboard-only usage, reduced motion, forced colors, and RTL documents.
- Existing repo prior art is minimal; test infrastructure should be introduced deliberately as product modules appear.

## Out of Scope

- Final public product naming, package naming, trademarks, domains, social handles, and SEO positioning.
- A large first release with dozens of shallow primitives.
- A themed Keystone component library.
- A Keystone dependency on UI.
- A UI implementation that reimplements focus traps, select behavior, typeahead, or accessibility behavior instead of using Keystone.
- A Tailwind-only primitive system.
- A package-only styled UI kit where users cannot own component source.
- Community registry marketplace features before core CLI, registry validation, and first-party examples work.
- Commercial pro blocks, sponsorship packaging, and paid templates.
- Full advanced product primitives such as data grids, kanban, scheduler, and rich selects in the foundation milestone.

## Further Notes

Keystone Core and UI are working names. Package scope and naming clearance should happen before public launch.

The recommended build order is:

1. Core internals.
2. Core overlays.
3. Keystone fields and forms.
4. Keystone select and combobox.
5. Mason CLI and registry.
6. UI core components.
7. UI blocks and templates.
8. Community registry support.

The current repository is still a small scaffold. The next planning artifacts should be a Core API RFC, Mason registry RFC, and accessibility testing plan.
