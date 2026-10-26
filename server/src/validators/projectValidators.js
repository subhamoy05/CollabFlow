import { z } from 'zod';
import { PROJECT_STATUSES, ROLES } from '../config/constants.js';

export const createProjectSchema = {
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(100),
    key: z.string().min(2).max(10).toUpperCase().regex(/^[A-Z0-9]+$/, 'Key must be alphanumeric'),
    description: z.string().max(2000).optional().default(''),
    organization: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid Organization ID'),
    manager: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid Manager User ID').optional(),
    status: z.enum(Object.values(PROJECT_STATUSES)).optional().default(PROJECT_STATUSES.ACTIVE),
    startDate: z.string().datetime().or(z.date()).optional().nullable(),
    dueDate: z.string().datetime().or(z.date()).optional().nullable(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional(),
    icon: z.string().max(50).optional(),
    isPrivate: z.boolean().optional().default(false),
    tags: z.array(z.string().trim()).optional().default([])
  })
};

export const updateProjectSchema = {
  body: z.object({
    title: z.string().min(2).max(100).optional(),
    description: z.string().max(2000).optional(),
    manager: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    status: z.enum(Object.values(PROJECT_STATUSES)).optional(),
    startDate: z.string().datetime().or(z.date()).optional().nullable(),
    dueDate: z.string().datetime().or(z.date()).optional().nullable(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    icon: z.string().max(50).optional(),
    isPrivate: z.boolean().optional(),
    tags: z.array(z.string().trim()).optional()
  })
};

export const addProjectMemberSchema = {
  body: z.object({
    userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid User ID'),
    role: z.enum([ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.VIEWER])
  })
};
