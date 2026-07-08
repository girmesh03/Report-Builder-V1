# ADR-003: Standalone MongoDB (No Transactions) — SUPERSEDED

**Date:** 2026-07-05 (superseded 2026-07-06)

## Context

The initial prompt states: "All write controllers must support MongoDB sessions/transactions where appropriate." MongoDB transactions require a replica set. The development and production MongoDB instances were standalone (single-node), which does not support transactions.

## Decision (Original — No Longer Active)

Do not use MongoDB transactions. Use single-document atomic writes with unique indexes for integrity instead.

- The User model uses `schema.index({ email: 1 }, { unique: true })` to prevent duplicate email registration.
- The OAuthAccount model uses `schema.index({ provider: 1, providerAccountId: 1 }, { unique: true })` to prevent duplicate OAuth links.
- Write operations that involve multiple documents are structured so that a failure can be handled without needing rollback (e.g., `findByIdAndUpdate` with `new: true`).

## Consequences (Original)

- **Positive**: Works with any MongoDB deployment, including free-tier Atlas and local standalone instances.
- **Positive**: Simpler code without session plumbing.
- **Positive**: Health endpoint reaches "connected" status even before transactions would be available.
- **Negative**: Not suitable for multi-document atomic operations. If future phases require atomic updates across collections, a replica set must be configured or transaction-like behavior must be implemented in application logic.
- **Impact on code**: All controllers omit the `try/catch/finally` session pattern shown in the initial prompt.

---

## Superseded By

The backend `.env` has been updated to point to a MongoDB deployment that supports replica sets / transactions. The session/transaction pattern is now applied to all write controllers (auth, profile, branch, report). See `docs/ARCHITECTURE.md` for the current pattern.
