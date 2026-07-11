/**
 * Environment variable loader and config object.
 *
 * @module config/env
 */
import dotenv from 'dotenv';

dotenv.config();

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 4000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/report-builder-v1',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'change_me',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'change_me',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || 'lax',
  ADDIS_AI_BASE_URL: process.env.ADDIS_AI_BASE_URL || 'https://api.addisassistant.com',
  ADDIS_AI_API_KEY: process.env.ADDIS_AI_API_KEY || '',
  ADDIS_AI_TEXT_MODEL: process.env.ADDIS_AI_TEXT_MODEL || '',
  ADDIS_AI_STT_MODEL: process.env.ADDIS_AI_STT_MODEL || '',
  ADDIS_AI_DEFAULT_TARGET_LANGUAGE: process.env.ADDIS_AI_DEFAULT_TARGET_LANGUAGE || 'am',
  ADDIS_AI_STT_LANGUAGE_CODE: process.env.ADDIS_AI_STT_LANGUAGE_CODE || 'am',
  ADDIS_AI_TIMEOUT_MS: parseInt(process.env.ADDIS_AI_TIMEOUT_MS, 10) || 60000,
  FFMPEG_PATH: process.env.FFMPEG_PATH || 'ffmpeg',
  FFPROBE_PATH: process.env.FFPROBE_PATH || 'ffprobe',

  OAUTH_GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID || '',
  OAUTH_GOOGLE_CLIENT_SECRET: process.env.OAUTH_GOOGLE_CLIENT_SECRET || '',
  OAUTH_GOOGLE_CALLBACK_URL: process.env.OAUTH_GOOGLE_CALLBACK_URL || '',
});

export default env;
