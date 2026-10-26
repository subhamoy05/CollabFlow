import { Router } from 'express';
import {
  getAdminOverview,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getProjectsAdmin,
  getOrganizationsAdmin,
  getAuditLogs,
  getSystemSettings,
  updateSystemSettings
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  updateUserStatusSchema,
  updateUserRoleSchema,
  updateSettingsSchema
} from '../validators/adminValidators.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.patch('/users/:userId/status', validate(updateUserStatusSchema), updateUserStatus);
router.patch('/users/:userId/role', validate(updateUserRoleSchema), updateUserRole);
router.get('/projects', getProjectsAdmin);
router.get('/organizations', getOrganizationsAdmin);
router.get('/audit-logs', getAuditLogs);
router.get('/settings', getSystemSettings);
router.patch('/settings', validate(updateSettingsSchema), updateSystemSettings);

export default router;
