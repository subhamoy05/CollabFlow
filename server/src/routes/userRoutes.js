import { Router } from 'express';
import { getMe, updateMe, listUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/authValidators.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMe);
router.patch('/me', validate(updateProfileSchema), updateMe);
router.get('/', listUsers);

export default router;
