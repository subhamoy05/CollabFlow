import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { initializeSockets } from './sockets/index.js';
import { stopMemoryServer } from './config/memoryServer.js';
import { User } from './models/User.js';
import { seedDemoData } from './services/seedService.js';

const httpServer = http.createServer(app);
const io = initializeSockets(httpServer);

async function startServer() {
  try {
    await connectDB();

    // Auto-seed demo accounts in development if not present
    if (!env.IS_PRODUCTION) {
      const adminUser = await User.findOne({ email: 'admin@collabflow.dev' });
      if (!adminUser) {
        console.log('[Server] Initializing demo workspace and seed accounts...');
        await seedDemoData();
      }
    }

    httpServer.listen(env.PORT, '0.0.0.0', () => {
      console.log(`[Server] CollabFlow Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      console.log(`[Server] Health check available at http://localhost:${env.PORT}/health`);
      console.log(`[Server] API v1 base: http://localhost:${env.PORT}/api/v1`);
      console.log('[Server] Demo Accounts available:');
      console.log('         - Admin:     admin@collabflow.dev    / Password123!');
      console.log('         - PM:        alex.pm@collabflow.dev  / Password123!');
      console.log('         - Developer: sarah.dev@collabflow.dev / Password123!');
      console.log('         - Viewer:    olivia.view@collabflow.dev / Password123!');
    });
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);
  httpServer.close(async () => {
    console.log('[Server] HTTP server closed');
    await disconnectDB();
    await stopMemoryServer();
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

export { app, httpServer, io };
