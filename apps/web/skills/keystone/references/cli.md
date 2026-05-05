# Mason CLI Reference

Use this for install, preview, and manual setup guidance.

## Commands

Preferred shape:

```bash
mason add button
mason add dialog
mason add select-field
mason add data-table
```

If the local CLI command is not available in the target project, inspect `packages/mason-cli` and the root scripts before inventing flags.

## Discovery

- Registry root: `registry/default/registry.json`
- Registry items: `registry/default/items/*.json`
- UI source: `packages/ui/src/default/`
- Docs generation: `scripts/generate-docs-registry-items.ts`

## Manual Install

When manual install is requested:

1. Read the registry item JSON.
2. Copy every listed source file.
3. Copy transitive local imports.
4. Install external dependencies listed in metadata.
5. Preserve import aliases.
6. Add design-system tokens if the target app does not have them.
7. Run typecheck.

## Output Checklist

- Command matches a real Mason item.
- Dependency list is complete.
- File paths are complete.
- Token/theme requirements are stated.
- Manual steps do not bypass accessibility behavior.

