import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user,
  };

  const result = await BookingService.createBooking(value);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingService.getAllBookings(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
};
