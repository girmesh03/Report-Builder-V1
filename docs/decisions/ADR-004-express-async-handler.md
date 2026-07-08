# ADR-004: express-async-handler over Custom Wrapper

**Date:** 2026-07-05

## Context

The initial prompt specifies using `express-async-handler` for all controller route handlers. Express 4 does not natively catch promise rejections in async route handlers, so a wrapper is needed.

## Decision

Use the installed `express-async-handler` package instead of writing a custom utility.

All controller files import and use `asyncHandler` from `express-async-handler` directly. No custom wrapper is needed.

## Consequences

- **Positive**: One less file to maintain. One less place for bugs.
- **Positive**: `express-async-handler` is a well-known, single-purpose package (800+ weekly downloads, 0 dependencies).
- **Positive**: Identical API — both use `asyncHandler(fn)`.
- **Neutral**: Adds one dependency instead of ~5 lines of custom code.
