/**
 * Branch route definitions.
 *
 * @module routes/branch
 */
import { Router } from 'express';
import { getBranches, getBranch, createBranch, updateBranch, deactivateBranch } from '../controllers/branch.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { createBranchRules, updateBranchRules } from '../validators/branch.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getBranches);
router.get('/:id', getBranch);
router.post('/', createBranchRules, validate, createBranch);
router.patch('/:id', updateBranchRules, validate, updateBranch);
router.delete('/:id', deactivateBranch);

export default router;
