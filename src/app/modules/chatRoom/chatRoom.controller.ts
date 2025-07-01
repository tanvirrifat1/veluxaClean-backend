import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatRoomService } from './chatRoom.service';

const getAllChatRoom = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await ChatRoomService.getAllChatRoom(req.query, userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChatRoom retrived successfully',
    data: result,
  });
});

const deleteChatRoom = catchAsync(async (req, res) => {
  const result = await ChatRoomService.deleteChatRoom(req.params.roomId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChatRoom deleted successfully',
    data: result,
  });
});

const updateChatRoom = catchAsync(async (req, res) => {
  const result = await ChatRoomService.updateChatRoom(
    req.params.roomId,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChatRoom updated successfully',
    data: result,
  });
});

export const ChatRoomController = {
  getAllChatRoom,
  deleteChatRoom,
  updateChatRoom,
};
