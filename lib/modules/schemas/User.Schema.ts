import * as mongoose from 'mongoose';
import { UserConfigurations } from 'modules/models/User.Model';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  configurations: UserConfigurations,
  createdAt: String,
  updatedAt: String,
});

export default mongoose.model('User', UserSchema);
