/**
 * Profile route definitions.
 *
 * @module routes/profile
 */
import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { updateProfileRules, changePasswordRules } from '../validators/profile.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.patch('/', updateProfileRules, validate, updateProfile);
router.patch('/password', changePasswordRules, validate, changePassword);

export default router;
