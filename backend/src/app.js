/**
 * Express app setup.
 *
 * Configures middleware, routes, and error handlers.
 *
 * @module app
 */
import express from 'express';
import { applySecurityMiddleware } from './middleware/security.middleware.js';
import applyRequestLogger from './middleware/requestLogger.middleware.js';
import routes from './routes/index.js';
import notFound from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import constants from './utils/constants.js';

const app = express();

app.use(express.json({ limit: constants.BODY_PARSER_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: constants.BODY_PARSER_LIMIT }));

applySecurityMiddleware(app);
applyRequestLogger(app);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
