import mongoose from 'mongoose';

const projectMilestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      default: '',
      maxlength: 1000
    },
    dueDate: {
      type: Date,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
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

projectMilestoneSchema.index({ project: 1, dueDate: 1 });

export const ProjectMilestone = mongoose.model('ProjectMilestone', projectMilestoneSchema);
