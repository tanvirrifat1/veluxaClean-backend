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

export const CleaningServiceController = {
  createServiceToDB,
};
