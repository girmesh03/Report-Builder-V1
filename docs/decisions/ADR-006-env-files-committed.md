# ADR-006: Committed .env Files With Placeholder Values

**Date:** 2026-07-08

## Context

The initial plan specified `.env.example` files that developers would copy to `.env` and fill in. During Phase 1 setup, the `.env` files were already populated with real values (backend) and created from scratch (client).

Maintaining both `.env.example` and `.env` creates duplication — every new variable must be added to both files. For a single-developer project with committed `.env` placeholders, this overhead is unnecessary.

## Decision

Remove `.env.example` files. Commit `.env` files directly with placeholder/default values for local development (e.g., `sk_replace_me` for API keys, `change_me` for secrets). The `.gitignore` still excludes `.env` from accidental commits, but these specific placeholder-value `.env` files are committed intentionally.

## Consequences

- **Positive**: Single source of truth for required environment variables.
- **Positive**: New developers clone and run without a manual copy step.
- **Positive**: CI and reviewers can see the full env schema in version control.
- **Neutral**: Developers must be careful not to place real secrets into the committed `.env` file. Real secrets should only exist in the uncommitted `.env.` (which git ignores).
- **Documentation**: All docs updated from `.env.example` to `.env` references.
