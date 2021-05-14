import * as mongoose from 'mongoose';
import { FRIENDSHIP_STATUS, FRIENDSHIP_STATUS_LIST } from '../../utils/enums';

const FriendshipSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    select: false,
    ref: 'User',
  },
  friend: {
    type: mongoose.Types.ObjectId,
    required: true,
    select: false,
    ref: 'User',
  },
  status: {
    type: String,
    enum: FRIENDSHIP_STATUS_LIST,
    default: FRIENDSHIP_STATUS.PENDING,
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

export default mongoose.model('Friendship', FriendshipSchema);
