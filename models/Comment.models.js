import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    status: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible',
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
