import * as mongoose from 'mongoose';
import DBModels from '../../config/models';

const _BasePurchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.PRODUCT,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const BasePurchaseSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.USER,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Unamed'
  },
  items: {
    type: [mongoose.Types.ObjectId],
    ref: DBModels.BASE_PURCHASE_ITEM,
    default: [],
  },
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  }
});

export const BasePurchaseItemSchema = 
          mongoose.model(DBModels.BASE_PURCHASE_ITEM, _BasePurchaseItemSchema);
export default mongoose.model(DBModels.BASE_PURCHASE, BasePurchaseSchema);
