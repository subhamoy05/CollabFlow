import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
      maxlength: [4000, 'Message cannot exceed 4000 characters']
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatMessage',
      default: null
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    attachments: [{
      originalName: String,
      fileName: String,
      fileSize: Number,
      mimeType: String,
      url: String
    }]
  },
  {
    timestamps: true
  }
);

chatMessageSchema.index({ project: 1, createdAt: -1 });

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
