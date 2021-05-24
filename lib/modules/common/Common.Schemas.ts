import * as mongoose from 'mongoose';
import { MEASUREMENT_TYPE_LIST } from '../../utils/enums';

export const LocationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true,
  }
});

export const MeasurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: MEASUREMENT_TYPE_LIST,
    required: true,
  }
});
