import { Types } from 'mongoose';

export type IBlogReview = {
  review: string;
  rating: number;
  user: Types.ObjectId;
  blog: Types.ObjectId;
};
