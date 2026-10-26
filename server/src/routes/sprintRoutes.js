import { Router } from 'express';
import {
  getSprints,
  createSprint,
  updateSprint,
  startSprint,
  completeSprint
} from '../controllers/sprintController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSprints);
router.post('/', createSprint);
router.patch('/:sprintId', updateSprint);
router.post('/:sprintId/start', startSprint);
router.post('/:sprintId/complete', completeSprint);

export default router;
