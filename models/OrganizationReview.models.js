import mongoose, { Schema } from 'mongoose';

const organizationReviewSchema = new Schema(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true }
);

const OrganizationReview = mongoose.model(
  'OrganizationReview',
  organizationReviewSchema
);
export default OrganizationReview;
