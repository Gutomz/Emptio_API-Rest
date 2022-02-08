import * as mongoose from 'mongoose';
import DBModels from '../../config/models';
import { PURCHASE_STATUS, PURCHASE_STATUS_LIST } from '../../utils/enums';

const _PurchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.PRODUCT,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  completedProductMarket: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.PRODUCT_MARKET,
    default: null,
  },
});

const PurchaseSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    select: false,
    required: true,
    ref: DBModels.USER,
  },
  market: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.MARKET,
    default: null,
  },
  items: {
    type: [mongoose.Types._ObjectId],
    default: [],
    ref: DBModels.PURCHASE_ITEM
  },
  limit: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: PURCHASE_STATUS_LIST,
    default: PURCHASE_STATUS.OPEN,
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

export const PurchaseItemSchema =
  mongoose.model(DBModels.PURCHASE_ITEM, _PurchaseItemSchema);
export default mongoose.model(DBModels.PURCHASE, PurchaseSchema);
