/**
 * Express app setup.
 *
 * Configures middleware, routes, and error handlers.
 *
 * @module app
 */
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { applySecurityMiddleware } from './middleware/security.middleware.js';
import applyRequestLogger from './middleware/requestLogger.middleware.js';
import routes from './routes/index.js';
import notFound from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import constants from './utils/constants.js';
import env from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: constants.BODY_PARSER_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: constants.BODY_PARSER_LIMIT }));

app.use('/uploads', cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

applySecurityMiddleware(app);
applyRequestLogger(app);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
