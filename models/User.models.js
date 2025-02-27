import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['lead', 'employee', 'admin', 'manager'],
      default: 'employee',
      required: true,
    },
    refreshToken: {
      type: String,
    },
    employeeNumber: {
      type: String,
      required: true,
      unique: true,
      minLength: 4,
    },
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    credits: {
      type: Number,
      min: 0,
      default: 0,
    },
    starredTask: [{ type: Schema.Types.ObjectId, ref: 'Task', default: [] }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
