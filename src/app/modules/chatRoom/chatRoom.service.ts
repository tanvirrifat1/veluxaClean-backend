import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Room } from './chatRoom.model';
import { QuestionAndAns } from '../questionAndAns/questionAndAns.model';

const getAllChatRoom = async (
  query: Record<string, unknown>,
  userId: string
) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  anyConditions.push({ user: userId });

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Room.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Room.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const deleteChatRoom = async (roomId: string) => {
  if (!roomId || !/^[0-9a-fA-F]{24}$/.test(roomId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid room ID');
  }

  const [room, deletedQA] = await Promise.all([
    Room.findById(roomId),
    QuestionAndAns.findOneAndDelete({ roomId }).exec(),
  ]);

  if (!room) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found');
  }

  if (!deletedQA) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Associated Question and Answer not found'
    );
  }

  const deletedRoom = await Room.findByIdAndDelete(roomId).exec();
  return deletedRoom;
};
const updateChatRoom = async (
  roomId: string,
  payload: Record<string, unknown>
) => {
  const isExist = await Room.findById(roomId);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found for update');
  }

  const room = await Room.findOneAndUpdate({ _id: roomId }, payload, {
    new: true,
  });

  return room;
};

export const ChatRoomService = {
  getAllChatRoom,
  deleteChatRoom,
  updateChatRoom,
};
