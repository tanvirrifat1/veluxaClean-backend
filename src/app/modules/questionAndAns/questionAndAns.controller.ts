import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { QuestionAndAnsService } from './questionAndAns.service';

const createChat = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user,
  };

  const result = await QuestionAndAnsService.createChat(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Chat created successfully',
    data: result,
  });
});

const getQuestionAndAns = catchAsync(async (req, res) => {
  const roomId = req.params.id;
  const result = await QuestionAndAnsService.getQuestionAndAns(
    req.query,
    roomId
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Chat retrived successfully',
    data: result,
  });
});

export const QuestionAndAnsController = {
  createChat,
  getQuestionAndAns,
};
