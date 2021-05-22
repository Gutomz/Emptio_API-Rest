import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  description: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: '',
  },
  configurations: {
    type: Object,
    select: false,
    canNotify: {
      type: Boolean,
      default: true,
    },
  },
  recoveryCode: {
    type: String,
    default: null,
    select: false,
  },
  location: {
    type: String,
    default: null,
    select: false,
  },
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
});

UserSchema.index({
  name: 'text',
  email: 'text',
});

export default mongoose.model('User', UserSchema);
