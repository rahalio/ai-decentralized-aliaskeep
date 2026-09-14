---
name: aliaskeep-codegen-local
description: >-
  Aliaskeep local .codegen policy — never commit or push .codegen; rehydrate
  from zero-apps-codegen-scaffold. Use when cloning, committing, running
  zero-codegen, or when .codegen is missing.
---

# Aliaskeep — `.codegen` is local-only

## Hard rule

**Never commit or push `.codegen/` to GitHub.**

- Listed in `.gitignore` (`.codegen/`, `codegen/`, `**/zero_codegen/`).
- Contains the vendored `zero-codegen` Python tool and absolute-path merged configs.
- OpenAPI contracts that *are* committed live under `packages/openapi-core/`.

## Rehydrate after clone

```bash
SCAFFOLD="${SCAFFOLD:-/Users/nrahal/@code/zero-apps/zero-apps-codegen-scaffold}"
rsync -a --delete "$SCAFFOLD/.codegen/" ./.codegen/
# Re-apply product scope + domains (see packages/openapi-core and docs/CODEGEN.md)
# package_scope must be @aliaskeep
pnpm codegen:paths
```

After rehydrate, ensure domains `identity`, `vaults`, `links`, `erasures`, `classification`, `participants`, `fabric`, `reporting` are registered in `.codegen/zero-codegen.json` and `.codegen/.zero-codegen-merged.json`, and `layers.webapp.services|features.enabled` is `true` when generating webapp skeletons.

## Agents

- Do not `git add -f .codegen` or suggest committing it.
- Prefer documenting rehydrate over checking the tool into the repo.
