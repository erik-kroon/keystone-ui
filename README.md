# Keystone UI

Keystone UI is an early component system for modern Solid applications. It pairs accessible, unstyled primitives with readable component source that you can copy, paste, inspect, and adapt for your own product.

The project is being shaped for serious Solid interfaces: dashboards, internal tools, developer tools, analytics workspaces, and other data-dense applications where clarity, accessibility, and keyboard behavior matter.

## Status

Keystone UI is in early development and is not recommended for production applications yet.

- Packages are not published to npm.
- Component APIs and source files may change while the system takes shape.
- The `Keystone`, `Keystone UI`, and `@keystone-ui` names are provisional.
- Accessibility, keyboard interaction, SSR, and hydration behavior are active areas of work.

## What Is Here

This repository currently contains:

- **Keystone Core**: headless, accessible, unstyled Solid primitives.
- **Keystone UI**: first-party styled component source, app components, blocks, and examples built for Solid.
- **Docs site**: a Solid + TanStack Router site for component docs, previews, and project documentation.

Core owns the behavior layer: accessibility, focus management, keyboard navigation, dismissal, positioning, form semantics, SSR, hydration, and controlled or uncontrolled state.

UI owns the source layer: styled components, composition patterns, application UI, and TanStack-backed integrations where they fit.

## Design Goals

- Solid-first APIs that use signals, accessors, JSX and composable primitives idiomatically.
- Accessible primitive behavior without forcing a visual language into Core.
- Readable component files that teams can review and change.
- Stable data attributes and predictable DOM structure for styling and customization.
- Product-ready patterns for overlays, fields, forms, and data-dense workflows.
- Thoughtful defaults styled with Tailwind CSS tokens.
- Clear boundaries between primitive behavior and app-level integrations.

## Explore The Source

Useful starting points:

- [packages/core/src](packages/core/src): primitive implementation source.
- [packages/ui/src/default](packages/ui/src/default): first-party component and block source.
- [apps/web/src/components/docs-overview.tsx](apps/web/src/components/docs-overview.tsx): current overview page copy.
- [docs/design-system.md](docs/design-system.md): visual language, tokens, and styling direction.
- [docs/roadmap/canonical-roadmap.md](docs/roadmap/canonical-roadmap.md): current sequencing and maturity posture.
- [docs/adr](docs/adr): durable architecture decisions.

## Local Development

Install dependencies:

```bash
bun install
```

Run the docs site:

```bash
bun run dev:docs
```

Run the main checks:

```bash
bun run check
bun run check-types
bun run test:core
bun run test:docs
```

Build the monorepo:

```bash
bun run build
```

## Contributing

Contributions, bug reports, accessibility notes, tests, examples, and docs improvements are welcome while Keystone UI is still forming.

Before opening a large change, please check the existing docs, ADRs, and roadmap notes so the work fits the current direction. Small fixes and focused improvements are easiest to review.

## License

MIT. See [LICENSE](LICENSE).
