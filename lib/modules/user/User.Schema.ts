import * as mongoose from 'mongoose';
import DBModels from '../../config/models';
import { LocationSchema } from '../common/Common.Schemas';

const ConfigurationSchema = new mongoose.Schema({
  canNotify: {
    type: Boolean,
    default: true,
  },
});

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
    type: ConfigurationSchema,
    select: false,
  },
  recoveryCode: {
    type: String,
    default: null,
    select: false,
  },
  location: {
    type: LocationSchema,
    select: false,
    required: true,
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

export default mongoose.model(DBModels.USER, UserSchema);
