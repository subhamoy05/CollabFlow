let mongod = null;

export async function startMemoryServer() {
  if (mongod) {
    return mongod.getUri();
  }
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log(`[MemoryServer] Started in-memory MongoDB at ${uri}`);
    return uri;
  } catch (err) {
    console.warn(`[MemoryServer] Could not initialize in-memory MongoDB: ${err.message}`);
    return null;
  }
}

export async function stopMemoryServer() {
  if (mongod) {
    await mongod.stop();
    mongod = null;
    console.log('[MemoryServer] Stopped in-memory MongoDB');
  }
}
