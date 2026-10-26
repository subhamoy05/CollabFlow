import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  archiveProject,
  restoreProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  getProjectActivity
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { requireProjectAccess } from '../middleware/projectAuth.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../config/constants.js';
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema
} from '../validators/projectValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', validate(createProjectSchema), createProject);

router.get('/:projectId', requireProjectAccess(ROLES.VIEWER), getProjectById);
router.patch('/:projectId', requireProjectAccess(ROLES.PROJECT_MANAGER), validate(updateProjectSchema), updateProject);
router.post('/:projectId/archive', requireProjectAccess(ROLES.PROJECT_MANAGER), archiveProject);
router.post('/:projectId/restore', requireProjectAccess(ROLES.PROJECT_MANAGER), restoreProject);

router.get('/:projectId/members', requireProjectAccess(ROLES.VIEWER), getProjectMembers);
router.post('/:projectId/members', requireProjectAccess(ROLES.PROJECT_MANAGER), validate(addProjectMemberSchema), addProjectMember);
router.delete('/:projectId/members/:memberUserId', requireProjectAccess(ROLES.PROJECT_MANAGER), removeProjectMember);

router.get('/:projectId/activity', requireProjectAccess(ROLES.VIEWER), getProjectActivity);

export default router;
