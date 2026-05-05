# UI Lifecycle And Default Registry

## Status

Preview documentation for the current Mason CLI and registry behavior.

UI is the source-owned component layer for Solid apps. It installs readable files into user projects and records enough metadata to support future diff, update, remove, and doctor workflows.

## Current Preview Boundary

The current CLI is a local-registry preview. Commands that resolve registry items require an explicit registry path:

```sh
mason add dialog --registry ./registry/default
mason diff dialog --registry ./registry/default
mason update dialog --registry ./registry/default
```

There is no hosted default registry in this preview. The default first-party registry exists in this repo under `registry/default`, and tests verify installs against that local registry. The CLI error text intentionally tells users that `--registry <path>` is required until a hosted default exists.

Hosted default registry resolution is deferred for 0.1. The first implementation slice should be:

- Publish a static build of `registry/default` at a versioned Keystone-owned URL.
- Define whether schema references stay relative to the package schema or use a hosted schema URL.
- Add CLI default-registry resolution only for `add`, `diff`, and `update`.
- Keep `--registry <path-or-url>` as an override for local and private registries.
- Add release verification that fetches the hosted registry and installs at least `button`, `dialog`, `data-table`, and `account-settings`.

## Lifecycle Commands

### `mason init`

Detects the current project and writes `mason.config.json`.

Current requirements:

- Solid project.
- Vite Solid project.
- JavaScript or TypeScript project shape.

Current behavior:

- Detects package manager.
- Records default aliases for UI, hooks, lib, and theme targets.
- Refuses to overwrite an existing Mason config unless forced.

Example:

```sh
mason init
```

### `mason add <item>`

Resolves a registry item and its transitive registry dependencies, validates them, builds a write plan, and writes files.

Current behavior:

- Requires `--registry <path>` because the 0.1 preview has no hosted default registry.
- Resolves registry dependencies into one plan.
- Validates item metadata, install-supported item types, paths, dependency specifiers, and targets before writing.
- Refuses existing target files unless the registry file mode allows the write.
- Records installed item metadata in `package.json` under `mason.installed`.
- Adds package dependency changes to `package.json` and prints the install command for the detected package manager.

Examples:

```sh
mason add button --registry ./registry/default
mason add dialog --registry ./registry/default
mason add data-table --registry ./registry/default
mason add account-settings --registry ./registry/default
```

Dry run:

```sh
mason add dialog --registry ./registry/default --dry-run
```

Dry run prints the planned files and dependencies without writing.

### `mason diff <item>`

Compares the current registry output with installed files and recorded hashes.

Current behavior:

- Requires `--registry <path>` because the 0.1 preview has no hosted default registry.
- Shows creates, updates, deletes, unchanged files, dependency changes, and local-change markers.
- Uses installed file hashes when available to distinguish registry updates from user edits.

Example:

```sh
mason diff dialog --registry ./registry/default
```

### `mason update <item>`

Re-resolves an installed item and applies registry output when safe.

Current behavior:

- Requires `--registry <path>` because the 0.1 preview has no hosted default registry.
- Blocks when local changes are detected unless `--force` is used.
- `--dry-run` prints the update plan without writing.
- `--force` overwrites local changes with the planned registry output.

Examples:

```sh
mason update dialog --registry ./registry/default --dry-run
mason update dialog --registry ./registry/default
mason update dialog --registry ./registry/default --force
```

### `mason remove <item>`

Removes clean installed files and clears installed metadata.

Current behavior:

- Does not require a registry path.
- Keeps locally changed files unless `--force` is used.
- `--dry-run` prints the delete/keep plan without writing.

Examples:

```sh
mason remove dialog --dry-run
mason remove dialog
mason remove dialog --force
```

### `mason doctor`

Checks UI project health.

Current behavior:

- Verifies `mason.config.json` exists.
- Checks configured aliases for empty values.
- Checks the configured style entry exists.
- Reports unknown package manager detection.
- Checks installed item metadata and recorded file hashes.
- With `--registry <path>`, checks that registry path has a `registry.json`.
- Reports missing `@keystone-ui/core` when Core-backed installed items require it.

Examples:

```sh
mason doctor
mason doctor --registry ./registry/default
```

## Installed Metadata

UI records installed item metadata in the user project's `package.json` under `mason.installed`.

The current record includes:

- Item name.
- Item version.
- Registry identity: registry name, homepage, and resolved source URL.
- Installed file targets.
- File hashes at install time.

This metadata lets `diff`, `update`, `remove`, and `doctor` detect local edits, missing files, and registry provenance mismatches without treating generated source as hidden runtime state.

## Default Registry Behavior

Current preview behavior:

- The first-party default registry source lives at `registry/default`.
- CLI commands do not yet imply that path automatically.
- Users and tests pass `--registry <path>` explicitly.
- A hosted public registry URL is intentionally deferred until package naming, release posture, and registry distribution are decided.

Target future behavior:

- `mason add <item>` can resolve the first-party registry without an explicit local path.
- Namespaced registries and direct registry URLs can be configured.
- Registry build/publish commands can emit static item payloads for hosting.
- Private registry headers and environment-variable expansion can be supported without logging secrets.

## Generated-App Verification

First-party UI items should prove generated output in realistic apps before preview claims expand.

Current verification covers:

- Installing representative registry items into a Solid Vite fixture.
- Typechecking generated source.
- Building generated source.
- Server-rendering a composed app that imports Core-backed overlays, DataTable, DataTable Router adapter, CommandMenu, TanStack Form text/select/textarea/checkbox/radio/switch fields, and the invoice dashboard block.
- Validating registry metadata, dependency graphs, and path safety.

Current limitations:

- SolidStart, full TanStack Router route-file generation, Tailwind/plain CSS variants, and monorepo matrices are not all covered yet.
- Browser interaction and accessibility smoke checks for installed UI examples remain future preview hardening work.

## Preview Rules

- UI source is user-owned after installation.
- Core-backed UI items should import Core primitives for behavior.
- UI should not reimplement focus traps, dismissable layers, typeahead, select behavior, combobox behavior, or form-control ARIA wiring.
- TanStack app engines belong in UI-generated source where they provide app-grade behavior.
- Registry docs and metadata should state parity notes and gaps honestly.
