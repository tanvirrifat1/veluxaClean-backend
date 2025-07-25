import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CleaningServiceService } from './service.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const createServiceToDB = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image[0];
  }

  const result = await CleaningServiceService.createServiceToDB(value);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const updateServiceToDB = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image[0];
  }

  const result = await CleaningServiceService.updateServiceToDB(
    req.params.id,
    value
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const getAllService = catchAsync(async (req, res) => {
  const result = await CleaningServiceService.getAllService(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service retrived successfully',
    data: result,
  });
});

const getSingleService = catchAsync(async (req, res) => {
  const result = await CleaningServiceService.getSingleService(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service retrived successfully',
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const result = await CleaningServiceService.deleteService(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const CleaningServiceController = {
  createServiceToDB,
  updateServiceToDB,
  getAllService,
  getSingleService,
  deleteService,
};
