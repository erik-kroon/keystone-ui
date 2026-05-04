# Keystone UI

Keystone UI is an early Solid UI workspace for building accessible primitives and source-owned application components.

It is split into two layers:

- **Core** is the headless, unstyled primitive layer for Solid.
- **UI components** are the copy-paste styled component, block, and template source for Solid apps.

Core owns behavior, accessibility, state, focus, dismissal, selection, overlays, and stable styling contracts. UI components own generated source, styled wrappers, blocks, templates, and app-level integrations. Mason owns the registry and CLI that install those files.

## Direction

Keystone Core/UI is aimed at Solid teams building serious, data-dense, keyboard-first applications: dashboards, internal tools, analytics workspaces, developer tools, financial workspaces, and similar operational surfaces.

Core stays domain-agnostic. UI is where source-owned app patterns live: TanStack-backed tables and forms, command surfaces, dense layouts, inspector panels, event feeds, and workspace blocks.

The durable sequencing direction lives in the [Canonical Roadmap](docs/roadmap/canonical-roadmap.md). Engine boundaries are documented in [Do Not Reinvent Engines](docs/roadmap/do-not-reinvent.md).

## Status

This repository is preparing for a `0.1.0` preview. It is not a stable public release yet.

- Package names, product names, domains, and trademark positioning are still provisional.
- Workspace packages are currently private.
- The current public package scope is an internal workspace scope, not a cleared release scope.
- Core internals are intentionally private while the primitive kernel is still being deepened.
- Mason currently targets local registry development before a hosted public registry.

The project direction is depth before breadth: harden the shared primitive kernel first, then expand the component catalog.

Primitive and registry surfaces use the maturity model in [Maturity Model](docs/roadmap/maturity-model.md): `internal`, `experimental`, `beta`, `stable`, and `deprecated`.

## Packages

```txt
packages/
  core/                 Solid primitives
  mason-cli/            init/add CLI for installing registry source
  mason-registry/       registry schema, validation, dependency resolution, and path safety

apps/
  docs/            Solid docs and product surface

registry/
  default/         first-party Mason registry items
```

## Core

Core primitives are Solid-native and unstyled. They expose stable `data-scope` and `data-part` attributes so design systems can style behavior without depending on private internals.

Current preview imports include:

```ts
import { Accordion } from "@keystone-ui/core/accordion";
import { Checkbox } from "@keystone-ui/core/checkbox";
import { Dialog } from "@keystone-ui/core/dialog";
import { DropdownMenu } from "@keystone-ui/core/dropdown-menu";
import { Menu } from "@keystone-ui/core/menu";
import { Popover } from "@keystone-ui/core/popover";
import { RadioGroup } from "@keystone-ui/core/radio-group";
import { Select } from "@keystone-ui/core/select";
import { Slider } from "@keystone-ui/core/slider";
import { Switch } from "@keystone-ui/core/switch";
import { Tabs } from "@keystone-ui/core/tabs";
import { Toast, toaster } from "@keystone-ui/core/toast";
import { Tooltip } from "@keystone-ui/core/tooltip";
```

The current work emphasizes overlays, disclosure, menus, fields, selection controls, tabs, toolbar, slider, date picker, toast, and shared metadata for docs.

## UI

Mason installs readable Solid source into an app. The installed files are owned by the app, while Core-backed components delegate intrinsic behavior to Core primitives.

Current local registry items include:

- Base components: `button`, `badge`, `card`, `field`, `input`, `label`, `separator`, `textarea`, `cn`
- Core-backed UI: `accordion`, `checkbox`, `collapsible`, `combobox`, `context-menu`, `date-picker`, `dialog`, `dropdown-menu`, `hover-card`, `menu`, `menubar`, `navigation-menu`, `popover`, `radio-group`, `sheet`, `slider`, `switch`, `tabs`, `toast`, `toolbar`, `tooltip`
- TanStack-backed app components: `data-table`, `data-table-tanstack-router`, `select-field`, `text-field`
- Blocks: `account-settings`

Example local registry usage:

```bash
mason init
mason add button --registry <local-registry-path>
mason add dialog --registry <local-registry-path>
```

Mason install planning records target files, content hashes, existing target state, dependency changes, installed item metadata, and conflicts before writes are applied.

## Data-Dense Patterns

UI is intended to grow beyond individual components into source-owned application patterns for dense product surfaces. The first direction is TanStack-backed app components such as `data-table`, command surfaces, form adapters, and route-aware data patterns.

Longer-term workspace blocks such as realtime tables, watchlists, metric components, terminal layouts, chart interaction adapters, condition builders, and event feeds are aspirational until Core kernels and Mason registry/CLI workflows are reliable enough to support them.

## Registry Metadata

Every first-party registry item carries docs-ready metadata:

- install command
- source files
- dependencies
- customization guidance
- anatomy or part names where relevant
- maturity and implementation notes where relevant
- `meta.parity` notes for first-party reference coverage and known gaps

Registry metadata should make each item understandable without requiring readers to compare it to another component system.

The registry metadata contract is documented in [Mason Registry RFC](docs/rfcs/mason-registry.md).

## Development

Install dependencies:

```bash
bun install
```

Run the docs app:

```bash
bun run dev:docs
```

Run the main checks:

```bash
bun run check
bun run check-types
bun run test:core
bun run test:mason-cli
bun run test:mason-registry
```

Run the release verification gate:

```bash
bun run verify:release
```

That runs formatting/linting, type checks, Core tests, Mason CLI tests, Mason registry tests, example app verification, and the docs build.

## Principles

- Solid APIs should not be React-shaped ports.
- Accessible behavior is core product scope.
- Core must not depend on UI components.
- UI components may depend on Core primitives.
- UI items should not reimplement Core behavior.
- TanStack app integrations belong in UI components, not Core.
- Generated UI code should stay readable and easy to own.
- Data-dense components should preserve clarity under frequent updates.
- Keyboard interaction and focus behavior should be designed as first-class product concerns.

## Product Focus

Keystone Core and UI are built around a Solid-native primitive foundation paired with a source-first component layer.

For application-level patterns, the project focuses on data-dense products such as developer tools, trading terminals, analytics workspaces, and internal operations software.

## License

MIT is the intended license before public release. A root `LICENSE` file still needs to be added before publication.
