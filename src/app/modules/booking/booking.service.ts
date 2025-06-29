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

const getAllBookings = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Booking.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Booking.countDocuments();

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const BookingService = {
  createBooking,
  getAllBookings,
};
