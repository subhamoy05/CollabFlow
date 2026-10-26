import { z } from 'zod';
import { TASK_STATUSES, TASK_PRIORITIES } from '../config/constants.js';

export const createTaskSchema = {
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(10000).optional().default(''),
    project: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid Project ID'),
    status: z.enum(Object.values(TASK_STATUSES)).optional().default(TASK_STATUSES.TODO),
    priority: z.enum(Object.values(TASK_PRIORITIES)).optional().default(TASK_PRIORITIES.MEDIUM),
    assignee: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid Assignee ID').optional().nullable(),
    startDate: z.string().datetime().or(z.date()).optional().nullable(),
    dueDate: z.string().datetime().or(z.date()).optional().nullable(),
    labels: z.array(z.string().trim()).optional().default([]),
    estimatedEffort: z.number().min(0).max(1000).optional().default(0),
    sprint: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable()
  })
};

export const updateTaskSchema = {
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(10000).optional(),
    status: z.enum(Object.values(TASK_STATUSES)).optional(),
    priority: z.enum(Object.values(TASK_PRIORITIES)).optional(),
    assignee: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
    startDate: z.string().datetime().or(z.date()).optional().nullable(),
    dueDate: z.string().datetime().or(z.date()).optional().nullable(),
    labels: z.array(z.string().trim()).optional(),
    estimatedEffort: z.number().min(0).max(1000).optional(),
    sprint: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
    order: z.number().optional()
  })
};

export const moveTaskSchema = {
  body: z.object({
    status: z.enum(Object.values(TASK_STATUSES)),
    order: z.number()
  })
};

export const commentSchema = {
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(5000)
  })
};

export const checklistSchema = {
  body: z.object({
    text: z.string().min(1).max(300)
  })
};
