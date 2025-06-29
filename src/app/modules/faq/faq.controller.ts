import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqService } from './faq.service';

const createFaq = catchAsync(async (req, res) => {
  const result = await FaqService.createFaq(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Faq created successfully',
    data: result,
  });
});

const updateFaq = catchAsync(async (req, res) => {
  const result = await FaqService.updateFaq(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Faq updated successfully',
    data: result,
  });
});

const getAllFaq = catchAsync(async (req, res) => {
  const result = await FaqService.getAllFaq(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Faq retrieved successfully',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req, res) => {
  const result = await FaqService.deleteFaq(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Faq deleted successfully',
    data: result,
  });
});

const getDetails = catchAsync(async (req, res) => {
  const result = await FaqService.getDetails(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Faq retrieved successfully',
    data: result,
  });
});

export const FaqController = {
  createFaq,
  updateFaq,
  getAllFaq,
  deleteFaq,
  getDetails,
};
