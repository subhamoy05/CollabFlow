import { Router } from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  moveTask,
  deleteTask,
  getTaskComments,
  addTaskComment,
  toggleChecklistItem,
  addChecklistItem,
  removeChecklistItem
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  commentSchema,
  checklistSchema
} from '../validators/taskValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);

router.get('/:taskId', getTaskById);
router.patch('/:taskId', validate(updateTaskSchema), updateTask);
router.patch('/:taskId/move', validate(moveTaskSchema), moveTask);
router.delete('/:taskId', deleteTask);

router.get('/:taskId/comments', getTaskComments);
router.post('/:taskId/comments', validate(commentSchema), addTaskComment);

router.post('/:taskId/checklist', validate(checklistSchema), addChecklistItem);
router.patch('/:taskId/checklist/:itemId/toggle', toggleChecklistItem);
router.delete('/:taskId/checklist/:itemId', removeChecklistItem);

export default router;
