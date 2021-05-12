import * as mongoose from 'mongoose';
import { IUser, UserConfigurations } from '../models/User.Model';

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
  description: String,
  photo: String,
  configurations: UserConfigurations,
  createdAt: String,
  updatedAt: String,
});

export default mongoose.model('User', UserSchema);
