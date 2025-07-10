import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IService } from './service.interface';
import { CleaningService } from './service.model';
import unlinkFile from '../../../shared/unlinkFile';

// const createServiceToDB = async (payload: IService) => {
//   const isExist = await CleaningService.findOne({
//     serviceName: payload.serviceName,
//     category: payload.category,
//   });
//   if (isExist) {
//     payload.image && unlinkFile(payload.image);
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Service already exists');
//   }
//   return await CleaningService.create(payload);
// };

const createServiceToDB = async (payload: IService) => {
  return await CleaningService.create(payload);
};

const updateServiceToDB = async (
  id: string,
  payload: IService
): Promise<IService | null> => {
  const isExist: any = await CleaningService.findOne({
    serviceName: payload.serviceName,
    _id: { $ne: id },
  });

  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service already exists');
  }

  if (payload.image && isExist?.image) {
    unlinkFile(isExist.image as string);
  }

  const updatedService = await CleaningService.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updatedService) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found');
  }

  return updatedService;
};

const getAllService = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [
        { serviceName: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    conditions.push({ $and: filterConditions });
  }

  conditions.push({ isDeleted: false });

  const whereConditions = conditions.length ? { $and: conditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const rawResult = await CleaningService.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean<IService[]>();

  const total = await CleaningService.countDocuments(whereConditions);

  // Group by category
  const groupedResult: Record<string, IService[]> = rawResult.reduce(
    (acc, service) => {
      const category = service.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    },
    {} as Record<string, IService[]>
  );

  return {
    result: groupedResult,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

const getSingleService = async (id: string) => {
  const result = await CleaningService.findById(id).lean<IService>();
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found');
  }
  return result;
};

const deleteService = async (id: string) => {
  const isExist = await CleaningService.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service not found');
  }
  return await CleaningService.findOneAndUpdate(
    { _id: id },
    { isDeleted: true }
  );
};

export const CleaningServiceService = {
  createServiceToDB,
  updateServiceToDB,
  getAllService,
  getSingleService,
  deleteService,
};
