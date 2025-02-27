import mongoose, { Schema } from 'mongoose';
const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      minLength: 5,
      lowercase: true,
    },
    organizationRegestrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model('Organization', OrganizationSchema);
export default Organization;
