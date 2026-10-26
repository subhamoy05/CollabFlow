import { Router } from 'express';
import { getCalendarEvents } from '../controllers/calendarController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/events', getCalendarEvents);

export default router;
