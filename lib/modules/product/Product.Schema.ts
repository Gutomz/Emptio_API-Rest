import * as mongoose from 'mongoose';
import DBModels from '../../config/models';
import { MeasurementSchema } from '../common/Common.Schemas';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  variation: {
    type: String,
    required: true,
  },
  weight: {
    type: MeasurementSchema,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    default: null,
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

ProductSchema.index({
  name: 'text',
  variation: 'text',
  tags: 'text',
});

export default mongoose.model(DBModels.PRODUCT, ProductSchema);
