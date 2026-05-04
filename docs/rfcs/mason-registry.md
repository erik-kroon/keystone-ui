# RFC: Mason Registry

## Status

Draft

## Date

2026-05-03

## Related

- [ADR 0001: Keystone And Mason Product Boundary](../adr/0001-keystone-mason-product-boundary.md)
- [ADR 0002: Scope, Names, License, And Governance](../adr/0002-scope-names-license-governance.md)
- [RFC: Keystone API](keystone-api.md)
- [PRD: Keystone And Mason Foundation](../prd/keystone-mason-foundation.md)

## Summary

Mason is the Solid-native copy-paste registry and CLI layer for Keystone-backed UI.

This RFC depends on the Keystone API RFC for primitive import shape, data attributes, CSS variables, event composition, SSR guarantees, and the first Keystone-backed component target.

The registry distributes readable source files into user projects. Users own the installed files after installation. Mason may update, diff, and reconcile those files later, but installed source must remain ordinary project source rather than an opaque runtime package.

Mason should be compatible with shadcn-style registry concepts where useful: registry JSON, item JSON, item types, file lists, npm dependencies, registry dependencies, target paths, namespaces, and registry indexes. Mason must not depend on React-specific assumptions or the shadcn CLI.

Multi-file components are first-class registry items. A single item may install several component files, hooks, utilities, and adapters when that keeps generated source readable and locally owned. The CLI should plan those files as one install transaction instead of forcing large app components into one oversized file.

## Goals

- Define the first Mason registry item schema and metadata contract.
- Define install, dry-run, diff, update, and doctor behavior for the first CLI slice.
- Define file target handling, dependency handling, registry dependency handling, and path safety.
- Define Solid-specific project detection requirements.
- Define multi-file item semantics for app components such as DataTable.
- Identify the first registry item that proves the registry flow.

## Non-Goals

- Community marketplace ranking, search, reviews, or sponsorship features.
- Private registry authentication beyond preserving a place in the model.
- Full update conflict automation.
- Every Mason block, template, theme, and publishing workflow.
- Reimplementing Keystone primitive behavior inside Mason source.

## Registry Model

A Mason registry has a root registry document and one JSON document per item.

The root registry document lists discoverable items:

```json
{
  "$schema": "https://mason.build/schema/registry.json",
  "name": "mason",
  "homepage": "https://mason.build",
  "items": []
}
```

An item document describes one installable unit:

```json
{
  "$schema": "https://mason.build/schema/registry-item.json",
  "name": "dialog",
  "type": "registry:ui",
  "title": "Dialog",
  "description": "A styled Solid dialog component backed by Keystone.",
  "version": "0.1.0",
  "compatibility": {
    "mason": ">=0.1.0 <0.2.0",
    "solid": ">=1.9.0"
  },
  "dependencies": ["@keystone-ui/keystone"],
  "devDependencies": [],
  "registryDependencies": ["button"],
  "files": [
    {
      "path": "registry/default/ui/dialog.tsx",
      "type": "registry:ui",
      "target": "src/components/ui/dialog.tsx"
    }
  ]
}
```

## Item Types

Mason should support these item types in the first registry schema:

- `registry:ui`: styled UI component source installed into a component directory.
- `registry:block`: multi-file production UI composed from components.
- `registry:hook`: Solid hook or primitive helper source.
- `registry:lib`: utility source such as `cn`, formatting helpers, or adapters.
- `registry:theme`: theme tokens, CSS variables, or design token files.
- `registry:page`: route or page source.
- `registry:template`: project template source.
- `registry:config`: tool or framework configuration files.
- `registry:rule`: editor, lint, agent, or project rules.
- `registry:asset`: static assets.
- `registry:file`: explicit escape hatch for other files.

The first CLI slice only needs to install `registry:ui`, `registry:hook`, `registry:lib`, `registry:theme`, `registry:config`, and `registry:file`. Other types may be validated and listed before full install support is implemented.

## Required Metadata

Every item must include:

- `$schema`: schema URL for editor and validator support.
- `name`: stable unique item id within its registry.
- `type`: one registry item type.
- `title`: human-readable title.
- `description`: short purpose statement.
- `version`: item version.
- `files`: non-empty list of file descriptors.

Optional metadata:

- `dependencies`: package dependencies to add to the user project.
- `devDependencies`: package dev dependencies to add to the user project.
- `registryDependencies`: Mason items that must be installed first.
- `compatibility`: supported Mason CLI, Keystone, Solid, and framework ranges.
- `keywords`: search and docs terms.
- `docs`: canonical docs URL.
- `preview`: preview URL or screenshot metadata.
- `changelog`: human-readable item changes.
- `integrity`: hash metadata for remote item payloads when available.
- `meta`: Mason-owned docs and maintenance metadata. First-party default registry items use
  `meta.install`, `meta.sourceFiles`, `meta.customization` or `meta.limitations`, and
  `meta.parity`.

## Parity Metadata

First-party Mason registry items must include `meta.parity` so docs and maintainers can see what each item currently matches, which references were used, and which gaps are intentionally left for later work. The CLI and registry package keep this as a first-party validation option rather than a universal requirement for every third-party registry.

`meta.parity` is an object whose keys name reference systems and whose values are concise notes:

```json
{
  "meta": {
    "parity": {
      "baseUi": "Matches the core runtime contract. Gaps: advanced transition metadata remains follow-up work.",
      "kobalte": "Matches the Solid composition shape. Gaps: deeper form-control integration remains follow-up work."
    }
  }
}
```

Reference selection:

- Use `baseUi` first for Keystone-backed primitive and overlay runtime depth.
- Use `kobalte` second for Solid-native primitive API shape and composition.
- For primitive-backed UI items, include both `baseUi` and `kobalte` unless the item is not meaningfully comparable to one of them. If one default reference is skipped, the note set should include a more relevant reference and the item description or limitations should make the exception obvious.
- TanStack-backed Mason app components may use keys such as `tanstackForm`, `tanstackTable`, `tanstackRouter`, `tanstackStore`, or `tanstackHotkeys`.
- Toast behavior may include `sonner` because notification queueing, viewport behavior, and action/close ergonomics are better compared there than through primitive-only references.
- Mason utilities, blocks, templates, and source-registry conventions may use keys such as `mason` or `shadcn`.

Expected shape:

- Each key is a non-empty reference id written in lower camel case.
- Each value is a non-empty string.
- Notes should state covered behavior first and known gaps second.
- Notes should avoid vague claims such as "matches upstream" without naming the matched behavior.
- Notes should not promise public compatibility with the reference library.

Parity notes are not a claim of complete compatibility. They should state what the current item covers and name important gaps. For the default first-party registry, tests and the registry validation option fail when parity notes are missing, empty, or not string-valued. Third-party registries may adopt the same convention, but this RFC does not make parity metadata a public compatibility guarantee for all external registries yet.

## File Descriptors

Each file descriptor must include:

- `path`: source path inside the registry repository or built registry payload.
- `type`: registry file type.

Each file descriptor may include:

- `target`: destination path in the user project.
- `content`: file content when the registry payload is self-contained.
- `mode`: write mode, such as `create`, `overwrite`, `merge-json`, or `append-css`.

Multi-file item documents may include:

- `filesRoot`: source directory shared by the item files.
- `targetRoot`: destination directory shared by the item files.

`target` is required for `registry:page`, `registry:config`, `registry:rule`, `registry:asset`, and `registry:file` unless the item provides `filesRoot` and `targetRoot`. For `registry:ui`, `registry:hook`, `registry:lib`, and `registry:theme`, Mason may derive the target from project configuration when `target` is omitted.

Generated targets must be deterministic. The same registry item installed into the same project config must produce the same write plan.

For multi-file items, every file descriptor participates in one item-level transaction. Validation, conflict detection, dependency planning, installed metadata, diff, and update must consider the full file set. Large Mason app components such as `data-table` should prefer several focused files over a single generated module when that improves source ownership. When `filesRoot` and `targetRoot` are present, each file without an explicit `target` is installed at `targetRoot` plus its path relative to `filesRoot`; explicit file targets remain available for exceptions.

## Target Resolution

Mason resolves targets from project config:

- `ui` files default to the configured UI component alias, usually `src/components/ui`.
- `hook` files default to the configured hooks directory, usually `src/hooks`.
- `lib` files default to the configured utility directory, usually `src/lib`.
- `theme` files default to the configured style entry or token directory.
- Explicit `target` values override derived targets after validation.

Path aliases must be resolved through project configuration, not string guessing. The first implementation should support `tsconfig.json` and `jsconfig.json` path aliases for Vite Solid and SolidStart projects.

## Dependency Handling

Package dependencies are added to the detected package manager manifest. Mason must detect and preserve the user package manager:

- Bun through `bun.lock`, `bun.lockb`, or `packageManager`.
- pnpm through `pnpm-lock.yaml` or `packageManager`.
- npm through `package-lock.json` or `packageManager`.
- Yarn through `yarn.lock` or `packageManager`.

The first implementation should write dependency changes to `package.json` and print the install command. Running package installation may be explicit or prompted; `--dry-run` must never install packages.

Mason must reject invalid dependency specifiers before writing. Registry package dependencies should be exact or semver-compatible ranges chosen by registry authors. Mason should preserve existing project versions unless an item declares an incompatible required range.

## Registry Dependencies

`registryDependencies` are item references installed before the current item. References may be:

- Local names in the current registry, such as `button`.
- Namespaced items, such as `@acme/input-form`.
- Fully qualified item URLs.

Resolution must be deterministic and cycle-safe. Mason must reject dependency cycles, missing items, unsupported item types, schema-invalid dependency payloads, and remote registry payloads that fail integrity checks when integrity metadata is available.

Registry dependencies are installed into the same write plan as the requested item. Dry-run and diff must show the complete transitive plan.

## CLI Commands

The first CLI slice should define these commands:

- `mason init`: detect project shape, create Mason config, choose style, record aliases, and verify compatible Solid setup.
- `mason add <item>`: resolve an item and dependencies, build a write plan, validate paths, write files, and update dependencies.
- `mason add <item> --dry-run`: print the planned file and dependency changes without writing.
- `mason diff <item>`: show file diffs and dependency changes for an install or update plan.
- `mason update <item>`: re-resolve an installed item, compare local files, and apply or present updates without deleting user-owned edits silently.
- `mason remove <item>`: remove clean installed files and installed metadata while keeping locally modified files unless the user explicitly forces removal.
- `mason doctor`: validate Mason config, aliases, style entry, package manager, registry reachability, installed item metadata, and Keystone dependency health.

Future commands may include `mason registry add`, `mason registry list`, `mason registry validate`, `mason registry build`, and `mason registry publish`.

## Install Semantics

Install is a planned operation:

1. Read Mason config and detect project shape.
2. Resolve item and transitive registry dependencies.
3. Validate every item against the schema.
4. Resolve package and file targets.
5. Check path safety and write conflicts.
6. Produce a complete write plan.
7. Apply writes only after validation succeeds.
8. Record installed item metadata for future diff and update.

Mason must never partially install an item after validation failure. If writes fail midway, the CLI should report which writes completed and which did not; transactional rollback is not required in the first slice.

## Diff And Update Semantics

Mason treats generated files as user-owned source.

For `diff`, Mason compares the planned registry output with the current project files and prints:

- New files.
- Changed files.
- Deleted source files from the registry item, if relevant.
- Dependency additions or version conflicts.
- Registry dependency changes.

For `update`, Mason must avoid silent overwrites. If an installed file has local changes since the last recorded item version, Mason should show the conflict and require explicit confirmation. The first implementation may stop at conflict reporting instead of performing three-way merges.

Installed metadata should include item name, registry source, item version, file targets, and file hashes at install time.

## Path Safety

Mason writes into user projects, so registry input is untrusted until validated.

The CLI must reject:

- Absolute paths.
- `..` path traversal.
- Home-directory expansion such as `~/`.
- Empty path segments.
- Windows drive prefixes.
- URL-like file targets.
- Symlink escapes outside the project root.
- Targets outside the detected project root unless explicitly supported by a future workspace policy.

All target paths must be normalized and checked against the real project root before writes. Validation must happen before any write.

Invalid registries must fail closed with actionable errors. Mason should not skip invalid files and continue installing a partial item.

## Solid Project Detection

Mason is Solid-specific. `mason init` and `mason doctor` should detect:

- Solid package presence and version.
- SolidStart package presence when applicable.
- Vite Solid plugin presence for Vite projects.
- TypeScript config and JSX mode.
- Path aliases from `tsconfig.json` or `jsconfig.json`.
- Package manager and workspace root.
- Style system entry points, especially Tailwind and plain CSS.
- Router conventions for TanStack Router and SolidStart where page items are later supported.
- SSR capability and hydration-sensitive app shape when Keystone-backed components are installed.

React-specific assumptions, Next.js-only paths, and `children`/ref patterns copied from React should not shape generated Solid code.

## Generated Source Ownership

Mason-installed files must be readable Solid source:

- Components use Solid APIs and JSX conventions.
- Keystone primitives provide behavior where applicable.
- Styling lives in source, class names, CSS variables, or theme files the user owns.
- Files should avoid hidden code generation comments except concise metadata when needed for update tracking.
- Components must typecheck without depending on private registry internals.

Mason components should import Keystone behavior rather than reimplementing focus traps, dialog dismissal, select typeahead, or similar primitive behavior.

## Shadcn-Style Compatibility

Mason should stay close to shadcn-style registry concepts where they improve adoption:

- Root `registry.json`.
- Per-item JSON documents.
- Common item types such as `registry:ui`, `registry:block`, `registry:hook`, `registry:lib`, `registry:page`, `registry:file`, `registry:style`, and `registry:theme`.
- `dependencies`, `devDependencies`, `registryDependencies`, `files`, `target`, CSS variables, and CSS patch concepts.
- Registry namespaces and item URLs.

Mason should diverge where Solid requires it:

- Solid project detection and generated source.
- Keystone-backed behavior imports.
- SolidStart and TanStack Router conventions.
- SSR and hydration checks relevant to Solid.
- No dependence on React file layout or the shadcn CLI.

## First Proving Item

The first registry item should be `button`.

`button` proves the registry flow with a small but realistic item:

- Installs one `registry:ui` file.
- Exercises target resolution to `src/components/ui/button.tsx`.
- Exercises class utility or theme dependency handling if needed.
- Produces readable Solid source without complex Keystone behavior.
- Can be used as a registry dependency by `dialog`, the first Keystone-backed overlay item.

After `button`, the next proving item should be `dialog`, because it validates Mason importing Keystone primitive behavior and catches overlay, SSR, accessibility, and generated-source ownership requirements.

The `dialog` item must follow the Keystone API RFC's `Dialog` import shape and public part contracts.

## Acceptance Checklist

- Registry item types and required metadata are defined.
- File target handling, dependency handling, and registry dependency handling are defined.
- `init`, `add`, `dry-run`, `diff`, `update`, and `doctor` expectations are defined.
- Path traversal protections and invalid registry rejection behavior are defined.
- Solid-specific project detection requirements are recorded.
- The first proving registry item is `button`.
