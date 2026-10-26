import mongoose from 'mongoose';
import { SPRINT_STATUSES } from '../config/constants.js';

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sprint name is required'],
      trim: true,
      maxlength: 100
    },
    goal: {
      type: String,
      default: '',
      maxlength: 1000
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(SPRINT_STATUSES),
      default: SPRINT_STATUSES.PLANNED
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

sprintSchema.index({ project: 1, status: 1 });

export const Sprint = mongoose.model('Sprint', sprintSchema);
