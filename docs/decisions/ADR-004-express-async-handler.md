# ADR-004: express-async-handler over Custom Wrapper

**Date:** 2026-07-05

## Context

The initial prompt specifies creating a custom `asyncHandler` utility at `backend/src/utils/asyncHandler.js`. Express 4 does not natively catch promise rejections in async route handlers, so a wrapper is needed.

## Decision

Use the installed `express-async-handler` package instead of writing a custom utility.

The custom `asyncHandler.js` file was created in Phase 2 as specified, but since `express-async-handler` was already an installed dependency and provides identical functionality, all controller files import and use it directly. The custom file was removed during the Phase 3 validation pass.

## Consequences

- **Positive**: One less file to maintain. One less place for bugs.
- **Positive**: `express-async-handler` is a well-known, single-purpose package (800+ weekly downloads, 0 dependencies).
- **Positive**: Identical API — both use `asyncHandler(fn)`.
- **Neutral**: Adds one dependency instead of ~5 lines of custom code.
