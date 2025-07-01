import { model, Schema } from 'mongoose';
import { ISetting } from './seeting.interface';

const settingSchema = new Schema<ISetting>(
  {
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['terms', 'privacy', 'about'],
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = model<ISetting>('Setting', settingSchema);
