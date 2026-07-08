# Phase 2 Summary — Backend Foundation

## Created Files

| File | Purpose |
|---|---|
| `backend/src/app.js` | Express app setup (middleware, routes, error handlers) |
| `backend/src/server.js` | Entry point (HTTP server, DB connection, graceful shutdown) |
| `backend/src/config/env.js` | Environment variable loader and frozen config object |
| `backend/src/config/db.js` | Mongoose connection setup with event handlers |
| `backend/src/middleware/error.middleware.js` | Global error handler (consistent JSON) |
| `backend/src/middleware/notFound.middleware.js` | 404 handler forwarding to error handler |
| `backend/src/middleware/security.middleware.js` | Helmet, cors, compression, cookie-parser, mongo-sanitize, rate-limit |
| `backend/src/middleware/requestLogger.middleware.js` | Morgan logger (development only) |
| `backend/src/routes/index.js` | Route aggregator (mounts /api/v1/*) |
| `backend/src/routes/health.routes.js` | Health check route definitions |
| `backend/src/controllers/health.controller.js` | Health check controllers (getHealth, getDbHealth) |
| `backend/src/utils/apiError.js` | Custom operational error class |
| `backend/src/utils/apiResponse.js` | Standardised success response helper |
| `backend/src/utils/constants.js` | Centralized constants (no magic values) |
| `backend/src/utils/httpStatus.js` | HTTP status code constants |
| `backend/src/utils/logger.js` | Structured logging utility |
| `docs/phases/phase-2-summary.md` | This file |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Basic health check (no DB dependency) |
| GET | `/api/v1/health/db` | Database connectivity status |

## Verified

- Backend starts on port 4000.
- Health endpoint returns 200 with expected JSON shape.
- DB health endpoint returns current connection state.
- 404 handler returns consistent error JSON.
- Graceful shutdown on SIGINT/SIGTERM.

## State After Phase 2

- Backend foundation with Express, Mongoose, security middleware, error handling.
- No auth, no models, no business logic yet.
- Ready for Phase 3 (Authentication and Profile API).

## Patterns Established For Future Phases

Every pattern below is an architectural rule that future phases MUST respect.

### 1. Route Aggregation Under `/api/v1`

**Rule:** All API routes are mounted under `/api/v1` in `app.js`. Each route module is registered in `routes/index.js`. New route modules (e.g., `branch.routes.js`, `report.routes.js`) must be:
1. Created in `routes/`
2. Imported and mounted in `routes/index.js`
3. NO routes registered directly in `app.js`

### 2. Error Handling Pipeline

**Rule:** Errors follow a 2-stage pipeline in `app.js`:
1. `notFound.middleware.js` — catches unmatched routes, creates `ApiError(404, ...)`, forwards via `next()`
2. `error.middleware.js` — 4-param Express handler, distinguishes operational (`ApiError`) from unexpected errors
Future phases must NOT modify or replace this pipeline. New controllers forward errors via `next(error)` (handled automatically by `express-async-handler`).

### 3. Security Middleware Stack Order

**Rule:** The middleware order in `app.js` is fixed:
```
helmet → cors → compression → cookie-parser → mongo-sanitize → rate-limit
```
This order is intentional and tested. Future phases must NOT reorder or remove middleware. New middleware should be added after careful consideration and must not break the existing order.

### 4. Centralized Constants — No Magic Values

**Rule:** All magic values go into `backend/src/utils/constants.js`. The file is a frozen object. New constants (pagination limits, report statuses, feature-specific values) must be added to this file. Values must NEVER be hardcoded in controllers, services, or validators. Status codes use `utils/httpStatus.js`.

### 5. Standardized API Response Format

**Rule:** All successful responses use `utils/apiResponse.js`:
```
{ success: true, message: "...", data: {...} }  // with data
{ success: true, message: "..." }               // without data
```
Error responses use `utils/apiError.js`:
```
{ success: false, message: "..." }  // development: may include err.stack
```
Future controllers MUST use `apiResponse` for success and `ApiError` for errors. Do NOT return ad-hoc JSON shapes.

### 6. HTTP Status Code Semantics

**Rule:** Status codes are referenced by semantic name from `utils/httpStatus.js`:
```
OK(200), CREATED(201), NO_CONTENT(204), BAD_REQUEST(400), UNAUTHORIZED(401),
FORBIDDEN(403), NOT_FOUND(404), CONFLICT(409), UNPROCESSABLE_ENTITY(422),
TOO_MANY_REQUESTS(429), INTERNAL_SERVER_ERROR(500)
```
Never hardcode numeric status codes. Import and use `httpStatus.OK` etc.

### 7. Frozen Env Config

**Rule:** Environment config is accessed via the frozen `env` object from `config/env.js`. Future phases add new env vars by:
1. Adding to `backend/.env` (local only, not committed)
2. Adding the field to the config object in `config/env.js`
3. Adding the validation/default logic in the same file
Env vars are NEVER accessed via `process.env` directly outside of `config/env.js`.

### 8. Graceful Shutdown

**Rule:** `server.js` handles `SIGINT` and `SIGTERM` by:
1. `server.close()` — stop accepting new connections
2. `mongoose.connection.close()` — close database connection
3. `process.exit(0)` — exit cleanly
Future phases must NOT remove or replace this. If additional cleanup is needed (e.g., closing file streams), add to the shutdown handler.

### 9. HTTP Server Before DB

**Rule:** The HTTP server starts BEFORE the database connection completes. This ensures the health endpoint (and any other endpoint) is reachable even if the DB is down. DB-dependent endpoints should handle connection failures gracefully.

### 10. Structured Logging

**Rule:** All logging uses `utils/logger.js`. In development, logs are pretty-printed with indentation. In production, logs are single-line JSON. Future phases must use `logger.info`, `logger.warn`, `logger.error`, `logger.debug`. Never use `console.log` in production code. Safe logging: no passwords, tokens, raw cookies, or secrets in log output.
