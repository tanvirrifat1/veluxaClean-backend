import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IFaq } from './faq.interface';
import { Faq } from './faq.model';

const createFaq = async (payload: IFaq) => {
  const isExist = await Faq.findOne({ question: payload.question });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Faq already exists');
  }
  return await Faq.create(payload);
};

export const FaqService = {
  createFaq,
};
