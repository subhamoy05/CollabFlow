import mongoose from 'mongoose';
import { TASK_STATUSES, TASK_PRIORITIES } from '../config/constants.js';

const checklistItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false }
  },
  { _id: true }
);

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false }
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title must not be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    key: {
      type: String,
      trim: true
    },
    taskNumber: {
      type: Number
    },
    description: {
      type: String,
      default: '',
      maxlength: 10000
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUSES),
      default: TASK_STATUSES.TODO
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITIES),
      default: TASK_PRIORITIES.MEDIUM
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: {
      type: Date,
      default: null
    },
    dueDate: {
      type: Date,
      default: null
    },
    labels: [{
      type: String,
      trim: true
    }],
    estimatedEffort: {
      type: Number,
      default: 0
    },
    order: {
      type: Number,
      default: 0
    },
    checklist: [checklistItemSchema],
    subtasks: [subtaskSchema],
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sprint',
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for query performance
taskSchema.index({ project: 1, status: 1, order: 1 });
taskSchema.index({ project: 1, assignee: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ project: 1, dueDate: 1 });
taskSchema.index({ project: 1, key: 1 });
taskSchema.index({ sprint: 1 });

// Helper to determine if task is overdue
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === TASK_STATUSES.DONE) return false;
  return new Date() > this.dueDate;
});

// Auto-manage completedAt
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === TASK_STATUSES.DONE && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== TASK_STATUSES.DONE && this.completedAt) {
      this.completedAt = null;
    }
  }
  next();
});

export const Task = mongoose.model('Task', taskSchema);
