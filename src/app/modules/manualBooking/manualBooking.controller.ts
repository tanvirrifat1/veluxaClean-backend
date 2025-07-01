import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ManualBookingService } from './manualBooking.service';

const createManualBooking = catchAsync(async (req, res) => {
  const result = await ManualBookingService.createManualBooking(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Manual Booking created successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await ManualBookingService.getAllBookings(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Manual Booking retrieved successfully',
    data: result,
  });
});

export const ManualBookingController = {
  createManualBooking,
  getAllBookings,
};
