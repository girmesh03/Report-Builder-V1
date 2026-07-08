# ADR-006: Local .env Files With Placeholder Values (Not Committed)

**Date:** 2026-07-08

## Context

The initial plan specified `.env.example` files that developers would copy to `.env` and fill in. During Phase 1 setup, the `.env` files were already populated with real values (backend) and created from scratch (client).

Maintaining both `.env.example` and `.env` creates duplication — every new variable must be added to both files. For a single-developer project, this overhead is unnecessary.

## Decision

Remove `.env.example` files. The `.env` files are **not committed** (`.gitignore` excludes `.env`). They exist locally with placeholder/default values (e.g., `sk_replace_me` for API keys, `change_me` for secrets) as a reference. Each developer creates their own `.env` with real values.

## Consequences

- **Positive**: No duplication between `.env.example` and `.env`.
- **Positive**: Real secrets never enter version control — `.env` is in `.gitignore`.
- **Neutral**: Developers must manually create `.env` when cloning fresh. The README documents the required variables.
- **Documentation**: All docs updated from `.env.example` to `.env` references.
