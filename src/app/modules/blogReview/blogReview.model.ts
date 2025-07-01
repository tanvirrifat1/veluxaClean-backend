import { model, Schema } from 'mongoose';
import { IBlogReview } from './blogReview.interface';

const blogReviewSchema = new Schema<IBlogReview>(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BlogReview = model<IBlogReview>('BlogReview', blogReviewSchema);
