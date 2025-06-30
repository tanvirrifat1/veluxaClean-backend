import { Types } from 'mongoose';

export type IPayment = {
  amount: number;
  user: Types.ObjectId;
  service: Types.ObjectId;
  transactionId: string;
  email: string;
  status: string;
};
