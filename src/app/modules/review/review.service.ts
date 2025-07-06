import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Booking } from '../booking/booking.model';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { CleaningService } from '../service/service.model';

const createReview = async (data: IReview) => {
  const isBookingExist = await Booking.findOne({ service: data.service });

  if (!isBookingExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Sorry! Booking not found');
  }

  const isExist = await Review.findOne({
    user: data.user,
    service: data.service,
  });

  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You already reviewed this service'
    );
  }

  return await Review.create(data);
};

const getReview = async (service: string, query: Record<string, unknown>) => {
  const isExist = await CleaningService.findById(service);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service not found');
  }

  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Review.find({ service: service })
    .populate('user', 'name email createdAt -_id')
    .sort('-createdAt')
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Review.countDocuments({ service: service });
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

const getReviewForAll = async (query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Review.find()
    .populate('user', 'name email image createdAt -_id')
    .sort('-createdAt')
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Review.countDocuments();
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

export const ReviewService = {
  createReview,
  getReview,
  getReviewForAll,
};
