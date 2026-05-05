# Mason Registry Tooling Improvements

## Status

Implementation planning note for Mason registry build, validation, source sync, docs generation, item indexing, and install metadata hardening.

## Purpose

Mason already has a stronger registry model than a one-off registry script: per-item JSON documents, schema validation, path safety, dependency graph resolution, install planning, installed hashes, lifecycle commands, and default-registry verification tests. The next tooling slice should make the default registry less hand-maintained by generating derived artifacts from Keystone-owned source and by validating that item metadata matches the installed source.

This note translates useful ideas from the referenced UI registry scripts into Keystone-owned Mason work. It is not a source port. The implementation should stay Solid-native, Mason-first, and independent from React-specific registry assumptions.

## Current Mason Baseline

- Registry schema and item validation live in `packages/mason-registry/src/schema.ts`, `validate-item.ts`, `validate-files.ts`, `validate-dependencies.ts`, and `resolve-dependencies.ts`.
- CLI install, diff, update, remove, and doctor planning live in `packages/mason-cli/src/install/plan.ts`, `packages/mason-cli/src/install/write.ts`, and `packages/mason-cli/src/commands/lifecycle.ts`.
- The first-party default registry lives under `registry/default`, with source files currently referenced from `packages/ui/src/default`.
- Docs registry preview generation lives in `scripts/generate-docs-registry-items.ts` and emits `apps/docs/src/lib/default-registry-items.gen.ts`.
- Tests already verify default item schema, parity metadata, source descriptor reachability, install plans, generated app typechecking, generated app builds, and some lifecycle behavior.

## Useful Ideas To Adopt

### Registry Build Generation

Useful idea: generate derived registry artifacts instead of relying on every public index by hand.

Mason adaptation:

- Keep `registry/default/items/*.json` as the human-authored item metadata for now.
- Add a Mason build script that validates every item, sorts items deterministically, and rewrites `registry/default/registry.json` from item summaries.
- Emit a static distribution directory for hosting, for example `dist/mason-registry/default`, containing `registry.json`, item JSON files, and copied file payloads when Keystone decides the hosted default registry URL.
- Do not generate Solid preview component imports through lazy runtime code. Mason docs can consume JSON and source previews; installed source remains ordinary project source.

Concrete targets:

- Add `scripts/build-mason-registry.ts`.
- Add exported helpers in `packages/mason-registry/src/build.ts` for `buildRootRegistry`, `collectRegistryItems`, `copyRegistryPayload`, and deterministic JSON writing.
- Export those helpers from `packages/mason-registry/src/index.ts`.
- Add root scripts: `registry:build`, `registry:validate`, and include validation in `verify:release`.

### Dependency Validation From Source Imports

Useful idea: compare source imports with declared `dependencies` and `registryDependencies`.

Mason adaptation:

- Add a validation mode that reads each item file, parses static imports, and checks declarations.
- Treat imports from Keystone default source roots as registry dependency candidates only when there is a known item owning that source file.
- Treat external package imports as package dependency candidates, with subpath imports normalized to package names for package manifest checks.
- Allow explicit ignore lists for Solid built-ins, local relative imports within the same multi-file item, TypeScript type-only imports, and known project aliases that resolve inside the same item.
- Prefer TypeScript AST parsing or Bun/TypeScript compiler APIs over regex-based import parsing.
- Report missing and extra metadata with item name, file path, import specifier, and suggested field.

Concrete targets:

- Add `packages/mason-registry/src/inspect-imports.ts`.
- Add `packages/mason-registry/src/validate-source-dependencies.ts`.
- Extend `validateItem` options with a first-party source dependency validation mode, or expose a separate `validateRegistrySourceDependencies` API to keep third-party schema validation lightweight.
- Add tests in `packages/mason-registry/src/registry-validation.test.ts` that run the check over `registry/default/items`.

### Source Sync

Useful idea: have a reproducible copy/rewrite step between canonical source and registry payloads.

Mason adaptation:

- Keep `packages/ui/src/default` as the canonical first-party generated-source tree.
- Do not sync registry source back into `packages/ui`; that would make the registry copy look authoritative.
- Add a build step that copies selected source files into a static registry payload only when publishing or previewing a hosted registry.
- Rewrites should be explicit and narrow. Keystone source imports should already be the installed-source shape wherever possible, so the build should not hide major import transformations.
- If import rewriting is needed for hosted payloads, put rules in a Mason-owned manifest and test each rewrite.

Concrete targets:

- Add `registry/default/source-map.json` only if item JSON becomes too repetitive to maintain source ownership.
- Otherwise derive source ownership from item `files` and `meta.sourceFiles`.
- Add `scripts/sync-mason-registry-payload.ts` only for publishing payloads, not for package source maintenance.
- Add tests that compare copied payload hashes to canonical source files.

### Docs Generation

Useful idea: generate docs-facing indexes from registry metadata.

Mason adaptation:

- Extend `scripts/generate-docs-registry-items.ts` instead of adding a separate docs-only generator.
- Include grouped item indexes by type, category, keyword, registry dependency, package dependency, and parity reference.
- Generate source previews from `meta.sourceFiles` with deterministic ordering and size guards.
- Generate docs warnings for items missing docs-ready metadata such as `meta.install`, `meta.anatomy`, `meta.accessibility`, `meta.limitations`, or `meta.parity` where applicable.

Concrete targets:

- Update `scripts/generate-docs-registry-items.ts`.
- Add generated exports in `apps/docs/src/lib/default-registry-items.gen.ts` for `defaultRegistryItemsByType`, `defaultRegistryItemsByDependency`, `defaultRegistryItemsByParityReference`, and `defaultRegistrySourcePreviews`.
- Add a docs test under `apps/docs` or a registry package test that asserts generated indexes match the default registry.

### Particle And Block Indexing

Useful idea: expose registry item indexes that distinguish small reusable pieces from blocks and templates.

Mason adaptation:

- Define Mason-owned group names instead of inheriting another project taxonomy:
  - `primitive`: Core-backed styled UI source such as dialog, select, tabs, and checkbox.
  - `particle`: small source-owned UI, hook, lib, or store item used by larger compositions.
  - `field`: TanStack Form field adapters and field shells.
  - `workspace`: data-dense blocks and app surfaces.
  - `template`: project or route scaffolds.
- Store this as `meta.mason.group` or a top-level `categories` convention after validating current item metadata.
- Generate an index that answers:
  - Which blocks depend on a given item?
  - Which particles are leaf install units?
  - Which items pull Core?
  - Which items pull TanStack app libraries?
  - Which items are not currently install-supported?

Concrete targets:

- Add `packages/mason-registry/src/index-items.ts`.
- Add `registry/default/groups.json` only if metadata should stay separate from item JSON.
- Prefer item-local metadata first, because Mason item docs and CLI output benefit from the same source of truth.

### Install Metadata

Useful idea: carry enough metadata for future diff, update, and provenance workflows.

Mason adaptation:

- Keep current `package.json` `mason.installed` records with item version, registry identity, file targets, and file hashes.
- Extend planned install records with item dependency closure and source payload identity, so update can detect whether a dependency was installed as a transitive dependency or explicitly requested later.
- Add optional registry build integrity data once the hosted default registry exists.
- Record the Mason CLI version that wrote the item when packages become publishable.
- Avoid embedding large source snapshots in user projects; hashes are enough for the first update and doctor workflows.

Concrete targets:

- Update `InstalledItemRecord` and `InstalledRecord` in `packages/mason-cli/src/install/plan.ts`.
- Update `applyWritePlan` metadata writes in `packages/mason-cli/src/install/write.ts`.
- Extend `doctor` checks in `createDoctorReport`.
- Add lifecycle tests in `packages/mason-cli/test/mason-cli.test.ts`.

## Implementation Sequence

1. Add source dependency inspection in `@keystone-ui/mason-registry`.
   - Start with package dependency normalization and same-item relative import handling.
   - Verify against the current default registry without changing item JSON in the same patch unless the validator exposes real metadata drift.

2. Add deterministic root registry generation.
   - Build `registry/default/registry.json` from `registry/default/items/*.json`.
   - Fail when generated output differs from the checked-in file.
   - Keep item JSON as the authoring surface.

3. Extend docs registry generation.
   - Generate item group indexes and reverse dependency maps.
   - Add size guards for source previews so docs builds do not silently ship oversized generated modules.

4. Add hosted payload build.
   - Copy item JSON and referenced source files to a distribution directory.
   - Preserve canonical source hashes.
   - Defer default URL wiring until the hosted registry decision in `docs/mason/lifecycle-and-default-registry.md` is resolved.

5. Harden installed metadata.
   - Add dependency closure and registry payload identity to installed records.
   - Update diff, update, remove, and doctor output only where the added metadata changes behavior.

## Verification

Run the focused checks after each implementation slice:

```sh
bun run test:mason-registry
bun run test:mason-cli
bun run check-types
```

Run release-level verification before merging the full tooling slice:

```sh
bun run verify:release
```

Add specific assertions for:

- Root registry generation is deterministic.
- Every default registry item validates with required parity metadata.
- Every default registry item source path exists and stays under the allowed canonical source roots.
- Source imports match declared `dependencies` and `registryDependencies`, with documented ignores.
- Docs generated indexes match the default registry and reverse dependency graph.
- Hosted payload files match canonical source hashes.
- Installed metadata round-trips through add, diff, update, remove, and doctor.

## Non-Goals

- Replacing Mason item JSON with a TypeScript registry definition in this slice.
- Making Core depend on UI or Mason.
- Adding React-specific preview loading, import shapes, or CLI behavior.
- Publishing the hosted default registry before the registry URL and schema URL decisions are made.
- Auto-fixing dependency metadata without a reviewable diff.
