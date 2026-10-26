import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { ROLES } from '../src/config/constants.js';
import { env } from '../src/config/env.js';
import { stopMemoryServer } from '../src/config/memoryServer.js';

async function bootstrapAdmin() {
  try {
    await connectDB();

    const name = process.env.ADMIN_BOOTSTRAP_NAME || 'Global Admin';
    const email = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@collabflow.dev';
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (!password) {
      console.error('ERROR: ADMIN_BOOTSTRAP_PASSWORD environment variable is required to bootstrap an admin account.');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`Administrator account for ${email} already exists.`);
      if (existingAdmin.role !== ROLES.ADMIN) {
        existingAdmin.role = ROLES.ADMIN;
        await existingAdmin.save();
        console.log(`Updated user ${email} to role '${ROLES.ADMIN}'.`);
      }
    } else {
      const passwordHash = await User.hashPassword(password);
      const admin = await User.create({
        name,
        email,
        passwordHash,
        role: ROLES.ADMIN,
        status: 'active'
      });
      console.log(`[Success] Bootstrapped initial administrator account:`);
      console.log(`  Name:  ${admin.name}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role:  ${admin.role}`);
    }

    await disconnectDB();
    await stopMemoryServer();
    process.exit(0);
  } catch (err) {
    console.error('Failed to bootstrap administrator:', err);
    process.exit(1);
  }
}

bootstrapAdmin();
