import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'CleaningService',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview>('Review', reviewSchema);
