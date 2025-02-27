import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema(
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
      maxLength: 500,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    allotedTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    allotedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'inactive', 'completed', 'on-hold'],
      default: 'pending',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'mid', 'high'],
      default: 'mid',
      required: true,
    },
    credits: {
      type: Number,
      min: 0,
      default: 0,
    },
    negativeRewards: {
      type: Number,
      max: 0,
      default: -100,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);
export default Task;
