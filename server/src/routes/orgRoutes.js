import { Router } from 'express';
import {
  getUserOrganizations,
  createOrganization,
  getOrganization,
  updateOrganization,
  getOrganizationMembers,
  inviteMember,
  acceptInvitation,
  removeMember
} from '../controllers/orgController.js';
import { authenticate } from '../middleware/auth.js';
import { requireOrgMember } from '../middleware/orgAuth.js';

const router = Router();

router.use(authenticate);

router.get('/', getUserOrganizations);
router.post('/', createOrganization);
router.post('/invitations/accept', acceptInvitation);

router.get('/:organizationId', requireOrgMember(), getOrganization);
router.patch('/:organizationId', requireOrgMember(), updateOrganization);
router.get('/:organizationId/members', requireOrgMember(), getOrganizationMembers);
router.post('/:organizationId/invitations', requireOrgMember(), inviteMember);
router.delete('/:organizationId/members/:memberUserId', requireOrgMember(), removeMember);

export default router;
