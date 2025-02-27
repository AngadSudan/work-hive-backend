import mongoose, { Schema } from 'mongoose';

const issueSchema = new Schema(
  {
    raisedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    resolvedAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'mid', 'high'],
      default: 'mid',
      required: true,
    },
    issueStatus: {
      type: String,
      enum: ['resolved', 'unresolved'],
      default: 'unresolved',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      required: true,
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
