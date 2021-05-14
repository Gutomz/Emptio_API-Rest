import * as mongoose from 'mongoose';
import { IUser, UserConfigurations } from './User.Model';

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
  configurations: UserConfigurations,
  recoveryCode: {
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

export default mongoose.model('User', UserSchema);
