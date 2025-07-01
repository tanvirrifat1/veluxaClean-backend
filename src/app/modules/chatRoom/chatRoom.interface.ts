import { Types } from 'mongoose';

export type IChatRoom = {
  roomName: string;
  user: Types.ObjectId;
};
