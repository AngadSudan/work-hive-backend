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
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);
export default Task;
