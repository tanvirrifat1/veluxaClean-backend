import { Types } from 'mongoose';

export type IReview = {
  review: string;
  rating: number;
  user: Types.ObjectId;
  service: Types.ObjectId;
};
