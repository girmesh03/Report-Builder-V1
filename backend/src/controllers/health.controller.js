/**
 * Health check controller.
 *
 * @module controllers/health
 */
import asyncHandler from 'express-async-handler';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import mongoose from 'mongoose';
import env from '../config/env.js';

/**
 * Basic health check — returns service status without DB dependency.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const getHealth = asyncHandler(async (req, res, next) => {
  apiResponse(res, httpStatus.OK, 'Service is healthy', {
    service: 'Report Builder V1 API',
    environment: env.NODE_ENV,
  });
});

/**
 * Database health check — returns DB connection status.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const getDbHealth = asyncHandler(async (req, res, next) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  apiResponse(res, httpStatus.OK, `Database is ${stateMap[dbState] || 'unknown'}`, {
    dbState: stateMap[dbState] || 'unknown',
  });
});

export { getHealth, getDbHealth };
