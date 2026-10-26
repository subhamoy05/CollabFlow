import mongoose from 'mongoose';
import { PROJECT_STATUSES } from '../config/constants.js';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    key: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: [2, 'Key must be at least 2 characters'],
      maxlength: [10, 'Key cannot exceed 10 characters']
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUSES),
      default: PROJECT_STATUSES.ACTIVE
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: {
      type: Date
    },
    dueDate: {
      type: Date
    },
    color: {
      type: String,
      default: '#6366F1'
    },
    icon: {
      type: String,
      default: 'FolderKanban'
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

projectSchema.index({ organization: 1, key: 1 }, { unique: true });
projectSchema.index({ organization: 1, status: 1 });
projectSchema.index({ manager: 1 });

export const Project = mongoose.model('Project', projectSchema);
