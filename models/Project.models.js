import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    projectLead: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    projectStatus: {
      type: String,
      enum: ['completed', 'active', 'terminated'],
      default: 'active',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'mid', 'high'],
      default: 'mid',
      required: true,
    },
    prd: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
