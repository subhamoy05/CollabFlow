import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export async function authenticate(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.cf_access_token) {
      token = req.cookies.cf_access_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. Please log in.', 401, null, 'UNAUTHENTICATED');
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      return errorResponse(res, 'Invalid or expired authentication token. Please log in again.', 401, null, 'TOKEN_EXPIRED');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 'User account no longer exists.', 401, null, 'USER_NOT_FOUND');
    }

    if (user.status === 'suspended') {
      return errorResponse(res, 'Your account has been suspended. Please contact an administrator.', 403, null, 'ACCOUNT_SUSPENDED');
    }

    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    let token = null;
    if (req.cookies && req.cookies.cf_access_token) {
      token = req.cookies.cf_access_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded && decoded.userId) {
        const user = await User.findById(decoded.userId);
        if (user && user.status !== 'suspended') {
          req.user = user;
        }
      }
    }
    next();
  } catch (err) {
    next();
  }
}
