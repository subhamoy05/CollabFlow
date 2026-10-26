import { Server } from 'socket.io';
import { socketAuthMiddleware } from './socketAuth.js';
import { registerPresenceHandlers } from './presenceHandlers.js';
import { registerTaskHandlers } from './taskHandlers.js';
import { registerChatHandlers } from './chatHandlers.js';
import { setIoInstance as setNotificationIo } from '../services/notificationService.js';
import { setTaskIoInstance } from '../controllers/taskController.js';
import { setChatIoInstance } from '../controllers/chatController.js';
import { env } from '../config/env.js';

export function initializeSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    },
    pingTimeout: 30000,
    pingInterval: 25000
  });

  // Provide io instance to controllers and services
  setNotificationIo(io);
  setTaskIoInstance(io);
  setChatIoInstance(io);

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    // Join personal notification room
    socket.join(`user:${socket.user._id}`);

    registerPresenceHandlers(io, socket);
    registerTaskHandlers(io, socket);
    registerChatHandlers(io, socket);

    socket.on('error', (err) => {
      console.error(`[Socket Error] ${socket.id}:`, err);
    });
  });

  return io;
}
