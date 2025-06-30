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

const getAllCleaningContact = catchAsync(async (req, res) => {
  const result = await CleaningContactService.getAllCleaningContact(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cleaning Contact retrieved successfully',
    data: result,
  });
});

const cleaningStatus = catchAsync(async (req, res) => {
  const result = await CleaningContactService.cleaningStatus(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cleaning Contact updated successfully',
    data: result,
  });
});

const deleteCleaningContact = catchAsync(async (req, res) => {
  const result = await CleaningContactService.deleteCleaningContact(
    req.params.id
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cleaning Contact deleted successfully',
    data: result,
  });
});

export const CleaningContactController = {
  createCleaningContact,
  getAllCleaningContact,
  cleaningStatus,
  deleteCleaningContact,
};
