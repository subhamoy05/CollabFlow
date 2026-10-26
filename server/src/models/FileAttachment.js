import mongoose from 'mongoose';

const fileAttachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      unique: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    }
  },
  {
    timestamps: true
  }
);

fileAttachmentSchema.index({ project: 1 });
fileAttachmentSchema.index({ task: 1 });

export const FileAttachment = mongoose.model('FileAttachment', fileAttachmentSchema);
