import { ROLES, ROLE_HIERARCHY } from '../config/constants.js';
import { errorResponse } from '../utils/apiResponse.js';

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401, null, 'UNAUTHENTICATED');
    }

    // Global Admin can perform any action
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. You do not have permission to perform this action.', 403, null, 'FORBIDDEN');
    }

    next();
  };
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return errorResponse(res, 'Authentication required.', 401, null, 'UNAUTHENTICATED');
  }

  if (req.user.role !== ROLES.ADMIN) {
    return errorResponse(res, 'Access restricted to platform Administrators only.', 403, null, 'ADMIN_ONLY');
  }

  next();
}
