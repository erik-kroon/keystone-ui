# Keystone UI

Keystone UI is an early Solid UI monorepo for accessible headless primitives, editable application UI source, and the Mason registry workflow that installs that source into user projects.

This repository is currently at the `0.1.0` private preview stage. It is useful for evaluation and development, but it is not a stable public package release and the packages are not published to npm.

## What Is Here

Keystone has three product layers:

- **Core**: headless, accessible, unstyled Solid primitives.
- **UI**: copy-paste styled components, app components, blocks, and templates for Solid.
- **Mason**: registry schema, validation, and CLI workflows for installing UI source.

Core owns intrinsic behavior: accessibility, focus, keyboard interaction, controlled state, dismissal, overlays, positioning, forms, collections, SSR, and stable DOM contracts.

UI owns generated source: styled wrappers, app components, blocks, templates, and TanStack-backed integrations. UI may depend on Core. Core must not depend on UI.

Mason owns source installation: project detection, install planning, dependency resolution, path safety, diff/update/remove/doctor workflows, and installed item metadata.

## Preview Status

The current preview is intentionally conservative:

- Packages remain private and versioned `0.0.0`.
- `Keystone` and `@keystone-ui` are provisional names until package, trademark, domain, and handle clearance are complete.
- The root license is MIT.
- No hosted default Mason registry is published yet.
- Mason commands use an explicit local registry path in this preview.
- Most primitives are `beta` or `experimental`, not stable.
- Manual assistive-technology evidence is still incomplete.

Release notes for the current preview are in [docs/releases/0.1.0-preview.md](docs/releases/0.1.0-preview.md).

## Repository Layout

```txt
apps/
  web/                  Solid + TanStack Router docs/product surface

packages/
  core/                 Headless Solid primitive package
  ui/                   First-party source-owned UI components and blocks
  mason-cli/            Mason CLI for registry init/add/diff/update/remove/doctor
  mason-registry/       Registry schema, validation, dependency resolution, and path safety

registry/
  default/items/        First-party Mason registry item metadata

docs/
  adr/                  Durable architecture decisions
  releases/             Preview release notes and checklist
  roadmap/              Sequencing, maturity, and engine-boundary notes
  rfcs/                 Core API and Mason registry contracts
```

## Core

Core primitives are Solid-native and unstyled. They expose stable styling hooks such as `data-scope`, `data-part`, state attributes, and documented CSS variables where relevant.

Example imports:

```ts
import { Dialog } from "@keystone-ui/core/dialog";
import { Popover } from "@keystone-ui/core/popover";
import { Select } from "@keystone-ui/core/select";
import { Tabs } from "@keystone-ui/core/tabs";
import { Toast, toaster } from "@keystone-ui/core/toast";
import { Tooltip } from "@keystone-ui/core/tooltip";
```

Current preview coverage includes overlays, dialogs, popovers, tooltips, menus, select/combobox, form control, selection controls, tabs, toolbar, slider, date picker/calendar, toast, and supporting utilities.

Core kernel utilities stay private unless an ADR or accepted RFC promotes them into public API.

## UI And Mason

UI source is distributed through Mason registry items. Installed files are normal Solid source owned by the target application.

The default local registry currently includes 47 items, including:

- Basic UI: `button`, `badge`, `card`, `field`, `input`, `label`, `separator`, `textarea`, `cn`
- Core-backed UI: `accordion`, `autocomplete`, `checkbox`, `collapsible`, `combobox`, `context-menu`, `date-picker`, `dialog`, `dropdown-menu`, `hover-card`, `menu`, `menubar`, `navigation-menu`, `popover`, `radio-group`, `select`, `sheet`, `slider`, `switch`, `tabs`, `toast`, `toolbar`, `tooltip`
- TanStack-backed app components: `checkbox-field`, `command-menu`, `data-table`, `data-table-tanstack-router`, `form-submit`, `radio-group-field`, `select-field`, `switch-field`, `tanstack-form`, `tanstack-field`, `text-field`, `textarea-field`
- Blocks and templates: `account-settings`, `invoice-dashboard`, `tanstack-start-dashboard`

Example local registry usage from a Solid app, once the preview CLI is available as `mason`:

```bash
mason init
mason add button --registry <path-to-keystone>/registry/default
mason add dialog --registry <path-to-keystone>/registry/default
```

The 0.1 preview is intentionally local-registry first: `add`, `diff`, and `update` require `--registry <path>`. There is no hosted default registry published yet.

In this repository, the CLI source can be run directly:

```bash
bun packages/mason-cli/src/index.ts init --cwd <solid-app-path>
bun packages/mason-cli/src/index.ts add button --cwd <solid-app-path> --registry ./registry/default
```

Every first-party registry item should carry docs-ready metadata, source file references, dependencies, customization notes, and `meta.parity` notes.

The registry contract is documented in [docs/rfcs/mason-registry.md](docs/rfcs/mason-registry.md).

## Development

Install dependencies:

```bash
bun install
```

Run the web app:

```bash
bun run dev:docs
```

Run the main checks:

```bash
bun run check
bun run check-types
bun run test:core
bun run test:docs
bun run test:mason-cli
bun run test:mason-registry
```

Run the full release gate:

```bash
bun run verify:release
```

The release gate runs formatting/linting, type checks, Core tests, the web test step, Mason CLI tests, Mason registry tests, example app verification, and the web build.

## Design Principles

- Prefer Solid-native APIs over React-shaped ports.
- Keep Core behavior unstyled and accessible by default.
- Keep Core independent from UI and TanStack app libraries.
- Put TanStack app integrations in UI source, not Core primitives.
- Make generated UI source readable, editable, and owned by the user project.
- Treat keyboard interaction, focus management, SSR, and hydration as product requirements.
- Build depth before breadth.

## Documentation

Useful starting points:

- [CONTEXT.md](CONTEXT.md): domain terms and product boundaries.
- [docs/roadmap/maturity-model.md](docs/roadmap/maturity-model.md): maturity labels.
- [docs/roadmap/do-not-reinvent.md](docs/roadmap/do-not-reinvent.md): engine-boundary guidance.
- [docs/adr/0003-ui-tanstack-app-layer.md](docs/adr/0003-ui-tanstack-app-layer.md): TanStack app-layer decision.
- [docs/adr/0004-core-kernel-api-boundary.md](docs/adr/0004-core-kernel-api-boundary.md): Core public/private kernel boundary.

## License

MIT. See [LICENSE](LICENSE).
