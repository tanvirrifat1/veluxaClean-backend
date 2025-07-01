import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogReviewService } from './blogReview.service';

const createReviewFormDb = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user,
  };

  const result = await BlogReviewService.createReviewFormDb(value);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReview = catchAsync(async (req, res) => {
  const result = await BlogReviewService.getAllReview(req.params.id, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

export const BlogReviewController = {
  createReviewFormDb,
  getAllReview,
};
