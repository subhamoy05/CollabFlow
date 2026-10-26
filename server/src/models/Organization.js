import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      default: '',
      maxlength: 500
    },
    logoUrl: {
      type: String,
      default: ''
    },
    isPersonal: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

organizationSchema.index({ owner: 1 });

export const Organization = mongoose.model('Organization', organizationSchema);
