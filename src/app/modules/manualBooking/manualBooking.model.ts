import { model, Schema } from 'mongoose';
import { SERVICE_ENUM } from '../service/service.constant';
import { IManualBooking } from './manualBooking.interface';

const manualBookingSchema = new Schema<IManualBooking>(
  {
    serviceName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: SERVICE_ENUM,
    },

    price: {
      type: Number,
      required: true,
    },
    additionalServices: {
      type: Map,
      of: Number,
      default: {},
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ManualBooking = model<IManualBooking>(
  'ManualBooking',
  manualBookingSchema
);
