/**
 * Auth route definitions.
 *
 * @module routes/auth
 */
import { Router } from 'express';
import { register, login, logout, refresh, getMe, getOAuthProvidersList } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { registerRules, loginRules } from '../validators/auth.validators.js';
import validate from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/security.middleware.js';

const router = Router();

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.get('/oauth/providers', getOAuthProvidersList);

export default router;
