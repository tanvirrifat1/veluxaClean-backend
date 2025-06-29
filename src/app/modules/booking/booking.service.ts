import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { CleaningService } from '../service/service.model';
import { IBooking } from './booking.interface';
import { User } from '../user/user.model';
import { Booking } from './booking.model';

const createBooking = async (payload: IBooking) => {
  const isServiceExist = await CleaningService.findById(payload.service);

  if (!isServiceExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service not found');
  }

  const isUser = await User.findById(payload.user);

  const value = {
    ...payload,
    name: isUser?.name,
    email: isUser?.email,
  };

  return await Booking.create(value);
};

export const BookingService = {
  createBooking,
};
