# Keystone UI

Keystone UI is an early Solid UI workspace for accessible primitives and source-owned components.

It has two layers:

- **Keystone** is the headless, unstyled primitive layer for Solid.
- **Mason** is the copy-paste component registry and CLI layer for Solid apps.

Keystone owns behavior, accessibility, state, focus, dismissal, selection, overlays, and stable styling contracts. Mason owns generated source, registry metadata, styled wrappers, blocks, templates, and app-level integrations.

## Status

This repository is preparing for a `0.1.0` preview. It is not a stable public release yet.

- Package names, product names, domains, and trademark positioning are still provisional.
- Workspace packages are currently private.
- The current public package scope is an internal workspace scope, not a cleared release scope.
- Keystone internals are intentionally private while the primitive kernel is still being deepened.
- Mason currently targets local registry development before a hosted public registry.

The project direction is depth before breadth: build the shared primitive kernel first, then expand the component catalog.

## Packages

```txt
packages/
  keystone/        Solid primitives
  mason-cli/       init/add CLI for installing registry source
  mason-registry/  registry schema, validation, dependency resolution, and path safety

apps/
  docs/            Solid docs and product surface

registry/
  default/         first-party Mason registry items
```

## Keystone

Keystone primitives are Solid-native and unstyled. They expose stable `data-scope` and `data-part` attributes so design systems can style behavior without depending on private internals.

Current preview imports include:

```ts
import { Accordion } from "@keystone-ui/keystone/accordion";
import { Checkbox } from "@keystone-ui/keystone/checkbox";
import { Dialog } from "@keystone-ui/keystone/dialog";
import { DropdownMenu } from "@keystone-ui/keystone/dropdown-menu";
import { Menu } from "@keystone-ui/keystone/menu";
import { Popover } from "@keystone-ui/keystone/popover";
import { RadioGroup } from "@keystone-ui/keystone/radio-group";
import { Select } from "@keystone-ui/keystone/select";
import { Slider } from "@keystone-ui/keystone/slider";
import { Switch } from "@keystone-ui/keystone/switch";
import { Tabs } from "@keystone-ui/keystone/tabs";
import { Toast, toaster } from "@keystone-ui/keystone/toast";
import { Tooltip } from "@keystone-ui/keystone/tooltip";
```

The current work emphasizes overlays, disclosure, menus, fields, selection controls, tabs, toolbar, slider, date picker, toast, and shared metadata for docs.

## Mason

Mason installs readable Solid source into an app. The installed files are owned by the app, while Keystone-backed components delegate intrinsic behavior to Keystone primitives.

Current local registry items include:

- Base UI: `button`, `badge`, `card`, `field`, `input`, `label`, `separator`, `textarea`, `cn`
- Keystone-backed UI: `accordion`, `checkbox`, `collapsible`, `combobox`, `context-menu`, `date-picker`, `dialog`, `dropdown-menu`, `hover-card`, `menu`, `menubar`, `navigation-menu`, `popover`, `radio-group`, `sheet`, `slider`, `switch`, `tabs`, `toast`, `toolbar`, `tooltip`
- TanStack-backed app components: `data-table`, `data-table-tanstack-router`, `select-field`, `text-field`
- Blocks: `account-settings`

Example local registry usage:

```bash
mason init
mason add button --registry <local-registry-path>
mason add dialog --registry <local-registry-path>
```

Mason install planning records target files, content hashes, existing target state, dependency changes, installed item metadata, and conflicts before writes are applied.

## Registry Metadata

Every first-party registry item carries docs-ready metadata:

- install command
- source files
- dependencies
- customization guidance
- anatomy or part names where relevant
- parity notes against the relevant references

Base UI is the first reference for runtime depth. Kobalte is the first reference for Solid-native primitive shape. Some components use more specific references, such as TanStack Table, TanStack Form, TanStack Router, Sonner, or shadcn-style registry conventions.

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
bun run test:keystone
bun run test:mason-cli
bun run test:mason-registry
```

Run the release verification gate:

```bash
bun run verify:release
```

That runs formatting/linting, type checks, Keystone tests, Mason CLI tests, Mason registry tests, example app verification, and the docs build.

## Principles

- Solid APIs should not be React-shaped ports.
- Accessible behavior is core product scope.
- Keystone must not depend on Mason.
- Mason may depend on Keystone primitives.
- Mason components should not reimplement Keystone behavior.
- TanStack app integrations belong in Mason, not Keystone.
- Generated Mason code should stay readable and easy to own.

## Inspiration

Keystone and Mason are informed by the ecosystem around Base UI, Kobalte, Radix Primitives, shadcn/ui, Sonner, TanStack, and copy-paste component registries. The goal is not to clone any one project. The goal is a Solid-native primitive foundation paired with a source-first component layer.

## License

MIT is the intended license before public release. A root `LICENSE` file still needs to be added before publication.
