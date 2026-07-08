# ADR-001: bcryptjs over bcrypt

**Date:** 2026-07-05

## Context

The initial `package.json` specified `bcrypt` for password hashing. During Phase 2 installation on Windows, `bcrypt` failed because it requires native compilation via `node-gyp`, which depends on Visual Studio Build Tools not present on the development machine.

## Decision

Replace `bcrypt` with `bcryptjs`.

`bcryptjs` is a pure JavaScript implementation with an identical API (`hash`, `compare`, `genSalt`). No code changes were needed beyond the package name in `package.json` and the import in `user.model.js`.

## Consequences

- **Positive**: No native compilation dependencies. Works on Windows, Linux, and macOS without build tools.
- **Neutral**: Slightly slower than native `bcrypt` for very large numbers of concurrent operations — not a concern for this application's auth volume.
- **Documentation**: `docs/PACKAGE_DECISIONS.md` updated to explain the replacement.
