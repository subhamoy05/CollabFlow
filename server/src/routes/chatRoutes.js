import { Router } from 'express';
import {
  getProjectMessages,
  sendMessage,
  editMessage,
  deleteMessage
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';
import { requireProjectAccess } from '../middleware/projectAuth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.use(authenticate);

router.get('/:projectId/messages', requireProjectAccess(ROLES.VIEWER), getProjectMessages);
router.post('/:projectId/messages', requireProjectAccess(ROLES.TEAM_MEMBER), sendMessage);
router.patch('/messages/:messageId', editMessage);
router.delete('/messages/:messageId', deleteMessage);

export default router;
