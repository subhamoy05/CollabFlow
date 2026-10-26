import mongoose from 'mongoose';
import { env } from './env.js';
import { startMemoryServer } from './memoryServer.js';

let isConnected = false;

export async function connectDB(uriOverride = null) {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  let uri = uriOverride || env.MONGODB_URI;

  try {
    // Attempt standard connection first with 3 second serverSelectionTimeoutMS
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
    return mongoose.connection;
  } catch (initialErr) {
    console.warn(`[Database] Primary MongoDB connection failed (${initialErr.message}).`);

    if (!env.IS_PRODUCTION) {
      console.log('[Database] Development environment detected. Starting in-memory MongoDB fallback...');
      const memoryUri = await startMemoryServer();
      if (memoryUri) {
        try {
          await mongoose.connect(memoryUri);
          isConnected = true;
          console.log(`[Database] In-memory MongoDB connected successfully to ${memoryUri}`);
          return mongoose.connection;
        } catch (memErr) {
          console.error('[Database] Failed to connect to in-memory MongoDB:', memErr.message);
          throw memErr;
        }
      }
    }

    throw initialErr;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] MongoDB disconnected');
  }
}
