import { model, Schema } from 'mongoose';
import { ICleaningContact } from './cleningContact.interface';
import { SERVICE_ENUM } from '../service/service.constant';

const cleaningContactSchema = new Schema<ICleaningContact>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: SERVICE_ENUM,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Completed', 'Rejected'],
    },
  },
  {
    timestamps: true,
  }
);

export const CleaningContact = model<ICleaningContact>(
  'CleaningContact',
  cleaningContactSchema
);
