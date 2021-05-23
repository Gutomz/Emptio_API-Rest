import * as mongoose from 'mongoose';
import { LocationSchema } from '../common/Common.Schemas';

const MarketSchema = new mongoose.Schema({
  place_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: LocationSchema,
    required: true,
  },
  openingHours: {
    type: [String],
    default: [],
  },
  website: {
    type: String,
    default: '-',
  },
  phone: {
    type: String,
    default: '-'
  },
  image: {
    type: String,
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

MarketSchema.index({
  name: 'text',
  address: 'text',
});

export default mongoose.model('Market', MarketSchema);
