import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const user = req.user.id;
  const value = {
    ...req.body,
    user,
  };

  const result = await ReviewService.createReview(value);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
};
