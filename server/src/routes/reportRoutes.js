import { Router } from 'express';
import {
  getOverviewReport,
  getProjectReport,
  exportCsv
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/overview', getOverviewReport);
router.get('/projects/:projectId', getProjectReport);
router.get('/export.csv', exportCsv);

export default router;
