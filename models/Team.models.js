import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 3,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    teamHead: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subTeamHeads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'working', 'on-hold', 'completed'],
      default: 'active',
      required: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);
export default Team;
