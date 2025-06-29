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

const getAllFaq = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [
        { question: { $regex: searchTerm, $options: 'i' } },
        { answer: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }
  // Add filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    conditions.push({ $and: filterConditions });
  }

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Faq.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Faq.countDocuments();

  const data = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const FaqService = {
  createFaq,
  updateFaq,
  getAllFaq,
};
