import cookie from 'cookie';
import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.js';

export async function socketAuthMiddleware(socket, next) {
  try {
    let token = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers.cookie) {
      const parsedCookies = cookie.parse(socket.handshake.headers.cookie);
      token = parsedCookies.cf_access_token;
    }

    if (!token && socket.handshake.headers.authorization) {
      if (socket.handshake.headers.authorization.startsWith('Bearer ')) {
        token = socket.handshake.headers.authorization.substring(7);
      }
    }

    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }

    const user = await User.findById(decoded.userId).select('name email avatarUrl role status');
    if (!user || user.status === 'suspended') {
      return next(new Error('Authentication error: User inactive or suspended'));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error(`Authentication error: ${err.message}`));
  }
}
