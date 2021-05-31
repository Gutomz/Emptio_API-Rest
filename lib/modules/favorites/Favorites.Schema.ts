import * as mongoose from 'mongoose';
import DBModels from '../../config/models';

const FavoritesSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.USER,
    required: true,
    select: false,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: DBModels.PRODUCT,
    required: true,
  },
  markets: {
    type: [mongoose.Types.ObjectId],
    ref: DBModels.MARKET,
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

export default mongoose.model(DBModels.FAVORITES, FavoritesSchema);

