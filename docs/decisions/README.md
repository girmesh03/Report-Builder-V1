# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) — lightweight documents that capture **why** significant architectural decisions were made.

## How to Use

Each ADR follows a template:

- **Title**: Decision name and date.
- **Context**: What was the problem or situation?
- **Decision**: What was chosen?
- **Consequences**: What trade-offs or impacts result?

## Related Docs

| Document | Purpose |
|----------|---------|
| `docs/PACKAGE_DECISIONS.md` | Package-level decisions and rationale |
| `docs/ARCHITECTURE.md` | Current system architecture |
| `docs/phases/` | Phase summaries with implementation decisions |

## Index

| ID | Title | Date |
|----|-------|------|
| 001 | bcryptjs over bcrypt | 2026-07-05 |
| 002 | httpOnly cookies for JWT tokens | 2026-07-05 |
| 003 | Standalone MongoDB (no transactions) — SUPERSEDED | 2026-07-05 |
| 004 | express-async-handler over custom wrapper | 2026-07-05 |
| 005 | Audio recording strategy (flexible duration, 10 MB limit, chunked STT) | 2026-07-07 |
