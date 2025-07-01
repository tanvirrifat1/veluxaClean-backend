import { model, Schema } from 'mongoose';
import { IChatRoom } from './chatRoom.interface';

const chatRoomSchema = new Schema<IChatRoom>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = model<IChatRoom>('Room', chatRoomSchema);
