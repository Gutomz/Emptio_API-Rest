import * as mongoose from 'mongoose';
import DBModels from '../../config/models';

const ProductMarketSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: DBModels.PRODUCT,
  },
  market: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: DBModels.MARKET,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: DBModels.USER,
  },
  updatedAt: {
    type: String,
    required: true,
  },
});

export default mongoose.model(DBModels.PRODUCT_MARKET, ProductMarketSchema);
