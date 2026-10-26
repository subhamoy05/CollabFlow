import { ActivityLog } from '../models/ActivityLog.js';

export async function logActivity({
  actorId,
  action,
  entityType,
  entityId = null,
  projectId = null,
  organizationId = null,
  details = '',
  metadata = {},
  ipAddress = ''
}) {
  try {
    // Sanitize metadata to never include password, secret, token
    const safeMetadata = { ...metadata };
    const forbiddenKeys = ['password', 'passwordHash', 'token', 'secret', 'tokenHash', 'refreshToken'];
    for (const key of Object.keys(safeMetadata)) {
      if (forbiddenKeys.some(fk => key.toLowerCase().includes(fk))) {
        delete safeMetadata[key];
      }
    }

    await ActivityLog.create({
      actor: actorId,
      action,
      entityType,
      entityId,
      project: projectId,
      organization: organizationId,
      details,
      metadata: safeMetadata,
      ipAddress
    });
  } catch (err) {
    console.error('[AuditService] Failed to record audit log:', err.message);
  }
}
