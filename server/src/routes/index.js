import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import orgRoutes from './orgRoutes.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js';
import chatRoutes from './chatRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import calendarRoutes from './calendarRoutes.js';
import sprintRoutes from './sprintRoutes.js';
import reportRoutes from './reportRoutes.js';
import fileRoutes from './fileRoutes.js';
import searchRoutes from './searchRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organizations', orgRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/calendar', calendarRoutes);
router.use('/sprints', sprintRoutes);
router.use('/reports', reportRoutes);
router.use('/files', fileRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);

export default router;
