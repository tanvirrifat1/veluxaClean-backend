import { model, Schema } from 'mongoose';
import { IService } from './service.interface';
import { SERVICE_ENUM } from './service.constant';

const cleaningServiceSchema = new Schema<IService>(
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
    details: {
      type: String,
      required: true,
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
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CleaningService = model<IService>(
  'CleaningService',
  cleaningServiceSchema
);
