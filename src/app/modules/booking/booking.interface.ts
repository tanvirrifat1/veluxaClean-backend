import { Types } from 'mongoose';

export type IBooking = {
  user: Types.ObjectId;
  service: Types.ObjectId;
  name: string;
  email: string;
  date: Date;
  time: string;
  status: string;
  description: string;
};
