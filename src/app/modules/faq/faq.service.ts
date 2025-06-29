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

const updateFaq = async (id: string, payload: Partial<IFaq>) => {
  const isExist = await Faq.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Faq not found');
  }
  return await Faq.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};

export const FaqService = {
  createFaq,
  updateFaq,
};
