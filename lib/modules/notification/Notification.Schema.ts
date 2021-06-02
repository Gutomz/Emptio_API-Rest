import * as mongoose from 'mongoose';
import DBModels from '../../config/models';

const NotificationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.USER,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

export default mongoose.model(DBModels.NOTIFICATION, NotificationSchema);
