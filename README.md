# Keystone UI

Keystone UI is an early Solid UI ecosystem experiment with two layers:

- **Keystone**: headless, accessible, unstyled primitives for Solid.
- **Mason**: a source-first component registry and CLI for installing editable Solid UI into an app.

The goal is a serious primitive foundation plus a source-first copy-paste registry for Solid. Keystone owns behavior and accessibility. Mason owns generated source, registry metadata, install planning, blocks, templates, and docs.

## Status

This repository is preparing for a `0.1.0` preview. It is not a stable public release yet.

Current Keystone preview surface:

```ts
import { Dialog } from "@keystone-ui/keystone/dialog";
import { Select } from "@keystone-ui/keystone/select";
import { createFormControl } from "@keystone-ui/keystone/form";
```

Current Mason preview surface:

```bash
mason init
mason add button --registry <local-registry-path>
```

The first Mason registry item is a standalone `button`. Keystone-backed Mason components, starting with `dialog`, are planned next.

## Design Principles

- Solid-native APIs, not React ports.
- Accessible behavior is product scope.
- Keystone primitives are unstyled and expose stable `data-scope` and `data-part` attributes.
- Mason installs readable source files that the app owns.
- Mason components import Keystone behavior instead of reimplementing focus, dismissal, selection, or form semantics.
- Kernel depth comes before primitive count.

## Repository Layout

```txt
apps/
  web/                 docs/product/landing surface, built with Solid

packages/
  keystone/            Solid primitive package
  mason-cli/           Mason init/add CLI tracer
  mason-registry/      registry schema, validation, path safety, dependency resolution
  config/              shared TypeScript config
  env/                 shared env helpers
  infra/               Cloudflare/Alchemy deployment

docs/
  adr/                 durable decisions
  rfcs/                API and registry proposals
  reports/             readiness and audit notes
  agents/              repo guidance for future agents/contributors
```

## Development

Install dependencies:

```bash
bun install
```

Run the web app:

```bash
bun run dev:web
```

Open:

```txt
http://localhost:3001
```

Run the release verification gate:

```bash
bun run verify:release
```

That runs formatting/linting, type checks, Keystone tests, Mason CLI tests, Mason registry tests, and the web build.

Run only the example app verification tracer:

```bash
bun run verify:example-app
```

That creates a temporary Solid Vite app, installs Mason output from the local registry through the CLI, consumes Keystone Dialog in the same app, checks SSR-rendered data/ARIA output, typechecks, and builds.

## Useful Commands

```bash
bun run check
bun run check-types
bun run test:keystone
bun run test:mason-cli
bun run test:mason-registry
bun run verify:example-app
bun run build
bun run verify:release
```

## What Is Not Stable Yet

- Package names and product names are provisional.
- `@keystone-ui` is the current workspace scope, not a cleared public package scope.
- Keystone `./overlay` and `./utils` internals are private for `0.1.0`.
- Mason currently supports a local registry path for the first tracer.
- Mason blocks, templates, themes, and a public registry are not ready.
- The docs/product surface lives in `apps/web` and is still early.

## License

MIT is the intended license before public release. A root `LICENSE` file still needs to be added before publication.
