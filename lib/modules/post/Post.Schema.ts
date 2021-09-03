import * as mongoose from 'mongoose';
import DBModels from '../../config/models';
import { POST_DATA_TYPE_LIST } from './Post.Model';

const PostDataSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: POST_DATA_TYPE_LIST,
    required: true,
  },
  productMarket: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.PRODUCT_MARKET,
  },
  purchase: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.BASE_PURCHASE,
  }
});

const PostSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.USER,
    select: false,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  data: {
    type: PostDataSchema,
    required: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    ref: DBModels.USER,
    default: [],
  },
  dislikes: {
    type: [mongoose.Types.ObjectId],
    ref: DBModels.USER,
    default: [],
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

export default mongoose.model(DBModels.POST, PostSchema);
