import { z } from 'zod';
import { ROLES } from '../config/constants.js';

export const updateUserStatusSchema = {
  body: z.object({
    status: z.enum(['active', 'suspended'])
  })
};

export const updateUserRoleSchema = {
  body: z.object({
    role: z.enum(Object.values(ROLES))
  })
};

export const updateSettingsSchema = {
  body: z.record(z.any())
};
