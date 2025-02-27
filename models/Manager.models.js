import mongoose, { Schema } from 'mongoose';

const managerSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
    role: {
      type: String,
      enum: ['lead', 'co-lead', 'supervisor'],
      required: true,
    },
  },
  { timestamps: true }
);

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
