import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CleaningContactService } from './cleningContact.service';

const createCleaningContact = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user,
  };

  const result = await CleaningContactService.createCleaningContact(value);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cleaning Contact created successfully',
    data: result,
  });
});

export const CleaningContactController = {
  createCleaningContact,
};
