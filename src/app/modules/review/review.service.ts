import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Booking } from '../booking/booking.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (data: IReview) => {
  const isBookingExist = await Booking.findOne({ service: data.service });

  if (!isBookingExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Sorry! Booking not found');
  }

  return await Review.create(data);
};

export const ReviewService = {
  createReview,
};
